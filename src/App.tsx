import React, { useState } from 'react';
import { ActiveModule, UserProfile, AlertNotification } from './types';
import { Navbar } from './components/Navbar';
import { StartPage } from './components/StartPage';
import { HomePage } from './components/HomePage';
import { RouteMapper } from './components/RouteMapper';
import { ImageSearch } from './components/ImageSearch';
import { AirEstimator } from './components/AirEstimator';
import { TutorialGuideModal } from './components/TutorialGuideModal';
import { ShareModal } from './components/ShareModal';
import { BookOpen, Bell, X, Shield, Radio } from 'lucide-react';

export default function App() {
  const [activeModule, setActiveModule] = useState<ActiveModule>('start');
  const [user, setUser] = useState<UserProfile>({
    email: '',
    name: '',
    alias: 'Delta-1 Emergency Responder',
    isAnonymous: false,
    role: 'Field Responder',
    isLoggedIn: false,
  });

  // Notifications Queue
  const [alerts, setAlerts] = useState<AlertNotification[]>([]);
  const [isAlertsOpen, setIsAlertsOpen] = useState<boolean>(false);

  // Modals
  const [isTutorialOpen, setIsTutorialOpen] = useState<boolean>(false);
  const [isShareOpen, setIsShareOpen] = useState<boolean>(false);

  const handleEnterApp = (profile: UserProfile) => {
    setUser(profile);
    setActiveModule('home');
  };

  const handleLogout = () => {
    setUser(prev => ({ ...prev, isLoggedIn: false }));
    setActiveModule('start');
  };

  const handlePushNotification = (notif: Omit<AlertNotification, 'id' | 'timestamp'>) => {
    const newAlert: AlertNotification = {
      ...notif,
      id: `ALT-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };
    setAlerts(prev => [newAlert, ...prev.slice(0, 19)]);
  };

  const dismissAlert = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navbar (only shown when in an active dashboard screen) */}
      {activeModule !== 'start' && (
        <Navbar
          activeModule={activeModule}
          onNavigate={(mod) => setActiveModule(mod)}
          user={user}
          onOpenShare={() => setIsShareOpen(true)}
          onLogout={handleLogout}
          alertCount={alerts.length}
        />
      )}

      {/* Main View Router */}
      <main className="flex-1">
        {activeModule === 'start' && (
          <StartPage onEnterApp={handleEnterApp} />
        )}

        {activeModule === 'home' && (
          <HomePage
            user={user}
            onSelectModule={(mod) => setActiveModule(mod)}
          />
        )}

        {activeModule === 'route-mapper' && (
          <RouteMapper onPushNotification={handlePushNotification} />
        )}

        {activeModule === 'image-search' && (
          <ImageSearch />
        )}

        {activeModule === 'air-estimator' && (
          <AirEstimator onPushNotification={handlePushNotification} />
        )}
      </main>

      {/* Floating Tutorial Guide & Alert Center Quick Controls (when logged in) */}
      {activeModule !== 'start' && (
        <div className="fixed bottom-5 right-5 z-40 flex items-center gap-2.5">
          {/* Notifications Indicator Button */}
          <button
            onClick={() => setIsAlertsOpen(!isAlertsOpen)}
            className="p-3 bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 rounded-full shadow-xl backdrop-blur-md transition-all relative"
            title="Active Emergency Alerts"
          >
            <Bell className="w-5 h-5 text-cyan-400" />
            {alerts.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-mono font-bold flex items-center justify-center animate-pulse">
                {alerts.length}
              </span>
            )}
          </button>

          {/* Tutorial Guide Launcher Button */}
          <button
            onClick={() => setIsTutorialOpen(true)}
            className="flex items-center gap-2 py-2.5 px-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold rounded-full shadow-xl transition-all text-xs"
          >
            <BookOpen className="w-4 h-4 text-slate-950" />
            <span>Operational Tutorial</span>
          </button>
        </div>
      )}

      {/* Alerts Drawer */}
      {isAlertsOpen && (
        <div className="fixed bottom-20 right-5 z-40 w-80 sm:w-96 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-4 space-y-3 max-h-96 overflow-y-auto">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
              <Radio className="w-3.5 h-3.5" />
              <span>INCIDENT NOTIFICATION FEED</span>
            </div>
            <button
              onClick={() => setIsAlertsOpen(false)}
              className="text-slate-400 hover:text-white text-xs"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {alerts.length === 0 ? (
            <div className="text-center py-6 text-xs text-slate-500 font-mono">
              No active threat alerts in queue.
            </div>
          ) : (
            <div className="space-y-2">
              {alerts.map((al) => (
                <div
                  key={al.id}
                  className={`p-2.5 rounded-lg border text-xs relative ${
                    al.type === 'danger'
                      ? 'bg-rose-950/40 border-rose-800/80 text-rose-200'
                      : al.type === 'warning'
                      ? 'bg-amber-950/40 border-amber-800/80 text-amber-200'
                      : 'bg-cyan-950/40 border-cyan-800/80 text-cyan-200'
                  }`}
                >
                  <div className="flex items-center justify-between font-mono text-[10px] text-slate-400 mb-1">
                    <span>[{al.module}] · {al.timestamp}</span>
                    <button
                      onClick={() => dismissAlert(al.id)}
                      className="text-slate-400 hover:text-white"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="font-semibold">{al.title}</div>
                  <p className="mt-0.5 text-[11px] opacity-90 leading-relaxed font-sans">
                    {al.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Global Modals */}
      <TutorialGuideModal
        isOpen={isTutorialOpen}
        onClose={() => setIsTutorialOpen(false)}
      />

      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        user={user}
        activeModule={activeModule}
      />
    </div>
  );
}
