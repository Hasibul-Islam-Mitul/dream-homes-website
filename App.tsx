
import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import ChatAssistant from './components/ChatAssistant';
import Home from './pages/Home';
import Listings from './pages/Listings';
import PropertyDetails from './pages/PropertyDetails';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { auth } from './firebase';

const Footer = () => (
  <footer className="bg-royalGreen text-white/70 py-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        <div className="space-y-6">
          <div className="flex flex-col">
            <span className="text-xl font-serif font-bold tracking-tight text-white uppercase">THE DREAM HOMES & CONSTRUCTIONS LTD.</span>
            <span className="text-[9px] font-bold text-royalGold uppercase tracking-widest">DREAM . BUILD . LIVE</span>
          </div>
          <p className="text-sm leading-relaxed">
            Dhaka's premier partner for high-end real estate and modern construction solutions. Precision, integrity, and architectural brilliance.
          </p>
          <div className="flex space-x-4">
            {['facebook', 'instagram', 'linkedin', 'whatsapp'].map(social => (
              <a key={social} href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-royalGold hover:border-royalGold transition-all">
                <i className={`fa-brands fa-${social === 'whatsapp' ? 'whatsapp' : social}`}></i>
              </a>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="text-white font-bold mb-6">Key Locations</h4>
          <ul className="space-y-4 text-sm">
            <li><a href="#" className="hover:text-royalGold transition-colors">Purbachal 300 ft</a></li>
            <li><a href="#" className="hover:text-royalGold transition-colors">Mirpur DOHS</a></li>
            <li><a href="#" className="hover:text-royalGold transition-colors">Trust Green City</a></li>
            <li><a href="#" className="hover:text-royalGold transition-colors">Shagupta</a></li>
          </ul>
        </div>
        
        <div>
          <h4 className="text-white font-bold mb-6">Company</h4>
          <ul className="space-y-4 text-sm">
            <li><a href="#" className="hover:text-royalGold transition-colors">Our Legacy</a></li>
            <li><a href="#" className="hover:text-royalGold transition-colors">Construction Portfolio</a></li>
            <li><a href="#" className="hover:text-royalGold transition-colors">Terms of Service</a></li>
            <li><Link to="/login" className="hover:text-royalGold transition-colors">Agent Portal</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="text-white font-bold mb-6">Contact Details</h4>
          <ul className="space-y-4 text-sm">
            <li className="flex items-start"><i className="fa-solid fa-location-dot mr-3 mt-1 text-royalGold"></i> ECB Chattor, Dhaka Cantonment, Dhaka-1206</li>
            <li className="flex items-center"><i className="fa-solid fa-phone mr-3 text-royalGold"></i> +8801708364030</li>
            <li className="flex items-center"><i className="fa-solid fa-envelope mr-3 text-royalGold"></i> contact@dreamhomes.com.bd</li>
          </ul>
        </div>
      </div>
      
      <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-[10px] tracking-widest uppercase text-white/40">
        <p>&copy; 2024 The Dream Homes & Constructions Ltd. All Rights Reserved.</p>
        <p className="mt-4 md:mt-0">Dhaka . Purbachal . Mirpur</p>
      </div>
    </div>
  </footer>
);

const App = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (auth) {
      const unsubscribe = auth.onAuthStateChanged((u: any) => setUser(u));
      return () => unsubscribe();
    }
  }, []);

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar user={user} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/listings" element={<Listings />} />
            <Route path="/property/:id" element={<PropertyDetails />} />
            <Route path="/login" element={<AdminLogin />} />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route path="/services" element={<div className="py-24 text-center"><h1 className="text-4xl font-bold uppercase text-royalGreen">Services Section Coming Soon</h1></div>} />
            <Route path="/contact" element={<div className="py-24 text-center"><h1 className="text-4xl font-bold uppercase text-royalGreen">Contact Section Coming Soon</h1></div>} />
          </Routes>
        </main>
        <Footer />
        <ChatAssistant />
      </div>
    </Router>
  );
};

export default App;
