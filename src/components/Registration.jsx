import React, { useState } from 'react';
import { User, Mail, ArrowRight, CheckCircle2, Lock, Sparkles, Clock, HelpCircle, Layers } from 'lucide-react';
import { api } from '../services/api';

export default function Registration({ activeSet, examInfo, onStartQuiz }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isStarting, setIsStarting] = useState(false);

  const getSetTitle = (setKey) => {
    if (setKey === 'setA') return 'Set A - Aptitude Pattern Round';
    if (setKey === 'setB') return 'Set B - Aptitude Pattern Round';
    return 'Custom Active Set';
  };

  const handleStart = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your full name');
      return;
    }
    const cleanEmail = email.trim().toLowerCase();
    if (!/^[^\s@]+@stpetershyd\.com$/i.test(cleanEmail)) {
      setError('Please enter a valid college email ending with @stpetershyd.com');
      return;
    }

    setIsStarting(true);
    try {
      const attempt = await api.startAttempt({ name: name.trim(), email: cleanEmail });
      setError('');
      onStartQuiz(attempt);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto my-8 px-4 relative z-10 animate-fadeIn">
      {/* Banner / Card */}
      <div className="bg-slate-900/80 backdrop-blur-2xl border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl shadow-indigo-950/40 relative overflow-hidden">
        
        {/* Glow accent */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Pattern Recognition Competition
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mb-1 bg-gradient-to-r from-white via-cyan-100 to-indigo-200 bg-clip-text text-transparent">
            Treasure Hunt Pattern Test
          </h2>
          <p className="text-sm font-semibold text-cyan-400 tracking-wide mb-3">
            Organized by R&amp;D Cell
          </p>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Test your logical reasoning, numerical series analysis, and spatial pattern recognition skills.
          </p>
        </div>

        {/* Instructions Box */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 mb-6 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-300 pb-2 border-b border-slate-800">
            <span className="flex items-center gap-1.5 font-medium text-cyan-300">
              <Layers className="w-4 h-4 text-cyan-400" />
              Active Exam Set:
            </span>
            <span className="font-bold text-white bg-slate-800 px-2 py-0.5 rounded-lg border border-slate-700">
              {getSetTitle(activeSet)}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <HelpCircle className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>15 Fill-in-the-Blank Qs</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <Clock className="w-4 h-4 text-purple-400 shrink-0" />
              <span>{examInfo ? `${Math.round(examInfo.examDurationSeconds / 60)} Minute Limit` : 'Timed Exam'}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Step-by-Step Explanations</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <Lock className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Verified Single Attempt</span>
            </div>
          </div>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleStart} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Student Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                placeholder="e.g. Alex Morgan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-slate-100 placeholder-slate-500 text-sm rounded-xl py-3 pl-10 pr-4 transition-all outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              College Email ID
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                placeholder="e.g. 25bk1a0500@stpetershyd.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-slate-100 placeholder-slate-500 text-sm rounded-xl py-3 pl-10 pr-4 transition-all outline-none"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1 pl-1">Enter your college email (e.g. 25bk1a0500@stpetershyd.com)</p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <Lock className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isStarting}
            className="w-full mt-4 group bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-semibold py-3.5 px-6 rounded-xl shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 flex items-center justify-center gap-2 text-sm transition-all duration-300 transform active:scale-[0.99]"
          >
            <span>{isStarting ? 'Starting Secure Attempt...' : 'Start Pattern Quiz'}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
      </div>
    </div>
  );
}
