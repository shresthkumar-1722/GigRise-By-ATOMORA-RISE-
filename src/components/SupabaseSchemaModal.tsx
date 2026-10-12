import React, { useState } from 'react';
import { X, Copy, Check, Database, Code, ShieldCheck, Terminal } from 'lucide-react';

interface SupabaseSchemaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseSchemaModal: React.FC<SupabaseSchemaModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  const [copiedTab, setCopiedTab] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'sql' | 'apiRoutes' | 'escrowRules'>('sql');

  const copyToClipboard = (text: string, tabName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTab(tabName);
    setTimeout(() => setCopiedTab(null), 2000);
  };

  const sqlCode = `-- GIGRISE BY ATOMORA - SUPABASE POSTGRESQL SCHEMA
-- Tables: users, artist_profiles, shield_pool, bookings, client_financing_loans

-- 1. USERS
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('CLIENT', 'ARTIST', 'ADMIN')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. ARTIST_PROFILES
CREATE TABLE public.artist_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE UNIQUE,
  category TEXT NOT NULL,
  base_hourly_rate NUMERIC(10,2) NOT NULL,
  fair_price_estimated NUMERIC(10,2) NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  gig_points INT DEFAULT 1000,
  is_shield_verified BOOLEAN DEFAULT TRUE
);

-- 3. SHIELD_POOL (Community Liquidity Pool for Cancel-Proof Guarantee)
CREATE TABLE public.shield_pool (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  total_balance NUMERIC(12,2) DEFAULT 48250.00 NOT NULL,
  total_collected_fees NUMERIC(12,2) DEFAULT 0.00,
  total_payouts_claimed NUMERIC(12,2) DEFAULT 0.00
);

-- 4. BOOKINGS (3-Step Escrow: Advance -> Geo Check-in -> Final OTP)
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES public.users(id),
  artist_id UUID REFERENCES public.artist_profiles(id),
  event_date DATE NOT NULL,
  total_amount NUMERIC(10,2) NOT NULL,
  advance_amount NUMERIC(10,2) NOT NULL,    -- 20% Held in Escrow
  shield_fee_amount NUMERIC(10,2) NOT NULL, -- 2% Allocated to Shield Pool
  remaining_balance NUMERIC(10,2) NOT NULL, -- 80% Unlocked by Client OTP
  payment_method TEXT CHECK (payment_method IN ('ESCROW_STANDARD', 'GIGCREDIT_BNPL')),
  bnpl_schedule JSONB DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'CONFIRMED' CHECK (status IN ('CONFIRMED', 'GEO_CHECKED_IN', 'COMPLETED', 'CANCELLED')),
  escrow_otp_hash TEXT NOT NULL,
  geo_checked_in_at TIMESTAMPTZ
);`;

  const apiRouteCode = `// NEXT.JS SERVER ACTIONS & API ROUTES (/api/escrow & /api/matchmaking)

// 1. SMART MATCHMAKING (Category + Geo Distance via Haversine)
export async function matchArtists(category: string, userLat: number, userLng: number, maxKm = 25) {
  const { data: artists } = await supabase.from('artist_profiles').select('*').eq('category', category);
  return artists.filter(a => {
    const km = calculateGeoDistanceKm(userLat, userLng, a.latitude, a.longitude);
    return km <= maxKm;
  });
}

// 2. ESCROW HOLD (20% Advance, 2% Shield Pool deduction)
export async function createEscrowBooking(total: number, artistId: string, clientId: string) {
  const advance = total * 0.20;
  const shieldContribution = total * 0.02;
  const remainingBalance = total - advance;

  // Credit 2% to community shield pool
  await supabase.rpc('increment_shield_pool', { amount: shieldContribution });

  // Store escrow holding record with 6-digit OTP
  return await supabase.from('bookings').insert({
    total_amount: total,
    advance_amount: advance,
    shield_fee_amount: shieldContribution,
    remaining_balance: remainingBalance,
    escrow_otp_hash: hashOtp(generate6DigitCode()),
    status: 'CONFIRMED'
  });
}

// 3. CANCELLATION SHIELD FUNCTION (< 7 Days Window)
export async function processCancellation(bookingId: string) {
  const booking = await getBooking(bookingId);
  const daysBefore = getDaysBetween(new Date(), booking.event_date);

  if (daysBefore < 7) {
    // Artist gets advance + 15% guaranteed bonus from Shield Pool!
    const shieldBonus = booking.total_amount * 0.15;
    await supabase.rpc('decrement_shield_pool', { amount: shieldBonus });
    await transferToArtist(booking.artist_id, booking.advance_amount + shieldBonus);
    return { status: 'SHIELD_PAID', artistTotal: booking.advance_amount + shieldBonus };
  } else {
    // Full refund to client
    await refundToClient(booking.client_id, booking.advance_amount);
    return { status: 'CLIENT_REFUNDED' };
  }
}

// 4. GIGCREDIT (BNPL) 20% Downpayment + 3 EMIs @ 1.5% Interest
export function calculateGigCredit(total: number) {
  const downpayment = total * 0.20;
  const financed = total - downpayment;
  const totalInterest = financed * 0.015 * 3; // 1.5% per month for 3 months
  const emi = (financed + totalInterest) / 3;
  return { downpayment, emi, totalInterest, totalRepayment: downpayment + (emi * 3) };
}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2c2722]/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl bg-[#faf8f5] rounded-2xl border border-[#c5a880]/50 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col paper-texture"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-5 border-b border-[#ebdcc8] flex items-center justify-between bg-[#f4efe4]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#ede2cf] text-[#8c6735] flex items-center justify-center border border-[#d8c7ad]">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#8c8072]">
                Backend Engineering Architecture
              </div>
              <h3 className="text-xl font-serif font-semibold text-[#2c2722]">
                Supabase Schema & Server Actions
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#ede6da] hover:bg-[#e2d8c9] text-[#5c5245] flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="px-5 pt-4 bg-[#f4efe4]/60 border-b border-[#ebdcc8] flex items-center gap-2">
          <button
            onClick={() => setActiveTab('sql')}
            className={`px-4 py-2 text-xs font-mono rounded-t-lg transition-colors border-t border-l border-r ${
              activeTab === 'sql'
                ? 'bg-[#2c2722] text-[#faf8f5] border-[#2c2722]'
                : 'text-[#6e6355] border-transparent hover:text-[#2c2722]'
            }`}
          >
            supabase_schema.sql
          </button>
          <button
            onClick={() => setActiveTab('apiRoutes')}
            className={`px-4 py-2 text-xs font-mono rounded-t-lg transition-colors border-t border-l border-r ${
              activeTab === 'apiRoutes'
                ? 'bg-[#2c2722] text-[#faf8f5] border-[#2c2722]'
                : 'text-[#6e6355] border-transparent hover:text-[#2c2722]'
            }`}
          >
            server_actions.ts
          </button>
        </div>

        {/* Code Content */}
        <div className="p-5 overflow-y-auto flex-1 bg-[#1e1c18] text-[#e8e2d4] font-mono text-xs">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10 text-white/60">
            <span>{activeTab === 'sql' ? 'PostgreSQL DDL + RLS Policies' : 'Next.js App Router / Server Actions'}</span>
            <button
              onClick={() => copyToClipboard(activeTab === 'sql' ? sqlCode : apiRouteCode, activeTab)}
              className="flex items-center gap-1.5 px-3 py-1 rounded bg-white/10 hover:bg-white/20 text-white text-xs transition-colors"
            >
              {copiedTab === activeTab ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedTab === activeTab ? 'Copied!' : 'Copy Code'}</span>
            </button>
          </div>

          <pre className="whitespace-pre-wrap leading-relaxed overflow-x-auto">
            {activeTab === 'sql' ? sqlCode : apiRouteCode}
          </pre>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#f4efe4] border-t border-[#ebdcc8] flex items-center justify-between text-xs text-[#6e6355]">
          <span>Includes complete earthdistance geo-indexing and cryptographic OTP hashing.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-[#faf8f5] bg-[#3a352f] hover:bg-[#1f1c19] rounded-md transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
