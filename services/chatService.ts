import { supabase } from './supabaseClient';
import { ChatMessage } from '../types';

export async function saveMessage(role: 'user' | 'model', text: string) {
  const { data, error } = await supabase
    .from('chat_messages')
    .insert({
      role,
      text,
    })
    .select();

  if (error) throw error;
  return data[0];
}

export async function getChatHistory() {
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) throw error;

  return data.map((msg: any): ChatMessage => ({
    id: msg.id,
    role: msg.role,
    text: msg.text,
    timestamp: new Date(msg.created_at),
  }));
}

export async function clearChatHistory() {
  const { error } = await supabase
    .from('chat_messages')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000');

  if (error) throw error;
}
