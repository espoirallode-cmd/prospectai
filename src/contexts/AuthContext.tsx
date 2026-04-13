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
    const pendingPrenom = localStorage.getItem('pending_prenom');
    const pendingNom = localStorage.getItem('pending_nom');

    if (pendingPrenom && pendingNom) {
      await supabase.from('profiles').upsert({
        id: user.id,
        prenom: pendingPrenom,
        nom: pendingNom,
        email: user.email,
        plan: 'freemium',
        created_at: new Date().toISOString()
      });
      localStorage.removeItem('pending_prenom');
      localStorage.removeItem('pending_nom');
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error && error.code === 'PGRST116') {
      // Profile doesn't exist, create it
      // For Google OAuth, we get info from metadata
      const metadata = user.user_metadata;
      const firstName = metadata?.given_name || metadata?.name?.split(' ')?.[0] || localStorage.getItem('temp_firstName') || '';
      const lastName = metadata?.family_name || metadata?.name?.split(' ')?.slice(1).join(' ') || localStorage.getItem('temp_lastName') || '';
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
      // Profile exists, check if we need to update info from metadata or temp storage
      const metadata = user.user_metadata;
      const firstName = metadata?.given_name || metadata?.name?.split(' ')?.[0] || localStorage.getItem('temp_firstName');
      const lastName = metadata?.family_name || metadata?.name?.split(' ')?.slice(1).join(' ') || localStorage.getItem('temp_lastName');
      const photoUrl = metadata?.avatar_url || metadata?.picture;

      const updates: any = {};
      let needsUpdate = false;

      if (firstName && !data.prenom) {
        updates.prenom = firstName;
        data.prenom = firstName;
        needsUpdate = true;
      }
      if (lastName && !data.nom) {
        updates.nom = lastName;
        data.nom = lastName;
        needsUpdate = true;
      }
      if (photoUrl && data.photo_url !== photoUrl) {
        updates.photo_url = photoUrl;
        data.photo_url = photoUrl;
        needsUpdate = true;
      }

      if (needsUpdate) {
        await supabase
          .from('profiles')
          .update(updates)
          .eq('id', user.id);
        
        // Clear temp storage if we used it
        localStorage.removeItem('temp_firstName');
        localStorage.removeItem('temp_lastName');
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
