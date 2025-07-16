
-- Create user roles enum
CREATE TYPE user_role AS ENUM ('employee', 'admin', 'hexanurse', 'security');

-- Create alert severity enum
CREATE TYPE alert_severity AS ENUM ('mild', 'moderate', 'emergency');

-- Create alert status enum
CREATE TYPE alert_status AS ENUM ('active', 'acknowledged', 'resolved');

-- Create user profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  employee_id TEXT UNIQUE NOT NULL,
  role user_role NOT NULL DEFAULT 'employee',
  department TEXT,
  phone TEXT,
  emergency_contact TEXT,
  floor_number INTEGER,
  office_location TEXT,
  privacy_settings JSONB DEFAULT '{"share_vitals": true, "share_location": true}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create health_vitals table
CREATE TABLE health_vitals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(user_id) ON DELETE CASCADE,
  heart_rate INTEGER,
  spo2 INTEGER,
  systolic_bp INTEGER,
  diastolic_bp INTEGER,
  temperature DECIMAL(4,2),
  stress_level INTEGER CHECK (stress_level >= 1 AND stress_level <= 10),
  activity_level TEXT,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create locations table for tracking
CREATE TABLE user_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(user_id) ON DELETE CASCADE,
  floor_number INTEGER NOT NULL,
  x_coordinate DECIMAL(10,4),
  y_coordinate DECIMAL(10,4),
  zone_name TEXT,
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create alerts table
CREATE TABLE alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(user_id) ON DELETE CASCADE,
  alert_type TEXT NOT NULL,
  severity alert_severity NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  location_data JSONB,
  vitals_data JSONB,
  status alert_status DEFAULT 'active',
  assigned_to UUID REFERENCES profiles(user_id),
  escalated_to UUID[] DEFAULT '{}',
  response_time INTEGER,
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create access_requests table
CREATE TABLE access_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id UUID REFERENCES profiles(user_id) ON DELETE CASCADE,
  target_user_id UUID REFERENCES profiles(user_id) ON DELETE CASCADE,
  request_type TEXT NOT NULL,
  reason TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  approved_by UUID REFERENCES profiles(user_id),
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  responded_at TIMESTAMP WITH TIME ZONE
);

-- Create activity_logs table
CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(user_id),
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id UUID,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(user_id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_vitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE access_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins and HexaNurse can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles p 
      WHERE p.user_id = auth.uid() 
      AND p.role IN ('admin', 'hexanurse')
    )
  );

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (user_id = auth.uid());

-- RLS Policies for health_vitals
CREATE POLICY "Users can view their own vitals" ON health_vitals
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "HexaNurse can view all vitals" ON health_vitals
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles p 
      WHERE p.user_id = auth.uid() 
      AND p.role = 'hexanurse'
    )
  );

CREATE POLICY "Users can insert their own vitals" ON health_vitals
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- RLS Policies for alerts
CREATE POLICY "Users can view alerts related to them" ON alerts
  FOR SELECT USING (
    user_id = auth.uid() OR 
    assigned_to = auth.uid() OR 
    auth.uid() = ANY(escalated_to) OR
    EXISTS (
      SELECT 1 FROM profiles p 
      WHERE p.user_id = auth.uid() 
      AND p.role IN ('admin', 'hexanurse', 'security')
    )
  );

-- RLS Policies for notifications
CREATE POLICY "Users can view their own notifications" ON notifications
  FOR SELECT USING (user_id = auth.uid());

-- Create indexes for performance
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_health_vitals_user_id ON health_vitals(user_id);
CREATE INDEX idx_health_vitals_recorded_at ON health_vitals(recorded_at);
CREATE INDEX idx_alerts_user_id ON alerts(user_id);
CREATE INDEX idx_alerts_status ON alerts(status);
CREATE INDEX idx_alerts_severity ON alerts(severity);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);

-- Create trigger for updating profiles updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON profiles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for testing
INSERT INTO profiles (user_id, email, full_name, employee_id, role, department, floor_number, office_location) VALUES
(gen_random_uuid(), 'admin@company.com', 'System Administrator', 'EMP001', 'admin', 'IT', 1, 'A-101'),
(gen_random_uuid(), 'nurse@company.com', 'Sarah Johnson', 'EMP002', 'hexanurse', 'Health', 2, 'B-201'),
(gen_random_uuid(), 'security@company.com', 'Mike Wilson', 'EMP003', 'security', 'Security', 1, 'S-101'),
(gen_random_uuid(), 'john.doe@company.com', 'John Doe', 'EMP004', 'employee', 'Engineering', 3, 'C-301');
