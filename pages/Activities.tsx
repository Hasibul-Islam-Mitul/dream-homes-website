
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { Activity } from '../types';

const Activities: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'Gallery' | 'Blog'>('Gallery');
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true);
      try {
        const snapshot = await db.collection("activities").orderBy("createdAt", "desc").get();
        setActivities(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Activity[]);
      } catch (err) {
        console.error("Error fetching activities:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, []);

  const filtered = activities.filter(a => a.category === activeTab);

  return (
    <div className="pt-32 pb-24 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold text-royalGreen uppercase tracking-tighter mb-6">Our Activities</h1>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg font-light">
            Stay updated with our latest construction progress, community events, and architectural insights.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-16">
          <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-100 flex space-x-2">
            {(['Gallery', 'Blog'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-12 py-3 rounded-xl font-bold text-xs uppercase tracking-[0.2em] transition-all ${
                  activeTab === tab 
                    ? 'bg-royalGreen text-white shadow-lg' 
                    : 'text-slate-400 hover:text-royalGreen'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-24">
            <i className="fa-solid fa-spinner fa-spin text-4xl text-royalGreen"></i>
          </div>
        ) : filtered.length > 0 ? (
          activeTab === 'Gallery' ? (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
              {filtered.map(item => (
                <div key={item.id} className="break-inside-avoid rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all group bg-white border border-slate-100">
                  <div className="relative overflow-hidden">
                    <img src={item.imageUrl} alt={item.title} className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-8 flex flex-col justify-end">
                      <h3 className="text-white font-bold text-lg leading-tight mb-2 uppercase tracking-tight">{item.title}</h3>
                      <p className="text-white/70 text-xs line-clamp-2 font-light">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filtered.map(item => (
                <div key={item.id} className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl transition-all flex flex-col sm:flex-row h-full">
                  <div className="sm:w-2/5 h-64 sm:h-auto overflow-hidden">
                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="sm:w-3/5 p-8 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <span className="bg-royalGold/10 text-royalGold px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest">Article</span>
                        <span className="text-[9px] text-slate-300 font-bold uppercase">{new Date(item.createdAt?.toDate?.() || Date.now()).toLocaleDateString()}</span>
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight uppercase leading-tight">{item.title}</h3>
                      <p className="text-slate-500 text-sm font-light leading-relaxed line-clamp-4">{item.description}</p>
                    </div>
                    <button className="mt-6 text-royalGreen font-bold text-[10px] uppercase tracking-[0.2em] flex items-center hover:underline">
                      Read Full Update <i className="fa-solid fa-arrow-right ml-2 text-[8px]"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="text-center py-32 bg-white rounded-[3rem] border border-dashed border-slate-200">
            <i className="fa-solid fa-folder-open text-5xl text-slate-100 mb-6"></i>
            <p className="text-slate-400 font-bold uppercase tracking-widest italic">No activities posted yet in this category</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Activities;
