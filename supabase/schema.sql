-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Profiles Table (Extends auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text unique not null,
  full_name text,
  phone text,
  role text check (role in ('customer', 'barber', 'admin')) default 'customer',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Row Level Security (RLS) for profiles
alter table public.profiles enable row level security;
create policy "Public profiles are viewable by everyone." on profiles for select using (true);
create policy "Users can insert their own profile." on profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile." on profiles for update using (auth.uid() = id);

-- Trigger to automatically create a profile when a new user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, phone)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'phone');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. Locations Table (Le 6 Sedi)
create table public.locations (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  address text not null,
  city text not null,
  phone text,
  stripe_account_id text, -- ID dell'account Stripe Connect (es. acct_12345)
  slug text unique,
  image_url text,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.locations enable row level security;
create policy "Locations are viewable by everyone." on locations for select using (true);

-- 3. Services Table
create table public.services (
  id uuid default uuid_generate_v4() primary key,
  location_id uuid references public.locations(id) on delete cascade not null,
  name text not null,
  description text,
  duration_minutes integer not null,
  price numeric(10, 2) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.services enable row level security;
create policy "Services are viewable by everyone." on services for select using (true);

-- 4. Barbers Table
create table public.barbers (
  id uuid default uuid_generate_v4() primary key,
  profile_id uuid references public.profiles(id) on delete set null, -- Optional link to auth user
  location_id uuid references public.locations(id) on delete cascade not null,
  name text not null,
  photo_url text,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.barbers enable row level security;
create policy "Barbers are viewable by everyone." on barbers for select using (true);

-- 5. Appointments Table
create table public.appointments (
  id uuid default uuid_generate_v4() primary key,
  customer_id uuid references public.profiles(id) on delete cascade, -- Nullable per i walk-in (prenotazioni manuali)
  guest_name text, -- Nome cliente per prenotazioni manuali
  guest_phone text, -- Telefono cliente per prenotazioni manuali
  location_id uuid references public.locations(id) on delete cascade not null,
  barber_id uuid references public.barbers(id) on delete cascade not null,
  service_id uuid references public.services(id) on delete cascade not null,
  start_time timestamp with time zone not null,
  end_time timestamp with time zone not null,
  status text check (status in ('pending', 'confirmed', 'cancelled', 'completed')) default 'pending',
  stripe_payment_intent text,
  total_amount numeric(10, 2) not null,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.appointments enable row level security;
-- Customers can see their own appointments
create policy "Customers can view own appointments." on appointments for select using (auth.uid() = customer_id);
-- Customers can insert their own appointments
create policy "Customers can insert own appointments." on appointments for insert with check (auth.uid() = customer_id);
-- Barbers can see appointments for their location
create policy "Barbers can view location appointments." on appointments for select using (
  exists (
    select 1 from barbers 
    where barbers.profile_id = auth.uid() 
    and barbers.location_id = appointments.location_id
  )
);

-- 6. Reviews Table
create table public.reviews (
  id uuid default uuid_generate_v4() primary key,
  appointment_id uuid references public.appointments(id) on delete cascade unique,
  location_id uuid references public.locations(id) on delete cascade not null,
  customer_id uuid references public.profiles(id) on delete cascade not null,
  rating integer check (rating >= 1 and rating <= 5) not null,
  comment text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.reviews enable row level security;
create policy "Reviews are viewable by everyone." on reviews for select using (true);
create policy "Customers can insert their own reviews." on reviews for insert with check (auth.uid() = customer_id);
