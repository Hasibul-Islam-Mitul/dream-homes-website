
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
  image2?: string;
  image3?: string;
  brochure?: string;
  features?: string;
  description: string;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: 'Gallery' | 'Blog';
  createdAt: any;
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
