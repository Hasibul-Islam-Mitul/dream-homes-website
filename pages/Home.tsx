
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { SERVICES, PROPERTIES } from '../constants'; 
import PropertyCard from '../components/PropertyCard';
import { db, isFirebaseConfigured } from '../firebase';
// Use compat/app to access the augmented firebase namespace with firestore types
import firebase from 'firebase/compat/app';

const Home: React.FC = () => {
  const [featuredProjects, setFeaturedProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [leadForm, setLeadForm] = useState({ name: '', email: '', message: '' });
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  useEffect(() => {
    const fetchProjects = async () => {
      if (!isFirebaseConfigured) {
        setFeaturedProjects(PROPERTIES.slice(0, 3));
        setLoading(false);
        return;
      }

      try {
        // Using compat syntax: db.collection().orderBy().limit().get()
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
    if (!isFirebaseConfigured) {
      alert("Contact form is currently in demo mode. Please configure Firebase to receive leads.");
      return;
    }

    setFormStatus('sending');
    try {
      // Using compat syntax: db.collection().add()
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
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1920" 
            alt="Luxury Home Dhaka" 
            className="w-full h-full object-cover scale-105 animate-slow-zoom"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-royalGreen/90 to-transparent"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl text-white">
            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
              Dream. Build. <br />
              <span className="text-royalGold">Live.</span>
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-10 leading-relaxed font-light">
              Pioneering modern living in Bangladesh. We specialize in premium plots and luxury residences near Purbachal 300ft, Mirpur DOHS, Trust Green City, and Shagupta.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/listings" className="bg-royalGold hover:bg-amber-600 text-white px-8 py-4 rounded-xl text-center font-bold transition-all shadow-lg">
                Explore Listings
              </Link>
              <a href="#leads" className="bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/30 text-white px-8 py-4 rounded-xl text-center font-bold transition-all">
                Contact Sales Team
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Area Focus */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 uppercase tracking-tighter">OUR STRATEGIC FOCUS AREAS</h2>
          <p className="text-slate-500 max-w-2xl mx-auto font-medium">Strategically focusing on Dhaka's most promising and secure development zones.</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {['Purbachal 300ft', 'Mirpur DOHS', 'Trust Green City', 'Shagupta'].map((area) => (
            <div key={area} className="relative h-48 rounded-2xl overflow-hidden group cursor-pointer shadow-md">
                <img src={`https://picsum.photos/400/300?city=${area}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={area} />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-royalGreen/60 transition-colors flex items-center justify-center">
                    <span className="text-white font-bold text-lg text-center px-2 uppercase tracking-tighter">{area}</span>
                </div>
            </div>
          ))}
        </div>
      </section>

      {/* Dynamic Projects from Firestore */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {!isFirebaseConfigured && (
          <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center text-amber-800 text-sm font-medium">
            <i className="fa-solid fa-triangle-exclamation mr-3 text-lg"></i>
            <div>
              <strong>Note:</strong> Firebase is not yet configured. Showing sample data. 
              Please update <code className="bg-amber-100 px-1 rounded">firebase.ts</code> with your API keys.
            </div>
          </div>
        )}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2 className="text-4xl font-bold text-slate-900 mb-4 tracking-tighter uppercase">Prime Opportunities</h2>
            <div className="h-1.5 w-24 bg-royalGreen rounded-full"></div>
          </div>
          <Link to="/listings" className="text-royalGreen font-bold hover:text-green-800 transition-colors flex items-center">
            View All Properties <i className="fa-solid fa-arrow-right ml-2"></i>
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
      <section className="bg-royalGreen py-24 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold mb-6 tracking-tighter uppercase">Built for Generations</h2>
            <p className="text-slate-200 text-lg font-light leading-relaxed">
              At The Dream Homes & Constructions Ltd., we don't just build structures; we build trust through engineering excellence and transparent dealings.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {SERVICES.map(service => (
              <div key={service.id} className="bg-white/5 border border-white/10 p-10 rounded-3xl hover:bg-white/10 transition-colors group">
                <div className="w-16 h-16 bg-royalGold rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <i className={`fa-solid ${service.icon} text-3xl`}></i>
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
        <div className="bg-slate-900 rounded-[3rem] p-12 md:p-20 relative overflow-hidden flex flex-col lg:flex-row items-center gap-16">
            <div className="absolute top-0 right-0 w-64 h-64 bg-royalGreen/20 rounded-full blur-3xl -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-royalGold/20 rounded-full blur-3xl -ml-32 -mb-32"></div>
            
            <div className="flex-1 relative z-10 text-center lg:text-left">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 tracking-tighter uppercase">Start Your Journey Today</h2>
                <p className="text-slate-400 text-lg mb-12 max-w-xl">
                    Whether you're looking for a plot in Purbachal or a luxury apartment in Mirpur DOHS, our experts are ready to guide you. Fill out the form and we'll reach out within 24 hours.
                </p>
                <div className="flex flex-col sm:flex-row items-center lg:justify-start justify-center gap-6">
                    <a href="tel:+8801708364030" className="bg-white text-royalGreen px-10 py-4 rounded-xl font-bold text-lg hover:bg-slate-100 transition-colors flex items-center">
                        <i className="fa-solid fa-phone mr-3"></i> Call +8801708364030
                    </a>
                </div>
            </div>

            <div className="flex-1 w-full max-w-lg bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10 relative z-10">
              <form onSubmit={handleLeadSubmit} className="space-y-4">
                <input 
                  required
                  type="text" 
                  placeholder="Your Name" 
                  value={leadForm.name}
                  onChange={e => setLeadForm({...leadForm, name: e.target.value})}
                  className="w-full bg-white/10 border-white/20 text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-royalGold" 
                />
                <input 
                  required
                  type="email" 
                  placeholder="Your Email" 
                  value={leadForm.email}
                  onChange={e => setLeadForm({...leadForm, email: e.target.value})}
                  className="w-full bg-white/10 border-white/20 text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-royalGold" 
                />
                <textarea 
                  required
                  placeholder="Tell us about your requirements..." 
                  rows={4}
                  value={leadForm.message}
                  onChange={e => setLeadForm({...leadForm, message: e.target.value})}
                  className="w-full bg-white/10 border-white/20 text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-royalGold"
                ></textarea>
                <button 
                  disabled={formStatus === 'sending'}
                  className="w-full bg-royalGold text-white font-bold py-4 rounded-xl hover:bg-amber-600 transition-all shadow-lg disabled:opacity-50"
                >
                  {formStatus === 'sending' ? 'Sending...' : formStatus === 'success' ? 'Message Sent!' : formStatus === 'error' ? 'Failed to Send' : 'Request Consultation'}
                </button>
              </form>
            </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
