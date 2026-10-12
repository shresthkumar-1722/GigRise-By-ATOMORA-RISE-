-- ==============================================================================
-- GIGRISE BY ATOMORA - SUPABASE POSTGRESQL DATABASE SCHEMA
-- Artisanal Event Artist Marketplace with Cancel-Proof Shield & 3-Step Escrow
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "earthdistance" CASCADE; -- Geo-distance calculation support

-- 2. USERS TABLE
-- Stores authenticated users (both Clients and Artists)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('CLIENT', 'ARTIST', 'ADMIN')),
    avatar_url TEXT,
    phone TEXT,
    city TEXT DEFAULT 'Singapore',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. ARTIST_PROFILES TABLE
-- Detailed portfolio, pricing, badges, and gamification points for creators
CREATE TABLE IF NOT EXISTS public.artist_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    handle TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL CHECK (category IN (
        'Acoustic Soloist', 
        'Jazz & Blues', 
        'Live Painting', 
        'Classical Strings', 
        'Sitar & World', 
        'Ambient Vinyl', 
        'Calligraphy & Craft'
    )),
    genre TEXT NOT NULL,
    bio TEXT NOT NULL,
    handwritten_quote TEXT,
    base_hourly_rate NUMERIC(10, 2) NOT NULL CHECK (base_hourly_rate > 0),
    minimum_hours INT DEFAULT 2 NOT NULL,
    fair_price_estimated NUMERIC(10, 2) NOT NULL, -- AI zero-bargaining fair rate
    location_name TEXT NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    sketch_image_url TEXT,
    repertoire TEXT[] DEFAULT '{}',
    instruments TEXT[] DEFAULT '{}',
    badges TEXT[] DEFAULT '{"Shield Verified"}',
    rating NUMERIC(3, 2) DEFAULT 5.00 NOT NULL,
    review_count INT DEFAULT 0 NOT NULL,
    gig_points INT DEFAULT 1000 NOT NULL, -- Gamification XP
    total_gigs_completed INT DEFAULT 0 NOT NULL,
    is_shield_verified BOOLEAN DEFAULT TRUE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. SHIELD_POOL TABLE
-- Autonomous community liquidity pool funding cancellation protections
CREATE TABLE IF NOT EXISTS public.shield_pool (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    total_balance NUMERIC(12, 2) DEFAULT 48250.00 NOT NULL,
    total_collected_fees NUMERIC(12, 2) DEFAULT 0.00 NOT NULL,
    total_payouts_claimed NUMERIC(12, 2) DEFAULT 0.00 NOT NULL,
    active_claims_count INT DEFAULT 0 NOT NULL,
    last_rebalanced_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. BOOKINGS & 3-STEP ESCROW TABLE
-- Manages the 3-Step Escrow lifecycle: Advance -> Geo Check-in -> Final OTP Release
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES public.users(id) ON DELETE RESTRICT NOT NULL,
    artist_id UUID REFERENCES public.artist_profiles(id) ON DELETE RESTRICT NOT NULL,
    event_date DATE NOT NULL,
    event_type TEXT NOT NULL,
    venue_name TEXT NOT NULL,
    venue_latitude DOUBLE PRECISION NOT NULL,
    venue_longitude DOUBLE PRECISION NOT NULL,
    duration_hours INT NOT NULL CHECK (duration_hours >= 1),
    
    -- Financial Escrow Allocations
    total_amount NUMERIC(10, 2) NOT NULL,
    advance_amount NUMERIC(10, 2) NOT NULL,      -- 20% held in Escrow Vault
    shield_fee_amount NUMERIC(10, 2) NOT NULL,   -- 2% allocated to Shield_Pool
    remaining_balance NUMERIC(10, 2) NOT NULL,   -- 80% pending completion OTP
    
    payment_method TEXT NOT NULL CHECK (payment_method IN ('ESCROW_STANDARD', 'GIGCREDIT_BNPL')),
    bnpl_schedule JSONB DEFAULT '[]'::jsonb,
    
    -- 3-Step Verification
    status TEXT NOT NULL DEFAULT 'CONFIRMED' CHECK (status IN (
        'PENDING_PAYMENT',
        'CONFIRMED',        -- Step 1: Advance secured in escrow
        'GEO_CHECKED_IN',   -- Step 2: Artist GPS within 200m of venue
        'COMPLETED',        -- Step 3: Client provides 6-digit OTP
        'CANCELLED'         -- Handled by Cancel-Proof Shield rules
    )),
    
    geo_checked_in_at TIMESTAMP WITH TIME ZONE,
    artist_checkin_lat DOUBLE PRECISION,
    artist_checkin_lng DOUBLE PRECISION,
    
    escrow_otp_hash TEXT NOT NULL,               -- Hashed 6-digit release code
    otp_verified_at TIMESTAMP WITH TIME ZONE,
    
    -- Cancellation Shield Audit
    cancellation_date TIMESTAMP WITH TIME ZONE,
    cancelled_by TEXT CHECK (cancelled_by IN ('CLIENT', 'ARTIST', 'FORCE_MAJEURE')),
    artist_shield_payout NUMERIC(10, 2) DEFAULT 0.00,
    client_refund_amount NUMERIC(10, 2) DEFAULT 0.00,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 6. CLIENT_FINANCING_LOANS TABLE
-- Micro-advances / Fair Credit for clients with low financial liquidity
CREATE TABLE IF NOT EXISTS public.client_financing_loans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES public.users(id) ON DELETE RESTRICT NOT NULL,
    requested_amount NUMERIC(10, 2) NOT NULL,
    interest_rate_annual NUMERIC(5, 2) NOT NULL, -- Calculated based on tier
    tenure_months INT NOT NULL CHECK (tenure_months BETWEEN 1 AND 12),
    monthly_installment NUMERIC(10, 2) NOT NULL,
    total_repayment NUMERIC(10, 2) NOT NULL,
    financial_tier TEXT NOT NULL,
    status TEXT DEFAULT 'PRE_APPROVED' CHECK (status IN ('PRE_APPROVED', 'ACTIVE', 'PAID_OFF', 'DEFAULTED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 7. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artist_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shield_pool ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_financing_loans ENABLE ROW LEVEL SECURITY;

-- Read policies
CREATE POLICY "Public profiles are viewable by anyone" 
    ON public.artist_profiles FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Users can read own record" 
    ON public.users FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Bookings viewable by involved client or artist" 
    ON public.bookings FOR SELECT USING (
        auth.uid() = client_id OR 
        auth.uid() IN (SELECT user_id FROM public.artist_profiles WHERE id = artist_id)
    );

CREATE POLICY "Shield pool stats public read-only" 
    ON public.shield_pool FOR SELECT USING (TRUE);

-- 8. INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_artists_category ON public.artist_profiles(category);
CREATE INDEX IF NOT EXISTS idx_artists_coords ON public.artist_profiles(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_event_date ON public.bookings(event_date);
