
import { Property, Service } from './types';

export const PROPERTIES: any[] = [
  {
    id: '1',
    title: 'Luxury Residence at Mirpur DOHS',
    priceRange: '৳ 2.5 Cr - 3.8 Cr',
    location: 'Mirpur DOHS, Dhaka',
    type: 'Residential',
    status: 'For Sale',
    beds: 4,
    baths: 4,
    sqft: 2200,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800',
    description: 'Exclusive south-facing apartment with modern amenities in the secure and elite neighborhood of Mirpur DOHS.'
  },
  {
    id: '2',
    title: 'Purbachal 300ft Road Plot',
    priceRange: '৳ 80 Lac - 1.5 Cr',
    location: 'Purbachal 300ft, Dhaka',
    type: 'Land',
    status: 'For Sale',
    sqft: 3600,
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800',
    description: 'Prime location plot near the 300ft highway, ideal for high-yield investment or residential construction.'
  },
  {
    id: '3',
    title: 'Trust Green City Smart Home',
    priceRange: '৳ 1.2 Cr - 1.8 Cr',
    location: 'Trust Green City, Dhaka Cantonment',
    type: 'Residential',
    status: 'For Sale',
    beds: 3,
    baths: 3,
    sqft: 1650,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800',
    description: 'Sustainable living in the heart of Dhaka Cantonment area. High security and green surroundings.'
  },
  {
    id: '4',
    title: 'Shagupta Lakeview Residency',
    priceRange: '৳ 95 Lac - 1.4 Cr',
    location: 'Shagupta, Dhaka',
    type: 'Residential',
    status: 'Constructing',
    beds: 3,
    baths: 3,
    sqft: 1800,
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800',
    description: 'Ongoing project with modern architectural design overlooking the serene Shagupta lakes.'
  },
  {
    id: '5',
    title: 'Commercial Space at ECB Chattor',
    priceRange: '৳ 45k - 85k / month',
    location: 'ECB Chattor, Dhaka',
    type: 'Commercial',
    status: 'For Rent',
    sqft: 1200,
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800',
    description: 'Perfect for retail or corporate offices, situated at the busy junction of ECB Chattor.'
  },
  {
    id: '6',
    title: 'Premium Plot at Sector 1, Purbachal',
    priceRange: '৳ 1.5 Cr - 2.2 Cr',
    location: 'Sector 1, Purbachal, Dhaka',
    type: 'Land',
    status: 'For Sale',
    sqft: 4320,
    image: 'https://images.unsplash.com/photo-1599809275671-b5942cacc7a1?auto=format&fit=crop&q=80&w=800',
    description: 'Large corner plot available for immediate registration and construction.'
  }
];

export const SERVICES: Service[] = [
  {
    id: 's1',
    title: 'Architectural Design',
    description: 'Bespoke designs that blend modern aesthetics with the tropical climate of Bangladesh.',
    icon: 'fa-pencil-ruler'
  },
  {
    id: 's2',
    title: 'Modern Construction',
    description: 'High-quality construction using premium materials and engineering standards.',
    icon: 'fa-hard-hat'
  },
  {
    id: 's3',
    title: 'Project Management',
    description: 'End-to-end management of your dream project, ensuring timely and quality delivery.',
    icon: 'fa-tasks'
  }
];
