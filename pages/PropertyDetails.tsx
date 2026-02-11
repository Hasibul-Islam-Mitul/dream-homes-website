import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { PROPERTIES } from '../constants';

const PropertyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const property = PROPERTIES.find(p => p.id === id);

  if (!property) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h2 className="text-3xl font-bold mb-4">Property Not Found</h2>
        <Link to="/listings" className="text-royalGreen font-bold underline">Back to Listings</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl h-[500px]">
            <img src={property.image} alt={property.title} className="w-full h-full object-cover" />
          </div>
          
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
              <div>
                <span className="text-royalGold font-bold text-sm tracking-widest uppercase mb-2 block">{property.type}</span>
                <h1 className="text-4xl font-bold text-slate-900">{property.title}</h1>
              </div>
              <div className="text-3xl font-bold text-royalGreen">
                {property.priceRange || 'Contact for Quote'}
              </div>
            </div>
            
            <p className="text-slate-500 flex items-center mb-8">
              <i className="fa-solid fa-location-dot mr-2 text-royalGreen"></i>
              {property.location}
            </p>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 p-6 bg-slate-50 rounded-2xl mb-10">
              <div className="text-center">
                <i className="fa-solid fa-bed text-royalGreen/40 text-xl mb-2"></i>
                <div className="text-sm text-slate-400 font-medium">Bedrooms</div>
                <div className="font-bold text-slate-900">{property.beds || 'N/A'}</div>
              </div>
              <div className="text-center border-l border-slate-200">
                <i className="fa-solid fa-bath text-royalGreen/40 text-xl mb-2"></i>
                <div className="text-sm text-slate-400 font-medium">Bathrooms</div>
                <div className="font-bold text-slate-900">{property.baths || 'N/A'}</div>
              </div>
              <div className="text-center border-l border-slate-200">
                <i className="fa-solid fa-vector-square text-royalGreen/40 text-xl mb-2"></i>
                <div className="text-sm text-slate-400 font-medium">Square Feet</div>
                <div className="font-bold text-slate-900">{property.sqft.toLocaleString()}</div>
              </div>
              <div className="text-center border-l border-slate-200">
                <i className="fa-solid fa-tag text-royalGreen/40 text-xl mb-2"></i>
                <div className="text-sm text-slate-400 font-medium">Status</div>
                <div className="font-bold text-slate-900">{property.status}</div>
              </div>
            </div>
            
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Description</h3>
            <p className="text-slate-600 leading-relaxed text-lg font-light">
              {property.description}
              <br /><br />
              Experience luxury like never before. This property embodies the peak of modern living, 
              featuring top-tier finishing, energy-efficient systems, and a layout designed for 
              both grand entertaining and peaceful relaxation. Whether you are looking for an 
              investment or your forever home, this property offers unmatched value and style.
            </p>
          </div>
        </div>
        
        <div className="space-y-8">
          <div className="bg-royalGreen text-white p-8 rounded-3xl shadow-xl sticky top-28">
            <h3 className="text-2xl font-bold mb-6">Interested in this property?</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-royalGold uppercase mb-2">Full Name</label>
                <input type="text" className="w-full bg-white/10 border-white/20 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-white outline-none" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-xs font-bold text-royalGold uppercase mb-2">Email Address</label>
                <input type="email" className="w-full bg-white/10 border-white/20 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-white outline-none" placeholder="john@example.com" />
              </div>
              <div>
                <label className="block text-xs font-bold text-royalGold uppercase mb-2">Message</label>
                <textarea rows={4} className="w-full bg-white/10 border-white/20 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-white outline-none" placeholder="I am interested in this property..."></textarea>
              </div>
              <button className="w-full bg-white text-royalGreen font-bold py-4 rounded-xl hover:bg-slate-50 transition-colors shadow-lg">
                Send Inquiry
              </button>
            </form>
            <div className="mt-8 flex items-center justify-center space-x-6 text-sm">
              <a href="tel:+8801708364030" className="hover:text-royalGold flex items-center"><i className="fa-solid fa-phone mr-2"></i> Call Us</a>
              <a href="mailto:contact@dreamhomes.com.bd" className="hover:text-royalGold flex items-center"><i className="fa-solid fa-envelope mr-2"></i> Email Us</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;