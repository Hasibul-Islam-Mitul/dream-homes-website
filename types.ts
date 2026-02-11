export interface Property {
  id: string;
  title: string;
  price?: number;
  priceRange: string;
  location: string;
  type: 'Residential' | 'Commercial' | 'Land';
  status: 'For Sale' | 'For Rent' | 'Constructing' | 'Sold';
  beds?: number;
  baths?: number;
  sqft: number;
  image: string;
  description: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}