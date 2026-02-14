
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PROPERTIES } from '../constants';
import { db } from '../firebase';
import firebase from 'firebase/compat/app';

const PropertyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string>('');
  const [inquiryStatus, setInquiryStatus] = useState<'idle' | 'sending' | 'success'>('idle');

  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true);
      if (db && id) {
        try {
          const doc = await db.collection("projects").doc(id).get();
          if (doc.exists) {
            const data = { id: doc.id, ...doc.data() };
            setProperty(data);
            setActiveImage(data.image);
          } else {
            const local = PROPERTIES.find(p => p.id === id);
            if (local) {
              setProperty(local);
              setActiveImage(local.image);
            }
          }
        } catch (err) {
          console.error(err);
        }
      } else {
        const local = PROPERTIES.find(p => p.id === id);
        if (local) {
          setProperty(local);
          setActiveImage(local.image);
        }
      }
      setLoading(false);
    };
    fetchProperty();
  }, [id]);

  const handleInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    setInquiryStatus('sending');
    const formData = new FormData(e.target as HTMLFormElement);
    try {
      if (db) {
        await db.collection("leads").add({
          name: formData.get('name'),
          email: formData.get('email'),
          message: formData.get('message'),
          projectId: id,
          projectTitle: property?.title,
          timestamp: firebase.firestore.Timestamp.now(),
          source: 'Property Details Inquiry'
        });
      }
      setInquiryStatus('success');
      setTimeout(() => setInquiryStatus('idle'), 5000);
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      console.error(err);
      setInquiryStatus('idle');
    }
  };

  if (loading) return <div className="py-24 text-center"><i className="fa-solid fa-spinner fa-spin text-4xl text-royalGreen"></i></div>;

  if (!property) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h2 className="text-3xl font-bold mb-4">Property Not Found</h2>
        <Link to="/listings" className="text-royalGreen font-bold underline">Back to Listings</Link>
      </div>
    );
  }

  const galleryImages = [property.image, property.image2, property.image3].filter(Boolean);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          {/* Gallery Section */}
          <div className="space-y-4">
            <div className="relative rounded-[3rem] overflow-hidden shadow-2xl h-[500px] border border-slate-100">
              <img src={activeImage} alt={property.title} className="w-full h-full object-cover transition-all duration-700" />
              {property.status === 'Sold' && (
                <div className="absolute top-8 right-8 bg-red-600 text-white px-6 py-2 rounded-full font-bold uppercase tracking-[0.3em] shadow-lg transform rotate-3">
                  SOLD OUT
                </div>
              )}
            </div>
            
            {galleryImages.length > 1 && (
              <div className="flex space-x-4 overflow-x-auto pb-4 px-2">
                {galleryImages.map((img, i) => (
                  <button 
                    key={i} 
                    onClick={() => setActiveImage(img)}
                    className={`flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all ${activeImage === img ? 'border-royalGold shadow-lg scale-105' : 'border-transparent opacity-60 hover:opacity-100'}`}
                  >
                    <img src={img} className="w-full h-full object-cover" alt={`Gallery ${i+1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
            <div className="flex flex-wrap items-center justify-between mb-8 gap-6">
              <div>
                <span className="text-royalGold font-bold text-[10px] tracking-[0.3em] uppercase mb-3 block">{property.type}</span>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">{property.title}</h1>
              </div>
              <div className="text-3xl font-bold text-royalGreen bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100 shadow-inner">
                {property.priceRange || 'Contact for Quote'}
              </div>
            </div>
            
            <p className="text-slate-500 flex items-center mb-10 text-lg">
              <div className="w-10 h-10 bg-royalGreen/5 rounded-xl flex items-center justify-center mr-4">
                <i className="fa-solid fa-location-dot text-royalGreen"></i>
              </div>
              {property.location}
            </p>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-8 bg-slate-50 rounded-[2rem] mb-12 shadow-inner">
              <div className="text-center">
                <i className="fa-solid fa-bed text-royalGreen/30 text-xl mb-3"></i>
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Bedrooms</div>
                <div className="font-bold text-slate-900 text-lg">{property.beds || 'N/A'}</div>
              </div>
              <div className="text-center border-l border-slate-200">
                <i className="fa-solid fa-bath text-royalGreen/30 text-xl mb-3"></i>
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Bathrooms</div>
                <div className="font-bold text-slate-900 text-lg">{property.baths || 'N/A'}</div>
              </div>
              <div className="text-center border-l border-slate-200">
                <i className="fa-solid fa-vector-square text-royalGreen/30 text-xl mb-3"></i>
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Total Space</div>
                <div className="font-bold text-slate-900 text-lg">{property.sqft?.toLocaleString() || 'N/A'} <span className="text-[10px]">sqft</span></div>
              </div>
              <div className="text-center border-l border-slate-200">
                <i className="fa-solid fa-tag text-royalGreen/30 text-xl mb-3"></i>
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Inventory</div>
                <div className="font-bold text-slate-900 text-lg">{property.status}</div>
              </div>
            </div>
            
            <h3 className="text-2xl font-bold text-slate-900 mb-6 uppercase tracking-tight">Project Overview</h3>
            <p className="text-slate-600 leading-relaxed text-lg font-light whitespace-pre-line mb-10">
              {property.description}
            </p>
            
            {property.features && (
              <div className="pt-8 border-t border-slate-50">
                <h3 className="text-2xl font-bold text-slate-900 mb-6 uppercase tracking-tight">Technical Features</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-12">
                  {property.features.split(',').map((feat: string, i: number) => (
                    <div key={i} className="flex items-center text-slate-600 text-sm py-2 border-b border-slate-50 last:border-0">
                      <div className="w-6 h-6 rounded-full bg-green-50 flex items-center justify-center mr-4">
                        <i className="fa-solid fa-check text-[10px] text-green-600"></i>
                      </div>
                      <span className="font-medium">{feat.trim()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {property.brochure && (
              <div className="mt-12 bg-slate-900 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between text-white gap-6">
                <div>
                  <h4 className="text-xl font-bold mb-2 uppercase tracking-tight">Project Documentation</h4>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Floor plans, permits, and specifications</p>
                </div>
                <a 
                  href={property.brochure} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-royalGold hover:bg-amber-600 text-white px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-[10px] transition-all flex items-center shadow-lg"
                >
                  <i className="fa-solid fa-file-pdf mr-3 text-lg"></i> Download Brochure
                </a>
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-8">
          <div className="bg-royalGreen text-white p-10 rounded-[3rem] shadow-2xl sticky top-28 border border-white/10">
            <h3 className="text-2xl font-bold mb-8 uppercase tracking-tight">Direct Inquiry</h3>
            <form onSubmit={handleInquiry} className="space-y-6">
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-royalGold uppercase mb-2 tracking-widest">Your Full Name</label>
                <input required name="name" type="text" className="w-full bg-white/10 border border-white/10 rounded-2xl px-5 py-4 text-white focus:ring-1 focus:ring-royalGold outline-none transition-all" placeholder="John Doe" />
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-royalGold uppercase mb-2 tracking-widest">Email Address</label>
                <input required name="email" type="email" className="w-full bg-white/10 border border-white/10 rounded-2xl px-5 py-4 text-white focus:ring-1 focus:ring-royalGold outline-none transition-all" placeholder="john@example.com" />
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-royalGold uppercase mb-2 tracking-widest">Specific Message</label>
                <textarea required name="message" rows={4} className="w-full bg-white/10 border border-white/10 rounded-2xl px-5 py-4 text-white focus:ring-1 focus:ring-royalGold outline-none transition-all resize-none" placeholder="I am interested in this project..."></textarea>
              </div>
              <button disabled={inquiryStatus === 'sending'} className="w-full bg-white text-royalGreen font-bold py-5 rounded-2xl hover:bg-slate-100 transition-all shadow-xl uppercase tracking-widest text-[11px]">
                {inquiryStatus === 'sending' ? (
                  <><i className="fa-solid fa-spinner fa-spin mr-3"></i> Transmitting...</>
                ) : inquiryStatus === 'success' ? (
                  <><i className="fa-solid fa-circle-check mr-3"></i> Sent Successfully</>
                ) : (
                  'Confirm Inquiry'
                )}
              </button>
            </form>
            <div className="mt-10 flex flex-col items-center space-y-4 text-xs font-bold uppercase tracking-widest text-white/40">
              <a href="tel:+8801769051777" className="hover:text-royalGold transition-colors flex items-center"><i className="fa-solid fa-phone mr-3 text-royalGold"></i> Call +880 1769-051777</a>
              <a href="mailto:official.mehedihasanrabbi@gmail.com" className="hover:text-royalGold transition-colors flex items-center"><i className="fa-solid fa-envelope mr-3 text-royalGold"></i> Email Sales Team</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
