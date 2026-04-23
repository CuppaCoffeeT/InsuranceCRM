-- Insurance CRM schema with row-level security
-- Run in Supabase SQL editor for project uivdgousiyfeyrebloaz

-- ---------- tables ----------
create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  email text,
  phone text,
  date_of_birth date,
  occupation text,
  annual_income numeric,
  risk_profile text default 'Moderate',
  notes text,
  created_date date default current_date,
  last_review_date date,
  next_review_date date,
  review_frequency text default 'Annual',
  total_bank_balance numeric default 0,
  cpf_oa numeric default 0,
  cpf_sa numeric default 0,
  cpf_ma numeric default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.policies (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  type text not null,
  provider text,
  policy_number text,
  premium numeric default 0,
  frequency text default 'Annual',
  coverage_amount numeric default 0,
  tpd_coverage numeric default 0,
  tpd_same_as_death boolean default false,
  critical_illness_coverage numeric default 0,
  ci_notes text,
  early_critical_illness_coverage numeric default 0,
  eci_notes text,
  start_date date,
  end_date date,
  status text default 'Active',
  has_cash_value boolean default false,
  current_cash_value numeric default 0,
  is_investment_linked boolean default false,
  current_account_value numeric default 0,
  investment_allocation text,
  illustrated_value_age_55 numeric default 0,
  illustrated_value_age_65 numeric default 0,
  ilp_premium_inclusion_percent numeric default 0,
  is_hospitalization boolean default false,
  hospital_type text default 'Private',
  integrated_shield_cpf numeric default 0,
  integrated_shield_cash numeric default 0,
  rider_cash numeric default 0,
  created_at timestamptz default now()
);

create table if not exists public.projected_cash_values (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  policy_id uuid not null references public.policies(id) on delete cascade,
  age integer not null,
  value numeric not null
);

create table if not exists public.interactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  date date not null default current_date,
  type text default 'Meeting',
  notes text,
  follow_up date,
  created_at timestamptz default now()
);

create table if not exists public.bank_balance_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  date date not null default current_date,
  balance numeric not null,
  notes text,
  created_at timestamptz default now()
);

-- ---------- indexes ----------
create index if not exists idx_clients_user on public.clients(user_id);
create index if not exists idx_policies_client on public.policies(client_id);
create index if not exists idx_policies_user on public.policies(user_id);
create index if not exists idx_pcv_policy on public.projected_cash_values(policy_id);
create index if not exists idx_interactions_client on public.interactions(client_id);
create index if not exists idx_bbh_client on public.bank_balance_history(client_id);

-- ---------- row level security ----------
alter table public.clients enable row level security;
alter table public.policies enable row level security;
alter table public.projected_cash_values enable row level security;
alter table public.interactions enable row level security;
alter table public.bank_balance_history enable row level security;

-- clients
drop policy if exists "clients_owner_all" on public.clients;
create policy "clients_owner_all"
  on public.clients for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- policies
drop policy if exists "policies_owner_all" on public.policies;
create policy "policies_owner_all"
  on public.policies for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- projected cash values
drop policy if exists "pcv_owner_all" on public.projected_cash_values;
create policy "pcv_owner_all"
  on public.projected_cash_values for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- interactions
drop policy if exists "interactions_owner_all" on public.interactions;
create policy "interactions_owner_all"
  on public.interactions for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- bank balance history
drop policy if exists "bbh_owner_all" on public.bank_balance_history;
create policy "bbh_owner_all"
  on public.bank_balance_history for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
