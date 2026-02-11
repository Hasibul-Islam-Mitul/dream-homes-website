
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center group">
              {/* Simplified SVG Logo based on the image */}
              <div className="bg-royalGreen p-2 rounded-lg mr-3 group-hover:bg-green-800 transition-colors">
                 <svg width="32" height="32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M50 5L85 85H15L50 5Z" stroke="white" strokeWidth="4" />
                    <path d="M40 95V45H60V95" stroke="#c49a6c" strokeWidth="4" />
                    <path d="M50 15L60 35L80 35L65 48L70 68L50 55L30 68L35 48L20 35L40 35L50 15Z" fill="white" transform="scale(0.3) translate(110, -10)" />
                 </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-bold tracking-tighter text-royalGreen leading-none uppercase">
                  THE DREAM HOMES & CONSTRUCTIONS LTD.
                </span>
                <span className="text-[10px] font-bold text-royalGold uppercase tracking-[0.3em] leading-tight">
                  DREAM . BUILD . LIVE
                </span>
              </div>
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-slate-600 hover:text-royalGreen font-medium transition-colors">Home</Link>
            <Link to="/listings" className="text-slate-600 hover:text-royalGreen font-medium transition-colors">Listings</Link>
            <Link to="/services" className="text-slate-600 hover:text-royalGreen font-medium transition-colors">Services</Link>
            <Link to="/contact" className="bg-royalGreen text-white px-6 py-2 rounded-full hover:bg-green-800 transition-colors font-medium">Contact Us</Link>
          </div>
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-royalGreen hover:bg-slate-100 focus:outline-none"
            >
              <i className={`fa-solid ${isOpen ? 'fa-xmark' : 'fa-bars'} text-xl`}></i>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 animate-fade-in-down">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium text-slate-700 hover:text-royalGreen hover:bg-slate-50">Home</Link>
            <Link to="/listings" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium text-slate-700 hover:text-royalGreen hover:bg-slate-50">Listings</Link>
            <Link to="/services" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium text-slate-700 hover:text-royalGreen hover:bg-slate-50">Services</Link>
            <Link to="/contact" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium text-white bg-royalGreen rounded-md">Contact Us</Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
