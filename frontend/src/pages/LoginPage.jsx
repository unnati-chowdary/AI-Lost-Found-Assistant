import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Search, Lock, Mail, ArrowRight, ShieldCheck, User } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(email, password);
      if (user.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoStudent = () => {
    setEmail('student@college.edu');
    setPassword('student123');
  };

  const handleDemoAdmin = () => {
    setEmail('admin@college.edu');
    setPassword('admin123');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-slate-200">
        
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white mx-auto shadow-md mb-3">
            <Search className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Sign in to Campus Portal</h2>
          <p className="text-sm text-slate-500 mt-1">Access your lost & found reports and AI matches</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">Email Address</label>
            <div className="relative">
              <Mail className="w-5 h-5 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@college.edu"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">Password</label>
            <div className="relative">
              <Lock className="w-5 h-5 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-sm transition-all shadow-md hover:shadow-sky-500/20 flex items-center justify-center space-x-2"
          >
            {loading ? <span>Signing in...</span> : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-100">
          <p className="text-xs text-center font-semibold text-slate-400 uppercase tracking-wider mb-3">Quick Demo Credentials</p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleDemoStudent}
              className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium flex items-center justify-center space-x-1 transition-colors"
            >
              <User className="w-3.5 h-3.5 text-sky-600" />
              <span>Student User</span>
            </button>
            <button
              onClick={handleDemoAdmin}
              className="px-3 py-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-medium flex items-center justify-center space-x-1 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
              <span>Office Admin</span>
            </button>
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-slate-500">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-sky-600 hover:underline">
            Register here
          </Link>
        </p>

      </div>
    </div>
  );
};

export default LoginPage;
