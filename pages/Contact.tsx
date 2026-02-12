
import React, { useState } from 'react';
import { db, isFirebaseConfigured } from '../firebase';
import firebase from 'firebase/compat/app';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFirebaseConfigured || !db) {
      alert("System is in demo mode. Please contact us directly at +8801708364030.");
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
                Visit our corporate office at ECB Chattor or reach out through the form. Our sales executives are available 24/7 for site visits in Purbachal and Dhaka DOHS areas.
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex items-start group">
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mr-6 group-hover:bg-royalGreen group-hover:text-white transition-all">
                  <i className="fa-solid fa-location-dot"></i>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1 uppercase tracking-widest text-sm">Head Office</h4>
                  <p className="text-slate-500">ECB Chattor, Dhaka Cantonment, Dhaka-1206, Bangladesh</p>
                </div>
              </div>

              <div className="flex items-start group">
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mr-6 group-hover:bg-royalGreen group-hover:text-white transition-all">
                  <i className="fa-solid fa-phone"></i>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1 uppercase tracking-widest text-sm">Hotline</h4>
                  <p className="text-slate-500">+880 1708 364030</p>
                  <p className="text-royalGold text-xs font-bold mt-1">Available 9:00 AM - 9:00 PM</p>
                </div>
              </div>

              <div className="flex items-start group">
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mr-6 group-hover:bg-royalGreen group-hover:text-white transition-all">
                  <i className="fa-solid fa-envelope"></i>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1 uppercase tracking-widest text-sm">Email Inquiries</h4>
                  <p className="text-slate-500">contact@dreamhomes.com.bd</p>
                  <p className="text-slate-500 text-sm">sales@dreamhomes.com.bd</p>
                </div>
              </div>
            </div>

            {/* Simple Map Placeholder */}
            <div className="h-64 bg-slate-200 rounded-3xl overflow-hidden relative group">
              <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" alt="Dhaka Map" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white px-6 py-3 rounded-xl shadow-2xl flex items-center">
                  <i className="fa-solid fa-location-crosshairs text-royalGreen mr-3"></i>
                  <span className="font-bold text-slate-900">Dhaka Cantonment</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-2xl border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-royalGold/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
            
            <h3 className="text-3xl font-bold text-slate-900 mb-8 tracking-tight uppercase">Request a Callback</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-widest">Your Name</label>
                  <input 
                    required 
                    type="text" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-4 outline-none focus:ring-2 focus:ring-royalGreen" 
                    placeholder="Full Name" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-widest">Phone Number</label>
                  <input 
                    required 
                    type="tel" 
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-4 outline-none focus:ring-2 focus:ring-royalGreen" 
                    placeholder="+8801xxxxxxxxx" 
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
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-4 outline-none focus:ring-2 focus:ring-royalGreen" 
                  placeholder="name@email.com" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-widest">Message / Requirements</label>
                <textarea 
                  required 
                  rows={5} 
                  value={formData.message}
                  onChange={e => setFormData({...formData, message: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-4 outline-none focus:ring-2 focus:ring-royalGreen" 
                  placeholder="I am interested in Purbachal plots..." 
                />
              </div>

              <button 
                disabled={status === 'sending'}
                className="w-full bg-royalGreen text-white font-bold py-5 rounded-2xl hover:bg-green-800 transition-all shadow-xl disabled:opacity-50 flex items-center justify-center text-lg"
              >
                {status === 'sending' ? (
                  <><i className="fa-solid fa-spinner fa-spin mr-3"></i> Sending Inquiry...</>
                ) : status === 'success' ? (
                  <><i className="fa-solid fa-circle-check mr-3"></i> Message Received!</>
                ) : (
                  'Send Message Now'
                )}
              </button>
              
              {status === 'error' && (
                <p className="text-red-500 text-center font-bold">Something went wrong. Please call +8801708364030.</p>
              )}
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;
