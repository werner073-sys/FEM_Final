import { supabase } from './supabaseClient';

export async function saveCycleEntry(
  date: string,
  cycleDay: number,
  loggedSymptoms: string[]
) {
  const { data, error } = await supabase
    .from('cycle_entries')
    .upsert(
      {
        date,
        cycle_day: cycleDay,
        logged_symptoms: loggedSymptoms,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,date' }
    )
    .select();

  if (error) throw error;
  return data;
}

export async function getCycleEntries(startDate?: string, endDate?: string) {
  let query = supabase
    .from('cycle_entries')
    .select('*')
    .order('date', { ascending: false });

  if (startDate) {
    query = query.gte('date', startDate);
  }

  if (endDate) {
    query = query.lte('date', endDate);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data;
}

export async function getTodaysCycleEntry(date: string) {
  const { data, error } = await supabase
    .from('cycle_entries')
    .select('*')
    .eq('date', date)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function deleteCycleEntry(id: string) {
  const { error } = await supabase
    .from('cycle_entries')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
