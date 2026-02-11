
import React from 'react';
import { Property } from '../types';
import { Link } from 'react-router-dom';

interface PropertyCardProps {
  property: any; // Using any to handle the updated property object with priceRange
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 group">
      <div className="relative h-64 overflow-hidden">
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 text-xs font-bold rounded-full ${
            property.status === 'For Sale' ? 'bg-green-100 text-green-800' :
            property.status === 'For Rent' ? 'bg-blue-100 text-blue-800' :
            'bg-orange-100 text-orange-800'
          }`}>
            {property.status}
          </span>
        </div>
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-lg font-bold text-royalGreen shadow-sm">
          {property.priceRange}
        </div>
      </div>
      <div className="p-6">
        <div className="text-xs font-semibold text-royalGold uppercase tracking-widest mb-1">{property.type}</div>
        <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-royalGreen transition-colors">{property.title}</h3>
        <p className="text-slate-500 flex items-center text-sm mb-4">
          <i className="fa-solid fa-location-dot mr-2 text-royalGreen"></i>
          {property.location}
        </p>
        <div className="flex items-center justify-between pt-4 border-t border-slate-50">
          <div className="flex space-x-4 text-sm text-slate-600 font-medium">
            {property.beds && (
              <span className="flex items-center">
                <i className="fa-solid fa-bed mr-2 text-royalGreen/40"></i>
                {property.beds}
              </span>
            )}
            {property.baths && (
              <span className="flex items-center">
                <i className="fa-solid fa-bath mr-2 text-royalGreen/40"></i>
                {property.baths}
              </span>
            )}
            <span className="flex items-center">
              <i className="fa-solid fa-vector-square mr-2 text-royalGreen/40"></i>
              {property.sqft.toLocaleString()} sqft
            </span>
          </div>
        </div>
        <Link 
          to={`/property/${property.id}`}
          className="mt-6 block w-full py-2 bg-slate-50 text-slate-700 text-center font-semibold rounded-lg group-hover:bg-royalGreen group-hover:text-white transition-all"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default PropertyCard;
