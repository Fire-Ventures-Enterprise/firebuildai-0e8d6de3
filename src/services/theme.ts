import { supabase } from "@/integrations/supabase/client";
import type { ThemePref } from "@/domain/db";

const LS_KEY = 'firebuildai:theme';

export const ThemeService = {
  // System → Light/Dark resolution
  resolveSystem(): ThemePref {
    if (typeof window === 'undefined') return 'light';
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  },

  apply(theme: ThemePref) {
    const effective = theme === 'system' ? this.resolveSystem() : theme;
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', effective === 'dark');
    }
  },

  saveLocal(theme: ThemePref) {
    if (typeof localStorage !== 'undefined') localStorage.setItem(LS_KEY, theme);
  },

  loadLocal(): ThemePref | null {
    if (typeof localStorage === 'undefined') return null;
    const v = localStorage.getItem(LS_KEY);
    return (v === 'system' || v === 'light' || v === 'dark') ? v : null;
  },

  async getProfileTheme(): Promise<ThemePref | null> {
    const { data } = await supabase.auth.getUser();
    if (!data.user) return null;
    const { data: prof, error } = await supabase.from('profiles').select('theme').eq('id', data.user.id).single();
    if (error) return null;
    return (prof?.theme ?? null) as ThemePref | null;
  },

  async setProfileTheme(theme: ThemePref): Promise<void> {
    const { data } = await supabase.auth.getUser();
    if (!data.user) {
      this.saveLocal(theme);
      this.apply(theme);
      return;
    }
    const { error } = await supabase.from('profiles').update({ theme }).eq('id', data.user.id);
    if (!error) {
      this.saveLocal(theme);
      this.apply(theme);
    }
  },

  // One-call bootstrapping on app load
  async init() {
    const profileTheme = await this.getProfileTheme();
    const localTheme = this.loadLocal();
    const effective: ThemePref = profileTheme ?? localTheme ?? 'system';
    this.apply(effective);
    this.saveLocal(effective);
  },
};