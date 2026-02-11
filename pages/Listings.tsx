
import React, { useState, useEffect } from 'react';
import PropertyCard from '../components/PropertyCard';
import { PROPERTIES } from '../constants';
import { db, isFirebaseConfigured } from '../firebase';

const Listings: React.FC = () => {
  const [filter, setFilter] = useState<'All' | 'Residential' | 'Commercial' | 'Land'>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'For Sale' | 'For Rent' | 'Constructing' | 'Sold'>('All');
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
        // Using compat syntax: db.collection().orderBy().get()
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

  const filteredProperties = properties.filter(p => 
    (filter === 'All' || p.type === filter) &&
    (statusFilter === 'All' || p.status === statusFilter)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-12">
        <h1 className="text-5xl font-bold text-slate-900 mb-4 tracking-tighter uppercase">Project Collection</h1>
        <p className="text-slate-500 max-w-2xl text-lg font-medium">
          Explore our handpicked selection of premium residences, commercial hubs, and investment opportunities across Dhaka.
        </p>
      </div>

      {!isFirebaseConfigured && (
        <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center text-amber-800 text-sm font-medium">
          <i className="fa-solid fa-triangle-exclamation mr-3 text-lg"></i>
          <div>
            <strong>Note:</strong> Showing sample data because Firebase is not yet configured. 
            Update <code className="bg-amber-100 px-1 rounded">firebase.ts</code> to see live projects.
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex flex-wrap gap-2">
          {['All', 'Residential', 'Commercial', 'Land'].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type as any)}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                filter === type 
                  ? 'bg-royalGreen text-white shadow-md' 
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
        
        <div className="flex items-center space-x-3">
          <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Status:</span>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-slate-50 border-none rounded-xl px-4 py-2 text-sm font-semibold focus:ring-2 focus:ring-royalGreen outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="For Sale">For Sale</option>
            <option value="For Rent">For Rent</option>
            <option value="Constructing">Constructing</option>
            <option value="Sold">Sold</option>
          </select>
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
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
          <i className="fa-solid fa-house-circle-exclamation text-4xl text-slate-300 mb-4"></i>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No matching properties found</h3>
          <p className="text-slate-500">Try adjusting your filters or search criteria.</p>
        </div>
      )}
    </div>
  );
};

export default Listings;
