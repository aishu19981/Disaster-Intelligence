import React, { useState } from 'react';
import { UserProfile } from '../types';
import { ASSET_IMAGES } from '../data/mockData';
import { Globe, Shield, ArrowRight, UserCheck, EyeOff, Radio } from 'lucide-react';

interface StartPageProps {
  onEnterApp: (user: UserProfile) => void;
}

export const StartPage: React.FC<StartPageProps> = ({ onEnterApp }) => {
  const [tab, setTab] = useState<'guest' | 'login' | 'register'>('guest');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [alias, setAlias] = useState('Delta-1 Emergency Responder');
  const [isAnonymous, setIsAnonymous] = useState(false);

  const handleGuestEnter = (e: React.FormEvent) => {
    e.preventDefault();
    onEnterApp({
      email: isAnonymous ? 'anonymous@disaster-grid.net' : 'guest.responder@aerointel.org',
      name: isAnonymous ? 'Anonymous Incident Agent' : (name || 'Guest Responder'),
      alias: isAnonymous ? 'SEC-ANON-99' : (alias || 'Field Unit Alpha'),
      isAnonymous,
      role: 'Emergency Dispatcher',
      isLoggedIn: true,
    });
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onEnterApp({
      email: email || 'officer@aerointel.org',
      name: name || email.split('@')[0] || 'Field Commander',
      alias: alias || 'Command-Central',
      isAnonymous,
      role: 'Civil Protection Coordinator',
      isLoggedIn: true,
    });
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-hidden bg-slate-950">
      {/* Satellite Earth Background */}
      <div className="absolute inset-0 z-0">
        <img
          src={ASSET_IMAGES.earthBg}
          alt="NASA High-Resolution Satellite Earth View from Orbit"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-1000 ease-out"
        />
        {/* Measured dark gradient scrim for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/75 to-slate-950/50" />
      </div>

      {/* Main Frosted Obsidian Card */}
      <div className="relative z-10 w-full max-w-lg bg-slate-900/85 backdrop-blur-xl border border-slate-700/80 rounded-2xl shadow-2xl p-6 sm:p-8 transition-all">
        {/* Header telemetry & Title */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-950/80 border border-cyan-800/80 rounded-lg text-cyan-400 text-xs font-mono mb-3">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>GEO-ORBITAL TELEMETRY READY</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-sans text-balance">
            Disaster Response & Environmental Intelligence
          </h1>
          <p className="mt-2 text-sm text-slate-300 font-sans">
            Multispectral Satellite Remote Sensing · Dynamic Safe Routing · Atmospheric Toxicity Forensics
          </p>

          {/* Quick Launch Direct Button */}
          <div className="mt-4">
            <button
              type="button"
              onClick={handleGuestEnter}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-950"
            >
              <span>Instant Launch: Open Interactive GIS Maps & Zoom Earth</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-1 p-1 bg-slate-950/70 border border-slate-800 rounded-lg mb-6">
          <button
            type="button"
            onClick={() => setTab('guest')}
            className={`flex-1 py-2 text-xs font-medium rounded-md transition-colors ${
              tab === 'guest'
                ? 'bg-cyan-500 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Instant Guest
          </button>
          <button
            type="button"
            onClick={() => setTab('login')}
            className={`flex-1 py-2 text-xs font-medium rounded-md transition-colors ${
              tab === 'login'
                ? 'bg-cyan-500 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Officer Sign In
          </button>
          <button
            type="button"
            onClick={() => setTab('register')}
            className={`flex-1 py-2 text-xs font-medium rounded-md transition-colors ${
              tab === 'register'
                ? 'bg-cyan-500 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Register
          </button>
        </div>

        {/* Guest Form */}
        {tab === 'guest' && (
          <form onSubmit={handleGuestEnter} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Responder Call Sign / Alias
              </label>
              <input
                type="text"
                value={alias}
                onChange={(e) => setAlias(e.target.value)}
                placeholder="e.g. Delta-1 Field Responder"
                className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            {/* Anonymous Mode Toggle */}
            <div className="flex items-center justify-between p-3 bg-slate-950/50 border border-slate-800 rounded-lg">
              <div className="flex items-center gap-2.5">
                <EyeOff className="w-4 h-4 text-cyan-400 shrink-0" />
                <div>
                  <div className="text-xs font-semibold text-slate-200">Anonymous Mode</div>
                  <div className="text-[11px] text-slate-400">
                    Omit responder ID in incident reports and dispatches
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="w-4 h-4 text-cyan-500 rounded border-slate-700 bg-slate-900 focus:ring-cyan-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-semibold rounded-lg text-sm transition-colors flex items-center justify-center gap-2 shadow-lg shadow-cyan-950"
            >
              <span>Access Emergency Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Email Login Form */}
        {tab === 'login' && (
          <form onSubmit={handleAuthSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Officer Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="officer@disaster-grid.net"
                className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-950/50 border border-slate-800 rounded-lg">
              <div className="flex items-center gap-2.5">
                <EyeOff className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="text-xs text-slate-300">Anonymous session toggle</span>
              </div>
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="w-4 h-4 text-cyan-500 rounded border-slate-700 bg-slate-900 focus:ring-cyan-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-semibold rounded-lg text-sm transition-colors flex items-center justify-center gap-2 shadow-lg shadow-cyan-950"
            >
              <span>Authenticate & Enter</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Register Form */}
        {tab === 'register' && (
          <form onSubmit={handleAuthSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Dr. Eleanor Vance"
                className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Official Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.vance@agency.gov"
                className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Operational Unit Callsign
              </label>
              <input
                type="text"
                value={alias}
                onChange={(e) => setAlias(e.target.value)}
                placeholder="Sector-4 Commander"
                className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-semibold rounded-lg text-sm transition-colors flex items-center justify-center gap-2 shadow-lg shadow-cyan-950"
            >
              <span>Create Account & Enter</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Footer info */}
        <div className="mt-6 pt-4 border-t border-slate-800 text-center">
          <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
            <span>Sentinel-1 SAR</span>
            <span aria-hidden="true">·</span>
            <span>NASA Earthdata</span>
            <span aria-hidden="true">·</span>
            <span>Copernicus CAMS</span>
            <span aria-hidden="true">·</span>
            <span>Zoom Earth</span>
          </div>
        </div>
      </div>
    </div>
  );
};
