
import React, { useState } from 'react';
import { auth } from '../firebase';
// Added Link to imports from react-router-dom
import { useNavigate, Link } from 'react-router-dom';
import { SITE_CONFIG } from '../siteConfig';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) {
      setError('Authentication service is not configured. Please check your Firebase settings.');
      return;
    }
    
    setLoading(true);
    setError('');
    try {
      await auth.signInWithEmailAndPassword(email, password);
      // Success redirects to the dashboard
      navigate('/admin');
    } catch (err: any) {
      setError('Invalid email or password. Only authorized agents can access this area.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 bg-slate-50">
      <div className="bg-white p-10 rounded-3xl shadow-2xl border border-slate-100 w-full max-w-md relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-royalGreen"></div>
        <div className="text-center mb-8">
          <h2 className="text-xl font-bold text-royalGreen uppercase tracking-tighter">{SITE_CONFIG.name}</h2>
          <p className="text-royalGold text-[10px] font-bold tracking-[0.3em] mt-2">AGENT SECURE ACCESS</p>
        </div>
        
        {!auth && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs font-medium">
            <i className="fa-solid fa-triangle-exclamation mr-2"></i>
            System configuration missing. Please update your environment variables.
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-widest">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-royalGreen text-sm"
              placeholder="agent@dreamhomes.com.bd"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-widest">Access Key</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-royalGreen text-sm"
              placeholder="••••••••"
            />
          </div>
          
          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-xs font-bold rounded-lg border border-red-100 flex items-center animate-in fade-in slide-in-from-top-2">
              <i className="fa-solid fa-circle-exclamation mr-2"></i>
              {error}
            </div>
          )}

          <button 
            disabled={loading || !auth}
            className="w-full bg-royalGreen text-white font-bold py-4 rounded-xl hover:bg-green-800 transition-all shadow-xl disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? (
              <><i className="fa-solid fa-spinner fa-spin mr-2"></i> Authenticating...</>
            ) : 'Enter Dashboard'}
          </button>
        </form>
        
        <div className="mt-8 text-center">
          <Link to="/" className="text-slate-400 hover:text-royalGreen text-xs font-bold transition-colors">
            <i className="fa-solid fa-arrow-left mr-2"></i> Return to Main Website
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
