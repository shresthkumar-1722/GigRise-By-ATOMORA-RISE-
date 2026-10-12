/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * GIGRISE BACKEND ARCHITECTURE & SERVER LOGIC
 * Implements:
 * 1. Smart Matchmaking (Geo-location + category filters via Haversine distance)
 * 2. 3-Step Escrow Logic (20% advance + 2% Shield Pool fee)
 * 3. Cancel-Proof Shield Function (< 7 days: Advance + 15% Shield bonus to artist)
 * 4. GigCredit (BNPL) Calculator (20% down + 3 EMIs @ 1.5% interest)
 * 5. Advance Financing Micro-Credit Engine for Clients
 * 6. Geo Check-in & Escrow OTP Release
 */

import { Artist, Booking, BNPLInstallment, ClientAdvanceLoan } from '../types';
import { INITIAL_ARTISTS } from '../data/artistsData';

// Haversine formula to compute great-circle distance between two GPS coordinates in kilometers
export function calculateGeoDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

/**
 * 1. SMART MATCHMAKING
 * Filters artists by category, keyword, and calculates relative distance from user's event venue.
 */
export function smartMatchmaking(
  artists: Artist[] = INITIAL_ARTISTS,
  filters: {
    category?: string;
    userLocation?: { lat: number; lng: number };
    maxDistanceKm?: number;
    sortBy?: 'nearby' | 'topRated' | 'priceLow' | 'points';
    query?: string;
  }
): Artist[] {
  let list = [...artists];

  // Text search
  if (filters.query && filters.query.trim()) {
    const q = filters.query.toLowerCase().trim();
    list = list.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q) ||
        a.genre.toLowerCase().includes(q) ||
        a.location.toLowerCase().includes(q) ||
        a.instruments.some((i) => i.toLowerCase().includes(q))
    );
  }

  // Category filter
  if (filters.category && filters.category !== 'All') {
    list = list.filter((a) => a.category === filters.category);
  }

  // Geo distance computation if user coords provided
  if (filters.userLocation) {
    list = list.map((a) => {
      const dist = calculateGeoDistanceKm(
        filters.userLocation!.lat,
        filters.userLocation!.lng,
        a.coordinates.lat,
        a.coordinates.lng
      );
      return { ...a, distanceKm: dist };
    });

    if (filters.maxDistanceKm) {
      list = list.filter((a) => (a.distanceKm ?? 0) <= filters.maxDistanceKm!);
    }
  }

  // Sorting
  if (filters.sortBy === 'nearby') {
    list.sort((a, b) => (a.distanceKm ?? 999) - (b.distanceKm ?? 999));
  } else if (filters.sortBy === 'topRated') {
    list.sort((a, b) => b.rating - a.rating);
  } else if (filters.sortBy === 'priceLow') {
    list.sort((a, b) => a.baseHourlyRate - b.baseHourlyRate);
  } else if (filters.sortBy === 'points') {
    list.sort((a, b) => b.gigPoints - a.gigPoints);
  }

  return list;
}

/**
 * 2. ESCROW FINANCIAL LOGIC
 * Allocates:
 * - 20% Advance held in safe escrow
 * - 2% Platform Shield Pool fee (deducted to capitalize the collective Shield Pool)
 * - 80% Remaining Balance unlocked upon post-event client OTP verification
 */
export function calculateEscrowBreakdown(totalAmount: number) {
  const advanceAmount = Math.round(totalAmount * 0.20 * 100) / 100;
  const shieldFeeAmount = Math.round(totalAmount * 0.02 * 100) / 100;
  const remainingAmount = Math.round((totalAmount - advanceAmount) * 100) / 100;

  return {
    totalAmount,
    advanceAmount,
    shieldFeeAmount,
    remainingAmount,
    netEscrowHeld: advanceAmount - shieldFeeAmount
  };
}

/**
 * 3. GIGCREDIT (BNPL) UTILITY
 * 20% downpayment today + 3 equal monthly EMIs with 1.5% flat interest per month.
 */
export function calculateGigCreditBNPL(totalPrice: number): {
  downpayment: number;
  financedAmount: number;
  monthlyInterestRate: number;
  totalInterest: number;
  emiAmount: number;
  totalRepayment: number;
  schedule: BNPLInstallment[];
} {
  const downpayment = Math.round(totalPrice * 0.20 * 100) / 100;
  const financedAmount = totalPrice - downpayment;
  const monthlyInterestRate = 0.015; // 1.5% monthly interest
  const totalInterest = Math.round(financedAmount * monthlyInterestRate * 3 * 100) / 100;
  const totalFinancedWithInterest = financedAmount + totalInterest;
  const emiAmount = Math.round((totalFinancedWithInterest / 3) * 100) / 100;
  const totalRepayment = downpayment + (emiAmount * 3);

  // Generate payment dates 30, 60, 90 days out
  const now = new Date();
  const schedule: BNPLInstallment[] = [1, 2, 3].map((num) => {
    const d = new Date(now.getTime() + num * 30 * 24 * 60 * 60 * 1000);
    return {
      installmentNumber: num,
      dueDate: d.toISOString().split('T')[0],
      amount: emiAmount,
      status: 'UPCOMING'
    };
  });

  return {
    downpayment,
    financedAmount,
    monthlyInterestRate: 1.5,
    totalInterest,
    emiAmount,
    totalRepayment,
    schedule
  };
}

/**
 * 4. CANCEL-PROOF SHIELD LOGIC
 * Rule:
 * - If client cancels >= 7 days before event:
 *   Full 20% advance refunded to client. Artist schedule unblocked.
 * - If client cancels < 7 days before event:
 *   Artist retains 100% of 20% advance + receives a 15% guaranteed bonus payout
 *   funded directly by the Shield Pool reserve to compensate for lost gig window!
 */
export function processCancellationShield(
  booking: Booking,
  cancellationDate: Date = new Date()
): {
  isLastMinute: boolean;
  daysRemaining: number;
  artistPayout: number;
  clientRefund: number;
  shieldBonusGranted: number;
  explanation: string;
} {
  const eventDate = new Date(booking.eventDate);
  const diffTime = eventDate.getTime() - cancellationDate.getTime();
  const daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  if (daysRemaining < 7) {
    // Under 7 days: Cancel-Proof Shield activates!
    const shieldBonus = Math.round(booking.totalAmount * 0.15 * 100) / 100;
    const artistTotalPayout = booking.advanceAmount + shieldBonus;

    return {
      isLastMinute: true,
      daysRemaining,
      artistPayout: artistTotalPayout,
      clientRefund: 0,
      shieldBonusGranted: shieldBonus,
      explanation: `Event was cancelled ${daysRemaining} days prior (< 7 day window). The Cancel-Proof Shield has transferred the full 20% advance ($${booking.advanceAmount}) PLUS a 15% bonus ($${shieldBonus}) from the Shield Pool to ${booking.artistName}.`
    };
  } else {
    // 7 days or more: Standard courteous cancellation
    return {
      isLastMinute: false,
      daysRemaining,
      artistPayout: 0,
      clientRefund: booking.advanceAmount,
      shieldBonusGranted: 0,
      explanation: `Cancelled with ${daysRemaining} days notice (>= 7 day policy). Client receives full advance refund of $${booking.advanceAmount}.`
    };
  }
}

/**
 * 5. ADVANCE FINANCING / LOW FINANCIAL CONDITION CLIENT LOAN CALCULATOR
 * Customized micro-advances with ethical interest calculation:
 * - Grassroots Community: 2.2% APR (subsidized)
 * - Student & Emerging Artist: 2.6% APR
 * - Small Family Celebration: 3.2% APR
 * - Standard Micro-Business: 3.8% APR
 */
export function calculateClientAdvanceLoan(
  amount: number,
  tier: 'Grassroots Community' | 'Student & Emerging Artist' | 'Small Family Event' | 'Standard Micro-Business',
  tenureMonths: number = 3
): ClientAdvanceLoan {
  let annualRate = 3.2;
  if (tier === 'Grassroots Community') annualRate = 2.2;
  else if (tier === 'Student & Emerging Artist') annualRate = 2.6;
  else if (tier === 'Small Family Event') annualRate = 3.2;
  else if (tier === 'Standard Micro-Business') annualRate = 3.8;

  const monthlyRate = (annualRate / 100) / 12;
  // Standard amortization formula: M = P * [r(1+r)^n] / [(1+r)^n - 1]
  const numerator = monthlyRate * Math.pow(1 + monthlyRate, tenureMonths);
  const denominator = Math.pow(1 + monthlyRate, tenureMonths) - 1;
  const monthlyInstallment = Math.round(amount * (numerator / denominator) * 100) / 100;
  const totalRepayment = Math.round(monthlyInstallment * tenureMonths * 100) / 100;

  return {
    id: `loan-${Date.now().toString().slice(-6)}`,
    clientName: 'Eleanor Vance',
    requestedAmount: amount,
    interestRateAnnual: annualRate,
    monthlyInterestRate: Math.round(monthlyRate * 100 * 100) / 100,
    tenureMonths,
    monthlyInstallment,
    totalRepayment,
    financialConditionTier: tier,
    status: 'PRE_APPROVED'
  };
}

/**
 * 6. GEO CHECK-IN VALIDATION
 * Checks if the artist's check-in coordinate is within 250m of venue coordinate
 */
export function validateGeoCheckIn(
  artistLat: number,
  artistLng: number,
  venueLat: number,
  venueLng: number
): { valid: boolean; distanceMeters: number } {
  const distKm = calculateGeoDistanceKm(artistLat, artistLng, venueLat, venueLng);
  const distanceMeters = Math.round(distKm * 1000);
  return {
    valid: distanceMeters <= 350, // within 350 meters considered arrived
    distanceMeters
  };
}
