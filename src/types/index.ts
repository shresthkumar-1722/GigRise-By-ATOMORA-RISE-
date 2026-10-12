export interface Artist {
  id: string;
  name: string;
  handle: string;
  category: 'Acoustic Soloist' | 'Jazz & Blues' | 'Live Painting' | 'Classical Strings' | 'Sitar & World' | 'Ambient Vinyl' | 'Calligraphy & Craft';
  genre: string;
  location: string;
  city: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  distanceKm?: number;
  rating: number;
  reviewCount: number;
  baseHourlyRate: number;
  minimumHours: number;
  fairPriceEstimated: number; // AI zero-bargaining fair rate for standard 3h gig
  bio: string;
  handwrittenQuote: string;
  sketchImage: string;
  repertoire: string[];
  badges: string[];
  instruments: string[];
  shieldVerified: boolean;
  gigPoints: number;
  totalGigsCompleted: number;
}

export interface Booking {
  id: string;
  artistId: string;
  artistName: string;
  artistCategory: string;
  artistImage: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  eventDate: string; // YYYY-MM-DD
  eventType: string;
  venueName: string;
  venueCity: string;
  venueCoords: {
    lat: number;
    lng: number;
  };
  hours: number;
  totalAmount: number;
  advanceAmount: number; // 20%
  shieldFeeAmount: number; // 2%
  remainingAmount: number; // 80%
  paymentType: 'ESCROW_STANDARD' | 'GIGCREDIT_BNPL';
  bnplSchedule?: BNPLInstallment[];
  status: 'CONFIRMED' | 'GEO_CHECKED_IN' | 'COMPLETED' | 'CANCELLED';
  geoCheckedInAt?: string;
  escrowOtp: string;
  otpVerified: boolean;
  cancellationDate?: string;
  cancellationCompensation?: number;
  createdAt: string;
}

export interface BNPLInstallment {
  installmentNumber: number;
  dueDate: string;
  amount: number;
  status: 'PAID' | 'UPCOMING';
}

export interface B2BLead {
  id: string;
  plannerName: string;
  companyName: string;
  eventTitle: string;
  budget: number;
  eventDate: string;
  requiredGenre: string;
  location: string;
  status: 'OPEN' | 'CONTACTED';
}

export interface ClientAdvanceLoan {
  id: string;
  clientName: string;
  requestedAmount: number;
  interestRateAnnual: number;
  monthlyInterestRate: number;
  tenureMonths: number;
  monthlyInstallment: number;
  totalRepayment: number;
  financialConditionTier: 'Grassroots Community' | 'Student & Emerging Artist' | 'Small Family Event' | 'Standard Micro-Business';
  status: 'PRE_APPROVED' | 'ACTIVE';
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'CLIENT' | 'ARTIST';
  avatarInitials: string;
  phone?: string;
  location?: string;
}
