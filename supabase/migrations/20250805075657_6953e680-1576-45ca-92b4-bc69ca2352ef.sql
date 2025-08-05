-- Insert demo users with correct email patterns for testing
-- First, let's clean up any existing demo users
DELETE FROM profiles WHERE email LIKE '%@demo.com';

-- Insert demo profiles with the correct hexaware.com email patterns
INSERT INTO profiles (
  user_id,
  email,
  full_name,
  employee_id,
  role,
  department,
  phone,
  emergency_contact,
  floor_number,
  office_location
) VALUES 
  (
    gen_random_uuid(),
    'admin@admin.hexaware.com',
    'System Administrator',
    'ADM001',
    'admin',
    'Administration',
    '+1-555-0001',
    '+1-555-9001',
    5,
    'Executive Wing'
  ),
  (
    gen_random_uuid(),
    'employee@employee.hexaware.com',
    'John Employee',
    'EMP001',
    'employee',
    'General',
    '+1-555-0002',
    '+1-555-9002',
    3,
    'Workstation Area'
  ),
  (
    gen_random_uuid(),
    'nurse@nurse.hexaware.com',
    'Medical Nurse',
    'NUR001',
    'hexanurse',
    'Medical',
    '+1-555-0003',
    '+1-555-9003',
    2,
    'Medical Center'
  ),
  (
    gen_random_uuid(),
    'security@security.hexaware.com',
    'Security Officer',
    'SEC001',
    'security',
    'Security',
    '+1-555-0004',
    '+1-555-9004',
    1,
    'Security Office'
  );