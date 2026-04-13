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
    // 1. Check for pending names from Login (localStorage)
    const pendingPrenom = localStorage.getItem('pending_prenom');
    const pendingNom = localStorage.getItem('pending_nom');

    if (pendingPrenom && pendingNom) {
      await supabase.from('profiles').upsert({
        id: user.id,
        prenom: pendingPrenom,
        nom: pendingNom,
        email: user.email,
        plan: 'freemium'
      });
      localStorage.removeItem('pending_prenom');
      localStorage.removeItem('pending_nom');
    }

    // 2. Load profile from Supabase (created by trigger if new)
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profile) {
      setProfile(profile);
    }
    
    setLoading(false);
  };

  const signOut = async () => {
    // 1. Clear local state immediately for instant UI feedback
    setProfile(null);
    setUser(null);
    setSession(null);
    setLoading(false);
    
    // 2. Clear any pending name data
    localStorage.removeItem('pending_prenom');
    localStorage.removeItem('pending_nom');
    localStorage.removeItem('temp_firstName');
    localStorage.removeItem('temp_lastName');
    localStorage.removeItem('temp_email');

    // 3. Perform network logout
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Error during Supabase signout:", error);
    }
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
