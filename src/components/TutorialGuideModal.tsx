import React, { useState } from 'react';
import { 
  BookOpen, 
  X, 
  Navigation, 
  Search, 
  Wind, 
  Globe2, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Layers, 
  Sparkles,
  ExternalLink
} from 'lucide-react';

interface TutorialGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TutorialGuideModal: React.FC<TutorialGuideModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'intro' | 'route' | 'search' | 'air' | 'summary'>('intro');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-sans">
                Comprehensive Operational Tutorial Guide
              </h2>
              <p className="text-xs text-slate-400">
                Disaster Response & Environmental Intelligence Dashboard Manual
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-5 pt-3 bg-slate-950 border-b border-slate-800 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('intro')}
            className={`px-3 py-2 font-medium border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'intro'
                ? 'border-cyan-400 text-cyan-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            1. Introduction & Architecture
          </button>
          <button
            onClick={() => setActiveTab('route')}
            className={`px-3 py-2 font-medium border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'route'
                ? 'border-cyan-400 text-cyan-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            2. Module 1: Route Mapper
          </button>
          <button
            onClick={() => setActiveTab('search')}
            className={`px-3 py-2 font-medium border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'search'
                ? 'border-cyan-400 text-cyan-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            3. Module 2: Image Search
          </button>
          <button
            onClick={() => setActiveTab('air')}
            className={`px-3 py-2 font-medium border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'air'
                ? 'border-cyan-400 text-cyan-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            4. Module 3: Air & Zoom Earth
          </button>
          <button
            onClick={() => setActiveTab('summary')}
            className={`px-3 py-2 font-medium border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'summary'
                ? 'border-cyan-400 text-cyan-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            5. Concluding Summary
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-300 leading-relaxed font-sans flex-1">
          {/* SECTION 1: INTRODUCTION */}
          {activeTab === 'intro' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>Section 1: Mission Architecture & Dashboard Overview</span>
              </h3>
              <p>
                The <strong>Disaster Response & Environmental Intelligence Dashboard</strong> is a mission-critical web application that bridges multi-sensor satellite remote sensing with AI/ML algorithms to solve complex real-world emergencies during severe floods, infrastructure failures, and atmospheric toxic pollution events.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-3">
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <div className="font-semibold text-cyan-400 mb-1">Track 2.1: Route Mapper</div>
                  <p className="text-[11px] text-slate-400">
                    Graph-based Dijkstra solver dynamically re-weighted with satellite radar flood depth data.
                  </p>
                </div>
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <div className="font-semibold text-cyan-400 mb-1">Track 2.2: Image Search</div>
                  <p className="text-[11px] text-slate-400">
                    Timeline imagery engine with Before/After split comparison sliders and Gemini semantic tagging.
                  </p>
                </div>
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <div className="font-semibold text-cyan-400 mb-1">Track 2.3: Air Estimator</div>
                  <p className="text-[11px] text-slate-400">
                    Copernicus CAMS satellite chemistry, live Zoom Earth integration, WHO toxicity tables & 48-hr ML forecast.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
                <div className="font-semibold text-white">Getting Started & Session Identity:</div>
                <ul className="list-disc list-inside space-y-1 text-slate-400">
                  <li><strong>Instant Guest:</strong> Quick-deploy access for field responders requiring immediate calculations without administrative delay.</li>
                  <li><strong>Officer Sign In:</strong> Verified operational credentials for civil protection coordinators.</li>
                  <li><strong>Anonymous Mode:</strong> When enabled, responder name and email are stripped from all generated dispatch reports and export links, preserving operational security and privacy.</li>
                </ul>
              </div>
            </div>
          )}

          {/* SECTION 2: MODULE 1 ROUTE MAPPER */}
          {activeTab === 'route' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Navigation className="w-4 h-4 text-cyan-400" />
                <span>Section 2: Post-Flood Route Mapper (Track 2.1)</span>
              </h3>

              <div className="space-y-2">
                <h4 className="font-semibold text-cyan-400 text-sm">Step-by-Step Instructions:</h4>
                <ol className="list-decimal list-inside space-y-1.5 pl-1 text-slate-300">
                  <li><strong>Select or Search Any Location on Earth:</strong> Pick from preset disaster basins (Houston, Kerala, Valencia, Brisbane) or type any city into the geocoding search bar. You can also click directly on the interactive map to select nodes.</li>
                  <li><strong>Scrub Past-to-Present Flood Timeline:</strong> Toggle between <em>Past Peak Flood</em> (historical maximum crest), <em>Receding Transition</em>, and <em>Present Live Orbit</em> to see water levels shift dynamically across the network.</li>
                  <li><strong>Inspect the Three-Tier Route Evaluation:</strong>
                    <ul className="list-disc list-inside pl-3 pt-1 text-slate-400 space-y-0.5">
                      <li><strong className="text-emerald-400">1. Best Route (Safe):</strong> Highest elevation ridges, zero impassable roads, safe for civilian cars and ambulances.</li>
                      <li><strong className="text-amber-400">2. Average Route (Caution):</strong> Shorter detour, crosses shallow standing water (&lt;25cm), suitable for high-clearance SUVs and trucks.</li>
                      <li><strong className="text-rose-400">3. Worst Route (Hazardous):</strong> Geometric shortest path traversing deep flood channels (&gt;50-90cm), strictly impassable for civilian vehicles.</li>
                    </ul>
                  </li>
                  <li><strong>Trigger Satellite Orbital Pass:</strong> Click "Simulate Satellite Pass" to simulate a fresh Sentinel-1 SAR microwave pass.</li>
                  <li><strong>Request AI Tactical Briefing:</strong> Receive Gemini synthesized vehicle clearance directives and secondary hazard warnings.</li>
                </ol>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
                <h4 className="font-semibold text-white text-sm">Three-Tier Mathematical Formulation:</h4>
                <div className="p-2.5 bg-slate-900 rounded border border-slate-800 font-mono text-cyan-300 text-center text-xs">
                  Best Path Cost = Distance × [1 + (Flood Severity)² × 35 + Impassable Block]
                </div>
                <div className="p-2.5 bg-slate-900 rounded border border-slate-800 font-mono text-amber-300 text-center text-xs">
                  Average Path Cost = Distance × [1 + Flood Severity × 3]
                </div>
                <div className="p-2.5 bg-slate-900 rounded border border-slate-800 font-mono text-rose-300 text-center text-xs">
                  Worst Path Cost = Distance (Geometric Shortest, Ignores Inundation)
                </div>
              </div>

              <div className="space-y-1.5">
                <h4 className="font-semibold text-cyan-400 text-sm">Best Practices for Data Interpretation:</h4>
                <ul className="list-disc list-inside space-y-1 text-slate-300">
                  <li><strong>Green Solid Polyline:</strong> Safe passage corridor with confirmed elevation and water depth &lt; 20 cm.</li>
                  <li><strong>Dashed Amber/Red Polyline:</strong> Shortest geographic path, flagged with high vehicular drowning hazard.</li>
                  <li><strong>Elevation Readouts:</strong> Check node elevation markers (e.g., 31m vs 12m) to avoid low-lying riparian depressions.</li>
                </ul>
              </div>
            </div>
          )}

          {/* SECTION 3: MODULE 2 IMAGE SEARCH */}
          {activeTab === 'search' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Search className="w-4 h-4 text-cyan-400" />
                <span>Section 3: Satellite Image "Google" Search (Track 2.2)</span>
              </h3>

              <div className="space-y-2">
                <h4 className="font-semibold text-cyan-400 text-sm">Step-by-Step Instructions:</h4>
                <ol className="list-decimal list-inside space-y-1.5 pl-1 text-slate-300">
                  <li><strong>Keyword Search:</strong> Query specific terms such as <em>"flooded roads"</em>, <em>"river overflow"</em>, <em>"submerged bridges"</em>, or watershed names.</li>
                  <li><strong>Filter by Sensor Mission:</strong> Toggle between Sentinel-1 SAR (all-weather microwave radar), Sentinel-2 MSI (10m high-resolution optical), or NASA MODIS (daily wide-angle revisit).</li>
                  <li><strong>Inspect Split Before/After Slider:</strong> Drag the central dividing line left or right to compare pre-flood normal baseline with peak flood disaster extent.</li>
                  <li><strong>Observe Surface Water Delta (%):</strong> Review the calculated hydrological percentage increase in open water surface.</li>
                  <li><strong>Execute AI Semantic Scene Tagging:</strong> Click "AI Semantic Scene Tagging" to generate Gemini automated hazard descriptors and damage assessments.</li>
                </ol>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
                <h4 className="font-semibold text-white text-sm">Remote Sensing Sensor Differences:</h4>
                <ul className="list-disc list-inside space-y-1 text-slate-400">
                  <li><strong>Sentinel-1 C-SAR:</strong> Emits microwave radar pulses that pierce through severe monsoon storm clouds and night darkness, reflecting off standing water as specular black or false-color cyan.</li>
                  <li><strong>Sentinel-2 MSI:</strong> 13 spectral bands including Near-Infrared (NIR) and Shortwave Infrared (SWIR), ideal for calculating Normalized Difference Water Index (NDWI) and silt plume dispersion.</li>
                  <li><strong>NASA MODIS / Landsat:</strong> Long-term historical baselines for verifying pre-disaster seasonal floodplains.</li>
                </ul>
              </div>

              <div className="space-y-1.5">
                <h4 className="font-semibold text-cyan-400 text-sm">Best Practices for Data Interpretation:</h4>
                <ul className="list-disc list-inside space-y-1 text-slate-300">
                  <li>Always check the acquisition date: floodwaters peak 24–72 hours after peak precipitation due to upstream catchment lag.</li>
                  <li>Use the Before/After slider to confirm whether a water body is a permanent lake/reservoir or anomalous new flood surge.</li>
                </ul>
              </div>
            </div>
          )}

          {/* SECTION 4: MODULE 3 AIR ESTIMATOR & ZOOM EARTH */}
          {activeTab === 'air' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Wind className="w-4 h-4 text-cyan-400" />
                <span>Section 4: Predictive Air Estimator & Zoom Earth (Track 2.3)</span>
              </h3>

              <div className="space-y-2">
                <h4 className="font-semibold text-cyan-400 text-sm">Step-by-Step Instructions:</h4>
                <ol className="list-decimal list-inside space-y-1.5 pl-1 text-slate-300">
                  <li><strong>Select Observation Region:</strong> Choose from metropolitan basins (e.g., Houston, Delhi, Los Angeles, Santiago, London, Tokyo, Beijing).</li>
                  <li><strong>Toggle Display Engine:</strong> Switch between <em>Copernicus CAMS Local GIS</em> and <em>Zoom Earth Integration</em>.</li>
                  <li><strong>Operate Zoom Earth Layers:</strong> In Zoom Earth mode, select between <em>Wind Streamlines</em>, <em>Precipitation Radar</em>, <em>Active Wildfire Heat</em>, or <em>Live Satellite True Color</em>.</li>
                  <li><strong>Inspect the WHO Toxicity Table:</strong> Review measured pollutants (NO₂, PM2.5, PM10, CO, SO₂, O₃) against World Health Organization 24-hour limit benchmarks.</li>
                  <li><strong>Analyze 48-Hour ML Forecast:</strong> Hover over the forecast bar chart to view hourly projected AQI curves and confidence intervals.</li>
                  <li><strong>Request AI Toxicology Advisory:</strong> Receive Gemini clinical interpretations and sensitive group recommendations.</li>
                </ol>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
                <div className="flex items-center gap-2 font-semibold text-white text-sm">
                  <Globe2 className="w-4 h-4 text-cyan-400" />
                  <span>The Zoom Earth Integration System:</span>
                </div>
                <p>
                  Zoom Earth provides near-real-time global satellite imagery updated every 10–15 minutes from geostationary satellites (GOES-East, GOES-West, Himawari-9, Meteosat).
                </p>
                <ul className="list-disc list-inside space-y-1 text-slate-400">
                  <li><strong>Wind Vector Streamlines:</strong> Critical for predicting which residential sectors will receive toxic plumes from industrial fires or chemical plant inundations.</li>
                  <li><strong>Direct Deep-Linking:</strong> Click "Launch Zoom Earth External" to access full-resolution atmospheric tracking with animated storm tracks and isobar pressure curves.</li>
                  <li><strong>Thermal Hotspot Overlays:</strong> Pinpoint active industrial flares or biomass wildfires contributing to fine particulate (PM2.5) spikes.</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-cyan-400 text-sm">WHO Safety Limits & Clinical Interpretation:</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-[11px]">
                  <div className="p-2 bg-slate-950 rounded border border-slate-800">
                    <span className="text-slate-400">NO₂:</span> <strong className="text-white">25 µg/m³</strong>
                  </div>
                  <div className="p-2 bg-slate-950 rounded border border-slate-800">
                    <span className="text-slate-400">PM2.5:</span> <strong className="text-white">15 µg/m³</strong>
                  </div>
                  <div className="p-2 bg-slate-950 rounded border border-slate-800">
                    <span className="text-slate-400">PM10:</span> <strong className="text-white">45 µg/m³</strong>
                  </div>
                  <div className="p-2 bg-slate-950 rounded border border-slate-800">
                    <span className="text-slate-400">CO:</span> <strong className="text-white">4,000 µg/m³</strong>
                  </div>
                  <div className="p-2 bg-slate-950 rounded border border-slate-800">
                    <span className="text-slate-400">SO₂:</span> <strong className="text-white">40 µg/m³</strong>
                  </div>
                  <div className="p-2 bg-slate-950 rounded border border-slate-800">
                    <span className="text-slate-400">O₃:</span> <strong className="text-white">100 µg/m³</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 5: CONCLUDING SUMMARY */}
          {activeTab === 'summary' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Section 5: Concluding Summary & Incident Dispatch Protocols</span>
              </h3>
              <p>
                In catastrophic disasters, no single data source suffices. The true operational power of the <strong>Disaster Response & Environmental Intelligence Dashboard</strong> stems from the seamless triad of all three tracks:
              </p>

              <div className="space-y-2 p-4 bg-slate-950 border border-slate-800 rounded-lg">
                <div className="font-semibold text-white">Triad Synergy in Practice:</div>
                <p>
                  1. <strong>Track 2.2 (Satellite Search)</strong> detects an embankment rupture and verifies that a chemical storage depot is inundated.
                  <br />
                  2. <strong>Track 2.3 (Air Estimator & Zoom Earth)</strong> reads wind direction streamlines and tracks toxic SO₂ / NO₂ atmospheric plumes drifting toward populated corridors.
                  <br />
                  3. <strong>Track 2.1 (Route Mapper)</strong> incorporates the water levels and wind hazards to dynamically route emergency evacuation convoys safely around both the waterlogged roads and the toxic gas plume.
                </p>
              </div>

              <div className="p-4 bg-cyan-950/40 border border-cyan-800/60 rounded-lg space-y-1.5">
                <div className="font-semibold text-cyan-300">Operational Best Practice Checklist:</div>
                <ul className="list-disc list-inside space-y-1 text-slate-300">
                  <li>Verify satellite orbital timestamps before dispatching field units.</li>
                  <li>Use Anonymous Mode when disseminating maps to public or civilian channels to protect responder identity.</li>
                  <li>Consult Gemini AI advisories for synthesized vehicle clearance instructions and secondary hazard alerts.</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-500 font-mono">
            AEROINTEL EMERGENCY OPERATIONAL MANUAL v2.4
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold rounded-lg text-xs transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
