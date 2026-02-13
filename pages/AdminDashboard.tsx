
import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import firebase from 'firebase/compat/app';
import { useNavigate } from 'react-router-dom';
import { SITE_CONFIG } from '../siteConfig';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<'projects' | 'leads'>('projects');
  const [projects, setProjects] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '', description: '', location: SITE_CONFIG.areas[0], priceRange: '', 
    status: 'For Sale', type: 'Residential', beds: '', baths: '', sqft: '', features: '',
    image: '', brochure: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'projects') {
        const snapshot = await db.collection("projects").orderBy("createdAt", "desc").get();
        setProjects(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } else {
        const snapshot = await db.collection("leads").orderBy("timestamp", "desc").get();
        setLeads(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/');
  };

  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const projectData = {
        ...formData,
        beds: formData.beds ? parseInt(formData.beds) : null,
        baths: formData.baths ? parseInt(formData.baths) : null,
        sqft: formData.sqft ? parseInt(formData.sqft) : 0,
        updatedAt: firebase.firestore.Timestamp.now()
      };

      if (editingId) {
        await db.collection("projects").doc(editingId).update(projectData);
      } else {
        await db.collection("projects").add({
          ...projectData,
          createdAt: firebase.firestore.Timestamp.now()
        });
      }

      setIsAdding(false);
      setEditingId(null);
      setFormData({ 
        title: '', description: '', location: SITE_CONFIG.areas[0], priceRange: '', 
        status: 'For Sale', type: 'Residential', beds: '', baths: '', 
        sqft: '', features: '', image: '', brochure: '' 
      });
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Error saving project.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (projectId: string) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      await db.collection("projects").doc(projectId).delete();
      fetchData();
    }
  };

  const handleEdit = (project: any) => {
    setEditingId(project.id);
    setFormData({
      title: project.title || '',
      description: project.description || '',
      location: project.location || SITE_CONFIG.areas[0],
      priceRange: project.priceRange || '',
      status: project.status || 'For Sale',
      type: project.type || 'Residential',
      beds: project.beds?.toString() || '',
      baths: project.baths?.toString() || '',
      sqft: project.sqft?.toString() || '',
      features: project.features || '',
      image: project.image || '',
      brochure: project.brochure || ''
    });
    setIsAdding(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-royalGreen uppercase tracking-tighter">{SITE_CONFIG.name}</h1>
          <p className="text-slate-500 font-medium tracking-widest text-xs">OFFICIAL INVENTORY CONTROL</p>
        </div>
        <div className="flex space-x-4">
          <button 
            onClick={() => { setActiveTab('projects'); setIsAdding(false); }}
            className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${activeTab === 'projects' ? 'bg-royalGreen text-white shadow-lg' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            Inventory
          </button>
          <button 
            onClick={() => { setActiveTab('leads'); setIsAdding(false); }}
            className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${activeTab === 'leads' ? 'bg-royalGreen text-white shadow-lg' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            Inquiries
          </button>
          <button onClick={handleLogout} className="text-red-600 font-bold hover:text-red-800 transition-colors px-4 py-2">
            <i className="fa-solid fa-right-from-bracket mr-2"></i> Logout
          </button>
        </div>
      </div>

      {activeTab === 'projects' && (
        <div className="space-y-8 animate-fade-in">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-900">{editingId ? 'Modify Record' : 'Add Property'}</h2>
            <button 
              onClick={() => {
                setIsAdding(!isAdding);
                if (isAdding) setEditingId(null);
                if (!isAdding) setFormData({ 
                  title: '', description: '', location: SITE_CONFIG.areas[0], priceRange: '', 
                  status: 'For Sale', type: 'Residential', beds: '', baths: '', 
                  sqft: '', features: '', image: '', brochure: '' 
                });
              }}
              className="bg-royalGold text-white px-6 py-2 rounded-xl font-bold hover:bg-amber-600 transition-all flex items-center shadow-md"
            >
              <i className={`fa-solid ${isAdding ? 'fa-minus' : 'fa-plus'} mr-2`}></i> 
              {isAdding ? 'Discard' : 'New Listing'}
            </button>
          </div>

          {isAdding && (
            <form onSubmit={handleProjectSubmit} className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-2xl grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-top-4">
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-bold text-royalGold uppercase tracking-widest ml-2">Public Title</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-royalGreen" placeholder="e.g. Signature Villa in Cantonment" />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-bold text-royalGold uppercase tracking-widest ml-2">Description</label>
                <textarea required rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-royalGreen" placeholder="Full details..." />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-royalGold uppercase tracking-widest ml-2">Strategic Area</label>
                <select value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-royalGreen">
                   {SITE_CONFIG.areas.map(area => <option key={area} value={area}>{area}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-royalGold uppercase tracking-widest ml-2">Display Price (String)</label>
                <input required type="text" value={formData.priceRange} onChange={e => setFormData({...formData, priceRange: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-royalGreen" placeholder="e.g. 75 Lac or 1.2 Crore" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-royalGold uppercase tracking-widest ml-2">Cover Image URL</label>
                <input required type="url" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-royalGreen" placeholder="https://..." />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-royalGold uppercase tracking-widest ml-2">Property Type</label>
                <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as any})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-royalGreen">
                  <option value="Residential">Residential</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Land">Land</option>
                </select>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Beds</label>
                  <input type="number" value={formData.beds} onChange={e => setFormData({...formData, beds: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Baths</label>
                  <input type="number" value={formData.baths} onChange={e => setFormData({...formData, baths: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Sqft</label>
                  <input type="number" value={formData.sqft} onChange={e => setFormData({...formData, sqft: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none" />
                </div>
              </div>
              <div className="flex items-end">
                <button type="submit" disabled={loading} className="w-full bg-royalGreen text-white font-bold py-5 rounded-2xl hover:bg-green-800 transition-all shadow-xl disabled:opacity-50">
                  {loading ? 'Processing...' : editingId ? 'Update Listing' : 'Publish to Website'}
                </button>
              </div>
            </form>
          )}

          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-widest border-b border-slate-100">
                <tr>
                  <th className="px-8 py-6">Project Title</th>
                  <th className="px-8 py-6">Area</th>
                  <th className="px-8 py-6">Price String</th>
                  <th className="px-8 py-6 text-right">Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {projects.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-8 py-6 font-bold text-slate-900">{p.title}</td>
                    <td className="px-8 py-6 text-sm text-slate-500">{p.location}</td>
                    <td className="px-8 py-6 text-sm font-medium text-royalGreen">{p.priceRange}</td>
                    <td className="px-8 py-6 text-right space-x-3">
                      <button onClick={() => handleEdit(p)} className="text-royalGold font-bold text-xs">Edit</button>
                      <button onClick={() => handleDelete(p.id)} className="text-red-400 text-xs">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'leads' && (
        <div className="space-y-8 animate-fade-in">
          <h2 className="text-xl font-bold text-slate-900">Incoming Leads</h2>
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
             {/* Inquiry table as before */}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
