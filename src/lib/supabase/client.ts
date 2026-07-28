import { createClient } from '@supabase/supabase-js';

const getSupabaseUrl = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url || !url.startsWith('http')) {
    return 'https://mujxnzazkqqxpjbftvtb.supabase.co';
  }
  return url;
};

const getSupabaseAnonKey = () => {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';
};

export const supabase = createClient(getSupabaseUrl(), getSupabaseAnonKey());
