import React from 'react';
import { X, Sparkles } from 'lucide-react';

const PlaceholderModal = ({ isOpen, onClose, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#14152a] border border-[#272952] rounded-2xl w-full max-w-md p-6 shadow-2xl text-center relative overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-[#1f203d] hover:bg-[#2b2c52] flex items-center justify-center text-slate-400 hover:text-white transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-[#3b2d71] to-[#7c5cfa] flex items-center justify-center text-white shadow-lg shadow-purple-600/30">
          <Sparkles className="w-7 h-7" />
        </div>

        <h3 className="text-xl font-bold text-white mb-2">{title} Module</h3>
        <p className="text-sm text-slate-400 mb-6 leading-relaxed">
          The <span className="text-purple-300 font-semibold">{title}</span> module is defined as a placeholder in the SRS (v1.0). Full interactive tracking and deep analytics are slated for future releases.
        </p>

        <button
          onClick={onClose}
          className="w-full py-2.5 px-4 rounded-xl bg-[#7c5cfa] hover:bg-[#6c48f2] text-white font-semibold text-sm transition cursor-pointer shadow-md shadow-purple-600/30"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default PlaceholderModal;
