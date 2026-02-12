
import React, { useState } from 'react';
import { db, isFirebaseConfigured } from '../firebase';
import firebase from 'firebase/compat/app';
import { SITE_CONFIG } from '../siteConfig';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFirebaseConfigured || !db) {
      alert(`System is in demo mode. Please contact us directly at ${SITE_CONFIG.phone}.`);
      return;
    }

    setStatus('sending');
    try {
      await db.collection("leads").add({
        ...formData,
        timestamp: firebase.firestore.Timestamp.now()
      });
      setStatus('success');
      setFormData({ name: '', email: '', phone: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <div className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          
          {/* Info Side */}
          <div className="space-y-12">
            <div>
              <h1 className="text-5xl md:text-7xl font-bold text-royalGreen uppercase tracking-tighter mb-6">Get In Touch</h1>
              <p className="text-slate-500 text-xl font-light leading-relaxed">
                Connect with Dhaka's most trusted real estate experts. Visit our Banani office or request a callback for site visits in Purbachal and Dhaka DOHS areas.
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex items-start group">
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mr-6 group-hover:bg-royalGreen group-hover:text-white transition-all shadow-sm">
                  <i className="fa-solid fa-location-dot"></i>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1 uppercase tracking-widest text-sm">Main Office</h4>
                  <p className="text-slate-500">{SITE_CONFIG.address}</p>
                </div>
              </div>

              <div className="flex items-start group">
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mr-6 group-hover:bg-royalGreen group-hover:text-white transition-all shadow-sm">
                  <i className="fa-solid fa-phone"></i>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1 uppercase tracking-widest text-sm">Direct Hotline</h4>
                  <p className="text-slate-500">{SITE_CONFIG.phone}</p>
                  <p className="text-royalGold text-xs font-bold mt-1 uppercase tracking-tighter">Available 9:00 AM - 9:00 PM</p>
                </div>
              </div>

              <div className="flex items-start group">
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mr-6 group-hover:bg-royalGreen group-hover:text-white transition-all shadow-sm">
                  <i className="fa-solid fa-envelope"></i>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1 uppercase tracking-widest text-sm">Email Inquiries</h4>
                  <p className="text-slate-500">{SITE_CONFIG.email}</p>
                  <p className="text-slate-500 text-sm">{SITE_CONFIG.salesEmail}</p>
                </div>
              </div>
            </div>

            {/* Real Map Integration */}
            <div className="h-80 bg-slate-100 rounded-[2.5rem] overflow-hidden shadow-2xl relative border-4 border-white">
              <iframe 
                src={SITE_CONFIG.mapEmbedUrl}
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Office Location"
              ></iframe>
            </div>
          </div>

          {/* Form Side */}
          <div className="bg-white p-8 md:p-12 rounded-[3.5rem] shadow-2xl border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-royalGold/5 rounded-full blur-3xl -mr-24 -mt-24"></div>
            
            <h3 className="text-3xl font-bold text-slate-900 mb-8 tracking-tight uppercase">Request a Callback</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-widest">Full Name</label>
                  <input 
                    required 
                    type="text" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-royalGreen transition-all" 
                    placeholder="Enter your name" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-widest">Phone</label>
                  <input 
                    required 
                    type="tel" 
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-royalGreen transition-all" 
                    placeholder="+88017..." 
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-widest">Email Address</label>
                <input 
                  required 
                  type="email" 
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-royalGreen transition-all" 
                  placeholder="email@example.com" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-widest">Message</label>
                <textarea 
                  required 
                  rows={4} 
                  value={formData.message}
                  onChange={e => setFormData({...formData, message: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-royalGreen transition-all resize-none" 
                  placeholder="Tell us about your property requirements..." 
                />
              </div>

              <button 
                disabled={status === 'sending'}
                className="w-full bg-royalGreen text-white font-bold py-5 rounded-2xl hover:bg-green-800 transition-all shadow-xl disabled:opacity-50 flex items-center justify-center text-lg uppercase tracking-widest"
              >
                {status === 'sending' ? (
                  <><i className="fa-solid fa-spinner fa-spin mr-3"></i> Processing...</>
                ) : status === 'success' ? (
                  <><i className="fa-solid fa-circle-check mr-3"></i> Inquiry Sent</>
                ) : (
                  'Confirm Consultation'
                )}
              </button>
              
              {status === 'error' && (
                <p className="text-red-500 text-center font-bold text-sm">Temporary error. Please call {SITE_CONFIG.phone} instead.</p>
              )}
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;
