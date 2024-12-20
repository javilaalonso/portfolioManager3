import { createClient } from '@supabase/supabase-js';
import type { Transaction } from '../types/transaction';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function getTransactions(): Promise<Transaction[]> {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: true });
    
    if (error) {
      console.error('Supabase error:', error);
      throw new Error(`Failed to fetch transactions: ${error.message}`);
    }
    
    if (!data) {
      return [];
    }
    
    return data.map(transaction => ({
      id: transaction.id,
      type: transaction.type as 'buy' | 'sell',
      symbol: transaction.symbol,
      shares: Number(transaction.shares),
      price: Number(transaction.price),
      date: new Date(transaction.date)
    }));
  } catch (error) {
    console.error('Failed to fetch transactions:', error);
    throw error;
  }
}

export async function saveTransaction(transaction: Transaction): Promise<void> {
  try {
    const { error } = await supabase
      .from('transactions')
      .insert([{
        id: transaction.id,
        type: transaction.type,
        symbol: transaction.symbol,
        shares: transaction.shares,
        price: transaction.price,
        date: transaction.date.toISOString()
      }]);
    
    if (error) {
      console.error('Supabase error:', error);
      throw new Error(`Failed to save transaction: ${error.message}`);
    }
  } catch (error) {
    console.error('Failed to save transaction:', error);
    throw error;
  }
}

export async function deleteTransaction(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Supabase error:', error);
      throw new Error(`Failed to delete transaction: ${error.message}`);
    }
  } catch (error) {
    console.error('Failed to delete transaction:', error);
    throw error;
  }
}