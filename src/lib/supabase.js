import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xjvvrhzvmcrrdqhjviel.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqdnZyaHp2bWNycmRxaGp2aWVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2NjE0ODAsImV4cCI6MjA5MjIzNzQ4MH0.pg2-CakuY69D8ljBMuSMMAj0q8oweyPHLeCPGjszHzE'

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
)

console.log('SUPABASE:', supabase)