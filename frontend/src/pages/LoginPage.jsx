import React, { useState } from 'react';
import { Wallet, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginPage = ({ onSwitchToRegister }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    setLoading(true);
    try {
      await login(email, password, rememberMe);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = () => {
    setEmail('harish@example.com');
    setPassword('password123');
    setError('');
  };

  return (
    <div className="min-h-screen w-full bg-[#090a12] flex items-center justify-center p-4">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-[#121325] border border-[#232545] rounded-3xl p-8 shadow-2xl relative z-10 select-none">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-purple-900/40 mb-3 border border-purple-400/30">
            <Wallet className="w-8 h-8 text-white" strokeWidth={2.2} />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-wide">
            Expense <span className="text-[#a78bfa]">Tracker</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Sign in to track your expenses & manage money
          </p>
        </div>

        {/* Demo Account Quick-Fill Card */}
        <div className="mb-6 p-3 rounded-xl bg-[#191a33] border border-[#2b2d55] flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-purple-300">Default Demo Account</p>
            <p className="text-xs text-slate-400">harish@example.com / password123</p>
          </div>
          <button
            type="button"
            onClick={handleDemoFill}
            className="text-xs px-2.5 py-1.5 rounded-lg bg-[#7c5cfa]/20 hover:bg-[#7c5cfa]/30 text-purple-300 font-medium transition cursor-pointer"
          >
            Auto-fill
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Email Address
            </label>
            <div className="flex items-center px-3.5 py-2.5 rounded-xl bg-[#181932] border border-[#26284f] focus-within:border-[#7c5cfa] transition">
              <Mail className="w-4 h-4 text-slate-400 mr-2.5 shrink-0" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent text-white text-sm outline-none placeholder:text-slate-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Password
            </label>
            <div className="flex items-center px-3.5 py-2.5 rounded-xl bg-[#181932] border border-[#26284f] focus-within:border-[#7c5cfa] transition">
              <Lock className="w-4 h-4 text-slate-400 mr-2.5 shrink-0" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent text-white text-sm outline-none placeholder:text-slate-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-400 hover:text-white transition ml-2 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-[#26284f] bg-[#181932] text-[#7c5cfa] focus:ring-0"
              />
              <span>Remember Me</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-[#7c5cfa] hover:bg-[#6c48f2] active:scale-[0.99] disabled:opacity-60 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 transition duration-150 cursor-pointer"
          >
            <span>{loading ? 'Signing in...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-slate-400 mt-6">
          Don't have an account?{' '}
          <button
            onClick={onSwitchToRegister}
            className="text-[#7c5cfa] hover:underline font-semibold cursor-pointer"
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
