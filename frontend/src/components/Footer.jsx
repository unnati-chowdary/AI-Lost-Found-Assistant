import React from 'react';
import { ShieldCheck, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center text-sm gap-4">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-5 h-5 text-sky-400" />
          <span>AI-Powered Lost & Found Campus Assistant</span>
        </div>
        <div className="flex items-center space-x-1 text-slate-500">
          <span>Built with</span>
          <Heart className="w-4 h-4 text-rose-500 fill-rose-500 inline" />
          <span>using SentenceTransformers, OpenCLIP & FastAPI</span>
        </div>
        <div>
          &copy; {new Date().getFullYear()} Campus Lost & Found Office
        </div>
      </div>
    </footer>
  );
};

export default Footer;
