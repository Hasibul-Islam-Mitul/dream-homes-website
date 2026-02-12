
import React, { useState, useEffect } from 'react';
import { db, storage, auth } from '../firebase';
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
    status: 'For Sale', type: 'Residential', beds: '', baths: '', sqft: '', features: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
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
      let imageUrl = formData['image'] || 'https://picsum.photos/800/600';
      if (imageFile) {
        // Upload to listings/ folder as requested
        const storageRef = storage.ref(`listings/${Date.now()}_${imageFile.name}`);
        await storageRef.put(imageFile);
        imageUrl = await storageRef.getDownloadURL();
      }

      const projectData = {
        ...formData,
        beds: formData.beds ? parseInt(formData.beds) : null,
        baths: formData.baths ? parseInt(formData.baths) : null,
        sqft: formData.sqft ? parseInt(formData.sqft) : 0,
        image: imageUrl,
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
      setFormData({ title: '', description: '', location: '', priceRange: '', status: 'For Sale', type: 'Residential', beds: '', baths: '', sqft: '', features: '' });
      setImageFile(null);
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
      features: project.features || ''
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
          <p className="text-slate-500 font-medium">Administrator Dashboard</p>
        </div>
        <div className="flex space-x-4">
          <button 
            onClick={() => { setActiveTab('projects'); setIsAdding(false); }}
            className={`px-6 py-2 rounded-full font-bold text-sm ${activeTab === 'projects' ? 'bg-royalGreen text-white' : 'bg-slate-100 text-slate-600'}`}
          >
            Projects
          </button>
          <button 
            onClick={() => { setActiveTab('leads'); setIsAdding(false); }}
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
            <h2 className="text-xl font-bold text-slate-900">{editingId ? 'Edit Project' : 'Project Management'}</h2>
            <button 
              onClick={() => {
                setIsAdding(!isAdding);
                if (isAdding) setEditingId(null);
                if (!isAdding) setFormData({ title: '', description: '', location: '', priceRange: '', status: 'For Sale', type: 'Residential', beds: '', baths: '', sqft: '', features: '' });
              }}
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
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Beds</label>
                  <input type="number" value={formData.beds} onChange={e => setFormData({...formData, beds: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Baths</label>
                  <input type="number" value={formData.baths} onChange={e => setFormData({...formData, baths: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Sqft</label>
                  <input type="number" value={formData.sqft} onChange={e => setFormData({...formData, sqft: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Features (comma separated)</label>
                <input type="text" value={formData.features} onChange={e => setFormData({...formData, features: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none" placeholder="e.g. Garden, Pool, 24/7 Security" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Image/PDF Upload</label>
                <input type="file" onChange={e => setImageFile(e.target.files?.[0] || null)} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-royalGreen file:text-white hover:file:bg-green-800" />
              </div>
              <div className="flex items-end">
                <button type="submit" disabled={loading} className="w-full bg-royalGreen text-white font-bold py-3 rounded-xl hover:bg-green-800 transition-all disabled:opacity-50">
                  {loading ? 'Saving...' : editingId ? 'Update Project' : 'Save Project'}
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
                      <button onClick={() => handleEdit(p)} className="text-royalGold hover:text-royalGreen font-bold text-xs">
                        <i className="fa-solid fa-pen-to-square mr-1"></i> Edit
                      </button>
                      <button onClick={() => handleToggleStatus(p.id, p.status)} className="text-royalGreen font-bold text-xs hover:underline">
                        Toggle Status
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
