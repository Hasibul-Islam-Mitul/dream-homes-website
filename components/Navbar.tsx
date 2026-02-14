
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SITE_CONFIG } from '../siteConfig';

interface NavbarProps {
  user?: any;
}

const Navbar: React.FC<NavbarProps> = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const isHomePage = location.pathname === '/';
  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isTransparent = isHomePage && !isScrolled;

  const NavLink = ({ to, children, active }: { to: string, children?: React.ReactNode, active?: boolean }) => (
    <Link 
      to={to} 
      className={`
        ${active 
          ? (isTransparent ? 'text-white border-b-2 border-white' : 'text-royalGreen border-b-2 border-royalGreen') 
          : (isTransparent ? 'text-white/80 hover:text-white' : 'text-slate-600 hover:text-royalGreen')
        } 
        font-bold transition-all px-2 py-1 text-[11px] uppercase tracking-wider whitespace-nowrap
      `}
    >
      {children}
    </Link>
  );

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${isTransparent ? 'bg-transparent py-4' : 'bg-white shadow-md border-b border-slate-200 py-2'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center group">
              {/* Glassmorphism Logo Box */}
              <div className={`p-2 rounded-2xl backdrop-blur-md transition-all duration-500 ${isTransparent ? 'bg-white/10 border border-white/20' : 'bg-royalGreen/5 border border-royalGreen/10'}`}>
                <img src={SITE_CONFIG.logo} alt="Logo" className="h-14 md:h-16 w-auto object-contain" />
              </div>
              <div className="flex flex-col ml-4">
                <span className={`text-base sm:text-lg font-bold tracking-tight leading-none uppercase transition-colors duration-500 ${isTransparent ? 'text-white' : 'text-royalGreen'}`}>
                  {SITE_CONFIG.name}
                </span>
                <div className="flex justify-between w-full mt-1 px-[1px]">
                   {SITE_CONFIG.tagline.split("").map((char, i) => (
                     <span key={i} className={`text-[9px] md:text-[10px] font-bold uppercase leading-tight tracking-tighter transition-colors duration-500 ${isTransparent ? 'text-white/70' : 'text-royalGold'}`}>
                       {char === " " ? "\u00A0" : char}
                     </span>
                   ))}
                </div>
              </div>
            </Link>
          </div>
          
          <div className="hidden lg:flex items-center space-x-5">
            <NavLink to="/" active={isActive('/')}>Home</NavLink>
            <NavLink to="/listings" active={isActive('/listings')}>Projects</NavLink>
            <NavLink to="/services" active={isActive('/services')}>Services</NavLink>
            <NavLink to="/activities" active={isActive('/activities')}>Activities</NavLink>
            <NavLink to="/contact" active={isActive('/contact')}>Contact Us</NavLink>
            
            <div className={`h-6 w-[1px] mx-2 ${isTransparent ? 'bg-white/20' : 'bg-slate-200'}`}></div>

            {user ? (
              <Link to="/admin" className="bg-royalGold text-white px-5 py-2 rounded-lg hover:bg-amber-600 transition-all font-bold text-[10px] uppercase tracking-widest shadow-sm">
                Dashboard
              </Link>
            ) : (
              <Link to="/login" className={`font-bold text-[10px] uppercase tracking-widest flex items-center transition-colors duration-500 ${isTransparent ? 'text-white hover:text-white/80' : 'text-royalGreen hover:text-green-800'}`}>
                <i className="fa-solid fa-user-lock mr-2"></i> Login
              </Link>
            )}
          </div>
          
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`inline-flex items-center justify-center p-2 rounded-md transition-colors duration-500 ${isTransparent ? 'text-white' : 'text-slate-400 hover:text-royalGreen'}`}
            >
              <i className={`fa-solid ${isOpen ? 'fa-xmark' : 'fa-bars'} text-xl`}></i>
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="lg:hidden bg-white border-t border-slate-100 shadow-xl overflow-hidden animate-in slide-in-from-top-4 duration-300">
          <div className="px-4 pt-2 pb-6 space-y-1">
            <Link to="/" onClick={() => setIsOpen(false)} className={`block px-3 py-3 text-sm font-bold rounded-lg ${isActive('/') ? 'bg-royalGreen text-white' : 'text-slate-700'}`}>Home</Link>
            <Link to="/listings" onClick={() => setIsOpen(false)} className={`block px-3 py-3 text-sm font-bold rounded-lg ${isActive('/listings') ? 'bg-royalGreen text-white' : 'text-slate-700'}`}>Projects</Link>
            <Link to="/services" onClick={() => setIsOpen(false)} className={`block px-3 py-3 text-sm font-bold rounded-lg ${isActive('/services') ? 'bg-royalGreen text-white' : 'text-slate-700'}`}>Services</Link>
            <Link to="/activities" onClick={() => setIsOpen(false)} className={`block px-3 py-3 text-sm font-bold rounded-lg ${isActive('/activities') ? 'bg-royalGreen text-white' : 'text-slate-700'}`}>Activities</Link>
            <Link to="/contact" onClick={() => setIsOpen(false)} className={`block px-3 py-3 text-sm font-bold rounded-lg ${isActive('/contact') ? 'bg-royalGreen text-white' : 'text-slate-700'}`}>Contact Us</Link>
            <div className="pt-2">
              {user ? (
                <Link to="/admin" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-center text-sm font-bold text-white bg-royalGold rounded-lg">Dashboard</Link>
              ) : (
                <Link to="/login" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-center text-sm font-bold text-white bg-royalGreen rounded-lg">Login</Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
