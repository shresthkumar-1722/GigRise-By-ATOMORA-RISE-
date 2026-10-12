/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * GigRise by ATOMORA
 * An Artisanal Sketchbook Marketplace for Local Event Artists
 * Features:
 * - Watercolor Ethereal & Digital Sketchbook Aesthetic (no dark mode, paper texture #f4f3ee)
 * - Physical Open 2-Page Sketchbook Hero Carousel with brass magnifier lens & audio audition
 * - Bento Grid: Cancel-Proof Shield, AI Fair Price (zero-bargaining), 3-Step Escrow, Advance Financing
 * - Smart Directory: Filtered by 📍 Nearby & ⭐ Top Rated, Chapter Ledger vs Cards view
 * - Paper-themed Booking Modal with GigCredit (BNPL) checkout (20% down, 3 EMIs @ 1.5% interest)
 * - Client Advance Financing: Micro-advances for lower financial condition clients
 * - Creator Studio (Artist Mode): GigPoints XP, active escrow milestones, GPS Geo Check-in, OTP release
 * - B2B Event Planner leads & interactive WhatsApp Calendar Bot simulation
 * - Supabase PostgreSQL Schema & Next.js Server Actions architecture
 * - Artisanal AI Concierge Chatbot for instant event assistance
 */

import React, { useState } from 'react';
import { Artist, Booking, UserProfile } from './types';
import { INITIAL_ARTISTS } from './data/artistsData';
import { BotanicalAccents } from './components/BotanicalAccents';
import { Header } from './components/Header';
import { SketchbookHero } from './components/SketchbookHero';
import { TrustBentoGrid } from './components/TrustBentoGrid';
import { ArtistDirectory } from './components/ArtistDirectory';
import { CreatorStudio } from './components/CreatorStudio';
import { BookingModal } from './components/BookingModal';
import { AdvanceFinancingModal } from './components/AdvanceFinancingModal';
import { AuthModal } from './components/AuthModal';
import { SupabaseSchemaModal } from './components/SupabaseSchemaModal';
import { AiConciergeChat } from './components/AiConciergeChat';
import { Footer } from './components/Footer';
import { processCancellationShield } from './backend/api';

export default function App() {
  const [currentMode, setCurrentMode] = useState<'CLIENT' | 'ARTIST'>('CLIENT');
  const [activeSection, setActiveSection] = useState('hero');

  // Authenticated user state
  const [currentUser, setCurrentUser] = useState<UserProfile | null>({
    id: 'usr-client-01',
    name: 'Eleanor Vance',
    email: 'eleanor.vance@atelierbloom.com',
    role: 'CLIENT',
    avatarInitials: 'EV',
    location: 'Singapore'
  });

  // Modal open states
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isFinancingOpen, setIsFinancingOpen] = useState(false);
  const [isSchemaOpen, setIsSchemaOpen] = useState(false);
  const [selectedArtistForBooking, setSelectedArtistForBooking] = useState<Artist | null>(null);

  // Active bookings list with an initial pre-loaded booking for Julian Vance
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: 'GIG-849201',
      artistId: 'art-01',
      artistName: 'Julian Vance',
      artistCategory: 'Acoustic Soloist',
      artistImage: INITIAL_ARTISTS[0].sketchImage,
      clientId: 'usr-client-01',
      clientName: 'Eleanor Vance',
      clientEmail: 'eleanor.vance@atelierbloom.com',
      eventDate: '2026-11-28',
      eventType: 'Private Botanical Wedding',
      venueName: 'Fort Canning Orangery Pavilion',
      venueCity: 'Singapore',
      venueCoords: { lat: 1.2952, lng: 103.8458 },
      hours: 3,
      totalAmount: 480,
      advanceAmount: 96,
      shieldFeeAmount: 9.6,
      remainingAmount: 384,
      paymentType: 'GIGCREDIT_BNPL',
      status: 'CONFIRMED',
      escrowOtp: '742918',
      otpVerified: false,
      createdAt: '2026-10-12T01:30:00Z'
    }
  ]);

  // Handlers
  const handleToggleMode = (mode: 'CLIENT' | 'ARTIST') => {
    setCurrentMode(mode);
    if (mode === 'ARTIST') {
      setCurrentUser({
        id: 'usr-artist-01',
        name: 'Julian Vance',
        email: 'julian@gigrise.com',
        role: 'ARTIST',
        avatarInitials: 'JV',
        location: 'Tiong Bahru'
      });
      setActiveSection('studio');
    } else {
      setCurrentUser({
        id: 'usr-client-01',
        name: 'Eleanor Vance',
        email: 'eleanor.vance@atelierbloom.com',
        role: 'CLIENT',
        avatarInitials: 'EV',
        location: 'Singapore'
      });
      setActiveSection('hero');
    }
  };

  const handleCreateBooking = (newBooking: Booking) => {
    setBookings((prev) => [newBooking, ...prev]);
  };

  const handleUpdateBookingStatus = (bookingId: string, status: Booking['status']) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status } : b))
    );
  };

  const handleVerifyOtp = (bookingId: string, inputOtp: string): boolean => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return false;

    // Check OTP match
    if (booking.escrowOtp.trim() === inputOtp.trim()) {
      setBookings((prev) =>
        prev.map((b) =>
          b.id === bookingId ? { ...b, status: 'COMPLETED', otpVerified: true } : b
        )
      );
      return true;
    }
    return false;
  };

  const handleSimulateClientCancellation = (bookingId: string) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return;

    // Simulate cancellation 3 days before event (triggers the Cancel-Proof Shield bonus!)
    const simulatedNoticeDate = new Date('2026-11-25'); // 3 days before Nov 28
    const shieldResult = processCancellationShield(booking, simulatedNoticeDate);

    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? {
              ...b,
              status: 'CANCELLED',
              cancellationDate: simulatedNoticeDate.toISOString(),
              cancellationCompensation: shieldResult.artistPayout
            }
          : b
      )
    );
  };

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f3ee] text-[#3a352f] relative selection:bg-[#c5a880]/30 selection:text-[#2c2722]">
      
      {/* Botanical Watercolor Accents in Background */}
      <BotanicalAccents />

      {/* Top Navigation Bar */}
      <Header
        currentMode={currentMode}
        onToggleMode={handleToggleMode}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={() => setCurrentUser(null)}
        onOpenSchema={() => setIsSchemaOpen(true)}
        onOpenFinancing={() => setIsFinancingOpen(true)}
        activeSection={activeSection}
        onNavigate={handleNavigate}
      />

      {/* Main Content Area */}
      <main className="relative z-10">
        
        {/* Physical Open 2-Page Sketchbook Hero Carousel */}
        <SketchbookHero
          artists={INITIAL_ARTISTS}
          onSelectArtistForBooking={(artist) => setSelectedArtistForBooking(artist)}
          onExploreDirectory={() => handleNavigate('directory')}
        />

        {/* Minimalist Bento Grid: Cancel-Proof Shield, AI Fair Price, 3-Step Escrow, Advance Financing */}
        <TrustBentoGrid
          onOpenFinancing={() => setIsFinancingOpen(true)}
          currentMode={currentMode}
        />

        {/* View Switch based on Mode */}
        {currentMode === 'CLIENT' ? (
          /* Client View: Smart Directory with Chapter Ledger & Cards */
          <ArtistDirectory
            artists={INITIAL_ARTISTS}
            onSelectArtist={(artist) => setSelectedArtistForBooking(artist)}
            onOpenFinancing={() => setIsFinancingOpen(true)}
          />
        ) : (
          /* Artist View: Creator Studio with GigPoints, Active Escrow Milestones, B2B Leads, WhatsApp Bot */
          <CreatorStudio
            bookings={bookings}
            onUpdateBookingStatus={handleUpdateBookingStatus}
            onVerifyOtp={handleVerifyOtp}
            onSimulateClientCancellation={handleSimulateClientCancellation}
          />
        )}

      </main>

      {/* Footer */}
      <Footer
        onOpenSchema={() => setIsSchemaOpen(true)}
        onOpenFinancing={() => setIsFinancingOpen(true)}
      />

      {/* Modals */}
      <BookingModal
        artist={selectedArtistForBooking}
        onClose={() => setSelectedArtistForBooking(null)}
        onConfirmBooking={handleCreateBooking}
      />

      <AdvanceFinancingModal
        isOpen={isFinancingOpen}
        onClose={() => setIsFinancingOpen(false)}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          setCurrentMode(user.role);
        }}
        initialRole={currentMode}
      />

      <SupabaseSchemaModal
        isOpen={isSchemaOpen}
        onClose={() => setIsSchemaOpen(false)}
      />

      {/* Floating AI Concierge Chatbot */}
      <AiConciergeChat
        onOpenFinancing={() => setIsFinancingOpen(true)}
      />

    </div>
  );
}
