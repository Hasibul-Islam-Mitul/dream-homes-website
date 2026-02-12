
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

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
      className={`${active ? 'text-royalGreen border-b-2 border-royalGreen' : 'text-slate-600 hover:text-royalGreen'} font-bold transition-all px-2 py-1 text-sm uppercase tracking-tighter`}
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
              <div className="bg-royalGreen p-2 rounded-lg mr-3 group-hover:bg-green-800 transition-colors shadow-lg shadow-green-900/20">
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
                <span className="text-[10px] font-bold text-royalGold uppercase tracking-[0.3em] leading-tight mt-1">
                  DREAM . BUILD . LIVE
                </span>
              </div>
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <NavLink to="/" active={isActive('/')}>Home</NavLink>
            <NavLink to="/listings" active={isActive('/listings')}>Inventory</NavLink>
            <NavLink to="/services" active={isActive('/services')}>Expertise</NavLink>
            {user && (
              <NavLink to="/admin" active={isActive('/admin')}>Dashboard</NavLink>
            )}
            <Link to="/contact" className="bg-royalGreen text-white px-8 py-3 rounded-xl hover:bg-green-800 transition-all font-bold text-sm uppercase tracking-widest shadow-lg shadow-green-900/20">Contact Us</Link>
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
        <div className="md:hidden bg-white border-t border-slate-100 animate-in slide-in-from-top-4 duration-300">
          <div className="px-4 pt-4 pb-6 space-y-3">
            <Link to="/" onClick={() => setIsOpen(false)} className="block px-3 py-3 text-base font-bold text-slate-700 hover:text-royalGreen hover:bg-slate-50 rounded-xl">Home</Link>
            <Link to="/listings" onClick={() => setIsOpen(false)} className="block px-3 py-3 text-base font-bold text-slate-700 hover:text-royalGreen hover:bg-slate-50 rounded-xl">Inventory</Link>
            <Link to="/services" onClick={() => setIsOpen(false)} className="block px-3 py-3 text-base font-bold text-slate-700 hover:text-royalGreen hover:bg-slate-50 rounded-xl">Expertise</Link>
            {user && (
              <Link to="/admin" onClick={() => setIsOpen(false)} className="block px-3 py-3 text-base font-bold text-royalGold hover:text-royalGreen hover:bg-slate-50 rounded-xl">Dashboard</Link>
            )}
            <Link to="/contact" onClick={() => setIsOpen(false)} className="block px-4 py-4 text-center text-base font-bold text-white bg-royalGreen rounded-xl shadow-lg">Contact Us Now</Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
