-- Enable Row Level Security
alter table stores enable row level security;

-- Create policy to allow public read access to store data
create policy "Public can read store locations" 
  on stores
  for select 
  using (true);

-- Create policy to allow authenticated users to manage store data
create policy "Authenticated users can manage stores" 
  on stores
  for all 
  using (auth.role() = 'authenticated');

-- Create policy for real-time subscriptions
create policy "Enable real-time for all users" 
  on stores
  for select 
  using (true);