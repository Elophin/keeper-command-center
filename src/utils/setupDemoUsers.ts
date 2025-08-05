
import { supabase } from '@/integrations/supabase/client';
import { getRoleFromEmail, getDepartmentFromRole, getOfficeLocationFromRole } from './roleUtils';

export const createDemoUsers = async () => {
  const demoUsers = [
    {
      email: 'admin@admin.hexaware.com',
      password: 'demo123',
      userData: {
        full_name: 'System Administrator',
        employee_id: 'ADM001',
        phone: '+1-555-0001',
        emergency_contact: '+1-555-9001'
      }
    },
    {
      email: 'employee@employee.hexaware.com',
      password: 'demo123',
      userData: {
        full_name: 'John Employee',
        employee_id: 'EMP001',
        phone: '+1-555-0002',
        emergency_contact: '+1-555-9002'
      }
    },
    {
      email: 'nurse@nurse.hexaware.com',
      password: 'demo123',
      userData: {
        full_name: 'Medical Nurse',
        employee_id: 'NUR001',
        phone: '+1-555-0003',
        emergency_contact: '+1-555-9003'
      }
    },
    {
      email: 'security@security.hexaware.com',
      password: 'demo123',
      userData: {
        full_name: 'Security Officer',
        employee_id: 'SEC001',
        phone: '+1-555-0004',
        emergency_contact: '+1-555-9004'
      }
    }
  ];

  console.log('Setting up demo users...');
  
  for (const user of demoUsers) {
    try {
      // Try to sign up the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: user.email,
        password: user.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        }
      });

      if (authError && !authError.message.includes('already registered')) {
        console.error(`Error creating user ${user.email}:`, authError);
        continue;
      }

      // If user was created, create their profile
      if (authData.user) {
        const role = getRoleFromEmail(user.email);
        const department = getDepartmentFromRole(role);
        const officeLocation = getOfficeLocationFromRole(role);
        
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert([{
            user_id: authData.user.id,
            email: user.email,
            full_name: user.userData.full_name,
            employee_id: user.userData.employee_id,
            role: role,
            department: department,
            phone: user.userData.phone,
            emergency_contact: user.userData.emergency_contact,
            floor_number: 1,
            office_location: officeLocation,
            privacy_settings: { share_vitals: true, share_location: true },
            is_active: true
          }]);

        if (profileError) {
          console.error(`Error creating profile for ${user.email}:`, profileError);
        } else {
          console.log(`Successfully set up user: ${user.email}`);
        }
      }
    } catch (error) {
      console.error(`Error setting up user ${user.email}:`, error);
    }
  }
  
  console.log('Demo user setup complete!');
};
