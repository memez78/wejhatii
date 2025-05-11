// Client-side types

export interface Destination {
  id: string;
  name: string;
  country: string;
  description: string;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  flightTime: string;
  bestSeason: string;
  languages: string[];
  currency: string;
  currencyCode: string;
  exchangeRate: number;
  timeDifference: string;
  visaStatus: string;
  visaInfo: string;
  muslimFriendly: {
    prayer: boolean;
    halal: boolean;
    alcohol: boolean;
    privacy: boolean;
  };
  costIndicators: {
    meal: { min: number; max: number; };
    transport: { min: number; max: number; };
    hotel: { min: number; max: number; };
    attraction: { min: number; max: number; };
  };
  embassy?: {
    address: string;
    phone: string;
    emergency: string;
  };
  documents: DocumentItem[];
}

export interface DocumentItem {
  name: string;
  status: 'required' | 'recommended' | 'info';
  description: string;
}

export interface TravelPreferences {
  id?: number;
  budget: number;
  startDate?: string;
  endDate?: string;
  interests?: string[];
  companions: string;
  muslimRequirements?: string[];
  revealPreference: "now" | "later";
  revealTiming?: string;
  destinationId?: string;
  revealed?: boolean;
  active?: boolean;
}
