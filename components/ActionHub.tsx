
import React from 'react';
import { SITE_CONFIG } from '../siteConfig';

const ActionHub: React.FC = () => {
  const mailtoLink = `mailto:${SITE_CONFIG.email}?subject=Inquiry from ${SITE_CONFIG.name}`;
  const phoneLink = `tel:${SITE_CONFIG.phone.replace(/\s+/g, '')}`;

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col space-y-4">
      {/* WhatsApp Button */}
      <a 
        href={SITE_CONFIG.socials.whatsapp} 
        target="_blank" 
        rel="noopener noreferrer"
        className="w-14 h-14 bg-[#25D366] text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 hover:-rotate-12 transition-all group relative"
        title="WhatsApp Us"
      >
        <i className="fa-brands fa-whatsapp text-2xl"></i>
        <span className="absolute right-16 bg-white text-[#25D366] text-[10px] px-3 py-1 rounded-full shadow-sm border border-green-100 font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap uppercase tracking-widest">
          Chat on WhatsApp
        </span>
      </a>

      {/* Phone Button */}
      <a 
        href={phoneLink}
        className="w-14 h-14 bg-royalGreen text-royalGold rounded-full shadow-2xl flex items-center justify-center hover:scale-110 hover:rotate-12 transition-all group relative"
        title="Call Us"
      >
        <i className="fa-solid fa-phone text-xl"></i>
        <span className="absolute right-16 bg-white text-royalGreen text-[10px] px-3 py-1 rounded-full shadow-sm border border-slate-100 font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap uppercase tracking-widest">
          Call Directly
        </span>
      </a>

      {/* Mail Button */}
      <a 
        href={mailtoLink}
        className="w-14 h-14 bg-white text-royalGreen border border-slate-100 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all group relative"
        title="Email Us"
      >
        <i className="fa-solid fa-envelope text-xl text-royalGold"></i>
        <span className="absolute right-16 bg-white text-slate-700 text-[10px] px-3 py-1 rounded-full shadow-sm border border-slate-100 font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap uppercase tracking-widest">
          Send Inquiry
        </span>
      </a>
    </div>
  );
};

export default ActionHub;
