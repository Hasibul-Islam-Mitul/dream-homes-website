
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SITE_CONFIG } from '../siteConfig';

interface NavbarProps {
  user?: any;
}

const Navbar: React.FC<NavbarProps> = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const NavLink = ({ to, children, active }: { to: string, children: React.ReactNode, active?: boolean }) => (
    <Link 
      to={to} 
      className={`${active ? 'text-royalGreen border-b-2 border-royalGreen' : 'text-slate-600 hover:text-royalGreen'} font-bold transition-all px-2 py-1 text-xs uppercase tracking-tighter whitespace-nowrap`}
    >
      {children}
    </Link>
  );

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center group">
              <div className="w-12 h-12 bg-royalGreen rounded-lg mr-3 group-hover:bg-green-800 transition-colors shadow-lg shadow-green-900/20 overflow-hidden flex items-center justify-center">
                 {SITE_CONFIG.logo ? (
                   <img src={SITE_CONFIG.logo} alt="Logo" className="w-full h-full object-cover" />
                 ) : (
                   <svg width="32" height="32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M50 5L85 85H15L50 5Z" stroke="white" strokeWidth="4" />
                      <path d="M40 95V45H60V95" stroke="#c49a6c" strokeWidth="4" />
                   </svg>
                 )}
              </div>
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-bold tracking-tighter text-royalGreen leading-none uppercase">
                  {SITE_CONFIG.name}
                </span>
                <span className="text-[10px] font-bold text-royalGold uppercase tracking-[0.3em] leading-tight mt-1">
                  {SITE_CONFIG.tagline}
                </span>
              </div>
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <NavLink to="/" active={isActive('/')}>Home</NavLink>
            <NavLink to="/listings" active={isActive('/listings')}>Projects</NavLink>
            <NavLink to="/services" active={isActive('/services')}>Services</NavLink>
            <NavLink to="/contact" active={isActive('/contact')}>Contact Us</NavLink>
            
            <div className="h-6 w-[1px] bg-slate-200"></div>

            {user ? (
              <Link to="/admin" className="bg-royalGold text-white px-6 py-2 rounded-xl hover:bg-amber-600 transition-all font-bold text-xs uppercase tracking-widest shadow-md">
                Dashboard
              </Link>
            ) : (
              <Link to="/login" className="text-royalGreen hover:text-green-800 font-bold text-xs uppercase tracking-widest flex items-center">
                <i className="fa-solid fa-user-lock mr-2"></i> Login
              </Link>
            )}
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
        <div className="md:hidden bg-white border-t border-slate-100 animate-in slide-in-from-top-4 duration-300 shadow-xl">
          <div className="px-4 pt-4 pb-6 space-y-2">
            <Link to="/" onClick={() => setIsOpen(false)} className={`block px-3 py-3 text-base font-bold rounded-xl ${isActive('/') ? 'bg-royalGreen text-white' : 'text-slate-700'}`}>Home</Link>
            <Link to="/listings" onClick={() => setIsOpen(false)} className={`block px-3 py-3 text-base font-bold rounded-xl ${isActive('/listings') ? 'bg-royalGreen text-white' : 'text-slate-700'}`}>Projects</Link>
            <Link to="/services" onClick={() => setIsOpen(false)} className={`block px-3 py-3 text-base font-bold rounded-xl ${isActive('/services') ? 'bg-royalGreen text-white' : 'text-slate-700'}`}>Services</Link>
            <Link to="/contact" onClick={() => setIsOpen(false)} className={`block px-3 py-3 text-base font-bold rounded-xl ${isActive('/contact') ? 'bg-royalGreen text-white' : 'text-slate-700'}`}>Contact Us</Link>
            <div className="pt-2">
              {user ? (
                <Link to="/admin" onClick={() => setIsOpen(false)} className="block px-4 py-4 text-center text-base font-bold text-white bg-royalGold rounded-xl">Dashboard</Link>
              ) : (
                <Link to="/login" onClick={() => setIsOpen(false)} className="block px-4 py-4 text-center text-base font-bold text-white bg-royalGreen rounded-xl shadow-lg">Agent Login</Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
