import React from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose }) => {
  if (!message) return null;

  const isSuccess = type === 'success';

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl bg-[#171830] border border-[#2d2f58] shadow-2xl animate-in slide-in-from-bottom-3 duration-200">
      {isSuccess ? (
        <CheckCircle2 className="w-5 h-5 text-[#22c97a]" />
      ) : (
        <AlertCircle className="w-5 h-5 text-[#f0485a]" />
      )}
      <span className="text-sm font-medium text-white">{message}</span>
      <button
        onClick={onClose}
        className="ml-2 text-slate-400 hover:text-white transition cursor-pointer"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Toast;
