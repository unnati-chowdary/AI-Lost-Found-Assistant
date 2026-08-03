import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Search, PlusCircle, LayoutDashboard, ShieldCheck, LogOut } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-sky-300 bg-clip-text text-transparent">
                AI Lost & Found
              </span>
              <span className="block text-[10px] text-sky-400 font-semibold tracking-wider uppercase">
                Campus Portal
              </span>
            </div>
          </Link>

          <div className="flex items-center space-x-3 sm:space-x-6">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-1.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 px-3 py-2 rounded-lg transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4 text-sky-400" />
                  <span>Dashboard</span>
                </Link>

                <Link
                  to="/report-lost"
                  className="flex items-center space-x-1.5 text-sm font-medium bg-rose-600/90 hover:bg-rose-600 text-white px-3 py-2 rounded-lg transition-colors shadow-sm"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Report Lost</span>
                </Link>

                <Link
                  to="/report-found"
                  className="flex items-center space-x-1.5 text-sm font-medium bg-emerald-600/90 hover:bg-emerald-600 text-white px-3 py-2 rounded-lg transition-colors shadow-sm"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Report Found</span>
                </Link>

                {user.role === 'ADMIN' && (
                  <Link
                    to="/admin"
                    className="flex items-center space-x-1.5 text-sm font-medium bg-indigo-600/90 hover:bg-indigo-600 text-white px-3 py-2 rounded-lg transition-colors shadow-sm"
                  >
                    <ShieldCheck className="w-4 h-4 text-indigo-200" />
                    <span>Office Admin</span>
                  </Link>
                )}

                <div className="flex items-center space-x-3 pl-3 border-l border-slate-800">
                  <div className="hidden md:flex flex-col text-right">
                    <span className="text-sm font-semibold text-slate-200 leading-tight">{user.name}</span>
                    <span className="text-xs text-sky-400 font-mono">{user.role}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    title="Sign Out"
                    className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-slate-300 hover:text-white px-3 py-2 rounded-lg transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-medium bg-sky-600 hover:bg-sky-500 text-white px-4 py-2 rounded-lg transition-all shadow-md hover:shadow-sky-500/20"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
