
import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import firebase from 'firebase/compat/app';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<'projects' | 'leads'>('projects');
  const [projects, setProjects] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '', description: '', location: '', priceRange: '', 
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
        title: '', description: '', location: '', priceRange: '', 
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
      location: project.location || '',
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

  const handleToggleStatus = async (projectId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'Sold' ? 'For Sale' : 'Sold';
    await db.collection("projects").doc(projectId).update({ status: nextStatus });
    fetchData();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-royalGreen uppercase tracking-tighter">THE DREAM HOMES & CONSTRUCTIONS LTD.</h1>
          <p className="text-slate-500 font-medium tracking-widest text-xs">ADMINISTRATOR DASHBOARD</p>
        </div>
        <div className="flex space-x-4">
          <button 
            onClick={() => { setActiveTab('projects'); setIsAdding(false); }}
            className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${activeTab === 'projects' ? 'bg-royalGreen text-white shadow-lg' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            Manage Properties
          </button>
          <button 
            onClick={() => { setActiveTab('leads'); setIsAdding(false); }}
            className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${activeTab === 'leads' ? 'bg-royalGreen text-white shadow-lg' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            Leads & Inquiries
          </button>
          <button onClick={handleLogout} className="text-red-600 font-bold hover:text-red-800 transition-colors px-4 py-2">
            <i className="fa-solid fa-right-from-bracket mr-2"></i> Logout
          </button>
        </div>
      </div>

      {activeTab === 'projects' && (
        <div className="space-y-8 animate-fade-in">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-900">{editingId ? 'Edit Property' : 'Property Inventory'}</h2>
            <button 
              onClick={() => {
                setIsAdding(!isAdding);
                if (isAdding) setEditingId(null);
                if (!isAdding) setFormData({ 
                  title: '', description: '', location: '', priceRange: '', 
                  status: 'For Sale', type: 'Residential', beds: '', baths: '', 
                  sqft: '', features: '', image: '', brochure: '' 
                });
              }}
              className="bg-royalGold text-white px-6 py-2 rounded-xl font-bold hover:bg-amber-600 transition-all flex items-center shadow-md"
            >
              <i className={`fa-solid ${isAdding ? 'fa-minus' : 'fa-plus'} mr-2`}></i> 
              {isAdding ? 'Cancel' : 'Add New Property'}
            </button>
          </div>

          {isAdding && (
            <form onSubmit={handleProjectSubmit} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-top-4 duration-300">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">Property Title</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-royalGreen" placeholder="e.g. Modern Villa at Purbachal" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">Detailed Description</label>
                <textarea required rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-royalGreen" placeholder="Describe the property's unique selling points..." />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Location</label>
                <input required type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-royalGreen" placeholder="e.g. Purbachal 300ft Road" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Price Range (BDT)</label>
                <input required type="text" value={formData.priceRange} onChange={e => setFormData({...formData, priceRange: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-royalGreen" placeholder="e.g. ৳ 80 Lac - 1.2 Cr" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Main Image URL</label>
                <input required type="url" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-royalGreen" placeholder="https://example.com/image.jpg" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Brochure/PDF URL</label>
                <input type="url" value={formData.brochure} onChange={e => setFormData({...formData, brochure: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-royalGreen" placeholder="https://example.com/brochure.pdf" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Listing Status</label>
                <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-royalGreen">
                  <option value="For Sale">For Sale</option>
                  <option value="For Rent">For Rent</option>
                  <option value="Constructing">Constructing</option>
                  <option value="Sold">Sold</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Property Type</label>
                <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as any})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-royalGreen">
                  <option value="Residential">Residential</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Land">Land</option>
                </select>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Bedrooms</label>
                  <input type="number" value={formData.beds} onChange={e => setFormData({...formData, beds: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Bathrooms</label>
                  <input type="number" value={formData.baths} onChange={e => setFormData({...formData, baths: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Total Sqft</label>
                  <input type="number" value={formData.sqft} onChange={e => setFormData({...formData, sqft: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Features (comma separated)</label>
                <input type="text" value={formData.features} onChange={e => setFormData({...formData, features: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none" placeholder="e.g. Garden, Pool, 24/7 Security" />
              </div>
              <div className="md:col-span-2 pt-4">
                <button type="submit" disabled={loading} className="w-full bg-royalGreen text-white font-bold py-4 rounded-xl hover:bg-green-800 transition-all shadow-lg disabled:opacity-50">
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <i className="fa-solid fa-spinner fa-spin mr-2"></i> Saving...
                    </span>
                  ) : editingId ? 'Update Property Details' : 'Publish Property Listing'}
                </button>
              </div>
            </form>
          )}

          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-widest border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4">Property</th>
                    <th className="px-6 py-4">Location</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {projects.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <img src={p.image || 'https://via.placeholder.com/40'} className="w-12 h-12 rounded-lg object-cover border border-slate-200" />
                          <div>
                            <div className="font-bold text-slate-900">{p.title}</div>
                            <div className="text-[10px] text-royalGold font-bold uppercase tracking-wider">{p.type}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{p.location}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 text-[10px] font-bold rounded-full ${
                          p.status === 'Sold' ? 'bg-red-100 text-red-700' : 
                          p.status === 'Constructing' ? 'bg-amber-100 text-amber-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button onClick={() => handleEdit(p)} className="p-2 text-royalGreen hover:bg-green-50 rounded-lg transition-colors" title="Edit">
                          <i className="fa-solid fa-pen-to-square"></i>
                        </button>
                        <button onClick={() => handleToggleStatus(p.id, p.status)} className="p-2 text-royalGold hover:bg-amber-50 rounded-lg transition-colors" title="Toggle Status">
                          <i className="fa-solid fa-arrows-rotate"></i>
                        </button>
                        <button onClick={() => handleDelete(p.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                  {projects.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-20 text-center text-slate-400">
                        No properties in inventory. Click 'Add New Property' to start.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'leads' && (
        <div className="space-y-8 animate-fade-in">
          <h2 className="text-xl font-bold text-slate-900">Incoming Leads & Inquiries</h2>
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-widest border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4">Client Name</th>
                    <th className="px-6 py-4">Contact Info</th>
                    <th className="px-6 py-4">Message</th>
                    <th className="px-6 py-4">Date Received</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {leads.map(l => (
                    <tr key={l.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900">{l.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-slate-600 font-medium">{l.email}</div>
                        {l.phone && <div className="text-xs text-slate-400">{l.phone}</div>}
                      </td>
                      <td className="px-6 py-4 text-slate-500 italic max-w-sm">"{l.message}"</td>
                      <td className="px-6 py-4 text-slate-400 text-xs">
                        {l.timestamp?.toDate ? l.timestamp.toDate().toLocaleString() : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {leads.length === 0 && <div className="p-20 text-center text-slate-400 font-medium">Your inquiry list is currently empty.</div>}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
