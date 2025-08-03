
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Profile {
  id?: string;
  user_id: string;
  email: string;
  full_name: string;
  employee_id: string;
  role: 'employee' | 'admin' | 'hexanurse' | 'security';
  department: string;
  phone?: string;
  emergency_contact?: string;
  floor_number: number;
  office_location: string;
  privacy_settings?: any;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, userData: Partial<Profile>) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user ID:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      console.log('Profile fetched:', data);
      return data;
    } catch (error) {
      console.error('Error in fetchProfile:', error);
      return null;
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      console.log('Initializing auth...');
      const {
        data: { session },
      } = await supabase.auth.getSession();

      console.log('Session found:', !!session, session?.user?.email);
      if (session) {
        setSession(session);
        setUser(session.user);
        const profileData = await fetchProfile(session.user.id);
        setProfile(profileData);
      }
      console.log('Setting loading to false');
      setLoading(false);
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state change:', event);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // Use setTimeout to avoid blocking the auth state change
        setTimeout(async () => {
          try {
            const profileData = await fetchProfile(session.user.id);
            setProfile(profileData);
            console.log('Profile set in auth state change:', profileData);
          } catch (error) {
            console.error('Error fetching profile in auth state change:', error);
            setProfile(null);
          }
        }, 0);
      } else {
        setProfile(null);
      }
    });

    initAuth();

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Login Failed",
          description: error.message,
          variant: "destructive",
        });
      }

      return { error };
    } catch (error) {
      console.error('Sign in error:', error);
      return { error };
    }
  };

  const signUp = async (email: string, password: string, userData: Partial<Profile>) => {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        }
      });

      if (authError) {
        toast({
          title: "Registration Failed",
          description: authError.message,
          variant: "destructive",
        });
        return { error: authError };
      }

      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([{
            user_id: authData.user.id,
            email,
            full_name: userData.full_name || '',
            employee_id: userData.employee_id || '',
            role: userData.role || 'employee',
            department: userData.department,
            phone: userData.phone,
            emergency_contact: userData.emergency_contact,
            floor_number: userData.floor_number,
            office_location: userData.office_location,
          }]);

        if (profileError) {
          console.error('Profile creation error:', profileError);
          return { error: profileError };
        }
      }

      return { error: null };
    } catch (error) {
      console.error('Sign up error:', error);
      return { error };
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Logout Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: new Error('No user logged in') };

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', user.id);

      if (error) {
        toast({
          title: "Update Failed",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }

      const updatedProfile = await fetchProfile(user.id);
      setProfile(updatedProfile);
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });

      return { error: null };
    } catch (error) {
      console.error('Update profile error:', error);
      return { error };
    }
  };

  const value = {
    user,
    session,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div className="min-h-screen flex items-center justify-center bg-keeper-gradient">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-keeper-blue to-keeper-purple rounded-lg mx-auto mb-4 animate-glow"></div>
            <p className="text-glow">Loading The Keeper...</p>
          </div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
