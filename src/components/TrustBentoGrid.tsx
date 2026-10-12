import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Scale, 
  Lock, 
  Coins, 
  ArrowRight, 
  MapPin, 
  KeyRound, 
  CheckCircle2, 
  Sparkles,
  Info
} from 'lucide-react';

interface TrustBentoGridProps {
  onOpenFinancing: () => void;
  currentMode: 'CLIENT' | 'ARTIST';
}

export const TrustBentoGrid: React.FC<TrustBentoGridProps> = ({
  onOpenFinancing,
  currentMode
}) => {
  // Interactive mini calculator for AI Fair Price
  const [fairHours, setFairHours] = useState(3);
  const [eventType, setEventType] = useState<'cocktail' | 'wedding' | 'privateGala'>('wedding');
  
  // Interactive test for cancellation shield
  const [simDaysNotice, setSimDaysNotice] = useState(4);

  // Compute fair price estimate
  const baseRate = eventType === 'wedding' ? 190 : eventType === 'privateGala' ? 220 : 160;
  const estimatedFairPrice = baseRate * fairHours;

  // Compute shield test outcome
  const isProtectedBonus = simDaysNotice < 7;
  const simAdvance = 120; // 20% on a $600 gig
  const simShieldBonus = 90; // 15% bonus

  return (
    <section id="trust" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Section Header */}
      <div className="text-center mb-10">
        <div className="text-xs font-sans tracking-[0.2em] uppercase text-[#7a6f61]">
          Institutional Trust Infrastructure
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-[#2c2722] font-semibold mt-1">
          Guaranteed Protection for Hosts & Creators
        </h2>
        <p className="mt-2 text-sm text-[#6f665a] max-w-xl mx-auto font-sans">
          Built with an artisanal aesthetic, powered by institutional cryptographic escrow, zero-bargaining fair rates, and community liquidity.
        </p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* CARD 1: CANCEL-PROOF SHIELD */}
        <div className="paper-card rounded-xl p-6 sm:p-7 flex flex-col justify-between border border-[#c5a880]/35 bg-[#faf8f5] shadow-sm relative overflow-hidden group">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#ede6da] text-[#9b784a] flex items-center justify-center border border-[#dacfb7]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-mono tracking-wider px-2.5 py-0.5 rounded bg-[#ebd7bf]/60 text-[#7a5828] border border-[#d6bfa3]">
                POOL RESERVE: $48,250
              </span>
            </div>

            <h3 className="text-xl font-serif font-semibold text-[#2c2722]">
              Cancel-Proof Shield
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-[#5d5449] leading-relaxed">
              If an event client cancels within 7 days, the artist retains their full 20% advance <strong className="font-semibold text-[#2c2722]">plus receives a 15% guaranteed bonus payout</strong> drawn automatically from our community Shield Pool.
            </p>

            {/* Interactive Policy Simulation Widget */}
            <div className="mt-5 p-3.5 rounded-lg bg-[#f4efe4] border border-[#e2d7c5] text-xs">
              <div className="flex justify-between items-center mb-1.5 font-medium text-[#4a4237]">
                <span>Notice Before Event:</span>
                <span className="font-bold font-mono text-[#9b784a]">{simDaysNotice} Days</span>
              </div>
              <input
                type="range"
                min="1"
                max="14"
                value={simDaysNotice}
                onChange={(e) => setSimDaysNotice(Number(e.target.value))}
                className="w-full accent-[#9b784a] cursor-pointer"
              />
              <div className="mt-2 pt-2 border-t border-[#e2d7c5]/80 flex items-center justify-between text-[11px]">
                <span className="text-[#6d6255]">Artist Payout:</span>
                <span className={`font-semibold font-mono ${isProtectedBonus ? 'text-[#4d7350]' : 'text-[#84786a]'}`}>
                  {isProtectedBonus ? `$${simAdvance} Adv + $${simShieldBonus} Shield Bonus` : 'Schedule Unblocked (Full Client Refund)'}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-[#eadfcb] text-[11px] text-[#73685a] flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#5a7f5e] shrink-0" />
            <span>Funded automatically by 2% micro-contributions on all bookings</span>
          </div>
        </div>

        {/* CARD 2: AI FAIR PRICE (ZERO BARGAINING) */}
        <div className="paper-card rounded-xl p-6 sm:p-7 flex flex-col justify-between border border-[#c5a880]/35 bg-[#faf8f5] shadow-sm relative overflow-hidden group">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#ede6da] text-[#9b784a] flex items-center justify-center border border-[#dacfb7]">
                <Scale className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-mono tracking-wider px-2.5 py-0.5 rounded bg-[#e8efe8] text-[#426a45] border border-[#c6dcc7]">
                ZERO BARGAINING
              </span>
            </div>

            <h3 className="text-xl font-serif font-semibold text-[#2c2722]">
              AI Fair Price Engine
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-[#5d5449] leading-relaxed">
              Eliminates demeaning price haggling and artist undercutting. Rates are scientifically indexed on instrument logistics, rehearsal preparation, and local guild averages.
            </p>

            {/* Interactive Fair Rate Sandbox */}
            <div className="mt-4 p-3.5 rounded-lg bg-[#f4efe4] border border-[#e2d7c5] text-xs">
              <div className="grid grid-cols-3 gap-1 mb-3 text-[11px]">
                <button
                  onClick={() => setEventType('cocktail')}
                  className={`py-1 px-1.5 rounded text-center transition-colors ${
                    eventType === 'cocktail' ? 'bg-[#3a352f] text-white font-medium' : 'bg-[#e8e2d4] text-[#554c41]'
                  }`}
                >
                  Cocktail
                </button>
                <button
                  onClick={() => setEventType('wedding')}
                  className={`py-1 px-1.5 rounded text-center transition-colors ${
                    eventType === 'wedding' ? 'bg-[#3a352f] text-white font-medium' : 'bg-[#e8e2d4] text-[#554c41]'
                  }`}
                >
                  Wedding
                </button>
                <button
                  onClick={() => setEventType('privateGala')}
                  className={`py-1 px-1.5 rounded text-center transition-colors ${
                    eventType === 'privateGala' ? 'bg-[#3a352f] text-white font-medium' : 'bg-[#e8e2d4] text-[#554c41]'
                  }`}
                >
                  Gala Dinner
                </button>
              </div>

              <div className="flex justify-between items-center text-[11px] text-[#5a5247]">
                <span>Set Duration: {fairHours} Hours</span>
                <div className="flex gap-1.5">
                  {[2, 3, 4].map((h) => (
                    <button
                      key={h}
                      onClick={() => setFairHours(h)}
                      className={`w-6 h-6 rounded text-xs flex items-center justify-center font-mono ${
                        fairHours === h ? 'bg-[#9b784a] text-white font-bold' : 'bg-[#e5ded0] text-[#4a4237]'
                      }`}
                    >
                      {h}h
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-[#e2d7c5]/80 flex items-center justify-between">
                <span className="text-[11px] text-[#73685a]">Calculated Fair Compensation:</span>
                <span className="text-base font-serif font-bold text-[#2c2722]">${estimatedFairPrice}</span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-[#eadfcb] text-[11px] text-[#73685a] flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#5a7f5e] shrink-0" />
            <span>Guaranteed living wage for every performance hour</span>
          </div>
        </div>

        {/* CARD 3: 3-STEP ESCROW VAULT */}
        <div className="paper-card rounded-xl p-6 sm:p-7 flex flex-col justify-between border border-[#c5a880]/35 bg-[#faf8f5] shadow-sm relative overflow-hidden group">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#ede6da] text-[#9b784a] flex items-center justify-center border border-[#dacfb7]">
                <Lock className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-mono tracking-wider px-2.5 py-0.5 rounded bg-[#f3ede3] text-[#726453] border border-[#dcd0bf]">
                CRYPTOGRAPHIC OTP
              </span>
            </div>

            <h3 className="text-xl font-serif font-semibold text-[#2c2722]">
              3-Step Escrow
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-[#5d5449] leading-relaxed">
              Funds are never released blindly. We follow a strict three-tier verification protocol to protect both host and performer.
            </p>

            {/* 3 Step Visual Path */}
            <div className="mt-4 space-y-2 text-xs">
              <div className="flex items-start gap-2.5 p-2 rounded bg-[#f4efe4] border border-[#e2d7c5]">
                <div className="w-5 h-5 rounded-full bg-[#3a352f] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <div className="font-medium text-[#2c2722]">20% Advance Secured</div>
                  <div className="text-[11px] text-[#73685a]">Locks calendar date; holds in neutral smart vault.</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2 rounded bg-[#f4efe4] border border-[#e2d7c5]">
                <div className="w-5 h-5 rounded-full bg-[#9b784a] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <div className="font-medium text-[#2c2722]">Geo Check-In Radius</div>
                  <div className="text-[11px] text-[#73685a]">GPS confirms artist arrival within 250m of venue.</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2 rounded bg-[#f4efe4] border border-[#e2d7c5]">
                <div className="w-5 h-5 rounded-full bg-[#4d7350] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <div className="font-medium text-[#2c2722]">Final 6-Digit OTP Release</div>
                  <div className="text-[11px] text-[#73685a]">Client gives secret OTP code to unlock final 80% payout.</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-[#eadfcb] text-[11px] text-[#73685a] flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#5a7f5e] shrink-0" />
            <span>Zero payment disputes since launch</span>
          </div>
        </div>

      </div>

      {/* CARD 4: ADVANCE FINANCING / LOW FINANCIAL CONDITION CLIENT LOANS BANNER */}
      <div className="mt-6 paper-card rounded-xl p-6 sm:p-8 border border-[#c5a880]/40 bg-gradient-to-r from-[#faf8f5] via-[#f7f2e8] to-[#faf8f5] shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#ede2cf] text-[#8c6735] flex items-center justify-center border border-[#d8c7ad] shrink-0">
            <Coins className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8c6735] uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>GigRise Advance Financing · Client Mode Feature</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-serif font-semibold text-[#2c2722]">
              Inclusive Event Loans & GigCredit (BNPL)
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-[#5d5449] max-w-2xl leading-relaxed">
              Hosting a wedding, memorial, or family milestone under tight financial constraints? Apply for our subsidized micro-advances at ethical interest rates (from 2.2% APR), or choose <strong>GigCredit BNPL</strong>: Pay 20% down today, and spread the balance over 3 easy EMIs at 1.5% interest.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full md:w-auto">
          <button
            onClick={onOpenFinancing}
            className="w-full sm:w-auto px-5 py-2.5 text-xs font-medium text-[#faf8f5] bg-[#3a352f] hover:bg-[#1f1c19] rounded-lg transition-all duration-200 shadow-sm flex items-center justify-center gap-2 active:scale-95 whitespace-nowrap"
          >
            <span>Open Loan Calculator</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#d9c5a3]" />
          </button>
        </div>
      </div>

    </section>
  );
};
