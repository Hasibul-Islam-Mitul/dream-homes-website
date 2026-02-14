
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
        timestamp: firebase.firestore.Timestamp.now(),
        source: 'Home Callback Form'
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

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1920" 
            alt="Luxury Home Dhaka" 
            className="w-full h-full object-cover animate-slow-zoom"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-royalGreen/70 via-royalGreen/40 to-transparent"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
          <div className="max-w-2xl p-10 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6 text-white uppercase tracking-tight">
              Build Your <span className="text-royalGold">Legacy</span>
            </h1>
            <p className="text-base md:text-xl text-white/90 mb-10 leading-relaxed font-light">
              Premium plots and luxury residences across Bangladesh's most elite development zones. Architectural brilliance meets timeless value.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-5">
              <Link to="/listings" className="bg-royalGold hover:bg-amber-600 text-white px-8 py-4 rounded-xl text-center font-bold transition-all text-sm uppercase tracking-widest shadow-lg">
                Explore Projects
              </Link>
              <a href="#leads" className="bg-white/20 backdrop-blur-xl hover:bg-white/30 border border-white/30 text-white px-8 py-4 rounded-xl text-center font-bold transition-all text-sm uppercase tracking-widest">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Strategic Focus Areas */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center mb-16">
          <h2 className="text-2xl md:text-4xl font-bold text-slate-900 mb-4 uppercase tracking-tight">Our Strategic Focus Areas</h2>
          <div className="h-1 w-24 bg-royalGold mx-auto rounded-full"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SITE_CONFIG.areas.map((area, index) => (
            <div key={index} className="relative h-64 rounded-[2rem] overflow-hidden group cursor-pointer shadow-lg">
                <img src={area.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={area.name} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-6">
                    <span className="text-white font-bold text-sm uppercase tracking-wider leading-tight">{area.name}</span>
                </div>
            </div>
          ))}
        </div>
      </section>

      {/* Dynamic Projects Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex justify-between items-end mb-12 border-b border-slate-100 pb-6">
          <div>
            <h2 className="text-2xl md:text-4xl font-bold text-slate-900 uppercase tracking-tight">Latest Projects</h2>
            <p className="text-slate-400 mt-2 text-sm uppercase tracking-widest font-bold">New Inventory</p>
          </div>
          <Link to="/listings" className="text-royalGreen font-bold hover:underline text-sm uppercase flex items-center">
            See All <i className="fa-solid fa-arrow-right ml-2 text-xs"></i>
          </Link>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-20"><i className="fa-solid fa-spinner fa-spin text-3xl text-royalGreen"></i></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProjects.map(property => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </section>

      {/* Leads Section */}
      <section id="leads" className="bg-slate-900 py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-royalGold/10 rounded-full blur-[100px] -mr-48 -mt-48"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-16 relative z-10">
            <div className="flex-1 text-center lg:text-left">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 uppercase tracking-tight">Request a callback</h2>
                <p className="text-slate-400 text-lg mb-10 font-light leading-relaxed">Our expert consultants are ready to assist you in securing your dream property. Whether it's a plot or a luxury residence, we have you covered.</p>
                <div className="space-y-4">
                  <a href={`tel:${SITE_CONFIG.phone.replace(/\s+/g, '')}`} className="inline-flex items-center text-royalGold text-2xl md:text-3xl font-bold hover:scale-105 transition-transform">
                      <i className="fa-solid fa-phone mr-4 text-white/20"></i> {SITE_CONFIG.phone}
                  </a>
                  <p className="text-white/40 text-xs font-bold uppercase tracking-[0.3em]">Direct Engineering Hotline</p>
                </div>
            </div>

            <div className="flex-1 w-full max-w-lg bg-white p-10 rounded-[3rem] shadow-2xl">
              <form onSubmit={handleLeadSubmit} className="space-y-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                  <input required type="text" value={leadForm.name} onChange={e => setLeadForm({...leadForm, name: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 outline-none focus:ring-1 focus:ring-royalGold" placeholder="John Doe" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                  <input required type="email" value={leadForm.email} onChange={e => setLeadForm({...leadForm, email: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 outline-none focus:ring-1 focus:ring-royalGold" placeholder="john@example.com" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Requirements</label>
                  <textarea required rows={4} value={leadForm.message} onChange={e => setLeadForm({...leadForm, message: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 outline-none focus:ring-1 focus:ring-royalGold resize-none" placeholder="How can we help?"></textarea>
                </div>
                <button disabled={formStatus === 'sending'} className="w-full bg-royalGreen text-white font-bold py-5 rounded-2xl uppercase tracking-widest text-xs hover:bg-green-800 transition-all shadow-xl">
                  {formStatus === 'success' ? 'Consultation Requested' : 'Confirm Callback'}
                </button>
              </form>
            </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
