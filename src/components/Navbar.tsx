import React from 'react';
import { ActiveModule, UserProfile } from '../types';
import { Shield, Share2, LogOut, Radio } from 'lucide-react';

interface NavbarProps {
  activeModule: ActiveModule;
  onNavigate: (module: ActiveModule) => void;
  user: UserProfile;
  onOpenShare: () => void;
  onLogout: () => void;
  alertCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeModule,
  onNavigate,
  user,
  onOpenShare,
  onLogout,
  alertCount,
}) => {
  if (activeModule === 'start') {
    return null; // On start page, header is replaced by clean hero space
  }

  return (
    <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Zone - Single text element wordmark */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2.5 text-left text-slate-100 hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0 group focus:outline-none"
        >
          <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-800/80 flex items-center justify-center text-cyan-400 group-hover:border-cyan-500 transition-colors">
            <Radio className="w-4 h-4" />
          </div>
          <span className="text-base font-bold tracking-tight font-sans">
            AEROINTEL DISASTER RESPONSE
          </span>
        </button>

        {/* Zone 2: Navigation Links - 4 single-line text links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <button
            onClick={() => onNavigate('home')}
            className={`whitespace-nowrap transition-colors hover:text-cyan-400 ${
              activeModule === 'home'
                ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400 py-1'
                : 'text-slate-400'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => onNavigate('route-mapper')}
            className={`whitespace-nowrap transition-colors hover:text-cyan-400 ${
              activeModule === 'route-mapper'
                ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400 py-1'
                : 'text-slate-400'
            }`}
          >
            Route Mapper
          </button>
          <button
            onClick={() => onNavigate('image-search')}
            className={`whitespace-nowrap transition-colors hover:text-cyan-400 ${
              activeModule === 'image-search'
                ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400 py-1'
                : 'text-slate-400'
            }`}
          >
            Satellite Search
          </button>
          <button
            onClick={() => onNavigate('air-estimator')}
            className={`whitespace-nowrap transition-colors hover:text-cyan-400 ${
              activeModule === 'air-estimator'
                ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400 py-1'
                : 'text-slate-400'
            }`}
          >
            Air Estimator
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action & Session controls */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenShare}
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors whitespace-nowrap shadow-sm shadow-cyan-950 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share Dispatch</span>
          </button>

          {/* User / Alias Indicator */}
          <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-800 text-xs text-slate-400">
            <span className="font-mono text-slate-300">
              {user.isAnonymous ? 'ANON' : user.alias || user.name || 'GUEST'}
            </span>
            <button
              onClick={onLogout}
              title="Return to Launch Screen"
              className="p-1 text-slate-500 hover:text-slate-300 transition-colors rounded"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
