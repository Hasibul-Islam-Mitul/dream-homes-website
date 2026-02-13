
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { SERVICES, PROPERTIES } from '../constants'; 
import PropertyCard from '../components/PropertyCard';
import { db, isFirebaseConfigured } from '../firebase';
import firebase from 'firebase/compat/app';
import { SITE_CONFIG } from '../siteConfig';

const Home: React.FC = () => {
  const [featuredProjects, setFeaturedProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [leadForm, setLeadForm] = useState({ name: '', email: '', message: '' });
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  useEffect(() => {
    const fetchProjects = async () => {
      if (!isFirebaseConfigured || !db) {
        setFeaturedProjects(PROPERTIES.slice(0, 3));
        setLoading(false);
        return;
      }

      try {
        const snapshot = await db.collection("projects").orderBy("createdAt", "desc").limit(3).get();
        if (snapshot.empty) {
          setFeaturedProjects(PROPERTIES.slice(0, 3));
        } else {
          setFeaturedProjects(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        }
      } catch (err) {
        console.error("Error fetching projects from Firebase:", err);
        setFeaturedProjects(PROPERTIES.slice(0, 3)); 
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFirebaseConfigured || !db) {
      alert(`Contact form is currently in demo mode. Please contact us at ${SITE_CONFIG.phone}`);
      return;
    }

    setFormStatus('sending');
    try {
      await db.collection("leads").add({
        ...leadForm,
        timestamp: firebase.firestore.Timestamp.now()
      });
      setFormStatus('success');
      setLeadForm({ name: '', email: '', message: '' });
      setTimeout(() => setFormStatus('idle'), 3000);
    } catch (err) {
      console.error(err);
      setFormStatus('error');
      setTimeout(() => setFormStatus('idle'), 3000);
    }
  };

  // Professional real estate image list for areas
  const areaImages = [
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800",
    "https://images.unsplash.com/photo-1600607687940-c52af096999c?q=80&w=800",
    "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?q=80&w=800",
    "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?q=80&w=800",
    "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?q=80&w=800",
    "https://images.unsplash.com/photo-1600585154526-990dcea4d4d9?q=80&w=800"
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1920" 
            alt="Luxury Home Dhaka" 
            className="w-full h-full object-cover animate-slow-zoom"
          />
          <div className="absolute inset-0 bg-royalGreen/40"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl p-8 rounded-3xl bg-white/20 backdrop-blur-lg border border-white/30 shadow-2xl">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4 text-white uppercase tracking-tight">
              Build Your <span className="text-royalGold">Legacy</span>
            </h1>
            <p className="text-base md:text-lg text-white/90 mb-8 leading-relaxed font-light">
              Premium plots and luxury residences across Bangladesh's most elite development zones.
            </p>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <Link to="/listings" className="bg-royalGold hover:bg-amber-600 text-white px-6 py-3 rounded-xl text-center font-bold transition-all text-sm uppercase tracking-widest">
                Explore Projects
              </Link>
              <a href="#leads" className="bg-white/20 backdrop-blur-xl hover:bg-white/30 border border-white/40 text-white px-6 py-3 rounded-xl text-center font-bold transition-all text-sm uppercase tracking-widest">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Strategic Focus Areas */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-4xl font-bold text-slate-900 mb-4 uppercase tracking-tight">Our Strategic Focus Areas</h2>
          <div className="h-1 w-20 bg-royalGold mx-auto rounded-full"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SITE_CONFIG.areas.map((area, index) => (
            <div key={index} className="relative h-48 rounded-2xl overflow-hidden group cursor-pointer shadow-md">
                <img src={areaImages[index % areaImages.length]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={area} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent flex flex-col justify-end p-5">
                    <span className="text-white font-bold text-sm uppercase tracking-tight leading-tight">{area}</span>
                </div>
            </div>
          ))}
        </div>
      </section>

      {/* Dynamic Projects Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex justify-between items-end mb-10">
          <h2 className="text-2xl md:text-4xl font-bold text-slate-900 uppercase tracking-tight">Latest Projects</h2>
          <Link to="/listings" className="text-royalGreen font-bold hover:underline text-sm uppercase">See All</Link>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-10"><i className="fa-solid fa-spinner fa-spin text-2xl text-royalGreen"></i></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProjects.map(property => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </section>

      {/* Leads Section */}
      <section id="leads" className="bg-slate-900 py-16 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-10">
            <div className="flex-1 text-center lg:text-left">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 uppercase tracking-tight">Request a callback</h2>
                <p className="text-slate-400 text-base mb-8 font-light">Our expert consultants are ready to assist you in securing your dream property.</p>
                <a href={`tel:${SITE_CONFIG.phone.replace(/\s+/g, '')}`} className="inline-flex items-center text-royalGold text-2xl font-bold hover:underline">
                    <i className="fa-solid fa-phone mr-3"></i> {SITE_CONFIG.phone}
                </a>
            </div>

            <div className="flex-1 w-full max-w-md bg-white p-8 rounded-3xl shadow-xl">
              <form onSubmit={handleLeadSubmit} className="space-y-4">
                <input required type="text" placeholder="Name" value={leadForm.name} onChange={e => setLeadForm({...leadForm, name: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-royalGold" />
                <input required type="email" placeholder="Email" value={leadForm.email} onChange={e => setLeadForm({...leadForm, email: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-royalGold" />
                <textarea required placeholder="Requirements" rows={3} value={leadForm.message} onChange={e => setLeadForm({...leadForm, message: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-royalGold resize-none"></textarea>
                <button disabled={formStatus === 'sending'} className="w-full bg-royalGreen text-white font-bold py-4 rounded-xl uppercase tracking-widest text-xs hover:bg-green-800">
                  {formStatus === 'success' ? 'Sent successfully' : 'Request Call'}
                </button>
              </form>
            </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
