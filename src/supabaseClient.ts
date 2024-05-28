import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://epbwawjgqvqgtrhzkxbc.supabase.co';
const supabaseKey = process.env.REACT_APP_SUPABASE_API_KEY;

if (!supabaseKey) {
    throw new Error('Supabase API key is not defined');
  }

export const supabase = createClient(supabaseUrl, supabaseKey);