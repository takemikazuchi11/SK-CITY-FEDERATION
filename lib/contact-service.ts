import { supabase } from './supabase';

export interface ContactInfo {
  id?: number;
  name: string;
  fullName: string;
  category: string;
  phone?: string;
  email?: string;
  address: string;
  hours?: string;
  description: string;
}

export async function getContacts(): Promise<ContactInfo[]> {
  const { data, error } = await supabase.from('contacts').select('*').order('category').order('name');
  if (error) throw error;
  // Map 'fullname' (from db) to 'fullName' (in code)
  return (data || []).map((c: any) => ({ ...c, fullName: c.fullName ?? c.fullname ?? "" }));
}

export async function addContact(contact: Omit<ContactInfo, 'id'>): Promise<ContactInfo> {
  const { data, error } = await supabase.from('contacts').insert([contact]).select();
  if (error) throw error;
  return data[0];
}

export async function updateContact(contact: ContactInfo): Promise<ContactInfo> {
  if (!contact.id) throw new Error('Missing contact id');
  const { id, ...updates } = contact;
  const { data, error } = await supabase.from('contacts').update(updates).eq('id', id).select();
  if (error) throw error;
  return data[0];
}

export async function deleteContact(id: number): Promise<void> {
  const { error } = await supabase.from('contacts').delete().eq('id', id);
  if (error) throw error;
} 