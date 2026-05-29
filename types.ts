export enum UserRole {
  GUARD = 'GUARD',
  ADMIN = 'ADMIN',
  RESIDENT = 'RESIDENT'
}

export interface LogEntry {
  id: string;
  type: 'VISITOR' | 'TANKER' | 'SERVICE';
  description: string;
  timestamp: Date;
  status: 'PENDING' | 'APPROVED' | 'DENIED' | 'VERIFIED';
  details?: {
    vendor?: string;
    amount?: number;
    unit?: string;
    flat?: string;
    category?: string;
  };
}

export interface MarketItem {
  id: string;
  title: string;
  price: number;
  seller: string;
  verified: boolean;
  image: string;
  category: 'SALE' | 'RENT' | 'SERVICE';
  scope: 'SOCIETY' | 'CITY_WIDE';
}

export interface PlaceRecommendation {
  name: string;
  rating: number;
  summary: string; // The Gemini summary
  address: string;
  type: string;
}

export enum TankerStatus {
  ARRIVED = 'ARRIVED',
  VERIFIED = 'VERIFIED',
  DISCREPANCY = 'DISCREPANCY'
}