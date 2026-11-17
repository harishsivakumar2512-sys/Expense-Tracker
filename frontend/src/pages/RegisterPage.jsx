import React, { useState } from 'react';
import { Wallet, Mail, Lock, User, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const RegisterPage = ({ onSwitchToLogin }) => {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password, confirmPassword, true);
    } catch (err) {
      console.error(err);
      const data = err.response?.data;
      if (data?.email) {
        setError(data.email[0]);
      } else if (data?.confirm_password) {
        setError(data.confirm_password[0]);
      } else {
        setError('Failed to create account. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#090a12] flex items-center justify-center p-4">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-[#121325] border border-[#232545] rounded-3xl p-8 shadow-2xl relative z-10 select-none">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-purple-900/40 mb-3 border border-purple-400/30">
            <Wallet className="w-8 h-8 text-white" strokeWidth={2.2} />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-wide">
            Create Account
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Start managing your finances effortlessly
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Full Name
            </label>
            <div className="flex items-center px-3.5 py-2.5 rounded-xl bg-[#181932] border border-[#26284f] focus-within:border-[#7c5cfa] transition">
              <User className="w-4 h-4 text-slate-400 mr-2.5 shrink-0" />
              <input
                type="text"
                required
                placeholder="Harish S"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-transparent text-white text-sm outline-none placeholder:text-slate-500"
              />
            </div>
          </div>

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
                placeholder="At least 6 characters"
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

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Confirm Password
            </label>
            <div className="flex items-center px-3.5 py-2.5 rounded-xl bg-[#181932] border border-[#26284f] focus-within:border-[#7c5cfa] transition">
              <Lock className="w-4 h-4 text-slate-400 mr-2.5 shrink-0" />
              <input
                type="password"
                required
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-transparent text-white text-sm outline-none placeholder:text-slate-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-[#7c5cfa] hover:bg-[#6c48f2] active:scale-[0.99] disabled:opacity-60 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 transition duration-150 cursor-pointer"
          >
            <span>{loading ? 'Creating Account...' : 'Create Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-slate-400 mt-6">
          Already have an account?{' '}
          <button
            onClick={onSwitchToLogin}
            className="text-[#7c5cfa] hover:underline font-semibold cursor-pointer"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
