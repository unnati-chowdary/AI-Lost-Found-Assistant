import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { itemsAPI, matchesAPI } from '../services/api';
import { Search, PlusCircle, Sparkles, FileText, CheckCircle2, AlertCircle, Clock, MapPin, Tag } from 'lucide-react';

const DashboardPage = () => {
  const [reports, setReports] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [reportsRes, matchesRes] = await Promise.all([
        itemsAPI.getMyReports(),
        matchesAPI.getMyMatches()
      ]);
      setReports(reportsRes.data);
      setMatches(matchesRes.data);
    } catch (err) {
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getConfidenceBadge = (score) => {
    if (score >= 75) {
      return <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full border border-emerald-300">High Match ({score}%)</span>;
    } else if (score >= 50) {
      return <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full border border-amber-300">Medium Match ({score}%)</span>;
    } else {
      return <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-full border border-slate-300">Low Match ({score}%)</span>;
    }
  };

  const lostReports = reports.filter(r => r.type === 'LOST');
  const foundReports = reports.filter(r => r.type === 'FOUND');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">User Dashboard</h1>
          <p className="text-slate-300 text-sm mt-1">Track your lost items, found reports, and real-time AI matches.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/report-lost"
            className="inline-flex items-center px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md"
          >
            <PlusCircle className="w-4 h-4 mr-2" /> Report Lost Item
          </Link>
          <Link
            to="/report-found"
            className="inline-flex items-center px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md"
          >
            <PlusCircle className="w-4 h-4 mr-2" /> Report Found Item
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Lost Reports</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-1">{lostReports.length}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Found Reports</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-1">{foundReports.length}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">AI Potential Matches</p>
              <h3 className="text-3xl font-bold text-sky-600 mt-1">{matches.length}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Sparkles className="w-6 h-6 text-sky-500" />
          <h2 className="text-xl font-bold text-slate-900">AI Matches for Your Items</h2>
        </div>

        {loading ? (
          <p className="text-slate-500 text-sm py-4">Loading potential matches...</p>
        ) : matches.length === 0 ? (
          <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <Search className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-slate-600 text-sm font-medium">No matches detected yet.</p>
            <p className="text-slate-400 text-xs mt-1">Our AI continuously searches incoming reports.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {matches.map((m) => (
              <div key={m.id} className="border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow bg-slate-50/50">
                <div className="flex justify-between items-start mb-3">
                  {getConfidenceBadge(m.confidence_score)}
                  <span className="text-xs font-mono text-slate-400">Match #{m.id}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 my-3 text-sm">
                  <div className="bg-rose-50 p-3 rounded-lg border border-rose-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600">Your Lost Item</span>
                    <p className="font-semibold text-slate-900 mt-1">{m.lost_item?.name}</p>
                    <p className="text-xs text-slate-500 mt-1">{m.lost_item?.location}</p>
                  </div>
                  <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Found Match</span>
                    <p className="font-semibold text-slate-900 mt-1">{m.found_item?.name}</p>
                    <p className="text-xs text-slate-500 mt-1">{m.found_item?.location}</p>
                  </div>
                </div>

                <div className="flex justify-between text-xs text-slate-500 pt-2 border-t border-slate-200 mt-3">
                  <span>Text Similarity: {m.text_similarity * 100}%</span>
                  <span>Image Similarity: {m.image_similarity ? `${m.image_similarity * 100}%` : 'N/A'}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-6">Your Reported Items</h2>
        
        {loading ? (
          <p className="text-slate-500 text-sm py-4">Loading reports...</p>
        ) : reports.length === 0 ? (
          <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-slate-600 text-sm font-medium">You haven't submitted any reports yet.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {reports.map((item) => (
              <div key={item.id} className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                {item.image_path ? (
                  <img src={item.image_path} alt={item.name} className="w-full h-40 object-cover" />
                ) : (
                  <div className="w-full h-40 bg-slate-100 flex items-center justify-center text-slate-400 text-xs">
                    No Image Uploaded
                  </div>
                )}
                <div className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${item.type === 'LOST' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
                      {item.type}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">{item.status}</span>
                  </div>
                  <h3 className="font-bold text-slate-900">{item.name}</h3>
                  <p className="text-xs text-slate-600 line-clamp-2 mt-1">{item.description}</p>
                  <div className="mt-3 text-xs text-slate-500 space-y-1">
                    <div className="flex items-center"><MapPin className="w-3.5 h-3.5 mr-1" /> {item.location}</div>
                    <div className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1" /> {item.date}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default DashboardPage;
