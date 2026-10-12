import React, { useState } from 'react';
import { Booking, B2BLead } from '../types';
import { INITIAL_B2B_LEADS } from '../data/artistsData';
import { processCancellationShield, validateGeoCheckIn } from '../backend/api';
import { 
  Trophy, 
  MapPin, 
  KeyRound, 
  Send, 
  Calendar, 
  ShieldCheck, 
  CheckCircle2, 
  MessageSquare, 
  Bot, 
  Sparkles, 
  AlertCircle,
  ExternalLink,
  Smartphone,
  ChevronRight,
  TrendingUp,
  Award
} from 'lucide-react';

interface CreatorStudioProps {
  bookings: Booking[];
  onUpdateBookingStatus: (bookingId: string, status: Booking['status']) => void;
  onVerifyOtp: (bookingId: string, inputOtp: string) => boolean;
  onSimulateClientCancellation: (bookingId: string) => void;
}

export const CreatorStudio: React.FC<CreatorStudioProps> = ({
  bookings,
  onUpdateBookingStatus,
  onVerifyOtp,
  onSimulateClientCancellation
}) => {
  const [leads, setLeads] = useState<B2BLead[]>(INITIAL_B2B_LEADS);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [otpInputs, setOtpInputs] = useState<Record<string, string>>({});
  const [checkInFeedback, setCheckInFeedback] = useState<Record<string, string>>({});
  const [otpFeedback, setOtpFeedback] = useState<Record<string, { success: boolean; msg: string }>>({});

  // WhatsApp bot chat state
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'bot' | 'user'; text: string; time: string }>>([
    {
      sender: 'bot',
      text: '🌿 Good morning, Julian! GigRise WhatsApp Assistant here. You have 1 active gig confirmed for Fort Canning. Type any command or tap below to update dates.',
      time: '09:15 AM'
    }
  ]);
  const [botInputText, setBotInputText] = useState('');

  // Handle Geo Check-In simulation
  const handleGeoCheckIn = (booking: Booking) => {
    // Simulate user coords near the venue (within 100m)
    const simulatedLat = booking.venueCoords.lat + 0.0008;
    const simulatedLng = booking.venueCoords.lng + 0.0008;
    const result = validateGeoCheckIn(simulatedLat, simulatedLng, booking.venueCoords.lat, booking.venueCoords.lng);

    if (result.valid) {
      onUpdateBookingStatus(booking.id, 'GEO_CHECKED_IN');
      setCheckInFeedback((prev) => ({
        ...prev,
        [booking.id]: `✓ Geo Check-in Verified! (${result.distanceMeters}m from venue). Step 2 completed.`
      }));
    }
  };

  // Handle OTP verification
  const handleVerifyOtp = (bookingId: string) => {
    const input = otpInputs[bookingId] || '';
    const success = onVerifyOtp(bookingId, input);
    if (success) {
      setOtpFeedback((prev) => ({
        ...prev,
        [bookingId]: { success: true, msg: '✓ OTP Validated! 80% Escrow funds released to bank account.' }
      }));
    } else {
      setOtpFeedback((prev) => ({
        ...prev,
        [bookingId]: { success: false, msg: '✕ Incorrect OTP. Ask your client for their 6-digit completion code.' }
      }));
    }
  };

  // Handle Lead Contact
  const handleContactLead = (leadId: string) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status: 'CONTACTED' } : l))
    );
    setSelectedLeadId(leadId);
  };

  // WhatsApp bot command sender
  const handleSendBotMessage = (textToSend?: string) => {
    const text = textToSend || botInputText;
    if (!text.trim()) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsgs = [...chatMessages, { sender: 'user' as const, text, time }];
    setChatMessages(newMsgs);
    setBotInputText('');

    // Simulate smart bot response
    setTimeout(() => {
      let botReply = "Roger that! Your GigRise calendar ledger has been updated.";
      const lower = text.toLowerCase();
      if (lower.includes('block') || lower.includes('calendar') || lower.includes('date')) {
        botReply = "📅 Done! Date blocked on your public sketchbook profile. Other event planners will see you as unavailable for that evening.";
      } else if (lower.includes('payout') || lower.includes('escrow') || lower.includes('balance')) {
        botReply = "💰 Active Escrow Balance: $384.00 (held in neutral vault). Your 20% advance ($96.00) has already been secured.";
      } else if (lower.includes('shield') || lower.includes('cancel')) {
        botReply = "🛡️ Cancel-Proof Shield Active: Community Reserve holds $48,250. If client cancels < 7 days, you will automatically receive an additional 15% bonus.";
      } else if (lower.includes('gps') || lower.includes('check-in')) {
        botReply = "📍 Live Location Synced: GPS coordinates matched Fort Canning venue. Status updated to 'Arrived On Site'!";
      }

      setChatMessages((msgs) => [
        ...msgs,
        {
          sender: 'bot',
          text: botReply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 700);
  };

  return (
    <section id="studio" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      
      {/* Studio Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#c5a880]/30">
        <div>
          <div className="text-xs font-sans tracking-[0.2em] uppercase text-[#7a6f61]">
            Creator Studio & Artist Workspace
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-[#2c2722] font-semibold mt-1">
            Julian Vance · Atelier Dashboard
          </h2>
          <p className="text-xs sm:text-sm text-[#6f665a] mt-1 font-sans">
            Track escrow milestones, perform venue geo check-ins, unlock client OTPs, and connect with event planners.
          </p>
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-lg bg-[#e8efe8] border border-[#c6dcc7] text-[#426a45] text-xs font-medium flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Cancel-Proof Shield Active</span>
          </div>
        </div>
      </div>

      {/* Top Gamification Banner: GigPoints & Level */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* GigPoints Card */}
        <div className="paper-card rounded-xl p-6 border border-[#c5a880]/40 bg-[#faf8f5] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-lg bg-[#ede6da] text-[#9b784a] flex items-center justify-center border border-[#dacfb7]">
              <Trophy className="w-5 h-5" />
            </div>
            <span className="text-xs font-mono font-bold text-[#8c6735] px-2 py-0.5 rounded bg-[#ebd7bf]/60 border border-[#d6bfa3]">
              LEVEL 4 MAESTRO
            </span>
          </div>

          <div className="my-4">
            <div className="text-xs text-[#7e7365] font-sans">Gamification XP</div>
            <div className="text-3xl font-serif font-bold text-[#2c2722] mt-0.5">
              3,420 <span className="text-xs font-sans font-normal text-[#8c8072]">/ 4,000 XP</span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full h-2 bg-[#ebdcc8] rounded-full overflow-hidden mt-2">
              <div className="h-full bg-[#9b784a] rounded-full" style={{ width: '85%' }} />
            </div>
          </div>

          <div className="text-[11px] text-[#695f52] flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#9b784a]" />
            <span>580 XP remaining until Level 5 Concertmaster (Priority Ranking)</span>
          </div>
        </div>

        {/* Badges & Trust Perks */}
        <div className="paper-card rounded-xl p-6 border border-[#c5a880]/40 bg-[#faf8f5] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-lg bg-[#ede6da] text-[#9b784a] flex items-center justify-center border border-[#dacfb7]">
              <Award className="w-5 h-5" />
            </div>
            <span className="text-xs font-mono text-[#5a7f5e] font-semibold">
              3 BADGES EARNED
            </span>
          </div>

          <div className="my-3 space-y-1.5">
            <div className="text-xs flex items-center gap-1.5 text-[#3a352f]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#5a7f5e]" />
              <span className="font-medium">Punctual Maestro (100% on-time GPS)</span>
            </div>
            <div className="text-xs flex items-center gap-1.5 text-[#3a352f]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#5a7f5e]" />
              <span className="font-medium">Zero Cancellation Record (42 Gigs)</span>
            </div>
            <div className="text-xs flex items-center gap-1.5 text-[#3a352f]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#5a7f5e]" />
              <span className="font-medium">Shield Verified Partner</span>
            </div>
          </div>

          <div className="text-[11px] text-[#7a6f62]">
            Increases client booking conversion by +34%.
          </div>
        </div>

        {/* Financial Escrow Pipeline */}
        <div className="paper-card rounded-xl p-6 border border-[#c5a880]/40 bg-[#faf8f5] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-lg bg-[#ede6da] text-[#9b784a] flex items-center justify-center border border-[#dacfb7]">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-xs font-mono text-[#426a45] px-2 py-0.5 rounded bg-[#e8efe8] border border-[#c6dcc7]">
              LOCKED IN ESCROW
            </span>
          </div>

          <div className="my-4">
            <div className="text-xs text-[#7e7365] font-sans">Upcoming Escrow Payouts</div>
            <div className="text-3xl font-serif font-bold text-[#2c2722] mt-0.5">
              $480.00
            </div>
            <div className="text-[11px] text-[#695f52] mt-1">
              $96.00 (20% Advance) Secured · $384.00 Pending Client OTP
            </div>
          </div>

          <div className="text-[11px] text-[#554b3f] flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#5a7f5e]" />
            <span>Shield Pool automatically protects this booking</span>
          </div>
        </div>

      </div>

      {/* ACTIVE GIGS & 3-STEP ESCROW VERIFICATION */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-serif font-semibold text-[#2c2722]">
            Active Bookings & Escrow Milestones
          </h3>
          <span className="text-xs text-[#7a6f62] font-mono">
            {bookings.length} Bookings in Queue
          </span>
        </div>

        {bookings.length === 0 ? (
          <div className="p-8 text-center paper-card rounded-xl border border-[#c5a880]/30 text-[#7a6f62]">
            <p className="font-serif">No active gigs right now. Switch to Client Mode to create a test booking!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => {
              const isCheckedIn = booking.status === 'GEO_CHECKED_IN';
              const isCompleted = booking.status === 'COMPLETED';
              const isCancelled = booking.status === 'CANCELLED';

              return (
                <div
                  key={booking.id}
                  className="paper-card rounded-xl p-5 sm:p-6 border border-[#c5a880]/40 bg-[#faf8f5] shadow-sm space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#ebdcc8]">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#8c6735]">
                          {booking.id}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-medium ${
                          isCompleted
                            ? 'bg-[#e8efe8] text-[#426a45] border border-[#c6dcc7]'
                            : isCheckedIn
                            ? 'bg-[#d9e7f5] text-[#2c5282] border border-[#b8d4f0]'
                            : isCancelled
                            ? 'bg-[#fae8e8] text-[#9b2c2c] border border-[#f0c2c2]'
                            : 'bg-[#ede6da] text-[#5a5042] border border-[#dacfb7]'
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                      <h4 className="text-lg font-serif font-semibold text-[#2c2722] mt-0.5">
                        {booking.eventType} · {booking.clientName}
                      </h4>
                      <div className="text-xs text-[#6e6355] font-sans flex flex-wrap items-center gap-2 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-[#9b784a]" />
                          {booking.eventDate} ({booking.hours} hours)
                        </span>
                        <span className="text-[#c5a880]">·</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#9b784a]" />
                          {booking.venueName}
                        </span>
                      </div>
                    </div>

                    <div className="text-left sm:text-right">
                      <div className="text-xs text-[#7e7365]">Total Value</div>
                      <div className="text-xl font-serif font-bold text-[#2c2722]">
                        ${booking.totalAmount}.00
                      </div>
                      <div className="text-[10px] text-[#4d7350]">
                        Advance Paid: ${booking.advanceAmount}
                      </div>
                    </div>
                  </div>

                  {/* 3-Step Escrow Status Banner */}
                  {!isCancelled && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      
                      {/* Step 1 */}
                      <div className="p-3 rounded-lg bg-[#e8efe8] border border-[#c6dcc7] flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#4d7350] shrink-0" />
                        <div>
                          <div className="font-semibold text-[#2c2722]">Step 1: 20% Advance</div>
                          <div className="text-[10px] text-[#426a45]">Locked in Escrow ($ {booking.advanceAmount})</div>
                        </div>
                      </div>

                      {/* Step 2 */}
                      <div className={`p-3 rounded-lg border flex items-center justify-between gap-2 ${
                        isCheckedIn || isCompleted
                          ? 'bg-[#e8efe8] border-[#c6dcc7]'
                          : 'bg-[#f4efe4] border-[#e0d6c4]'
                      }`}>
                        <div className="flex items-center gap-2">
                          {isCheckedIn || isCompleted ? (
                            <CheckCircle2 className="w-4 h-4 text-[#4d7350] shrink-0" />
                          ) : (
                            <MapPin className="w-4 h-4 text-[#9b784a] shrink-0" />
                          )}
                          <div>
                            <div className="font-semibold text-[#2c2722]">Step 2: Geo Check-In</div>
                            <div className="text-[10px] text-[#6e6355]">
                              {isCheckedIn || isCompleted ? 'Verified at Venue' : 'Pending Arrival'}
                            </div>
                          </div>
                        </div>

                        {!isCheckedIn && !isCompleted && (
                          <button
                            onClick={() => handleGeoCheckIn(booking)}
                            className="px-2.5 py-1 text-[11px] font-medium text-white bg-[#3a352f] hover:bg-[#1f1c19] rounded transition-colors whitespace-nowrap"
                          >
                            Simulate GPS Check-in
                          </button>
                        )}
                      </div>

                      {/* Step 3 */}
                      <div className={`p-3 rounded-lg border flex flex-col justify-between ${
                        isCompleted
                          ? 'bg-[#e8efe8] border-[#c6dcc7]'
                          : 'bg-[#f4efe4] border-[#e0d6c4]'
                      }`}>
                        <div className="flex items-center gap-2 mb-1.5">
                          {isCompleted ? (
                            <CheckCircle2 className="w-4 h-4 text-[#4d7350] shrink-0" />
                          ) : (
                            <KeyRound className="w-4 h-4 text-[#9b784a] shrink-0" />
                          )}
                          <div>
                            <div className="font-semibold text-[#2c2722]">Step 3: Client OTP</div>
                            <div className="text-[10px] text-[#6e6355]">
                              {isCompleted ? 'Escrow Released!' : 'Enter code from client'}
                            </div>
                          </div>
                        </div>

                        {!isCompleted && isCheckedIn && (
                          <div className="flex items-center gap-1.5 mt-1">
                            <input
                              type="text"
                              maxLength={6}
                              placeholder="6-digit OTP"
                              value={otpInputs[booking.id] || ''}
                              onChange={(e) =>
                                setOtpInputs((prev) => ({ ...prev, [booking.id]: e.target.value }))
                              }
                              className="w-24 px-2 py-1 text-xs font-mono bg-white border border-[#c5a880]/50 rounded text-center tracking-widest"
                            />
                            <button
                              onClick={() => handleVerifyOtp(booking.id)}
                              className="px-2 py-1 text-[11px] font-medium text-white bg-[#4d7350] hover:bg-[#3e5f41] rounded transition-colors"
                            >
                              Unlock 80%
                            </button>
                          </div>
                        )}
                      </div>

                    </div>
                  )}

                  {/* Feedback notices */}
                  {checkInFeedback[booking.id] && (
                    <div className="text-xs text-[#4d7350] bg-[#e8efe8]/60 p-2 rounded border border-[#c6dcc7]">
                      {checkInFeedback[booking.id]}
                    </div>
                  )}

                  {otpFeedback[booking.id] && (
                    <div className={`text-xs p-2 rounded border ${
                      otpFeedback[booking.id].success
                        ? 'text-[#4d7350] bg-[#e8efe8]/60 border-[#c6dcc7]'
                        : 'text-[#9b2c2c] bg-[#fae8e8]/60 border-[#f0c2c2]'
                    }`}>
                      {otpFeedback[booking.id].msg}
                    </div>
                  )}

                  {/* Simulator action: Test Cancel-Proof Shield */}
                  {!isCancelled && !isCompleted && (
                    <div className="pt-2 border-t border-[#ebdcc8] flex items-center justify-between text-xs text-[#73685a]">
                      <span className="text-[11px]">
                        Demo Test: See what happens if the client cancels this event 3 days ahead.
                      </span>
                      <button
                        onClick={() => onSimulateClientCancellation(booking.id)}
                        className="px-3 py-1 text-[11px] font-medium text-[#9b2c2c] hover:bg-[#fae8e8] border border-[#f0c2c2] rounded transition-colors"
                      >
                        Simulate Client Cancellation (&lt; 7 Days)
                      </button>
                    </div>
                  )}

                  {isCancelled && (
                    <div className="p-3 rounded-lg bg-[#fcf5e8] border border-[#e8d5b5] text-xs text-[#7a5828]">
                      <strong>Cancel-Proof Shield Activated:</strong> Event was cancelled by client with &lt; 7 days notice. The full 20% advance ($ {booking.advanceAmount}) plus an extra 15% bonus ($ {(booking.totalAmount * 0.15).toFixed(2)}) was deposited to Julian Vance from the Shield Pool.
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* LOWER SECTION: B2B EVENT PLANNER LEADS & INTERACTIVE WHATSAPP BOT MOCKUP */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* LEFT: B2B EVENT PLANNER LEADS LIST */}
        <div id="leads" className="paper-card rounded-xl p-6 border border-[#c5a880]/40 bg-[#faf8f5] shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#ebdcc8]">
            <div>
              <div className="text-[10px] font-sans uppercase tracking-widest text-[#8c8072]">
                B2B Opportunities
              </div>
              <h3 className="text-xl font-serif font-semibold text-[#2c2722]">
                Event Planner Leads
              </h3>
            </div>
            <span className="text-xs font-mono text-[#8c6735] px-2.5 py-0.5 rounded bg-[#ebd7bf]/60 border border-[#d6bfa3]">
              3 NEW INQUIRIES
            </span>
          </div>

          <p className="text-xs text-[#6e6355]">
            Verified luxury planners and wedding directors seeking live acoustics and live painting.
          </p>

          <div className="space-y-3">
            {leads.map((lead) => (
              <div
                key={lead.id}
                className="p-4 rounded-xl bg-[#f4efe4] border border-[#e0d6c4] space-y-2 hover:border-[#c5a880] transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-serif font-semibold text-sm text-[#2c2722]">
                      {lead.eventTitle}
                    </h4>
                    <div className="text-xs text-[#6e6355] mt-0.5">
                      {lead.plannerName} · <span className="font-medium text-[#4a4237]">{lead.companyName}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-sm font-bold text-[#4d7350]">
                      ${lead.budget}
                    </span>
                    <div className="text-[10px] text-[#8c8072]">Budget</div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#6d6153]">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-[#9b784a]" />
                    {lead.eventDate}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#9b784a]" />
                    {lead.location}
                  </span>
                </div>

                <div className="pt-2 border-t border-[#e2d7c5] flex items-center justify-between">
                  <span className="text-[11px] font-sans italic text-[#786b5d]">
                    Preferred: {lead.requiredGenre}
                  </span>

                  {lead.status === 'CONTACTED' ? (
                    <span className="text-xs text-[#4d7350] font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Pitch Sent!</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => handleContactLead(lead.id)}
                      className="px-3 py-1 text-xs font-medium text-[#faf8f5] bg-[#3a352f] hover:bg-[#1f1c19] rounded transition-colors flex items-center gap-1"
                    >
                      <span>1-Click Pitch</span>
                      <Send className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: INTERACTIVE WHATSAPP BOT MOCKUP */}
        <div id="whatsapp-bot" className="paper-card rounded-xl p-6 border border-[#c5a880]/40 bg-[#faf8f5] shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#ebdcc8]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-xs">
                <MessageSquare className="w-4 h-4 fill-white" />
              </div>
              <div>
                <div className="text-[10px] font-sans uppercase tracking-widest text-[#8c8072]">
                  Mobile Concierge
                </div>
                <h3 className="text-xl font-serif font-semibold text-[#2c2722]">
                  WhatsApp Calendar Bot
                </h3>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#e8efe8] text-[#426a45] border border-[#c6dcc7]">
              ONLINE · SYNCED
            </span>
          </div>

          <p className="text-xs text-[#6e6355]">
            Update your availability, block calendar dates, and verify GPS check-ins straight from WhatsApp without opening a browser.
          </p>

          {/* Smartphone Frame Simulation */}
          <div className="rounded-xl border border-[#d6c9b5] bg-[#e5ddd5] overflow-hidden shadow-inner flex flex-col h-[340px]">
            
            {/* Top WhatsApp App Bar */}
            <div className="bg-[#075E54] text-white px-4 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#128C7E] flex items-center justify-center font-bold text-xs text-white">
                  GR
                </div>
                <div>
                  <div className="text-xs font-semibold">GigRise Official Bot</div>
                  <div className="text-[10px] text-white/80">Automated Calendar & Escrow</div>
                </div>
              </div>
              <Smartphone className="w-4 h-4 text-white/70" />
            </div>

            {/* Chat Messages Log */}
            <div className="flex-1 p-3 overflow-y-auto space-y-2.5 bg-[#efeae2]">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-2.5 rounded-lg text-xs shadow-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-[#dcf8c6] text-[#1f2c25] rounded-tr-none'
                        : 'bg-white text-[#2a2a2a] rounded-tl-none border border-[#e0dad0]'
                    }`}
                  >
                    {msg.text}
                    <div className="text-[9px] text-[#7a867e] text-right mt-1">
                      {msg.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Action Chips */}
            <div className="p-2 bg-[#f0f2f5] border-t border-[#d1d7db] flex gap-1.5 overflow-x-auto text-[11px] scrollbar-none">
              <button
                onClick={() => handleSendBotMessage('Block calendar for Nov 20')}
                className="px-2.5 py-1 bg-white hover:bg-[#e4e6eb] rounded-full border border-[#d1d7db] text-[#3b4a54] whitespace-nowrap transition-colors"
              >
                📅 Block Nov 20
              </button>
              <button
                onClick={() => handleSendBotMessage('Check my Escrow Balance')}
                className="px-2.5 py-1 bg-white hover:bg-[#e4e6eb] rounded-full border border-[#d1d7db] text-[#3b4a54] whitespace-nowrap transition-colors"
              >
                💰 Escrow Balance
              </button>
              <button
                onClick={() => handleSendBotMessage('Check Cancel-Proof Shield')}
                className="px-2.5 py-1 bg-white hover:bg-[#e4e6eb] rounded-full border border-[#d1d7db] text-[#3b4a54] whitespace-nowrap transition-colors"
              >
                🛡️ Shield Status
              </button>
            </div>

            {/* Input Bar */}
            <div className="p-2 bg-[#f0f2f5] flex items-center gap-2">
              <input
                type="text"
                value={botInputText}
                onChange={(e) => setBotInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendBotMessage()}
                placeholder="Type 'Block date' or 'Escrow balance'..."
                className="flex-1 px-3 py-1.5 bg-white rounded-full text-xs text-[#2a2a2a] focus:outline-none border border-[#d1d7db]"
              />
              <button
                onClick={() => handleSendBotMessage()}
                className="w-7 h-7 rounded-full bg-[#128C7E] text-white flex items-center justify-center hover:bg-[#075E54] transition-colors shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>

      </div>

    </section>
  );
};
