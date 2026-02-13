
import React, { useState, useEffect } from 'react';
import PropertyCard from '../components/PropertyCard';
import { PROPERTIES } from '../constants';
import { db, isFirebaseConfigured } from '../firebase';
import { SITE_CONFIG } from '../siteConfig';

const Listings: React.FC = () => {
  const [areaFilter, setAreaFilter] = useState<string>('All');
  const [priceRangeFilter, setPriceRangeFilter] = useState<string>('All');
  const [typeFilter, setTypeFilter] = useState<'All' | 'Residential' | 'Commercial' | 'Land'>('All');
  
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      if (!isFirebaseConfigured) {
        setProperties(PROPERTIES);
        setLoading(false);
        return;
      }

      try {
        const snapshot = await db.collection("projects").orderBy("createdAt", "desc").get();
        if (snapshot.empty) {
          setProperties(PROPERTIES);
        } else {
          setProperties(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        }
      } catch (err) {
        console.error("Error fetching properties from Firebase:", err);
        setProperties(PROPERTIES);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  // Helper to parse price strings into numeric values for smart filtering
  const parsePrice = (priceStr: string | undefined): number => {
    if (!priceStr) return 0;
    const clean = priceStr.toLowerCase().replace(/[৳,]/g, '').trim();
    
    // Check for ranges like "1.2 Crore - 2 Crore"
    const parts = clean.split('-');
    const target = parts[0].trim(); // Filter by the starting price
    
    let value = parseFloat(target);
    if (target.includes('crore')) value *= 10000000;
    else if (target.includes('lac') || target.includes('lakh')) value *= 100000;
    else if (target.includes('k')) value *= 1000;
    
    return isNaN(value) ? 0 : value;
  };

  const filteredProperties = properties.filter(p => {
    const matchesType = typeFilter === 'All' || p.type === typeFilter;
    const matchesArea = areaFilter === 'All' || p.location.includes(areaFilter);
    
    let matchesPrice = true;
    if (priceRangeFilter !== 'All') {
      const range = SITE_CONFIG.priceRanges.find(r => r.label === priceRangeFilter);
      if (range) {
        const numericPrice = parsePrice(p.priceRange);
        matchesPrice = numericPrice >= range.min && numericPrice <= range.max;
      }
    }

    return matchesType && matchesArea && matchesPrice;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-12">
        <h1 className="text-5xl font-bold text-slate-900 mb-4 tracking-tighter uppercase">Project Collection</h1>
        <p className="text-slate-500 max-w-2xl text-lg font-medium">
          Discover exclusive opportunities in Bangladesh's premier locations. Use our smart filters to find your perfect match.
        </p>
      </div>

      {/* Advanced Filters Container */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl mb-12 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Area Selection */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-royalGold uppercase tracking-widest ml-1">Preferred Location</label>
            <select 
              value={areaFilter}
              onChange={(e) => setAreaFilter(e.target.value)}
              className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-royalGreen outline-none appearance-none cursor-pointer shadow-inner"
            >
              <option value="All">All Locations</option>
              {SITE_CONFIG.areas.map(area => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>
          </div>

          {/* Price Range Selection */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-royalGold uppercase tracking-widest ml-1">Budget Range (BDT)</label>
            <select 
              value={priceRangeFilter}
              onChange={(e) => setPriceRangeFilter(e.target.value)}
              className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-royalGreen outline-none appearance-none cursor-pointer shadow-inner"
            >
              <option value="All">Any Budget</option>
              {SITE_CONFIG.priceRanges.map(range => (
                <option key={range.label} value={range.label}>{range.label}</option>
              ))}
            </select>
          </div>

          {/* Property Type Selection */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-royalGold uppercase tracking-widest ml-1">Property Type</label>
            <div className="flex bg-slate-50 rounded-2xl p-1 shadow-inner">
              {['All', 'Residential', 'Commercial', 'Land'].map((type) => (
                <button
                  key={type}
                  onClick={() => setTypeFilter(type as any)}
                  className={`flex-1 py-3 rounded-xl text-[10px] md:text-xs font-bold transition-all ${
                    typeFilter === type 
                      ? 'bg-royalGreen text-white shadow-lg' 
                      : 'text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><i className="fa-solid fa-spinner fa-spin text-4xl text-royalGreen"></i></div>
      ) : filteredProperties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProperties.map(property => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-slate-100 shadow-sm">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="fa-solid fa-house-circle-exclamation text-3xl text-slate-200"></i>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">No matching inventory found</h3>
          <p className="text-slate-500 max-w-xs mx-auto">Try broadening your search criteria or contact our helpdesk for manual assistance.</p>
          <button 
            onClick={() => { setAreaFilter('All'); setPriceRangeFilter('All'); setTypeFilter('All'); }}
            className="mt-8 text-royalGreen font-bold hover:underline"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default Listings;
