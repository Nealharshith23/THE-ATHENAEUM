import React from 'react';
import { Shield, UserCheck, Sparkles, BookOpen, Layers, LogOut } from 'lucide-react';

export default function Header({ currentRole, user, activeSet, onToggleRole, onLogout }) {
  const getSetLabel = (setKey) => {
    if (setKey === 'setA') return 'Set A (Pattern Round)';
    if (setKey === 'setB') return 'Set B (Pattern Round)';
    return 'Custom Set';
  };

  return (
    <header className="relative z-20 w-full max-w-6xl mx-auto px-4 pt-6 pb-2">
      <div className="bg-slate-900/70 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-4 shadow-2xl flex flex-wrap items-center justify-between gap-4">
        
        {/* Left: Event Title & Logo */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-cyan-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold bg-gradient-to-r from-white via-cyan-100 to-indigo-200 bg-clip-text text-transparent tracking-tight">
                Treasure Hunt Pattern Test
              </h1>
            </div>
            <p className="text-xs font-semibold text-cyan-400/90 tracking-wide">Organized by R&amp;D Cell</p>
          </div>
        </div>

        {/* Middle: Active Set Badge */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/60 border border-slate-800">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs text-slate-400">Broadcasting Active Set:</span>
          <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            {getSetLabel(activeSet)}
          </span>
        </div>

        {/* Right: User / Role Status & Navigation */}
        <div className="flex items-center gap-3 ml-auto">
          {user && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-950/40 border border-indigo-800/40 text-xs text-indigo-200">
              <UserCheck className="w-4 h-4 text-indigo-400" />
              <span className="font-semibold">{user.name}</span>
              <span className="text-slate-400">({user.email})</span>
            </div>
          )}

          {/* Toggle Role Button */}
          <button
            onClick={onToggleRole}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-medium text-xs transition-all duration-300 border shadow-lg ${
              currentRole === 'admin'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30 shadow-amber-500/10'
                : 'bg-indigo-600/20 text-indigo-300 border-indigo-500/40 hover:bg-indigo-600/30 shadow-indigo-500/10'
            }`}
          >
            {currentRole === 'admin' ? (
              <>
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span>Switch to Student View</span>
              </>
            ) : (
              <>
                <Shield className="w-4 h-4 text-indigo-400" />
                <span>Admin Dashboard</span>
              </>
            )}
          </button>

          {user && (
            <button
              onClick={onLogout}
              title="Logout"
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 border border-slate-700/60 hover:border-rose-500/40 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

