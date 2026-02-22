import type { Session } from '@supabase/supabase-js';
import { type PropsWithChildren, useEffect, useState } from 'react';
import { Linking } from 'react-native';
import { AuthContext } from '../hooks/useAuthContext';
import { supabase } from '../lib/supabase';

function extractParamsFromUrl(url: string) {
  try {
    const parsed = new URL(url);
    const hash = parsed.hash.substring(1);
    const params = new URLSearchParams(hash);
    return {
      access_token: params.get('access_token'),
      refresh_token: params.get('refresh_token'),
    };
  } catch {
    return { access_token: null, refresh_token: null };
  }
}

export default function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSession = async () => {
      const {
        data: { session: currentSession },
        error,
      } = await supabase.auth.getSession();
      if (error) console.error('Erro ao carregar sessão:', error);
      setSession(currentSession);
      setIsLoading(false);
    };

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handleDeepLink = async (url: string | null) => {
      if (!url || !url.includes('access_token')) return;
      const params = extractParamsFromUrl(url);
      if (params.access_token && params.refresh_token) {
        await supabase.auth.setSession({
          access_token: params.access_token,
          refresh_token: params.refresh_token,
        });
      }
    };

    Linking.getInitialURL().then(handleDeepLink);
    const sub = Linking.addEventListener('url', ({ url }) => handleDeepLink(url));
    return () => sub.remove();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        session,
        isLoading,
        isLoggedIn: !!session,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
