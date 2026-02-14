
import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import firebase from 'firebase/compat/app';
import { useNavigate } from 'react-router-dom';
import { SITE_CONFIG } from '../siteConfig';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<'projects' | 'leads' | 'activities'>('projects');
  const [projects, setProjects] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Project Form State
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [projectFormData, setProjectFormData] = useState({
    title: '', description: '', location: SITE_CONFIG.areas[0].name, priceRange: '', 
    status: 'For Sale', type: 'Residential', beds: '', baths: '', sqft: '', features: '',
    image: '', image2: '', image3: '', brochure: ''
  });

  // Activity Form State
  const [isAddingActivity, setIsAddingActivity] = useState(false);
  const [editingActivityId, setEditingActivityId] = useState<string | null>(null);
  const [activityFormData, setActivityFormData] = useState({
    title: '', description: '', imageUrl: '', category: 'Gallery' as 'Gallery' | 'Blog'
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
      } else if (activeTab === 'leads') {
        const snapshot = await db.collection("leads").orderBy("timestamp", "desc").get();
        setLeads(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } else if (activeTab === 'activities') {
        const snapshot = await db.collection("activities").orderBy("createdAt", "desc").get();
        setActivities(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
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

  // --- Project Actions ---
  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = {
        ...projectFormData,
        beds: projectFormData.beds ? parseInt(projectFormData.beds) : null,
        baths: projectFormData.baths ? parseInt(projectFormData.baths) : null,
        sqft: projectFormData.sqft ? parseInt(projectFormData.sqft) : 0,
        updatedAt: firebase.firestore.Timestamp.now()
      };

      if (editingProjectId) {
        await db.collection("projects").doc(editingProjectId).update(data);
      } else {
        await db.collection("projects").add({
          ...data,
          createdAt: firebase.firestore.Timestamp.now()
        });
      }

      setIsAddingProject(false);
      setEditingProjectId(null);
      setProjectFormData({ 
        title: '', description: '', location: SITE_CONFIG.areas[0].name, priceRange: '', 
        status: 'For Sale', type: 'Residential', beds: '', baths: '', 
        sqft: '', features: '', image: '', image2: '', image3: '', brochure: '' 
      });
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Error saving project.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      await db.collection("projects").doc(id).delete();
      fetchData();
    }
  };

  const handleEditProject = (p: any) => {
    setEditingProjectId(p.id);
    setProjectFormData({
      title: p.title || '',
      description: p.description || '',
      location: p.location || SITE_CONFIG.areas[0].name,
      priceRange: p.priceRange || '',
      status: p.status || 'For Sale',
      type: p.type || 'Residential',
      beds: p.beds?.toString() || '',
      baths: p.baths?.toString() || '',
      sqft: p.sqft?.toString() || '',
      features: p.features || '',
      image: p.image || '',
      image2: p.image2 || '',
      image3: p.image3 || '',
      brochure: p.brochure || ''
    });
    setIsAddingProject(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- Activity Actions ---
  const handleActivitySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = {
        ...activityFormData,
        updatedAt: firebase.firestore.Timestamp.now()
      };

      if (editingActivityId) {
        await db.collection("activities").doc(editingActivityId).update(data);
      } else {
        await db.collection("activities").add({
          ...data,
          createdAt: firebase.firestore.Timestamp.now()
        });
      }

      setIsAddingActivity(false);
      setEditingActivityId(null);
      setActivityFormData({ title: '', description: '', imageUrl: '', category: 'Gallery' });
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Error saving activity.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteActivity = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this activity?")) {
      await db.collection("activities").doc(id).delete();
      fetchData();
    }
  };

  const handleEditActivity = (a: any) => {
    setEditingActivityId(a.id);
    setActivityFormData({
      title: a.title || '',
      description: a.description || '',
      imageUrl: a.imageUrl || '',
      category: a.category || 'Gallery'
    });
    setIsAddingActivity(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const ImagePreview = ({ url, label }: { url: string, label: string }) => (
    <div className="space-y-2">
      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</label>
      <div className="h-28 bg-slate-50 border border-dashed border-slate-200 rounded-xl flex items-center justify-center overflow-hidden transition-all hover:border-royalGold">
        {url ? <img src={url} className="w-full h-full object-cover" alt="Preview" /> : <i className="fa-solid fa-image text-slate-200 text-2xl"></i>}
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
      <div className="flex justify-between items-center mb-10 border-b pb-6">
        <div>
          <h1 className="text-xl font-bold text-royalGreen uppercase tracking-tighter">{SITE_CONFIG.name}</h1>
          <p className="text-slate-500 text-[10px] font-bold tracking-widest uppercase">Inventory Control Center</p>
        </div>
        <div className="flex items-center space-x-6">
          <button onClick={() => setActiveTab('projects')} className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${activeTab === 'projects' ? 'text-royalGreen' : 'text-slate-400 hover:text-slate-600'}`}>Inventory</button>
          <button onClick={() => setActiveTab('activities')} className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${activeTab === 'activities' ? 'text-royalGreen' : 'text-slate-400 hover:text-slate-600'}`}>Activities</button>
          <button onClick={() => setActiveTab('leads')} className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${activeTab === 'leads' ? 'text-royalGreen' : 'text-slate-400 hover:text-slate-600'}`}>Leads</button>
          <button onClick={handleLogout} className="text-red-500 text-[10px] font-bold uppercase tracking-widest border border-red-100 px-4 py-2 rounded-lg hover:bg-red-50 transition-all">Logout</button>
        </div>
      </div>

      {activeTab === 'projects' && (
        <div className="space-y-8 animate-in fade-in duration-500">
          <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div>
              <h2 className="text-lg font-bold uppercase tracking-tight">{editingProjectId ? 'Modify Project' : 'Inventory Management'}</h2>
              <p className="text-xs text-slate-400 italic">Manage plots, luxury homes, and construction units.</p>
            </div>
            <button 
              onClick={() => { setIsAddingProject(!isAddingProject); if(isAddingProject) setEditingProjectId(null); }}
              className={`${isAddingProject ? 'bg-slate-200 text-slate-700' : 'bg-royalGreen text-white'} px-6 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all shadow-md`}
            >
              {isAddingProject ? 'Close Editor' : 'Add New Listing'}
            </button>
          </div>

          {isAddingProject && (
            <form onSubmit={handleProjectSubmit} className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-2xl space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Project Name</label>
                  <input required type="text" value={projectFormData.title} onChange={e => setProjectFormData({...projectFormData, title: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 outline-none focus:ring-1 focus:ring-royalGold" placeholder="Elite Residence..." />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Listing Status</label>
                  <select value={projectFormData.status} onChange={e => setProjectFormData({...projectFormData, status: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 outline-none">
                     <option value="For Sale">For Sale</option>
                     <option value="For Rent">For Rent</option>
                     <option value="Constructing">Constructing</option>
                     <option value="Sold">Sold</option>
                  </select>
                </div>
                
                <div className="md:col-span-3 space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Detailed Description</label>
                  <textarea required rows={4} value={projectFormData.description} onChange={e => setProjectFormData({...projectFormData, description: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 outline-none resize-none focus:ring-1 focus:ring-royalGold" />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Strategic Location</label>
                  <select value={projectFormData.location} onChange={e => setProjectFormData({...projectFormData, location: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 outline-none">
                     {SITE_CONFIG.areas.map(area => <option key={area.name} value={area.name}>{area.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Price String</label>
                  <input required type="text" value={projectFormData.priceRange} onChange={e => setProjectFormData({...projectFormData, priceRange: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 outline-none focus:ring-1 focus:ring-royalGold" placeholder="৳ 1.5 Cr - 2.2 Cr" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Property Type</label>
                  <select value={projectFormData.type} onChange={e => setProjectFormData({...projectFormData, type: e.target.value as any})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 outline-none">
                     <option value="Residential">Residential</option>
                     <option value="Commercial">Commercial</option>
                     <option value="Land">Land</option>
                  </select>
                </div>

                <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-slate-100">
                  <div className="space-y-4">
                    <ImagePreview url={projectFormData.image} label="Main Image Preview" />
                    <input required type="url" value={projectFormData.image} onChange={e => setProjectFormData({...projectFormData, image: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-[10px] outline-none" placeholder="Primary Image URL" />
                  </div>
                  <div className="space-y-4">
                    <ImagePreview url={projectFormData.image2} label="Gallery Image 2" />
                    <input type="url" value={projectFormData.image2} onChange={e => setProjectFormData({...projectFormData, image2: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-[10px] outline-none" placeholder="Optional Gallery URL" />
                  </div>
                  <div className="space-y-4">
                    <ImagePreview url={projectFormData.image3} label="Gallery Image 3" />
                    <input type="url" value={projectFormData.image3} onChange={e => setProjectFormData({...projectFormData, image3: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-[10px] outline-none" placeholder="Optional Gallery URL" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Brochure PDF URL</label>
                  <input type="url" value={projectFormData.brochure} onChange={e => setProjectFormData({...projectFormData, brochure: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 outline-none focus:ring-1 focus:ring-royalGold" placeholder="https://..." />
                </div>
                <div className="md:col-span-2 space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Features (Comma separated)</label>
                  <input type="text" value={projectFormData.features} onChange={e => setProjectFormData({...projectFormData, features: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 outline-none focus:ring-1 focus:ring-royalGold" placeholder="Parking, CCTV, Lift, Gym..." />
                </div>

                <div className="md:col-span-3 grid grid-cols-3 gap-6">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Beds</label>
                    <input type="number" value={projectFormData.beds} onChange={e => setProjectFormData({...projectFormData, beds: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Baths</label>
                    <input type="number" value={projectFormData.baths} onChange={e => setProjectFormData({...projectFormData, baths: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sqft</label>
                    <input type="number" value={projectFormData.sqft} onChange={e => setProjectFormData({...projectFormData, sqft: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 outline-none" />
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button type="submit" disabled={loading} className="w-full bg-royalGreen text-white font-bold py-5 rounded-[2rem] shadow-2xl uppercase tracking-[0.2em] text-[11px] hover:bg-green-800 disabled:opacity-50 transition-all flex items-center justify-center">
                  {loading ? (
                    <><i className="fa-solid fa-spinner fa-spin mr-3"></i> Syncing to Firestore...</>
                  ) : editingProjectId ? (
                    <><i className="fa-solid fa-cloud-arrow-up mr-3"></i> Update Project Info</>
                  ) : (
                    <><i className="fa-solid fa-plus mr-3"></i> Publish to Inventory</>
                  )}
                </button>
              </div>
            </form>
          )}

          <div className="bg-white rounded-[2rem] border overflow-hidden shadow-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-white border-b border-slate-800">
                <tr>
                  <th className="px-8 py-5 font-bold uppercase tracking-widest">Listing</th>
                  <th className="px-8 py-5 font-bold uppercase tracking-widest">Location</th>
                  <th className="px-8 py-5 font-bold uppercase tracking-widest">Status</th>
                  <th className="px-8 py-5 text-right font-bold uppercase tracking-widest">Management</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {projects.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center">
                        <img src={p.image} className="w-10 h-10 rounded-lg object-cover mr-4" alt="" />
                        <div>
                          <div className="font-bold text-slate-900 text-sm">{p.title}</div>
                          <div className="text-[9px] uppercase font-bold text-royalGold">{p.priceRange}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-slate-500 font-medium uppercase tracking-tighter">{p.location}</td>
                    <td className="px-8 py-5">
                      <span className={`px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-widest ${p.status === 'Sold' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right space-x-6 uppercase font-bold text-[10px] tracking-widest">
                      <button onClick={() => handleEditProject(p)} className="text-royalGreen hover:text-green-900">Modify</button>
                      <button onClick={() => handleDeleteProject(p.id)} className="text-red-400 hover:text-red-600">Archive</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'activities' && (
        <div className="space-y-8 animate-in fade-in duration-500">
          <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div>
              <h2 className="text-lg font-bold uppercase tracking-tight">{editingActivityId ? 'Modify Activity' : 'Manage Activities'}</h2>
              <p className="text-xs text-slate-400 italic">Publish updates to the Gallery and Blog tabs.</p>
            </div>
            <button 
              onClick={() => { setIsAddingActivity(!isAddingActivity); if(isAddingActivity) setEditingActivityId(null); }}
              className={`${isAddingActivity ? 'bg-slate-200 text-slate-700' : 'bg-royalGreen text-white'} px-6 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all shadow-md`}
            >
              {isAddingActivity ? 'Close Editor' : 'Create New Activity'}
            </button>
          </div>

          {isAddingActivity && (
            <form onSubmit={handleActivitySubmit} className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-2xl space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Activity Title</label>
                  <input required type="text" value={activityFormData.title} onChange={e => setActivityFormData({...activityFormData, title: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 outline-none focus:ring-1 focus:ring-royalGold" placeholder="Site Visit at Purbachal..." />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Category</label>
                  <select value={activityFormData.category} onChange={e => setActivityFormData({...activityFormData, category: e.target.value as 'Gallery' | 'Blog'})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 outline-none">
                     <option value="Gallery">Gallery (Photos Only)</option>
                     <option value="Blog">Blog/Update (Text & Image)</option>
                  </select>
                </div>
                <div className="md:col-span-2 space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Description</label>
                  <textarea required rows={4} value={activityFormData.description} onChange={e => setActivityFormData({...activityFormData, description: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 outline-none resize-none focus:ring-1 focus:ring-royalGold" placeholder="Share details about this activity..." />
                </div>
                <div className="md:col-span-2 space-y-4">
                  <ImagePreview url={activityFormData.imageUrl} label="Cover Image Preview" />
                  <input required type="url" value={activityFormData.imageUrl} onChange={e => setActivityFormData({...activityFormData, imageUrl: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-[10px] outline-none" placeholder="Activity Image URL" />
                </div>
              </div>

              <div className="pt-6">
                <button type="submit" disabled={loading} className="w-full bg-royalGreen text-white font-bold py-5 rounded-[2rem] shadow-2xl uppercase tracking-[0.2em] text-[11px] hover:bg-green-800 disabled:opacity-50 transition-all">
                  {loading ? <i className="fa-solid fa-spinner fa-spin mr-3"></i> : (editingActivityId ? 'Update Activity' : 'Publish Activity')}
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {activities.map(a => (
              <div key={a.id} className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-all group relative">
                <div className="h-48 overflow-hidden">
                  <img src={a.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt="" />
                </div>
                <div className="p-6">
                  <span className="bg-royalGold/10 text-royalGold px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest">{a.category}</span>
                  <h3 className="font-bold text-slate-900 mt-2 line-clamp-1">{a.title}</h3>
                  <div className="mt-4 flex justify-end space-x-4 border-t pt-4">
                    <button onClick={() => handleEditActivity(a)} className="text-[10px] font-bold text-royalGreen uppercase hover:underline">Edit</button>
                    <button onClick={() => handleDeleteActivity(a.id)} className="text-[10px] font-bold text-red-400 uppercase hover:underline">Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'leads' && (
        <div className="animate-in fade-in duration-500">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {leads.map(lead => (
                <div key={lead.id} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
                    <i className="fa-solid fa-quote-right text-4xl text-royalGold"></i>
                  </div>
                  <div className="flex justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg uppercase tracking-tight">{lead.name}</h3>
                      <p className="text-[10px] text-royalGold uppercase font-bold tracking-widest">Consultation Request</p>
                    </div>
                    <span className="text-[9px] text-slate-300 uppercase font-bold bg-slate-50 px-3 py-1 rounded-full h-fit">
                      {lead.timestamp ? new Date(lead.timestamp?.toDate()).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                  <div className="space-y-3 mb-6">
                    <p className="text-xs text-slate-600 flex items-center">
                      <i className="fa-solid fa-envelope mr-3 text-royalGreen/30"></i> {lead.email}
                    </p>
                    <p className="text-xs text-slate-600 flex items-center">
                      <i className="fa-solid fa-phone mr-3 text-royalGreen/30"></i> {lead.phone || 'No phone provided'}
                    </p>
                  </div>
                  <div className="bg-slate-50 p-5 rounded-2xl italic text-slate-500 text-sm border border-slate-100">
                    "{lead.message}"
                  </div>
                  <div className="mt-6 pt-6 border-t border-slate-50 flex justify-between items-center">
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Source: {lead.source || 'Website Form'}</span>
                    <a href={`mailto:${lead.email}`} className="bg-royalGreen text-white px-5 py-2 rounded-lg text-[9px] font-bold uppercase tracking-widest shadow-md">Reply</a>
                  </div>
                </div>
              ))}
              {leads.length === 0 && (
                <div className="md:col-span-2 text-center py-32 bg-white rounded-[3rem] border border-dashed border-slate-200">
                  <i className="fa-solid fa-inbox text-5xl text-slate-100 mb-6"></i>
                  <p className="text-slate-400 font-bold uppercase tracking-widest">No active leads found</p>
                </div>
              )}
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
