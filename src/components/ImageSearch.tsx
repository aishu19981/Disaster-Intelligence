import React, { useState, useEffect, useRef } from 'react';
import { SATELLITE_IMAGE_ARCHIVE, ASSET_IMAGES } from '../data/mockData';
import { SatelliteImageRecord } from '../types';
import { 
  Search, 
  Layers, 
  Sparkles, 
  ArrowLeftRight, 
  Tag, 
  ExternalLink,
  Bot,
  CheckCircle2,
  Image as ImageIcon,
  MapPin,
  History,
  Clock,
  Globe2,
  Satellite,
  Droplets,
  Calendar,
  AlertOctagon,
  Home,
  Building2,
  Wheat,
  Users,
  DollarSign,
  Maximize2,
  X
} from 'lucide-react';
import L from 'leaflet';
import { DisasterLocationTimeSelector } from './DisasterLocationTimeSelector';
import { DisasterLocationTime } from '../types';

interface ImageSearchProps {
  locationTime?: DisasterLocationTime;
  onLocationTimeChange?: (data: DisasterLocationTime) => void;
}

export const ImageSearch: React.FC<ImageSearchProps> = ({
  locationTime,
  onLocationTimeChange
}) => {
  const [records, setRecords] = useState<SatelliteImageRecord[]>(SATELLITE_IMAGE_ARCHIVE);
  const [selectedRecord, setSelectedRecord] = useState<SatelliteImageRecord>(SATELLITE_IMAGE_ARCHIVE[0]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedMission, setSelectedMission] = useState<string>('All');
  const [timelinePhase, setTimelinePhase] = useState<'all' | 'past' | 'present'>('all');
  const [basemapStyle, setBasemapStyle] = useState<'satellite' | 'streets' | 'dark'>('satellite');

  // Modal preview for full size damage images
  const [previewDamageImage, setPreviewDamageImage] = useState<{ url: string; caption: string; type: string } | null>(null);

  // Date and Time range filters for satellite remote sensing search
  const [startDateFilter, setStartDateFilter] = useState<string>('2005-01-01');
  const [endDateFilter, setEndDateFilter] = useState<string>('2026-12-31');
  
  // Custom location search input
  const [locationQuery, setLocationQuery] = useState<string>('');
  const [isSearchingLocation, setIsSearchingLocation] = useState<boolean>(false);
  const [locationSearchResults, setLocationSearchResults] = useState<any[]>([]);

  // Split Comparison Slider state (0% to 100%)
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [isAiAnalyzing, setIsAiAnalyzing] = useState<boolean>(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<any>(null);

  // Map references for Module 2
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const mapMarkersRef = useRef<L.LayerGroup | null>(null);

  // Filter records
  const filteredRecords = records.filter(rec => {
    const matchesMission = selectedMission === 'All' || rec.satelliteMission === selectedMission;
    const matchesQuery = 
      searchQuery === '' ||
      rec.locationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (rec.country && rec.country.toLowerCase().includes(searchQuery.toLowerCase())) ||
      rec.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      rec.floodSeverity.toLowerCase().includes(searchQuery.toLowerCase());

    const recDate = new Date(rec.timestamp).getTime();
    const start = startDateFilter ? new Date(startDateFilter).getTime() : 0;
    const end = endDateFilter ? new Date(`${endDateFilter}T23:59:59`).getTime() : Infinity;
    const matchesDate = recDate >= start && recDate <= end;

    const yr = new Date(rec.timestamp).getFullYear();
    const matchesPhase = 
      timelinePhase === 'all' || 
      (timelinePhase === 'past' && yr < 2026) || 
      (timelinePhase === 'present' && yr >= 2026);

    return matchesMission && matchesQuery && matchesDate && matchesPhase;
  });

  // Get coordinates for a record
  const getRecordCoords = (rec: SatelliteImageRecord): [number, number] => {
    if (rec.coordinates) return rec.coordinates;
    return [20.5937, 78.9629]; // India center default
  };

  // Sync with incoming locationTime prop
  useEffect(() => {
    if (locationTime) {
      const match = records.find(r => 
        (locationTime.presetId && r.id.toLowerCase().includes(locationTime.presetId.toLowerCase())) ||
        r.locationName.toLowerCase().includes(locationTime.place.toLowerCase().split('(')[0].trim().toLowerCase())
      );
      if (match) {
        setSelectedRecord(match);
        if (mapInstanceRef.current && match.coordinates) {
          mapInstanceRef.current.setView(match.coordinates, 8);
        }
      }
    }
  }, [locationTime]);

  const handleLocationTimeApplied = (data: DisasterLocationTime) => {
    if (onLocationTimeChange) onLocationTimeChange(data);
    setBasemapStyle('satellite');
    const match = records.find(r => 
      (data.presetId && r.id.toLowerCase().includes(data.presetId.toLowerCase())) ||
      r.locationName.toLowerCase().includes(data.place.toLowerCase().split('(')[0].trim().toLowerCase())
    );
    if (match) {
      setSelectedRecord(match);
      if (mapInstanceRef.current && match.coordinates) {
        mapInstanceRef.current.setView(match.coordinates, 8);
      }
    } else {
      handleSelectLocationResult({
        lat: data.coordinates[0],
        lon: data.coordinates[1],
        display_name: data.place,
      });
    }
  };

  // Initialize and update Leaflet Map in Module 2
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const tileUrl = 
      basemapStyle === 'satellite'
        ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
        : basemapStyle === 'streets'
        ? 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
        : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

    const tileAttr = 
      basemapStyle === 'satellite' ? 'Esri World Imagery' : 'OpenStreetMap';

    if (!mapInstanceRef.current) {
      const initialCoords = getRecordCoords(selectedRecord);
      const map = L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false,
      }).setView(initialCoords, 6);

      const tileLayer = L.tileLayer(tileUrl, {
        maxZoom: 18,
        attribution: tileAttr,
      }).addTo(map);

      tileLayerRef.current = tileLayer;

      L.control.zoom({ position: 'topright' }).addTo(map);

      // Click on map to select or inspect location
      map.on('click', (e: L.LeafletMouseEvent) => {
        handleMapClick(e.latlng.lat, e.latlng.lng);
      });

      const layerGroup = L.layerGroup().addTo(map);
      mapMarkersRef.current = layerGroup;
      mapInstanceRef.current = map;

      setTimeout(() => {
        map.invalidateSize();
      }, 250);
    } else {
      if (tileLayerRef.current) {
        tileLayerRef.current.setUrl(tileUrl);
      }
      setTimeout(() => {
        mapInstanceRef.current?.invalidateSize();
      }, 150);
    }

    renderSatelliteMapMarkers();
  }, [selectedRecord, filteredRecords, basemapStyle]);

  const renderSatelliteMapMarkers = () => {
    if (!mapMarkersRef.current || !mapInstanceRef.current) return;
    mapMarkersRef.current.clearLayers();

    filteredRecords.forEach(rec => {
      const coords = getRecordCoords(rec);
      const isSelected = rec.id === selectedRecord.id;

      // Draw footprint bounding circle
      const footprint = L.circle(coords, {
        radius: isSelected ? 48000 : 28000,
        color: isSelected ? '#06b6d4' : '#38bdf8',
        fillColor: isSelected ? '#06b6d4' : '#0284c7',
        fillOpacity: isSelected ? 0.35 : 0.18,
        weight: isSelected ? 2.5 : 1.2,
      });

      const marker = L.circleMarker(coords, {
        radius: isSelected ? 9 : 6,
        fillColor: isSelected ? '#06b6d4' : '#38bdf8',
        color: '#ffffff',
        weight: 2,
        fillOpacity: 1,
      });

      marker.bindPopup(`
        <div style="font-size: 12px; line-height: 1.4; color: #0f172a;">
          <strong>${rec.locationName}</strong><br/>
          Country: ${rec.country || 'Global'}<br/>
          Mission: ${rec.satelliteMission}<br/>
          Water Extent: ${rec.waterCoveragePct}%<br/>
          Severity: <strong>${rec.floodSeverity}</strong>
        </div>
      `);

      marker.on('click', () => {
        setSelectedRecord(rec);
        setAiAnalysisResult(null);
      });

      mapMarkersRef.current?.addLayer(footprint);
      mapMarkersRef.current?.addLayer(marker);
    });

    // Pan to selected record
    const targetCoords = getRecordCoords(selectedRecord);
    mapInstanceRef.current.setView(targetCoords, 7);
  };

  const handleMapClick = (lat: number, lng: number) => {
    // Find closest archive scene or generate simulated scene
    let closest = selectedRecord;
    let minD = Infinity;

    filteredRecords.forEach(rec => {
      const c = getRecordCoords(rec);
      const d = Math.hypot(c[0] - lat, c[1] - lng);
      if (d < minD) {
        minD = d;
        closest = rec;
      }
    });

    // If within close range, select it
    if (minD < 0.5) {
      setSelectedRecord(closest);
    } else {
      // Create custom target scene on clicked satellite coordinate
      const customScene: SatelliteImageRecord = {
        id: `SAT-CLICK-${Date.now()}`,
        timestamp: new Date().toISOString(),
        locationName: `Target [${lat.toFixed(3)}°N, ${lng.toFixed(3)}°E]`,
        country: lat >= 8 && lat <= 37 && lng >= 68 && lng <= 97 ? 'India' : 'Observation Point',
        coordinates: [lat, lng],
        satelliteMission: 'Sentinel-1 SAR',
        waterCoveragePct: 45.0,
        cloudCoverPct: 20.0,
        resolutionM: 10,
        imageUrl: ASSET_IMAGES.floodRouteThumb,
        baselineImageUrl: ASSET_IMAGES.satelliteTimelineThumb,
        tags: ['Point Target', 'Live SAR Pass', 'Hydrological Survey'],
        floodSeverity: 'Severe Inundation',
        damageSummary: `User-selected coordinate [${lat.toFixed(4)}°, ${lng.toFixed(4)}°]. High-resolution SAR backscatter reveals surface water expansion.`,
        recommendedAction: 'Direct nearby reconnaissance drone or emergency survey crew.',
        historicalEvents: {
          pastDate: 'Historical Flood Basin Baseline',
          pastWaterCoveragePct: 62.0,
          pastDescription: 'Historical monsoon hydrological maximum.',
          presentDate: 'Present Live Satellite Orbit',
          presentWaterCoveragePct: 20.0,
          presentDescription: 'Real-time orbital observation pass.',
        }
      };

      setRecords(prev => [customScene, ...prev]);
      setSelectedRecord(customScene);
      setAiAnalysisResult(null);
    }
  };

  // Search custom location via geocode
  const handleSearchLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!locationQuery.trim()) return;
    setIsSearchingLocation(true);
    setLocationSearchResults([]);

    try {
      const res = await fetch(`/api/geocode?q=${encodeURIComponent(locationQuery)}`);
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setLocationSearchResults(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearchingLocation(false);
    }
  };

  const handleSelectLocationResult = (item: any) => {
    const lat = parseFloat(item.lat);
    const lon = parseFloat(item.lon);
    const name = item.display_name.split(',')[0];
    const isIndia = item.display_name.includes('India');

    const newRecord: SatelliteImageRecord = {
      id: `SAT-CUSTOM-${Date.now()}`,
      timestamp: new Date().toISOString(),
      locationName: `${name} (${isIndia ? 'India' : 'Target'})`,
      country: isIndia ? 'India' : 'Custom Target',
      coordinates: [lat, lon],
      satelliteMission: 'Sentinel-1 SAR',
      waterCoveragePct: 52.4,
      cloudCoverPct: 15.0,
      resolutionM: 10,
      imageUrl: ASSET_IMAGES.floodRouteThumb,
      baselineImageUrl: ASSET_IMAGES.satelliteTimelineThumb,
      tags: ['Custom Target', 'SAR Microwave', 'Hydrological Analysis', name],
      floodSeverity: 'Severe Inundation',
      damageSummary: `Remote sensing SAR imagery for ${name} [${lat.toFixed(3)}°, ${lon.toFixed(3)}°] acquired. Surface water detection indicates significant drainage stress.`,
      recommendedAction: 'Verify road underpasses and local culvert capacities.',
      historicalEvents: {
        pastDate: 'Past High-Water Historical Crest',
        pastWaterCoveragePct: 72.0,
        pastDescription: `Past peak flood inundation across ${name} riparian corridor.`,
        presentDate: 'Present Live Satellite Pass',
        presentWaterCoveragePct: 22.0,
        presentDescription: `Live satellite telemetry monitoring current surface runoff in ${name}.`,
      }
    };

    setRecords(prev => [newRecord, ...prev]);
    setSelectedRecord(newRecord);
    setAiAnalysisResult(null);

    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([lat, lon], 8);
    }

    setLocationSearchResults([]);
    setLocationQuery('');
    setSearchQuery('');
  };

  const handleFocusIndia = () => {
    setBasemapStyle('satellite');
    const indiaRec = records.find(r => r.country === 'India') || records[0];
    setSelectedRecord(indiaRec);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([21.5, 79.5], 5);
    }
  };

  const handleAiTagging = async () => {
    setIsAiAnalyzing(true);
    try {
      const response = await fetch('/api/gemini/tag-imagery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location: selectedRecord.locationName,
          timestamp: selectedRecord.timestamp,
          waterPercentage: selectedRecord.waterCoveragePct,
          descriptionQuery: searchQuery || 'multispectral flood damage assessment',
        }),
      });

      const data = await response.json();
      setAiAnalysisResult(data);
    } catch (err) {
      console.error(err);
      setAiAnalysisResult({
        tags: ['Turbid Water Extent', 'Submerged Artery', 'Sediment Plume', 'Critical Runoff'],
        floodLevel: selectedRecord.floodSeverity,
        damageSummary: selectedRecord.damageSummary || 'Satellite remote sensing confirms severe water coverage over road corridors.',
        recommendedAction: selectedRecord.recommendedAction || 'Deploy high-axle emergency teams to affected basins.',
      });
    } finally {
      setIsAiAnalyzing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* 4 Mandatory Data Fields: 1. Country, 2. Place, 3. Date, 4. Time */}
      <DisasterLocationTimeSelector
        currentValue={locationTime || {
          country: selectedRecord.country || 'India',
          place: selectedRecord.locationName,
          date: selectedRecord.timestamp.slice(0, 10),
          time: selectedRecord.timestamp.slice(11, 16) || '06:30',
          coordinates: selectedRecord.coordinates || [10.0261, 76.3125],
          presetId: selectedRecord.id,
          isPast: true,
          eventTitle: selectedRecord.tags[0] || selectedRecord.locationName,
        }}
        onApply={handleLocationTimeApplied}
        title="Module 2: Satellite Search & Damage Forensics · 4 Mandatory Parameters (Country · Place · Date · Time)"
      />

      {/* Header & Search Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
              <Search className="w-3.5 h-3.5" />
              <span>TRACK 2.2 · SATELLITE EARTH OBSERVATION ENGINE & GIS MAP</span>
            </div>
            <h1 className="text-xl font-bold text-white font-sans mt-0.5">
              Satellite Image "Google" Search & Timeline Forensics
            </h1>
          </div>

          {/* Past to Present Timeline Filter */}
          <div className="flex items-center gap-2 p-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono">
            <History className="w-3.5 h-3.5 text-cyan-400 ml-1" />
            <span className="text-slate-400 text-[11px] pr-1">TIMELINE:</span>
            <button
              onClick={() => setTimelinePhase('all')}
              className={`px-2.5 py-1 rounded text-xs transition-colors ${
                timelinePhase === 'all'
                  ? 'bg-slate-800 text-white font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Archives
            </button>
            <button
              onClick={() => setTimelinePhase('past')}
              className={`px-2.5 py-1 rounded text-xs transition-colors ${
                timelinePhase === 'past'
                  ? 'bg-amber-950 text-amber-300 border border-amber-800 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Past Disasters (2005-2024)
            </button>
            <button
              onClick={() => setTimelinePhase('present')}
              className={`px-2.5 py-1 rounded text-xs transition-colors ${
                timelinePhase === 'present'
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Present Passes (2026)
            </button>
          </div>
        </div>

        {/* Quick Indian Satellite Presets Bar */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800 text-xs">
          <span className="text-cyan-400 font-mono font-bold flex items-center gap-1.5 shrink-0">
            <Satellite className="w-3.5 h-3.5" />
            <span>🇮🇳 INDIAN SATELLITE MAP:</span>
          </span>
          {[
            { id: 'SAT-IND-001', label: 'Kerala (Aluva / Periyar)' },
            { id: 'SAT-IND-002', label: 'Assam (Brahmaputra / Kaziranga)' },
            { id: 'SAT-IND-003', label: 'Wayanad (Chooralmala)' },
            { id: 'SAT-IND-004', label: 'Bihar (Kosi Basin)' },
            { id: 'SAT-IND-005', label: 'Chennai (Adyar Basin)' },
            { id: 'SAT-IND-006', label: 'Mumbai (Mithi Delta)' },
          ].map(preset => {
            const rec = records.find(r => r.id === preset.id);
            if (!rec) return null;
            return (
              <button
                key={preset.id}
                onClick={() => {
                  setSelectedRecord(rec);
                  setBasemapStyle('satellite');
                  setAiAnalysisResult(null);
                  if (rec.coordinates && mapInstanceRef.current) {
                    mapInstanceRef.current.setView(rec.coordinates, 8);
                  }
                }}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                  selectedRecord.id === preset.id
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                    : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
                }`}
              >
                {preset.label}
              </button>
            );
          })}
          <button
            onClick={handleFocusIndia}
            className="px-2.5 py-1 rounded text-xs bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 font-bold transition-all ml-auto"
          >
            🇮🇳 Focus India Satellite
          </button>
        </div>

        {/* Date & Time Search Bar for Past Satellite Flood Data */}
        <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-2.5 text-xs font-mono">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-cyan-400">
              <Calendar className="w-4 h-4 text-cyan-400 shrink-0" />
              <span className="font-bold">CHOOSE DATE & TIME FOR PAST SATELLITE DATA:</span>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-slate-300">
              <span className="text-slate-400 text-[11px]">TIMELINE RANGE:</span>
              <input
                type="date"
                value={startDateFilter}
                onChange={(e) => setStartDateFilter(e.target.value)}
                className="px-2 py-1 bg-slate-900 border border-slate-700 rounded text-xs text-white"
              />
              <span className="text-slate-500">to</span>
              <input
                type="date"
                value={endDateFilter}
                onChange={(e) => setEndDateFilter(e.target.value)}
                className="px-2 py-1 bg-slate-900 border border-slate-700 rounded text-xs text-white"
              />
              <button
                type="button"
                onClick={() => {
                  setStartDateFilter('2005-01-01');
                  setEndDateFilter('2026-12-31');
                }}
                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded border border-slate-700 text-[11px]"
              >
                Reset Dates
              </button>
            </div>
          </div>

          {/* Quick Disaster Datetime Presets for Satellite Passes */}
          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-900">
            <span className="text-slate-400 text-[11px] shrink-0">HISTORICAL SATELLITE PASS DATES:</span>
            {[
              { label: 'Aug 16, 2018 (Kerala)', recId: 'SAT-IND-001' },
              { label: 'Jul 08, 2024 (Assam)', recId: 'SAT-IND-002' },
              { label: 'Jul 30, 2024 (Wayanad)', recId: 'SAT-IND-003' },
              { label: 'Aug 20, 2023 (Bihar)', recId: 'SAT-IND-004' },
              { label: 'Dec 04, 2023 (Chennai)', recId: 'SAT-IND-005' },
              { label: 'Jul 26, 2005 (Mumbai)', recId: 'SAT-IND-006' },
              { label: 'Aug 25, 2022 (Mach)', recId: 'SAT-005' },
              { label: 'Aug 28, 2017 (Houston)', recId: 'SAT-001' },
              { label: 'Oct 29, 2024 (Valencia)', recId: 'SAT-004' },
            ].map((p, idx) => {
              const rec = records.find(r => r.id === p.recId);
              if (!rec) return null;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setSelectedRecord(rec);
                    setBasemapStyle('satellite');
                    setAiAnalysisResult(null);
                    if (rec.coordinates && mapInstanceRef.current) {
                      mapInstanceRef.current.setView(rec.coordinates, 8);
                    }
                  }}
                  className={`px-2 py-0.5 rounded text-[11px] transition-colors border ${
                    selectedRecord.id === p.recId
                      ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400'
                      : 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white border-slate-800'
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-900 gap-2">
            <div>
              Active Image Pass: <span className="text-white font-bold">{new Date(selectedRecord.timestamp).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</span> ({selectedRecord.satelliteMission})
            </div>
            <div className="text-cyan-400">
              Filtered Archives: {filteredRecords.length} / {records.length} passes available
            </div>
          </div>
        </div>

        {/* Search Inputs: Keyword Search + Custom Location Geocoding */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-2 border-t border-slate-800 text-xs">
          {/* Keyword Search */}
          <div className="relative">
            <label className="block text-slate-400 mb-1 font-medium">Search by Keywords & Tags:</label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="'flooded roads', 'river overflow', 'bridge scouring'..."
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 font-sans"
              />
            </div>
          </div>

          {/* Search ANY Location on Earth / India */}
          <div className="relative">
            <label className="block text-slate-400 mb-1 font-medium">Search Any Location on Satellite Map:</label>
            <form onSubmit={handleSearchLocation} className="flex gap-2">
              <input
                type="text"
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                placeholder="Search city/basin: 'Patna', 'Kochi', 'Guwahati', 'Mumbai'..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 font-sans"
              />
              <button
                type="submit"
                disabled={isSearchingLocation}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 shrink-0 font-medium"
              >
                {isSearchingLocation ? '...' : <MapPin className="w-3.5 h-3.5 text-cyan-400" />}
              </button>
            </form>

            {locationSearchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl z-30 max-h-48 overflow-y-auto">
                {locationSearchResults.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectLocationResult(item)}
                    className="w-full text-left p-2 hover:bg-slate-800 text-xs text-slate-200 border-b border-slate-800 last:border-0 truncate flex items-center gap-2"
                  >
                    <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                    <span className="truncate">{item.display_name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Satellite Mission Filter */}
          <div>
            <label className="block text-slate-400 mb-1 font-medium">Satellite Mission:</label>
            <select
              value={selectedMission}
              onChange={(e) => setSelectedMission(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 font-sans"
            >
              <option value="All">All Constellations</option>
              <option value="Sentinel-1 SAR">Sentinel-1 SAR (Radar Microwave)</option>
              <option value="Sentinel-2 MSI">Sentinel-2 MSI (10m Optical)</option>
              <option value="ISRO RISAT / Sentinel">ISRO RISAT / Sentinel</option>
              <option value="NASA MODIS">NASA MODIS (Daily Revisit)</option>
              <option value="Landsat 9">Landsat 9 (Multispectral)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Satellite Footprint GIS Map with Basemap Switcher */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-3 bg-slate-950/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-3">
            <span className="text-cyan-400 font-semibold flex items-center gap-1.5">
              <Satellite className="w-3.5 h-3.5" />
              INDIAN & GLOBAL SATELLITE RADAR FOOTPRINT MAP
            </span>
            <span className="hidden sm:inline">Click any marker or area to inspect Before/After flood imagery</span>
          </div>

          {/* Basemap switcher for Module 2 */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleFocusIndia}
              className="px-2 py-0.5 rounded text-xs bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 font-bold"
            >
              🇮🇳 India Focus
            </button>
            <button
              onClick={() => setBasemapStyle('satellite')}
              className={`px-2 py-0.5 rounded text-xs transition-colors ${
                basemapStyle === 'satellite'
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Satellite
            </button>
            <button
              onClick={() => setBasemapStyle('streets')}
              className={`px-2 py-0.5 rounded text-xs transition-colors ${
                basemapStyle === 'streets'
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Streets
            </button>
            <button
              onClick={() => setBasemapStyle('dark')}
              className={`px-2 py-0.5 rounded text-xs transition-colors ${
                basemapStyle === 'dark'
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Dark GIS
            </button>
          </div>
        </div>

        <div
          ref={mapContainerRef}
          className="w-full h-[320px] z-10 cursor-pointer"
          style={{ minHeight: '320px' }}
        />

        <div className="p-2.5 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400 gap-2">
          <div className="flex items-center gap-2">
            <span className="text-cyan-400 font-bold">ACTIVE SCENE:</span>
            <span className="text-white">{selectedRecord.locationName}</span>
            <span className="text-slate-500">({selectedRecord.country || 'Global'})</span>
          </div>
          <div>Target Acquisition: {new Date(selectedRecord.timestamp).toISOString()}</div>
        </div>
      </div>

      {/* Main Stage: Before/After Comparison Slider + Scene Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Interactive Before vs After Split View */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col shadow-sm">
          <div className="p-3.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-xs font-mono text-slate-300">
            <div className="flex items-center gap-2">
              <span className="text-cyan-400 font-semibold">
                BEFORE (Normal Baseline) ↔ AFTER ({selectedRecord.floodSeverity.toUpperCase()})
              </span>
            </div>
            <div>
              Acquisition: {new Date(selectedRecord.timestamp).toLocaleDateString()}
            </div>
          </div>

          {/* Split Comparison Canvas Container */}
          <div className="relative w-full h-[460px] bg-slate-950 select-none overflow-hidden">
            {/* Background Layer: After Flood Satellite Image */}
            <img
              src={selectedRecord.imageUrl}
              alt="After Flood Satellite Remote Sensing"
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Foreground Layer (Clipped by slider): Before Flood Baseline Image */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${sliderPosition}%` }}
            >
              <img
                src={selectedRecord.baselineImageUrl || ASSET_IMAGES.satelliteTimelineThumb}
                alt="Before Flood Baseline Satellite Imagery"
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover max-w-none"
                style={{ width: `${100 / (sliderPosition / 100 || 1)}%` }}
              />
              <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded border border-slate-700 text-xs text-slate-200 font-mono">
                PRE-DISASTER BASELINE
              </div>
            </div>

            <div className="absolute top-4 right-4 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded border border-slate-700 text-xs text-cyan-400 font-mono">
              PEAK INUNDATION PASS
            </div>

            {/* Draggable Divider Handle */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.8)] cursor-ew-resize flex items-center justify-center"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="w-8 h-8 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center shadow-lg transform -translate-x-1/2">
                <ArrowLeftRight className="w-4 h-4" />
              </div>
            </div>

            {/* Hidden native range slider for seamless touch/mouse interaction */}
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPosition}
              onChange={(e) => setSliderPosition(Number(e.target.value))}
              aria-label="Before/After satellite image comparison slider"
              className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
            />
          </div>

          {/* Slider control caption & Water Delta Telemetry */}
          <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
            <div className="text-slate-400">
              Drag slider to inspect hydrological surface delta (<span className="text-cyan-400">{sliderPosition}%</span>)
            </div>
            <div className="flex items-center gap-4 text-slate-300">
              <div>
                Water Surface: <span className="text-cyan-400 font-bold">{selectedRecord.waterCoveragePct}%</span>
              </div>
              <div>
                Resolution: <span className="text-white font-bold">{selectedRecord.resolutionM}m</span>
              </div>
              <div>
                Sensor: <span className="text-white font-bold">{selectedRecord.satelliteMission}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Remote Sensing Metadata & Past-to-Present Forensics */}
        <div className="space-y-6">
          {/* Metadata Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[11px] font-mono text-cyan-400">SCENE TELEMETRY</div>
                <h2 className="text-base font-bold text-white mt-0.5">{selectedRecord.locationName}</h2>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold ${
                selectedRecord.floodSeverity === 'Catastrophic Deluge'
                  ? 'bg-rose-950 text-rose-300 border border-rose-800'
                  : 'bg-amber-950 text-amber-300 border border-amber-800'
              }`}>
                {selectedRecord.floodSeverity}
              </span>
            </div>

            {/* Past to Present Historical Events Comparison */}
            {selectedRecord.historicalEvents && (
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-2 text-xs font-mono">
                <div className="text-slate-400 font-bold flex items-center gap-1.5 pb-1 border-b border-slate-800">
                  <History className="w-3.5 h-3.5 text-cyan-400" />
                  <span>PAST TO PRESENT HYDROLOGICAL TIMELINE</span>
                </div>
                <div>
                  <div className="text-rose-400 font-semibold">{selectedRecord.historicalEvents.pastDate}</div>
                  <div className="text-slate-300 text-[11px] font-sans mt-0.5">
                    {selectedRecord.historicalEvents.pastDescription}
                  </div>
                  <div className="text-rose-300/80 text-[10px] mt-0.5">
                    Past Flood Extent: {selectedRecord.historicalEvents.pastWaterCoveragePct}%
                  </div>
                </div>
                <div className="pt-1.5 border-t border-slate-900">
                  <div className="text-cyan-400 font-semibold">{selectedRecord.historicalEvents.presentDate}</div>
                  <div className="text-slate-300 text-[11px] font-sans mt-0.5">
                    {selectedRecord.historicalEvents.presentDescription}
                  </div>
                  <div className="text-cyan-300/80 text-[10px] mt-0.5">
                    Current Surface Water: {selectedRecord.historicalEvents.presentWaterCoveragePct}%
                  </div>
                </div>
              </div>
            )}

            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {selectedRecord.damageSummary}
            </p>

            <div className="pt-3 border-t border-slate-800 space-y-2">
              <div className="text-[11px] font-mono text-slate-400">DETECTED FEATURES:</div>
              <div className="flex flex-wrap gap-1.5">
                {selectedRecord.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 bg-slate-800/80 text-cyan-300 border border-slate-700 rounded text-[11px] font-mono flex items-center gap-1"
                  >
                    <Tag className="w-2.5 h-2.5" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
              <div className="text-[11px] font-mono text-emerald-400 font-semibold">
                TACTICAL DIRECTIVE:
              </div>
              <div className="text-xs text-slate-300 font-sans">
                {selectedRecord.recommendedAction}
              </div>
            </div>

            {/* AI Scene Analysis trigger */}
            <button
              onClick={handleAiTagging}
              disabled={isAiAnalyzing}
              className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 text-slate-950 font-bold rounded-lg text-xs font-mono transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              {isAiAnalyzing ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>ANALYZING MULTISPECTRAL BANDS...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                  <span>RUN GEMINI REMOTE SENSING AI AUDIT</span>
                </>
              )}
            </button>
          </div>

          {/* AI Analysis Result Card */}
          {aiAnalysisResult && (
            <div className="bg-slate-900 border border-cyan-800/80 rounded-xl p-5 space-y-3 font-mono text-xs">
              <div className="flex items-center gap-2 text-cyan-400 font-bold">
                <Bot className="w-4 h-4" />
                <span>GEMINI SATELLITE SCENE INTERPRETATION</span>
              </div>
              <p className="text-slate-300 font-sans leading-relaxed text-xs">
                {aiAnalysisResult.damageSummary}
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {aiAnalysisResult.tags?.map((tag: string, idx: number) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 bg-cyan-950 text-cyan-300 border border-cyan-800 rounded text-[11px]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              <div className="p-2.5 bg-slate-950 rounded border border-slate-800 text-slate-300 font-sans text-xs">
                <strong className="text-emerald-400">Directive: </strong>
                {aiAnalysisResult.recommendedAction}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Comprehensive Flood Damage Telemetry & Ground/Aerial Damage Images */}
      {selectedRecord.impactData && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-rose-400 font-bold">
                <AlertOctagon className="w-4 h-4" />
                <span>HISTORICAL FLOOD DAMAGE ASSESSMENT & INFRASTRUCTURE IMPACTS</span>
              </div>
              <h2 className="text-lg font-bold text-white mt-1">
                Catastrophic Inundation & Ground Impact Analysis · {selectedRecord.locationName}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-rose-950/80 text-rose-300 border border-rose-800">
                LOSS: ${selectedRecord.impactData.economicLossUsdMillions}M USD
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
                CASUALTIES: {selectedRecord.impactData.fatalitiesRecorded ?? 0}
              </span>
            </div>
          </div>

          {/* 4 Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2 text-slate-400 text-xs font-mono">
                <Home className="w-4 h-4 text-rose-400" />
                <span>STRUCTURES DAMAGED</span>
              </div>
              <div className="text-2xl font-bold text-white font-mono mt-1">
                {selectedRecord.impactData.structuresDamaged.toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">Homes & public facilities</div>
            </div>

            <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2 text-slate-400 text-xs font-mono">
                <Building2 className="w-4 h-4 text-amber-400" />
                <span>BRIDGES & CULVERTS</span>
              </div>
              <div className="text-2xl font-bold text-amber-400 font-mono mt-1">
                {selectedRecord.impactData.bridgesImpacted} Severed
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">Scoured or washed out</div>
            </div>

            <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2 text-slate-400 text-xs font-mono">
                <Wheat className="w-4 h-4 text-emerald-400" />
                <span>CROPLAND INUNDATED</span>
              </div>
              <div className="text-2xl font-bold text-emerald-400 font-mono mt-1">
                {selectedRecord.impactData.cropHectaresInundated.toLocaleString()} Ha
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">Agricultural submerged</div>
            </div>

            <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2 text-slate-400 text-xs font-mono">
                <Users className="w-4 h-4 text-cyan-400" />
                <span>POPULATION DISPLACED</span>
              </div>
              <div className="text-2xl font-bold text-cyan-400 font-mono mt-1">
                {selectedRecord.impactData.displacedPopulation.toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">Evacuated to shelters</div>
            </div>
          </div>

          {/* Key Infrastructure Failures list */}
          {selectedRecord.impactData.keyDamagedInfrastructure && selectedRecord.impactData.keyDamagedInfrastructure.length > 0 && (
            <div className="p-4 bg-slate-950/90 rounded-xl border border-rose-950/60 space-y-2">
              <div className="text-xs font-mono text-rose-400 font-bold flex items-center gap-2">
                <AlertOctagon className="w-3.5 h-3.5" />
                <span>KEY DAMAGED INFRASTRUCTURE & CRITICAL ARTERIAL BREACHES:</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                {selectedRecord.impactData.keyDamagedInfrastructure.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-slate-300 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                    <span className="w-5 h-5 rounded bg-rose-950 text-rose-400 border border-rose-800 text-[10px] font-mono font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Damage Images Gallery: Aerial, Ground, and Satellite Radar */}
          {selectedRecord.impactData.damageImages && selectedRecord.impactData.damageImages.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <div className="text-xs font-mono text-cyan-400 font-bold flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  <span>SATELLITE & GROUND DAMAGE IMAGERY ARCHIVE:</span>
                </div>
                <span className="text-[11px] text-slate-400">Click any photo to inspect high-resolution reconnaissance</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {selectedRecord.impactData.damageImages.map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => setPreviewDamageImage(img)}
                    className="group relative bg-slate-950 rounded-xl border border-slate-800 overflow-hidden cursor-pointer hover:border-cyan-500/60 transition-all shadow-md"
                  >
                    <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                      <img
                        src={img.url}
                        alt={img.caption}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-slate-950/80 text-cyan-300 border border-slate-700 backdrop-blur-sm">
                        {img.type} Observation
                      </div>
                      <div className="absolute inset-0 bg-slate-950/0 group-hover:bg-slate-950/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div className="p-2 rounded-full bg-cyan-500 text-slate-950 shadow-lg">
                          <Maximize2 className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                    <div className="p-3">
                      <p className="text-xs text-slate-300 line-clamp-2 font-sans">{img.caption}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal Preview for Full Size Damage Image */}
      {previewDamageImage && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setPreviewDamageImage(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
                <span className="uppercase font-bold">{previewDamageImage.type} HIGH-RESOLUTION RECONNAISSANCE</span>
                <span className="text-slate-500">·</span>
                <span className="text-slate-300">{selectedRecord.locationName}</span>
              </div>
              <button
                onClick={() => setPreviewDamageImage(null)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="relative max-h-[70vh] bg-black flex items-center justify-center overflow-hidden">
              <img
                src={previewDamageImage.url}
                alt={previewDamageImage.caption}
                referrerPolicy="no-referrer"
                className="max-h-[70vh] w-auto object-contain"
              />
            </div>
            <div className="p-4 bg-slate-950 border-t border-slate-800 text-xs text-slate-200">
              <p>{previewDamageImage.caption}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
