
import { supabase } from '@/integrations/supabase/client';

export const createDemoUsers = async () => {
  const demoUsers = [
    {
      email: 'admin@demo.com',
      password: 'password123',
      userData: {
        full_name: 'System Administrator',
        employee_id: 'EMP001',
        role: 'admin' as const,
        department: 'IT',
        floor_number: 1,
        office_location: 'A-101'
      }
    },
    {
      email: 'nurse@demo.com',
      password: 'password123',
      userData: {
        full_name: 'Sarah Johnson',
        employee_id: 'EMP002',
        role: 'hexanurse' as const,
        department: 'Health',
        floor_number: 2,
        office_location: 'B-201'
      }
    },
    {
      email: 'security@demo.com',
      password: 'password123',
      userData: {
        full_name: 'Mike Wilson',
        employee_id: 'EMP003',
        role: 'security' as const,
        department: 'Security',
        floor_number: 1,
        office_location: 'S-101'
      }
    },
    {
      email: 'employee@demo.com',
      password: 'password123',
      userData: {
        full_name: 'John Doe',
        employee_id: 'EMP004',
        role: 'employee' as const,
        department: 'Engineering',
        floor_number: 3,
        office_location: 'C-301'
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
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert([{
            user_id: authData.user.id,
            email: user.email,
            full_name: user.userData.full_name,
            employee_id: user.userData.employee_id,
            role: user.userData.role,
            department: user.userData.department,
            floor_number: user.userData.floor_number,
            office_location: user.userData.office_location,
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
