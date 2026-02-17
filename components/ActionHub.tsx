
import React, { useState } from 'react';
import { SITE_CONFIG } from '../siteConfig';
import { db } from '../firebase';
import firebase from 'firebase/compat/app';

const ActionHub: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);

  const phoneLink = `tel:${SITE_CONFIG.phone.replace(/\s+/g, '')}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      if (db) {
        await db.collection("leads").add({
          ...formData,
          timestamp: firebase.firestore.Timestamp.now(),
          source: 'Action Hub Mail Modal'
        });
        alert("Your inquiry has been sent successfully!");
        setFormData({ name: '', email: '', subject: '', message: '' });
        setIsModalOpen(false);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to send inquiry. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col space-y-3">
        {/* WhatsApp Button */}
        <a 
          href={SITE_CONFIG.socials.whatsapp} 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-10 h-10 md:w-12 md:h-12 bg-[#25D366] text-white rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition-all"
        >
          <i className="fa-brands fa-whatsapp text-lg md:text-xl"></i>
        </a>

        {/* Phone Button */}
        <a 
          href={phoneLink}
          className="w-10 h-10 md:w-12 md:h-12 bg-royalGreen text-royalGold rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition-all"
        >
          <i className="fa-solid fa-phone text-base md:text-lg"></i>
        </a>

        {/* Mail Button (Modal Trigger) */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-10 h-10 md:w-12 md:h-12 bg-white text-royalGreen border border-slate-100 rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition-all"
        >
          <i className="fa-solid fa-envelope text-base md:text-lg text-royalGold"></i>
        </button>
      </div>

      {/* Pop-up Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden relative">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-royalGreen uppercase tracking-tight">Direct Inquiry</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <i className="fa-solid fa-xmark text-xl"></i>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Name</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-royalGold" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email</label>
                  <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-royalGold" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Subject</label>
                  <input required type="text" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-royalGold" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Message</label>
                  <textarea required rows={3} value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-royalGold resize-none" />
                </div>

                <button 
                  disabled={sending} 
                  className="w-full bg-royalGreen text-white font-bold py-4 rounded-xl uppercase tracking-widest text-[11px] hover:bg-green-800 transition-all shadow-lg flex items-center justify-center"
                >
                  {sending ? <i className="fa-solid fa-spinner fa-spin mr-2"></i> : 'Send Inquiry'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ActionHub;
