import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Session, User } from '@supabase/supabase-js';

interface Profile {
  id: string;
  prenom: string;
  nom: string;
  email: string;
  photo_url?: string;
  competences: string[];
  ville: string;
  pays: string;
  rayon_km: number;
  tarif_fcfa: number;
  plan: string;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        handleUserSignIn(session.user);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        await handleUserSignIn(session.user);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleUserSignIn = async (user: User) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error && error.code === 'PGRST116') {
      // Profile doesn't exist, create it
      // For Google OAuth, we get info from metadata
      const metadata = user.user_metadata;
      const firstName = metadata?.given_name || metadata?.name?.split(' ')[0] || localStorage.getItem('temp_firstName') || '';
      const lastName = metadata?.family_name || metadata?.name?.split(' ').slice(1).join(' ') || localStorage.getItem('temp_lastName') || '';
      const photoUrl = metadata?.avatar_url || metadata?.picture || '';
      
      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert([
          { 
            id: user.id, 
            prenom: firstName, 
            nom: lastName, 
            email: user.email,
            photo_url: photoUrl,
            competences: [],
            ville: "",
            pays: "",
            rayon_km: 10,
            tarif_fcfa: 0,
            plan: 'freemium',
            created_at: new Date().toISOString()
          }
        ])
        .select()
        .single();

      if (createError) {
        console.error('Error creating profile:', createError);
      } else {
        setProfile(newProfile);
        // Clear temp storage
        localStorage.removeItem('temp_firstName');
        localStorage.removeItem('temp_lastName');
        localStorage.removeItem('temp_email');
      }
    } else if (data) {
      // Update photo if it's missing or changed and we have a new one from Google
      const metadata = user.user_metadata;
      const photoUrl = metadata?.avatar_url || metadata?.picture;
      if (photoUrl && data.photo_url !== photoUrl) {
        await supabase
          .from('profiles')
          .update({ photo_url: photoUrl })
          .eq('id', user.id);
        data.photo_url = photoUrl;
      }
      setProfile(data);
    }
    setLoading(false);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ session, user, profile, loading, signOut }}>
      {children}
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
