-- Insert missing profile for the admin user
INSERT INTO public.profiles (
  user_id,
  email,
  full_name,
  employee_id,
  role,
  department,
  floor_number,
  office_location
) VALUES (
  '38bd8647-b92f-4188-bb66-ca8dda01019d',
  'admin@demo.com',
  'Admin User',
  'ADMIN001',
  'admin',
  'Administration',
  1,
  'Floor 1 - Admin Office'
);