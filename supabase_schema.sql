-- Jalankan skrip ini di Supabase Dashboard → SQL Editor
-- Project: rigjcrmigatioudqwbny

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null,
  datetime timestamptz not null,
  type text not null check (type in ('income', 'expense')),
  category text not null,
  text text not null,
  amount numeric not null check (amount > 0),
  payment_method text,
  created_at timestamptz default now()
);

-- Index biar query per user & rentang tanggal cepat
create index if not exists transactions_user_datetime_idx
  on public.transactions (user_id, datetime desc);

-- Aktifkan Row Level Security
alter table public.transactions enable row level security;

-- Setiap user cuma bisa baca & ubah transaksi miliknya sendiri
create policy "Users can view own transactions"
  on public.transactions for select
  using (auth.uid() = user_id);

create policy "Users can insert own transactions"
  on public.transactions for insert
  with check (auth.uid() = user_id);

create policy "Users can update own transactions"
  on public.transactions for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own transactions"
  on public.transactions for delete
  using (auth.uid() = user_id);
