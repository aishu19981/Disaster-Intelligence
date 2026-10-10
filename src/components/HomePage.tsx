import React from 'react';
import { ActiveModule, UserProfile } from '../types';
import { ASSET_IMAGES } from '../data/mockData';
import { 
  Navigation, 
  Search, 
  Wind, 
  ArrowRight, 
  Satellite, 
  ShieldCheck, 
  Clock, 
  Radio, 
  Layers
} from 'lucide-react';

interface HomePageProps {
  user: UserProfile;
  onSelectModule: (module: ActiveModule) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ user, onSelectModule }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome & Tactical Command Ribbon */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
        <div>
          <div className="text-xs font-mono text-cyan-400 mb-1 flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>OPERATIONAL DISPATCH CONSOLE ACTIVE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-sans">
            Welcome, {user.isAnonymous ? 'Anonymous Incident Agent' : (user.alias || user.name)}
          </h1>
          <p className="mt-1 text-sm text-slate-400 max-w-2xl">
            Real-time geospatial Earth observation system uniting radar SAR flood mapping, historical & live satellite image search, and atmospheric toxicity predictive models.
          </p>
        </div>

        <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-6 shrink-0">
          <div className="space-y-1">
            <div className="text-[11px] font-mono text-slate-400">ACTIVE CONSTELLATION</div>
            <div className="text-sm font-semibold text-slate-200">Sentinel-1 / Sentinel-5P / GIBS</div>
            <div className="text-xs text-slate-400">
              Session Mode: <span className="text-cyan-400 font-medium">{user.isAnonymous ? 'Anonymous (ID Concealed)' : 'Verified Responder'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* The 3 Core Modules (Side by side 3-card grid) */}
      <div>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-white">Emergency Response Tracks</h2>
          <p className="text-xs text-slate-400">Select a specialized module to initiate telemetry inspection or route calculation.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Module 1: Post-Flood Route Mapper */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden flex flex-col hover:border-cyan-500/50 transition-all group shadow-md hover:shadow-cyan-950/40">
            {/* Visual Thumbnail */}
            <div className="relative h-48 w-full overflow-hidden bg-slate-950">
              <img
                src={ASSET_IMAGES.floodRouteThumb}
                alt="Post-Flood Satellite SAR Route Mapping"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
              <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md border border-slate-800 rounded px-2.5 py-1 text-[11px] font-mono text-cyan-400 flex items-center gap-1.5">
                <Navigation className="w-3 h-3 text-cyan-400" />
                <span>Track 2.1 · Route Mapper</span>
              </div>
            </div>

            {/* Content */}
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white group-hover:text-cyan-400 transition-colors">
                  Post-Flood Route Mapper
                </h3>
                <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                  Solves for the safest evacuation route across flooded road networks. Continuously integrates satellite flood updates and Dijkstra graph algorithms to avoid submerged arteries and minimize vehicular drowning risk.
                </p>

                <div className="mt-4 space-y-1.5 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <span className="text-cyan-400">✓</span>
                    <span>Graph-based shortest vs safest path</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-cyan-400">✓</span>
                    <span>Dynamic satellite pass simulation updates</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-cyan-400">✓</span>
                    <span>AI tactical evacuation directives</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800">
                <button
                  onClick={() => onSelectModule('route-mapper')}
                  className="w-full py-2.5 px-4 bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-200 font-medium rounded-lg text-xs transition-colors flex items-center justify-center gap-2 group-hover:bg-cyan-500 group-hover:text-slate-950"
                >
                  <span>Open Route Mapper</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Module 2: Satellite Image Search */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden flex flex-col hover:border-cyan-500/50 transition-all group shadow-md hover:shadow-cyan-950/40">
            {/* Visual Thumbnail */}
            <div className="relative h-48 w-full overflow-hidden bg-slate-950">
              <img
                src={ASSET_IMAGES.satelliteTimelineThumb}
                alt="Satellite Image Search Timeline Comparison"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
              <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md border border-slate-800 rounded px-2.5 py-1 text-[11px] font-mono text-cyan-400 flex items-center gap-1.5">
                <Search className="w-3 h-3 text-cyan-400" />
                <span>Track 2.2 · Image Search</span>
              </div>
            </div>

            {/* Content */}
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white group-hover:text-cyan-400 transition-colors">
                  Satellite Image "Google" Search
                </h3>
                <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                  Query satellite archives across timeline date ranges and disaster coordinates. Features interactive side-by-side Before/After flood sliders, water surface delta calculations, and Gemini multimodal semantic scene tagging.
                </p>

                <div className="mt-4 space-y-1.5 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <span className="text-cyan-400">✓</span>
                    <span>Interactive Before/After comparison slider</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-cyan-400">✓</span>
                    <span>Keyword & semantic tag image filtering</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-cyan-400">✓</span>
                    <span>Multispectral water coverage percentage (%)</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800">
                <button
                  onClick={() => onSelectModule('image-search')}
                  className="w-full py-2.5 px-4 bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-200 font-medium rounded-lg text-xs transition-colors flex items-center justify-center gap-2 group-hover:bg-cyan-500 group-hover:text-slate-950"
                >
                  <span>Open Image Search</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Module 3: Predictive Air Estimator */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden flex flex-col hover:border-cyan-500/50 transition-all group shadow-md hover:shadow-cyan-950/40">
            {/* Visual Thumbnail */}
            <div className="relative h-48 w-full overflow-hidden bg-slate-950">
              <img
                src={ASSET_IMAGES.airToxicityThumb}
                alt="Predictive Air Quality and Atmospheric Toxicity Map"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
              <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md border border-slate-800 rounded px-2.5 py-1 text-[11px] font-mono text-cyan-400 flex items-center gap-1.5">
                <Wind className="w-3 h-3 text-cyan-400" />
                <span>Track 2.3 · Air Estimator</span>
              </div>
            </div>

            {/* Content */}
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white group-hover:text-cyan-400 transition-colors">
                  Predictive Air Estimator
                </h3>
                <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                  Monitors multi-pollutant toxicity (NO₂, PM2.5, CO, SO₂, O₃) via Copernicus CAMS satellite telemetry, live Zoom Earth global integration, WHO limit toxicity tables, and 48-hour forward ML regression forecasting.
                </p>

                <div className="mt-4 space-y-1.5 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <span className="text-cyan-400">✓</span>
                    <span>Direct Zoom Earth live satellite integration</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-cyan-400">✓</span>
                    <span>Toxicity matrix vs WHO safety thresholds</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-cyan-400">✓</span>
                    <span>48-Hour ML predictive forecast curve</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800">
                <button
                  onClick={() => onSelectModule('air-estimator')}
                  className="w-full py-2.5 px-4 bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-200 font-medium rounded-lg text-xs transition-colors flex items-center justify-center gap-2 group-hover:bg-cyan-500 group-hover:text-slate-950"
                >
                  <span>Open Air Estimator</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Global Telemetry & Integration Specification Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-[11px] font-mono text-slate-400 uppercase">SAR SENSOR</div>
            <div className="text-lg font-bold text-white font-mono mt-1">Sentinel-1 C-SAR</div>
            <div className="text-[11px] text-slate-400 mt-0.5">All-weather cloud penetration</div>
          </div>
          <div>
            <div className="text-[11px] font-mono text-slate-400 uppercase">OPTICAL SATELLITE</div>
            <div className="text-lg font-bold text-white font-mono mt-1">Sentinel-2 MSI</div>
            <div className="text-[11px] text-slate-400 mt-0.5">10m multispectral resolution</div>
          </div>
          <div>
            <div className="text-[11px] font-mono text-slate-400 uppercase">ATMOSPHERIC SENSOR</div>
            <div className="text-lg font-bold text-white font-mono mt-1">TROPOMI S-5P</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Tropospheric NO₂ / PM2.5 trace</div>
          </div>
          <div>
            <div className="text-[11px] font-mono text-slate-400 uppercase">ROUTING ENGINE</div>
            <div className="text-lg font-bold text-white font-mono mt-1">Dijkstra + Flood Penalty</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Quadratic water depth cost</div>
          </div>
        </div>
      </div>
    </div>
  );
};
