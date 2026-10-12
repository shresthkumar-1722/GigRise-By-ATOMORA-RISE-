import React, { useState } from 'react';
import { Artist, Booking } from '../types';
import { calculateEscrowBreakdown, calculateGigCreditBNPL } from '../backend/api';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  CreditCard, 
  CheckCircle2, 
  Sparkles, 
  FileText, 
  KeyRound,
  Info
} from 'lucide-react';

interface BookingModalProps {
  artist: Artist | null;
  onClose: () => void;
  onConfirmBooking: (booking: Booking) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  artist,
  onClose,
  onConfirmBooking
}) => {
  if (!artist) return null;

  const [hours, setHours] = useState(artist.minimumHours || 2);
  const [eventDate, setEventDate] = useState('2026-11-28');
  const [eventType, setEventType] = useState('Private Garden Wedding');
  const [venueName, setVenueName] = useState('Fort Canning Orangery Pavilion');
  const [paymentPlan, setPaymentPlan] = useState<'ESCROW_STANDARD' | 'GIGCREDIT_BNPL'>('GIGCREDIT_BNPL');
  const [isSuccess, setIsSuccess] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  // Computations
  const totalAmount = artist.baseHourlyRate * hours;
  const escrow = calculateEscrowBreakdown(totalAmount);
  const bnpl = calculateGigCreditBNPL(totalAmount);

  const handleBookNow = () => {
    // Generate secure 6-digit OTP code for this booking
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

    const newBooking: Booking = {
      id: `GIG-${Date.now().toString().slice(-6)}`,
      artistId: artist.id,
      artistName: artist.name,
      artistCategory: artist.category,
      artistImage: artist.sketchImage,
      clientId: 'usr-client-01',
      clientName: 'Eleanor Vance',
      clientEmail: 'eleanor.vance@atelierbloom.com',
      eventDate,
      eventType,
      venueName,
      venueCity: artist.city || 'Singapore',
      venueCoords: artist.coordinates,
      hours,
      totalAmount,
      advanceAmount: escrow.advanceAmount,
      shieldFeeAmount: escrow.shieldFeeAmount,
      remainingAmount: escrow.remainingAmount,
      paymentType: paymentPlan,
      bnplSchedule: paymentPlan === 'GIGCREDIT_BNPL' ? bnpl.schedule : undefined,
      status: 'CONFIRMED',
      escrowOtp: generatedOtp,
      otpVerified: false,
      createdAt: new Date().toISOString()
    };

    setConfirmedBooking(newBooking);
    setIsSuccess(true);
    onConfirmBooking(newBooking);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2c2722]/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-[#faf8f5] rounded-2xl border border-[#c5a880]/50 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col paper-texture"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top Paper Header */}
        <div className="p-5 sm:p-6 border-b border-[#ebdcc8] flex items-center justify-between bg-[#f4efe4]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 chinese-stamp rounded-sm flex flex-col items-center justify-center p-0.5 bg-[#fdf5f2]/70">
              <span className="text-[8px] uppercase tracking-tighter font-bold leading-none">ATOM</span>
              <span className="text-[7px] uppercase tracking-widest font-serif leading-none mt-0.5">ORA</span>
            </div>
            <div>
              <div className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#8c8072]">
                Paper Booking Voucher
              </div>
              <h3 className="text-xl font-serif font-semibold text-[#2c2722]">
                {artist.name} · {artist.category}
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

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          
          {isSuccess && confirmedBooking ? (
            /* Booking Confirmed State */
            <div className="py-6 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-[#e8efe8] text-[#4d7350] border border-[#c6dcc7] flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-2xl font-serif font-semibold text-[#2c2722]">
                Escrow Voucher Issued
              </h4>
              <p className="text-xs sm:text-sm text-[#6f665a] max-w-md mx-auto">
                Your reservation with <strong className="text-[#2c2722]">{artist.name}</strong> is secured in our escrow ledger. 
                {paymentPlan === 'GIGCREDIT_BNPL' ? ' GigCredit BNPL schedule activated.' : ' 20% advance held safely.'}
              </p>

              {/* Secret Escrow OTP Box */}
              <div className="p-4 rounded-xl bg-[#f4efe4] border border-[#d6c9b5] max-w-sm mx-auto text-center">
                <div className="text-[11px] uppercase tracking-wider text-[#7a6f62] font-semibold flex items-center justify-center gap-1.5 mb-1">
                  <KeyRound className="w-3.5 h-3.5 text-[#9b784a]" />
                  <span>Client Completion OTP Code</span>
                </div>
                <div className="font-mono text-3xl font-bold tracking-[0.25em] text-[#2c2722] my-1">
                  {confirmedBooking.escrowOtp}
                </div>
                <div className="text-[10px] text-[#8c7f70] mt-1 leading-relaxed">
                  Provide this 6-digit code to the artist only after their performance finishes to release remaining escrow balance.
                </div>
              </div>

              <div className="pt-4 flex justify-center">
                <button
                  onClick={onClose}
                  className="px-6 py-2 text-xs font-medium text-[#faf8f5] bg-[#3a352f] hover:bg-[#1f1c19] rounded-lg transition-colors shadow-xs"
                >
                  Return to Journal
                </button>
              </div>
            </div>
          ) : (
            /* Active Form State */
            <>
              {/* Event Details Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#5c5245] mb-1">
                    Event Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8c8072]" />
                    <input
                      type="date"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs bg-[#faf8f5] border border-[#c5a880]/40 rounded-lg text-[#3a352f] focus:outline-none focus:border-[#9b784a]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#5c5245] mb-1">
                    Duration Hours (Min {artist.minimumHours}h)
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8c8072]" />
                    <input
                      type="number"
                      min={artist.minimumHours}
                      max={8}
                      value={hours}
                      onChange={(e) => setHours(Math.max(artist.minimumHours, Number(e.target.value)))}
                      className="w-full pl-9 pr-3 py-2 text-xs bg-[#faf8f5] border border-[#c5a880]/40 rounded-lg text-[#3a352f] focus:outline-none focus:border-[#9b784a]"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-[#5c5245] mb-1">
                    Venue Name & City
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8c8072]" />
                    <input
                      type="text"
                      value={venueName}
                      onChange={(e) => setVenueName(e.target.value)}
                      placeholder="e.g. Fort Canning Orangery Pavilion, Singapore"
                      className="w-full pl-9 pr-3 py-2 text-xs bg-[#faf8f5] border border-[#c5a880]/40 rounded-lg text-[#3a352f] focus:outline-none focus:border-[#9b784a]"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Plan Choice: Escrow Standard vs GigCredit BNPL */}
              <div>
                <label className="block text-xs font-medium text-[#5c5245] mb-2">
                  Choose Financial Settlement Plan
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  
                  {/* Option 1: GigCredit BNPL (Highlighted) */}
                  <div
                    onClick={() => setPaymentPlan('GIGCREDIT_BNPL')}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      paymentPlan === 'GIGCREDIT_BNPL'
                        ? 'bg-[#f4efe4] border-[#9b784a] shadow-xs'
                        : 'bg-[#faf8f5] border-[#dfd4c0] hover:bg-[#f7f2e8]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5 font-semibold text-xs text-[#2c2722]">
                        <CreditCard className="w-3.5 h-3.5 text-[#9b784a]" />
                        <span>GigCredit (BNPL)</span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#ebd7bf] text-[#7a5828]">
                        POPULAR
                      </span>
                    </div>
                    <div className="text-[11px] text-[#695f52] leading-tight mt-1">
                      Pay 20% down today (<strong className="text-[#2c2722]">${bnpl.downpayment}</strong>), rest in 3 monthly EMIs of <strong>${bnpl.emiAmount}</strong> at 1.5% interest.
                    </div>
                  </div>

                  {/* Option 2: Standard Escrow */}
                  <div
                    onClick={() => setPaymentPlan('ESCROW_STANDARD')}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      paymentPlan === 'ESCROW_STANDARD'
                        ? 'bg-[#f4efe4] border-[#9b784a] shadow-xs'
                        : 'bg-[#faf8f5] border-[#dfd4c0] hover:bg-[#f7f2e8]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5 font-semibold text-xs text-[#2c2722]">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#4d7350]" />
                        <span>3-Step Escrow</span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#e8efe8] text-[#426a45]">
                        STANDARD
                      </span>
                    </div>
                    <div className="text-[11px] text-[#695f52] leading-tight mt-1">
                      20% advance today (<strong className="text-[#2c2722]">${escrow.advanceAmount}</strong>), 80% balance held until post-performance OTP release.
                    </div>
                  </div>

                </div>
              </div>

              {/* Financial Calculation Breakdown Table */}
              <div className="p-4 rounded-xl bg-[#f4efe4] border border-[#e2d7c5] space-y-2 text-xs">
                <div className="flex justify-between text-[#5f5446]">
                  <span>Artist Rate: ${artist.baseHourlyRate}/hr × {hours} hours</span>
                  <span className="font-mono text-[#2c2722]">${totalAmount}.00</span>
                </div>

                <div className="flex justify-between text-[#5f5446]">
                  <span className="flex items-center gap-1">
                    <span>Shield Pool Contribution (2%)</span>
                    <Info className="w-3 h-3 text-[#9b784a]" />
                  </span>
                  <span className="font-mono text-[#4d7350]">${escrow.shieldFeeAmount}</span>
                </div>

                {paymentPlan === 'GIGCREDIT_BNPL' ? (
                  <>
                    <div className="flex justify-between text-[#5f5446]">
                      <span>Downpayment Due Today (20%)</span>
                      <span className="font-mono font-bold text-[#2c2722]">${bnpl.downpayment}</span>
                    </div>
                    <div className="flex justify-between text-[#73685a] text-[11px] pt-1 border-t border-[#e2d7c5]">
                      <span>3 EMIs @ 1.5% monthly interest:</span>
                      <span className="font-mono">3 × ${bnpl.emiAmount}/mo</span>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between text-[#5f5446]">
                    <span>Advance Held in Escrow Today (20%)</span>
                    <span className="font-mono font-bold text-[#2c2722]">${escrow.advanceAmount}</span>
                  </div>
                )}

                <div className="pt-2 border-t border-[#d8ccb8] flex justify-between font-serif text-sm font-bold text-[#2c2722]">
                  <span>Total Investment:</span>
                  <span>${paymentPlan === 'GIGCREDIT_BNPL' ? bnpl.totalRepayment : totalAmount}.00</span>
                </div>
              </div>

              {/* Cancel-Proof Guarantee Notice */}
              <div className="flex items-center gap-2 p-3 rounded-lg bg-[#e8efe8]/60 border border-[#c6dcc7] text-[11px] text-[#3e5f41]">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Protected by Cancel-Proof Shield: Full refund if cancelled 7+ days ahead. Artist receives 15% bonus if client cancels last minute.</span>
              </div>

              {/* Checkout Action */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-[#6e6355] hover:text-[#2c2722] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleBookNow}
                  className="px-6 py-2.5 text-xs font-medium text-[#faf8f5] bg-[#3a352f] hover:bg-[#1f1c19] rounded-lg transition-all duration-200 shadow-md flex items-center gap-2 active:scale-95"
                >
                  <span>Confirm & Lock Date</span>
                  <Sparkles className="w-3.5 h-3.5 text-[#d9c5a3]" />
                </button>
              </div>
            </>
          )}

        </div>

      </div>
    </div>
  );
};
