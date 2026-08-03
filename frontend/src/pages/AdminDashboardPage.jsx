import React, { useState, useEffect } from 'react';
import { adminAPI, itemsAPI } from '../services/api';
import { ShieldCheck, Package, Sparkles, CheckCircle, RefreshCw, Users, FileText, Check } from 'lucide-react';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [items, setItems] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('items');

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, itemsRes, matchesRes] = await Promise.all([
        adminAPI.getStats(),
        adminAPI.getAllItems(),
        adminAPI.getAllMatches()
      ]);
      setStats(statsRes.data);
      setItems(itemsRes.data);
      setMatches(matchesRes.data);
    } catch (err) {
      console.error("Admin data fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateItemStatus = async (itemId, newStatus) => {
    try {
      await itemsAPI.updateStatus(itemId, newStatus);
      fetchAdminData();
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const handleUpdateMatchStatus = async (matchId, newStatus) => {
    try {
      await adminAPI.updateMatchStatus(matchId, newStatus);
      fetchAdminData();
    } catch (err) {
      console.error("Failed to update match status:", err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Campus Office Admin Portal</h1>
            <p className="text-slate-300 text-sm mt-1">Inventory management, match verification, and claim resolution.</p>
          </div>
        </div>

        <button
          onClick={fetchAdminData}
          className="inline-flex items-center px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors border border-slate-700"
        >
          <RefreshCw className="w-4 h-4 mr-2" /> Refresh Inventory
        </button>
      </div>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Users</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{stats.total_users}</h3>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Lost Reports</p>
            <h3 className="text-2xl font-bold text-rose-600 mt-1">{stats.lost_items}</h3>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Found Reports</p>
            <h3 className="text-2xl font-bold text-emerald-600 mt-1">{stats.found_items}</h3>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Confirmed Matches</p>
            <h3 className="text-2xl font-bold text-indigo-600 mt-1">{stats.confirmed_matches}</h3>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="border-b border-slate-200 flex space-x-6 px-6 bg-slate-50">
          <button
            onClick={() => setActiveTab('items')}
            className={`py-4 font-semibold text-sm border-b-2 transition-colors ${activeTab === 'items' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            All Inventory Items ({items.length})
          </button>
          <button
            onClick={() => setActiveTab('matches')}
            className={`py-4 font-semibold text-sm border-b-2 transition-colors ${activeTab === 'matches' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            AI Matches Verification ({matches.length})
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'items' ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 bg-slate-50">
                    <th className="py-3 px-4">Item</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50">
                      <td className="py-3 px-4 font-semibold text-slate-900">{item.name}</td>
                      <td className="py-3 px-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.type === 'LOST' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
                          {item.type}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600">{item.category}</td>
                      <td className="py-3 px-4 text-slate-600">{item.location}</td>
                      <td className="py-3 px-4 text-slate-500">{item.date}</td>
                      <td className="py-3 px-4">
                        <span className={`text-xs font-semibold ${item.status === 'RESOLVED' ? 'text-emerald-600' : 'text-amber-600'}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {item.status === 'ACTIVE' ? (
                          <button
                            onClick={() => handleUpdateItemStatus(item.id, 'RESOLVED')}
                            className="px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-medium transition-colors"
                          >
                            Mark Claimed
                          </button>
                        ) : (
                          <span className="text-xs text-slate-400">Resolved</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="space-y-4">
              {matches.map((m) => (
                <div key={m.id} className="border border-slate-200 rounded-xl p-5 bg-slate-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="font-bold text-sky-600 text-sm">{m.confidence_score}% Confidence</span>
                      <span className="text-xs font-semibold text-slate-500 uppercase">Status: {m.status}</span>
                    </div>
                    <p className="text-sm text-slate-900 font-semibold">
                      Lost: "{m.lost_item?.name}" &rarr; Found: "{m.found_item?.name}"
                    </p>
                  </div>
                  {m.status === 'PENDING' && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleUpdateMatchStatus(m.id, 'CONFIRMED')}
                        className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-500 transition-colors"
                      >
                        Confirm Match
                      </button>
                      <button
                        onClick={() => handleUpdateMatchStatus(m.id, 'REJECTED')}
                        className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-300 transition-colors"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default AdminDashboardPage;
