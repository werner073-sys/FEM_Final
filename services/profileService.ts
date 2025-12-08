import { supabase } from './supabaseClient';

export async function getUserProfile() {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function updateUserProfile(updates: {
  display_name?: string;
  cycle_mode?: 'CYCLE' | 'PREGNANCY';
  cycle_length?: number;
}) {
  const { data, error } = await supabase
    .from('user_profiles')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .select();

  if (error) throw error;
  return data[0];
}

export async function createUserProfileIfMissing(userId: string, displayName: string) {
  const existing = await getUserProfile();

  if (!existing) {
    const { data, error } = await supabase
      .from('user_profiles')
      .insert({
        user_id: userId,
        display_name: displayName,
      })
      .select();

    if (error) throw error;
    return data[0];
  }

  return existing;
}
