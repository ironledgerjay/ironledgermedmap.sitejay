import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wbikdrduhotwnklrbrlt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndiaWtkcmR1aG90d25rbHJicmx0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzOTU5MjMsImV4cCI6MjA2OTk3MTkyM30.NDW4lN3hOCYyDBr86NHto8I1cdRszLAHU7QkntwYgoM';

export const supabase = createClient(supabaseUrl, supabaseKey);
