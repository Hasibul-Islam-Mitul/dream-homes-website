
import React, { useState, useEffect } from 'react';
import { db, storage, auth } from '../firebase';
import firebase from 'firebase/app';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<'projects' | 'leads'>('projects');
  const [projects, setProjects] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    title: '', description: '', location: '', priceRange: '', 
    status: 'For Sale', type: 'Residential', beds: '', baths: '', sqft: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  // Using compat syntax for queries and fetches
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

  // Using compat syntax: auth.signOut()
  const handleLogout = async () => {
    await auth.signOut();
    navigate('/');
  };

  // Using compat syntax for storage and firestore additions
  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl = 'https://picsum.photos/800/600';
      if (imageFile) {
        const storageRef = storage.ref(`projects/${Date.now()}_${imageFile.name}`);
        await storageRef.put(imageFile);
        imageUrl = await storageRef.getDownloadURL();
      }

      await db.collection("projects").add({
        ...formData,
        image: imageUrl,
        createdAt: firebase.firestore.Timestamp.now()
      });
      setIsAdding(false);
      setFormData({ title: '', description: '', location: '', priceRange: '', status: 'For Sale', type: 'Residential', beds: '', baths: '', sqft: '' });
      setImageFile(null);
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Error adding project.");
    } finally {
      setLoading(false);
    }
  };

  // Using compat syntax for deletion
  const handleDelete = async (projectId: string) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      await db.collection("projects").doc(projectId).delete();
      fetchData();
    }
  };

  // Using compat syntax for updates
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
          <p className="text-slate-500 font-medium">Administrator Dashboard</p>
        </div>
        <div className="flex space-x-4">
          <button 
            onClick={() => setActiveTab('projects')}
            className={`px-6 py-2 rounded-full font-bold text-sm ${activeTab === 'projects' ? 'bg-royalGreen text-white' : 'bg-slate-100 text-slate-600'}`}
          >
            Projects
          </button>
          <button 
            onClick={() => setActiveTab('leads')}
            className={`px-6 py-2 rounded-full font-bold text-sm ${activeTab === 'leads' ? 'bg-royalGreen text-white' : 'bg-slate-100 text-slate-600'}`}
          >
            Leads
          </button>
          <button onClick={handleLogout} className="text-red-600 font-bold hover:text-red-800 transition-colors">
            <i className="fa-solid fa-right-from-bracket mr-2"></i> Logout
          </button>
        </div>
      </div>

      {activeTab === 'projects' && (
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-900">Project Management</h2>
            <button 
              onClick={() => setIsAdding(!isAdding)}
              className="bg-royalGold text-white px-6 py-2 rounded-xl font-bold hover:bg-amber-600 transition-all flex items-center"
            >
              <i className={`fa-solid ${isAdding ? 'fa-minus' : 'fa-plus'} mr-2`}></i> 
              {isAdding ? 'Cancel' : 'Add New Project'}
            </button>
          </div>

          {isAdding && (
            <form onSubmit={handleProjectSubmit} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-lg grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">Project Title</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
                <textarea required rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Location</label>
                <input required type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none" placeholder="e.g. Purbachal 300ft" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Price Range (BDT)</label>
                <input required type="text" value={formData.priceRange} onChange={e => setFormData({...formData, priceRange: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none" placeholder="e.g. ৳ 80 Lac - 1.2 Cr" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Status</label>
                <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none">
                  <option value="For Sale">For Sale</option>
                  <option value="For Rent">For Rent</option>
                  <option value="Constructing">Constructing</option>
                  <option value="Sold">Sold</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Property Type</label>
                <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as any})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none">
                  <option value="Residential">Residential</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Land">Land</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Image/Brochure Upload</label>
                <input type="file" onChange={e => setImageFile(e.target.files?.[0] || null)} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-royalGreen file:text-white hover:file:bg-green-800" />
              </div>
              <div className="flex items-end">
                <button type="submit" disabled={loading} className="w-full bg-royalGreen text-white font-bold py-3 rounded-xl hover:bg-green-800 transition-all disabled:opacity-50">
                  {loading ? 'Adding...' : 'Save Project'}
                </button>
              </div>
            </form>
          )}

          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-widest border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">Project</th>
                  <th className="px-6 py-4">Area</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {projects.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <img src={p.image} className="w-10 h-10 rounded-lg object-cover" />
                        <div>
                          <div className="font-bold text-slate-900">{p.title}</div>
                          <div className="text-xs text-slate-400">{p.type}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{p.location}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-[10px] font-bold rounded-full ${p.status === 'Sold' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <button onClick={() => handleToggleStatus(p.id, p.status)} className="text-royalGreen font-bold text-xs hover:underline">
                        Toggle Sold/Sale
                      </button>
                      <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:text-red-700">
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'leads' && (
        <div className="space-y-8">
          <h2 className="text-xl font-bold text-slate-900">Potential Client Leads</h2>
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-widest border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">Client Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Message</th>
                  <th className="px-6 py-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {leads.map(l => (
                  <tr key={l.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900">{l.name}</td>
                    <td className="px-6 py-4 text-slate-600">{l.email}</td>
                    <td className="px-6 py-4 text-slate-500 truncate max-w-xs">{l.message}</td>
                    <td className="px-6 py-4 text-slate-400">
                      {l.timestamp?.toDate().toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {leads.length === 0 && <div className="p-10 text-center text-slate-400">No leads found yet.</div>}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
