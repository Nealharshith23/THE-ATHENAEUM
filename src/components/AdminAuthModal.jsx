import React, { useState } from 'react';
import { Shield, Lock, ArrowRight, X, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

export default function AdminAuthModal({ isOpen, onClose, onSuccess }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await api.adminLogin(password);
      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 w-full max-w-md shadow-2xl relative overflow-hidden animate-scaleUp">
        
        {/* Ambient background glow */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-3">
            <Shield className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-white mb-1">
            Protected Admin Gateway
          </h3>
          <p className="text-xs text-slate-400">
            Treasure Hunt Pattern Test &bull; R&amp;D Cell
          </p>
        </div>

        {/* Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Admin Gateway Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                autoFocus
                placeholder="Enter password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950/90 border border-slate-800 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-amber-300 font-mono text-sm rounded-xl py-3 pl-10 pr-4 outline-none transition-all"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-semibold py-3 px-5 rounded-xl shadow-lg shadow-amber-600/20 flex items-center justify-center gap-2 text-sm transition-all"
          >
            <span>{isSubmitting ? 'Verifying...' : 'Unlock Admin Dashboard'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
