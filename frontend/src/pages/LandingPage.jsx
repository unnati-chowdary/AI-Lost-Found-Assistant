import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Sparkles, Image as ImageIcon, Mail, ArrowRight, CheckCircle2 } from 'lucide-react';
import { demoAPI } from '../services/api';

const LandingPage = () => {
  const [seeding, setSeeding] = useState(false);
  const [seedSuccess, setSeedSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSeedDemo = async () => {
    setSeeding(true);
    try {
      await demoAPI.seedData();
      setSeedSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      console.error("Seed demo error:", err);
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <section className="relative overflow-hidden bg-slate-900 text-white py-24 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-sky-900/30 via-slate-900 to-slate-950 pointer-events-none" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-300 text-xs font-semibold uppercase tracking-wider mb-6">
            <Sparkles className="w-4 h-4 text-sky-400" />
            <span>AI-Driven Multi-Factor Matching</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
            Lost Something on Campus? <br />
            <span className="bg-gradient-to-r from-sky-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              Let AI Reconnect You.
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto font-light leading-relaxed">
            Report lost or found items with text descriptions and photos. Our multimodal AI uses 
            <span className="text-sky-400 font-medium"> Sentence Transformers</span> and 
            <span className="text-sky-400 font-medium"> OpenCLIP</span> to automatically identify matches and alert owners.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              to="/register"
              className="inline-flex items-center px-6 py-3.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-base transition-all shadow-lg hover:shadow-sky-500/25 group"
            >
              <span>Get Started Now</span>
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/login"
              className="inline-flex items-center px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-base border border-slate-700 transition-all"
            >
              Sign In
            </Link>

            <button
              onClick={handleSeedDemo}
              disabled={seeding}
              className="inline-flex items-center px-6 py-3.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/40 font-semibold text-base transition-all disabled:opacity-50"
            >
              {seeding ? (
                <span>Loading Demo Data...</span>
              ) : seedSuccess ? (
                <span className="flex items-center text-emerald-300">
                  <CheckCircle2 className="w-5 h-5 mr-2" /> Demo Data Seeded!
                </span>
              ) : (
                <span>Seed Test Demo Data</span>
              )}
            </button>
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900">How It Works</h2>
            <p className="text-slate-600 mt-3 text-lg">
              Intelligent multi-factor scoring matching items across text, images, categories, locations, and timestamps.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center mb-6">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">1. Semantic Text AI</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Uses <code>all-MiniLM-L6-v2</code> sentence embeddings to match items even when descriptions use completely different wording.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-6">
                <ImageIcon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">2. Visual Vector Matching</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Extracts visual feature embeddings using <code>OpenCLIP</code> to compare color, texture, and visual traits across uploaded photos.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-6">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">3. Automated Alerts</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                When a high-confidence match ($\ge 75\%$) is detected, the owner automatically receives an email notification with instructions.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
