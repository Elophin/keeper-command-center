-- Create a function to set up demo users with elevated privileges
CREATE OR REPLACE FUNCTION public.setup_demo_users()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert or update demo user profiles
  INSERT INTO public.profiles (
    user_id, email, full_name, employee_id, role, department, 
    phone, emergency_contact, floor_number, office_location, 
    privacy_settings, is_active
  )
  SELECT 
    u.id,
    u.email,
    CASE 
      WHEN u.email = 'admin@hexaware.com' THEN 'System Administrator'
      WHEN u.email = 'employee@hexaware.com' THEN 'John Employee'
      WHEN u.email = 'nurse@hexaware.com' THEN 'Medical Nurse'
      WHEN u.email = 'security@hexaware.com' THEN 'Security Officer'
    END as full_name,
    CASE 
      WHEN u.email = 'admin@hexaware.com' THEN 'ADM001'
      WHEN u.email = 'employee@hexaware.com' THEN 'EMP001'
      WHEN u.email = 'nurse@hexaware.com' THEN 'NUR001'
      WHEN u.email = 'security@hexaware.com' THEN 'SEC001'
    END as employee_id,
    CASE 
      WHEN u.email = 'admin@hexaware.com' THEN 'admin'::user_role
      WHEN u.email = 'employee@hexaware.com' THEN 'employee'::user_role
      WHEN u.email = 'nurse@hexaware.com' THEN 'hexanurse'::user_role
      WHEN u.email = 'security@hexaware.com' THEN 'security'::user_role
    END as role,
    CASE 
      WHEN u.email = 'admin@hexaware.com' THEN 'Administration'
      WHEN u.email = 'employee@hexaware.com' THEN 'General'
      WHEN u.email = 'nurse@hexaware.com' THEN 'Medical'
      WHEN u.email = 'security@hexaware.com' THEN 'Security'
    END as department,
    '+1-555-000' || 
    CASE 
      WHEN u.email = 'admin@hexaware.com' THEN '1'
      WHEN u.email = 'employee@hexaware.com' THEN '2'
      WHEN u.email = 'nurse@hexaware.com' THEN '3'
      WHEN u.email = 'security@hexaware.com' THEN '4'
    END as phone,
    '+1-555-900' || 
    CASE 
      WHEN u.email = 'admin@hexaware.com' THEN '1'
      WHEN u.email = 'employee@hexaware.com' THEN '2'
      WHEN u.email = 'nurse@hexaware.com' THEN '3'
      WHEN u.email = 'security@hexaware.com' THEN '4'
    END as emergency_contact,
    1 as floor_number,
    CASE 
      WHEN u.email = 'admin@hexaware.com' THEN 'Admin Office - Floor 5'
      WHEN u.email = 'employee@hexaware.com' THEN 'General Office - Floor 3'
      WHEN u.email = 'nurse@hexaware.com' THEN 'Medical Wing - Floor 2'
      WHEN u.email = 'security@hexaware.com' THEN 'Security Station - Ground Floor'
    END as office_location,
    '{"share_vitals": true, "share_location": true}'::jsonb as privacy_settings,
    true as is_active
  FROM auth.users u
  WHERE u.email IN ('admin@hexaware.com', 'employee@hexaware.com', 'nurse@hexaware.com', 'security@hexaware.com')
  ON CONFLICT (user_id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    employee_id = EXCLUDED.employee_id,
    role = EXCLUDED.role,
    department = EXCLUDED.department,
    phone = EXCLUDED.phone,
    emergency_contact = EXCLUDED.emergency_contact,
    office_location = EXCLUDED.office_location,
    privacy_settings = EXCLUDED.privacy_settings,
    is_active = EXCLUDED.is_active;
END;
$$;

-- Run the function to create the profiles
SELECT public.setup_demo_users();