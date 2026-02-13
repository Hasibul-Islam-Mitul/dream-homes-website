
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
      <div className="flex justify-between items-center mb-10 border-b pb-6">
        <div>
          <h1 className="text-xl font-bold text-royalGreen uppercase">{SITE_CONFIG.name}</h1>
          <p className="text-slate-500 text-[10px] font-bold tracking-widest uppercase">Admin Control</p>
        </div>
        <div className="flex items-center space-x-6">
          <button onClick={() => setActiveTab('projects')} className={`text-xs font-bold uppercase tracking-widest ${activeTab === 'projects' ? 'text-royalGreen' : 'text-slate-400'}`}>Inventory</button>
          <button onClick={() => setActiveTab('leads')} className={`text-xs font-bold uppercase tracking-widest ${activeTab === 'leads' ? 'text-royalGreen' : 'text-slate-400'}`}>Leads</button>
          <button onClick={handleLogout} className="text-red-500 text-xs font-bold uppercase tracking-widest border border-red-100 px-4 py-2 rounded-lg">Logout</button>
        </div>
      </div>

      {activeTab === 'projects' && (
        <div className="space-y-8 animate-in fade-in duration-500">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold uppercase">{editingId ? 'Modify Project' : 'Inventory Management'}</h2>
            <button 
              onClick={() => { setIsAdding(!isAdding); if(isAdding) setEditingId(null); }}
              className="bg-royalGreen text-white px-5 py-2 rounded-lg font-bold text-[10px] uppercase tracking-widest"
            >
              {isAdding ? 'Close Form' : 'Add New Project'}
            </button>
          </div>

          {isAdding && (
            <form onSubmit={handleProjectSubmit} className="bg-white p-8 rounded-2xl border border-slate-100 shadow-xl grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Project Title</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-slate-50 border rounded-xl px-4 py-3 outline-none" />
              </div>
              <div className="md:col-span-2 space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Full Description</label>
                <textarea required rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-slate-50 border rounded-xl px-4 py-3 outline-none resize-none" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Strategic Location</label>
                <select value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full bg-slate-50 border rounded-xl px-4 py-3 outline-none">
                   {SITE_CONFIG.areas.map(area => <option key={area} value={area}>{area}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Price String (e.g. 75 Lac)</label>
                <input required type="text" value={formData.priceRange} onChange={e => setFormData({...formData, priceRange: e.target.value})} className="w-full bg-slate-50 border rounded-xl px-4 py-3 outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Image URL</label>
                <input required type="url" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="w-full bg-slate-50 border rounded-xl px-4 py-3 outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Brochure URL (PDF Link)</label>
                <input type="url" value={formData.brochure} onChange={e => setFormData({...formData, brochure: e.target.value})} className="w-full bg-slate-50 border rounded-xl px-4 py-3 outline-none" placeholder="Optional PDF link" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Features (Comma separated)</label>
                <input type="text" value={formData.features} onChange={e => setFormData({...formData, features: e.target.value})} className="w-full bg-slate-50 border rounded-xl px-4 py-3 outline-none" placeholder="Parking, Pool, Security" />
              </div>
              <div className="grid grid-cols-3 gap-3 items-end">
                <div className="space-y-1">
                   <label className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Beds</label>
                   <input type="number" value={formData.beds} onChange={e => setFormData({...formData, beds: e.target.value})} className="w-full bg-slate-50 border rounded-xl px-2 py-3 outline-none" />
                </div>
                <div className="space-y-1">
                   <label className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Baths</label>
                   <input type="number" value={formData.baths} onChange={e => setFormData({...formData, baths: e.target.value})} className="w-full bg-slate-50 border rounded-xl px-2 py-3 outline-none" />
                </div>
                <div className="space-y-1">
                   <label className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Sqft</label>
                   <input type="number" value={formData.sqft} onChange={e => setFormData({...formData, sqft: e.target.value})} className="w-full bg-slate-50 border rounded-xl px-2 py-3 outline-none" />
                </div>
              </div>
              <div className="md:col-span-2">
                <button type="submit" disabled={loading} className="w-full bg-royalGreen text-white font-bold py-4 rounded-xl shadow-lg uppercase tracking-widest text-[11px] hover:bg-green-800 disabled:opacity-50">
                  {loading ? 'Processing...' : editingId ? 'Update project' : 'Add to inventory'}
                </button>
              </div>
            </form>
          )}

          <div className="bg-white rounded-xl border overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="px-6 py-4 font-bold uppercase tracking-widest text-slate-400">Project</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-widest text-slate-400">Location</th>
                  <th className="px-6 py-4 text-right font-bold uppercase tracking-widest text-slate-400">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {projects.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-bold text-slate-700">{p.title}</td>
                    <td className="px-6 py-4 text-slate-500">{p.location}</td>
                    <td className="px-6 py-4 text-right space-x-4 uppercase font-bold text-[10px] tracking-widest">
                      <button onClick={() => handleEdit(p)} className="text-royalGold">Edit</button>
                      <button onClick={() => handleDelete(p.id)} className="text-red-400">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'leads' && (
        <div className="animate-in fade-in duration-500">
           {/* Inquiry handling */}
           <div className="grid grid-cols-1 gap-4">
              {leads.map(lead => (
                <div key={lead.id} className="bg-white p-6 rounded-xl border shadow-sm">
                  <div className="flex justify-between mb-2">
                    <h3 className="font-bold text-slate-700">{lead.name}</h3>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">{new Date(lead.timestamp?.toDate()).toLocaleDateString()}</span>
                  </div>
                  <p className="text-xs text-slate-500 mb-2">{lead.email} | {lead.phone}</p>
                  <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg italic">"{lead.message}"</p>
                </div>
              ))}
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
