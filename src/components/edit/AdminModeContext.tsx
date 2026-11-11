"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ensureAdmin } from "@/lib/supabase/ensure-admin";
import { browserSupabase } from "@/lib/supabase/browser";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { refreshPublicSite } from "@/lib/revalidate-public";

type AdminModeValue = {
  ready: boolean;
  isAdmin: boolean;
  email: string;
  refreshSite: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AdminModeContext = createContext<AdminModeValue>({
  ready: false,
  isAdmin: false,
  email: "",
  refreshSite: async () => undefined,
  signOut: async () => undefined,
});

export function AdminModeProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState("");

  const check = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setReady(true);
      setIsAdmin(false);
      setEmail("");
      return;
    }
    const supabase = browserSupabase();
    if (!supabase) {
      setReady(true);
      setIsAdmin(false);
      return;
    }
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      setIsAdmin(false);
      setEmail("");
      setReady(true);
      return;
    }
    setEmail(data.session.user.email ?? "");
    const result = await ensureAdmin(supabase);
    setIsAdmin(result.ok);
    setReady(true);
  }, []);

  useEffect(() => {
    void check();
    const supabase = browserSupabase();
    if (!supabase) return;
    const { data } = supabase.auth.onAuthStateChange(() => {
      void check();
    });
    return () => data.subscription.unsubscribe();
  }, [check]);

  const refreshSite = useCallback(async () => {
    await refreshPublicSite();
    router.refresh();
  }, [router]);

  const signOut = useCallback(async () => {
    await browserSupabase()?.auth.signOut();
    setIsAdmin(false);
    setEmail("");
    router.refresh();
  }, [router]);

  const value = useMemo(
    () => ({ ready, isAdmin, email, refreshSite, signOut }),
    [ready, isAdmin, email, refreshSite, signOut],
  );

  return <AdminModeContext.Provider value={value}>{children}</AdminModeContext.Provider>;
}

export function useAdminMode() {
  return useContext(AdminModeContext);
}
