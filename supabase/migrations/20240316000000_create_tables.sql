-- Enable Row Level Security
create extension if not exists "uuid-ossp";

-- Create transactions table
create table public.transactions (
    id uuid primary key default uuid_generate_v4(),
    type text not null check (type in ('buy', 'sell')),
    symbol text not null,
    shares numeric not null check (shares > 0),
    price numeric not null check (price > 0),
    date timestamp with time zone not null default now(),
    created_at timestamp with time zone not null default now()
);

-- Enable RLS
alter table public.transactions enable row level security;

-- Create policies
create policy "Enable read access for all users" on public.transactions
    for select using (true);

create policy "Enable insert access for all users" on public.transactions
    for insert with check (true);

create policy "Enable delete access for all users" on public.transactions
    for delete using (true);

-- Insert initial transactions for PLTR and AMZN positions
insert into public.transactions (type, symbol, shares, price, date)
values 
    ('buy', 'PLTR', 20, 30, '2022-12-12T00:00:00Z'),
    ('buy', 'AMZN', 10, 10, '2021-12-12T00:00:00Z');