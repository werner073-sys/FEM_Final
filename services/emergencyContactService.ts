import { supabase } from './supabaseClient';
import { EmergencyContact } from '../types';

export async function saveEmergencyContact(contact: Omit<EmergencyContact, 'id'>) {
  const { data, error } = await supabase
    .from('emergency_contacts')
    .insert(contact)
    .select();

  if (error) throw error;
  return data[0];
}

export async function getEmergencyContacts() {
  const { data, error } = await supabase
    .from('emergency_contacts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function updateEmergencyContact(
  id: string,
  contact: Partial<Omit<EmergencyContact, 'id'>>
) {
  const { data, error } = await supabase
    .from('emergency_contacts')
    .update(contact)
    .eq('id', id)
    .select();

  if (error) throw error;
  return data[0];
}

export async function deleteEmergencyContact(id: string) {
  const { error } = await supabase
    .from('emergency_contacts')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
