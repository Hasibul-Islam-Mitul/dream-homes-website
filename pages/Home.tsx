
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

  return (
    <div className="space-y-24">
      {/* Hero Section with Glassmorphism and Real Estate Visuals */}
      <section className="relative h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1920" 
            alt="Luxury Home Dhaka" 
            className="w-full h-full object-cover scale-105 animate-slow-zoom blur-[2px]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-royalGreen/80 via-royalGreen/40 to-transparent"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl p-8 md:p-12 rounded-[2.5rem] bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl">
            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6 text-white drop-shadow-lg">
              Dream. Build. <br />
              <span className="text-royalGold">Live.</span>
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-10 leading-relaxed font-light">
              Pioneering modern living in Bangladesh. We specialize in premium plots and luxury residences across Dhaka's most elite zones.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/listings" className="bg-royalGold hover:bg-amber-600 text-white px-8 py-4 rounded-xl text-center font-bold transition-all shadow-lg text-lg">
                Explore Projects
              </Link>
              <a href="#leads" className="bg-white/20 backdrop-blur-xl hover:bg-white/30 border border-white/40 text-white px-8 py-4 rounded-xl text-center font-bold transition-all text-lg">
                Talk to an Expert
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Strategic Focus - Updated Areas */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 uppercase tracking-tighter">OUR STRATEGIC FOCUS AREAS</h2>
          <p className="text-slate-500 max-w-2xl mx-auto font-medium">Providing premium real estate opportunities in Bangladesh's most high-growth development zones.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SITE_CONFIG.areas.map((area, index) => (
            <div key={index} className="relative h-56 rounded-[2rem] overflow-hidden group cursor-pointer shadow-lg border border-slate-100">
                <img src={`https://images.unsplash.com/photo-${1582407947304 + index}-5a1c21201453?auto=format&fit=crop&q=80&w=400`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={area} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-royalGreen/90 transition-all flex flex-col justify-end p-6">
                    <span className="text-white font-bold text-lg uppercase tracking-tighter leading-tight">{area}</span>
                    <span className="text-royalGold text-[10px] font-bold uppercase tracking-widest mt-1 opacity-0 group-hover:opacity-100 transition-opacity">View Listings <i className="fa-solid fa-arrow-right ml-1"></i></span>
                </div>
            </div>
          ))}
        </div>
      </section>

      {/* Dynamic Projects */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2 className="text-4xl font-bold text-slate-900 mb-4 tracking-tighter uppercase">Prime Opportunities</h2>
            <div className="h-2 w-32 bg-royalGold rounded-full"></div>
          </div>
          <Link to="/listings" className="text-royalGreen font-bold hover:text-green-800 transition-colors flex items-center bg-slate-100 px-6 py-3 rounded-full">
            Browse All Inventory <i className="fa-solid fa-arrow-right ml-2"></i>
          </Link>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-20"><i className="fa-solid fa-spinner fa-spin text-4xl text-royalGreen"></i></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map(property => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </section>

      {/* Services Section */}
      <section className="bg-royalGreen py-24 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-royalGold/5 rounded-full blur-[100px] -mr-48 -mt-48"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tighter uppercase">Built for Generations</h2>
            <p className="text-slate-200 text-lg font-light leading-relaxed">
              At {SITE_CONFIG.name}, we don't just build structures; we build trust through engineering excellence and transparent dealings.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {SERVICES.map(service => (
              <div key={service.id} className="bg-white/5 backdrop-blur-sm border border-white/10 p-10 rounded-[3rem] hover:bg-white/10 transition-all group">
                <div className="w-20 h-20 bg-royalGold rounded-3xl flex items-center justify-center mb-8 group-hover:rotate-6 transition-transform shadow-xl">
                  <i className={`fa-solid ${service.icon} text-3xl text-white`}></i>
                </div>
                <h3 className="text-2xl font-bold mb-4 uppercase tracking-tighter">{service.title}</h3>
                <p className="text-slate-200 font-light leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lead Generation Form */}
      <section id="leads" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="bg-slate-900 rounded-[4rem] p-12 md:p-20 relative overflow-hidden flex flex-col lg:flex-row items-center gap-16 shadow-2xl border border-white/5">
            <div className="absolute top-0 right-0 w-80 h-80 bg-royalGreen/30 rounded-full blur-[120px] -mr-40 -mt-40"></div>
            
            <div className="flex-1 relative z-10 text-center lg:text-left">
                <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tighter uppercase">Your Journey Starts Here</h2>
                <p className="text-slate-400 text-xl mb-12 max-w-xl font-light">
                    Looking for a residential plot or a luxury apartment? Our dedicated consultants are available 24/7 to guide you through the registration process.
                </p>
                <div className="flex flex-col sm:flex-row items-center lg:justify-start justify-center gap-6">
                    <a href={`tel:${SITE_CONFIG.phone.replace(/\s+/g, '')}`} className="bg-white text-royalGreen px-10 py-5 rounded-2xl font-bold text-xl hover:bg-slate-100 transition-all flex items-center shadow-2xl">
                        <i className="fa-solid fa-phone mr-3 text-royalGold"></i> {SITE_CONFIG.phone}
                    </a>
                </div>
            </div>

            <div className="flex-1 w-full max-w-lg bg-white/5 backdrop-blur-2xl p-10 rounded-[3rem] border border-white/10 relative z-10 shadow-2xl">
              <form onSubmit={handleLeadSubmit} className="space-y-6">
                <div className="space-y-2">
                   <label className="text-xs font-bold text-royalGold uppercase tracking-widest ml-2">Full Name</label>
                   <input 
                     required
                     type="text" 
                     placeholder="e.g. Mehedi Hasan" 
                     value={leadForm.name}
                     onChange={e => setLeadForm({...leadForm, name: e.target.value})}
                     className="w-full bg-white/10 border border-white/10 text-white rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-royalGold transition-all placeholder:text-white/20" 
                   />
                </div>
                <div className="space-y-2">
                   <label className="text-xs font-bold text-royalGold uppercase tracking-widest ml-2">Email Address</label>
                   <input 
                     required
                     type="email" 
                     placeholder="name@email.com" 
                     value={leadForm.email}
                     onChange={e => setLeadForm({...leadForm, email: e.target.value})}
                     className="w-full bg-white/10 border border-white/10 text-white rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-royalGold transition-all placeholder:text-white/20" 
                   />
                </div>
                <div className="space-y-2">
                   <label className="text-xs font-bold text-royalGold uppercase tracking-widest ml-2">Your Requirements</label>
                   <textarea 
                     required
                     placeholder="Interested in plots at Purbachal..." 
                     rows={4}
                     value={leadForm.message}
                     onChange={e => setLeadForm({...leadForm, message: e.target.value})}
                     className="w-full bg-white/10 border border-white/10 text-white rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-royalGold transition-all placeholder:text-white/20 resize-none"
                   ></textarea>
                </div>
                <button 
                  disabled={formStatus === 'sending'}
                  className="w-full bg-royalGold text-white font-bold py-5 rounded-2xl hover:bg-amber-600 transition-all shadow-xl disabled:opacity-50 text-lg uppercase tracking-widest mt-4"
                >
                  {formStatus === 'sending' ? 'Sending Request...' : formStatus === 'success' ? 'Consultation Booked!' : 'Request Consultation'}
                </button>
              </form>
            </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
