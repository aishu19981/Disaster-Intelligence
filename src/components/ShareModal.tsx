import React, { useState } from 'react';
import { UserProfile, ActiveModule } from '../types';
import { Share2, X, Copy, Check, EyeOff, Shield, Radio, FileText } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  activeModule: ActiveModule;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  user,
  activeModule,
}) => {
  const [copied, setCopied] = useState(false);
  const [isAnonymousShare, setIsAnonymousShare] = useState(user.isAnonymous);
  const [shareAlias, setShareAlias] = useState(user.alias || 'Field Response Unit');

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.origin : 'https://aerointel-dispatch.net';
  const incidentId = `INC-${Math.floor(100000 + Math.random() * 900000)}`;

  const dispatchSummary = `[EMERGENCY DISPATCH REPORT]
Incident ID: ${incidentId}
Date/Time (UTC): ${new Date().toISOString()}
Active Operation: ${activeModule.toUpperCase()}
Reporting Entity: ${isAnonymousShare ? 'ANONYMOUS INCIDENT AGENT (ID REDACTED)' : shareAlias}
Classification: CIVIL PROTECTION / TACTICAL AWARENESS
Satellite Constellation: Sentinel-1 SAR / Sentinel-2 / Sentinel-5P / Zoom Earth
Dispatch Link: ${currentUrl}/#${activeModule}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(dispatchSummary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2 text-white font-semibold text-sm">
            <Share2 className="w-4 h-4 text-cyan-400" />
            <span>Share Emergency Telemetry Dispatch</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Anonymous Mode & Identity Toggle */}
        <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-lg space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <EyeOff className="w-4 h-4 text-cyan-400" />
              <div>
                <div className="text-xs font-semibold text-white">Anonymous Dissemination</div>
                <div className="text-[11px] text-slate-400">
                  Strip your user ID, name, and email from shared dispatches
                </div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={isAnonymousShare}
              onChange={(e) => setIsAnonymousShare(e.target.checked)}
              className="w-4 h-4 text-cyan-500 rounded border-slate-700 bg-slate-900 focus:ring-cyan-500"
            />
          </div>

          {!isAnonymousShare && (
            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">
                Custom Tactical Alias / Unit Call Sign
              </label>
              <input
                type="text"
                value={shareAlias}
                onChange={(e) => setShareAlias(e.target.value)}
                placeholder="e.g. Sector-4 Search & Rescue"
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>
          )}
        </div>

        {/* Dispatch Preview Box */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center justify-between">
            <span>Standard Military / Civil Dispatch Payload</span>
            <span className="text-[11px] font-mono text-cyan-400">INCIDENT ID: {incidentId}</span>
          </label>
          <pre className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-[11px] text-slate-300 font-mono whitespace-pre-wrap leading-relaxed overflow-x-auto max-h-48">
            {dispatchSummary}
          </pre>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={handleCopy}
            className="flex-1 py-2.5 px-4 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-semibold rounded-lg text-xs transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-slate-950" />
                <span>Copied Dispatch to Clipboard</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Dispatch Markdown</span>
              </>
            )}
          </button>
          <button
            onClick={onClose}
            className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-lg text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
