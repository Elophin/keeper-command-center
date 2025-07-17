-- Create user roles enum
CREATE TYPE user_role AS ENUM ('admin', 'employee', 'hexanurse', 'security');

-- Create alert severity enum  
CREATE TYPE alert_severity AS ENUM ('mild', 'moderate', 'emergency');

-- Create profiles table
CREATE TABLE profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    email TEXT NOT NULL,
    full_name TEXT NOT NULL,
    employee_id TEXT UNIQUE NOT NULL,
    role user_role NOT NULL,
    department TEXT NOT NULL,
    phone TEXT,
    emergency_contact TEXT,
    floor_number INTEGER NOT NULL,
    office_location TEXT NOT NULL,
    privacy_settings JSONB DEFAULT '{"share_vitals": true, "share_location": true}'::jsonb,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create vitals table
CREATE TABLE vitals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    heart_rate INTEGER,
    blood_pressure_systolic INTEGER,
    blood_pressure_diastolic INTEGER,
    temperature DECIMAL(4,2),
    oxygen_saturation INTEGER,
    stress_level INTEGER CHECK (stress_level BETWEEN 1 AND 10),
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create alerts table
CREATE TABLE alerts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    severity alert_severity NOT NULL,
    message TEXT NOT NULL,
    vitals_data JSONB,
    location TEXT,
    is_resolved BOOLEAN DEFAULT false,
    assigned_nurse_id UUID REFERENCES auth.users(id),
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create locations table
CREATE TABLE locations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    floor_number INTEGER NOT NULL,
    room_number TEXT,
    coordinates JSONB,
    last_seen TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create access requests table
CREATE TABLE access_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    requested_area TEXT NOT NULL,
    purpose TEXT NOT NULL,
    requested_for TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'denied')),
    approved_by UUID REFERENCES auth.users(id),
    approved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create incident logs table
CREATE TABLE incident_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    incident_type TEXT NOT NULL,
    description TEXT NOT NULL,
    severity alert_severity NOT NULL,
    location TEXT,
    reported_by UUID REFERENCES auth.users(id) NOT NULL,
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'resolved')),
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE access_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE incident_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow admins and nurses to view all profiles
CREATE POLICY "Admins and nurses can view all profiles" ON profiles FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM profiles p 
        WHERE p.user_id = auth.uid() 
        AND p.role IN ('admin', 'hexanurse', 'security')
    )
);

-- Create RLS policies for vitals
CREATE POLICY "Users can view their own vitals" ON vitals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own vitals" ON vitals FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow nurses to view all vitals with user consent
CREATE POLICY "Nurses can view consented vitals" ON vitals FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM profiles nurse 
        WHERE nurse.user_id = auth.uid() 
        AND nurse.role = 'hexanurse'
    ) AND 
    EXISTS (
        SELECT 1 FROM profiles patient 
        WHERE patient.user_id = vitals.user_id 
        AND (patient.privacy_settings->>'share_vitals')::boolean = true
    )
);

-- Create RLS policies for alerts
CREATE POLICY "Users can view their own alerts" ON alerts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Staff can view all alerts" ON alerts FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM profiles p 
        WHERE p.user_id = auth.uid() 
        AND p.role IN ('admin', 'hexanurse', 'security')
    )
);
CREATE POLICY "Staff can insert alerts" ON alerts FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM profiles p 
        WHERE p.user_id = auth.uid() 
        AND p.role IN ('admin', 'hexanurse', 'security')
    )
);
CREATE POLICY "Staff can update alerts" ON alerts FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM profiles p 
        WHERE p.user_id = auth.uid() 
        AND p.role IN ('admin', 'hexanurse', 'security')
    )
);

-- Create RLS policies for locations
CREATE POLICY "Users can view their own location" ON locations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own location" ON locations FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow staff to view all locations with user consent
CREATE POLICY "Staff can view consented locations" ON locations FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM profiles staff 
        WHERE staff.user_id = auth.uid() 
        AND staff.role IN ('admin', 'hexanurse', 'security')
    ) AND 
    EXISTS (
        SELECT 1 FROM profiles patient 
        WHERE patient.user_id = locations.user_id 
        AND (patient.privacy_settings->>'share_location')::boolean = true
    )
);

-- Create RLS policies for access requests
CREATE POLICY "Users can view their own access requests" ON access_requests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own access requests" ON access_requests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all access requests" ON access_requests FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM profiles p 
        WHERE p.user_id = auth.uid() 
        AND p.role = 'admin'
    )
);
CREATE POLICY "Admins can update access requests" ON access_requests FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM profiles p 
        WHERE p.user_id = auth.uid() 
        AND p.role = 'admin'
    )
);

-- Create RLS policies for incident logs
CREATE POLICY "Users can view incident logs they reported" ON incident_logs FOR SELECT USING (auth.uid() = reported_by);
CREATE POLICY "Staff can view all incident logs" ON incident_logs FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM profiles p 
        WHERE p.user_id = auth.uid() 
        AND p.role IN ('admin', 'hexanurse', 'security')
    )
);
CREATE POLICY "Users can insert incident logs" ON incident_logs FOR INSERT WITH CHECK (auth.uid() = reported_by);
CREATE POLICY "Staff can update incident logs" ON incident_logs FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM profiles p 
        WHERE p.user_id = auth.uid() 
        AND p.role IN ('admin', 'hexanurse', 'security')
    )
);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for profiles table
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();