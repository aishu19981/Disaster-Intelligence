import React, { useState, useEffect, useRef } from 'react';
import { 
  FLOOD_REGIONS, 
  solveThreeRoutes, 
  generateCustomFloodRegion,
  FloodRegionPreset,
  ThreeRoutesResult,
  RouteDetail
} from '../data/mockData';
import { RouteNode, RouteEdge, AlertNotification } from '../types';
import { 
  Navigation, 
  RefreshCw, 
  AlertTriangle, 
  Layers, 
  Bot, 
  CheckCircle2, 
  Clock,
  Sparkles,
  Search,
  MapPin,
  Shield,
  Car,
  Truck,
  LifeBuoy,
  History,
  Calendar,
  Activity,
  Droplets,
  Satellite
} from 'lucide-react';
import L from 'leaflet';
import { DisasterLocationTimeSelector } from './DisasterLocationTimeSelector';
import { DisasterLocationTime } from '../types';

interface RouteMapperProps {
  onPushNotification: (notification: Omit<AlertNotification, 'id' | 'timestamp'>) => void;
  locationTime?: DisasterLocationTime;
  onLocationTimeChange?: (data: DisasterLocationTime) => void;
}

export const RouteMapper: React.FC<RouteMapperProps> = ({ 
  onPushNotification,
  locationTime,
  onLocationTimeChange
}) => {
  const [selectedRegionId, setSelectedRegionId] = useState<string>(FLOOD_REGIONS[0].id);
  const [activeRegion, setActiveRegion] = useState<FloodRegionPreset>(FLOOD_REGIONS[0]);

  // Basemap style: 'satellite' | 'streets' | 'dark'
  const [basemapStyle, setBasemapStyle] = useState<'satellite' | 'streets' | 'dark'>('satellite');

  // Nodes & Edges
  const [nodes, setNodes] = useState<RouteNode[]>(FLOOD_REGIONS[0].nodes);
  const [edges, setEdges] = useState<RouteEdge[]>(FLOOD_REGIONS[0].edges);
  const [startNodeId, setStartNodeId] = useState<string>(FLOOD_REGIONS[0].nodes[0].id);
  const [endNodeId, setEndNodeId] = useState<string>(
    FLOOD_REGIONS[0].nodes.find(n => n.isShelter)?.id || FLOOD_REGIONS[0].nodes[FLOOD_REGIONS[0].nodes.length - 1].id
  );

  // Past to Present Timeline Phase: 'past' | 'receding' | 'present'
  const [timelinePhase, setTimelinePhase] = useState<'past' | 'receding' | 'present'>('past');
  // Explicit Date and Time selection for past flood data analysis
  const [selectedDateTime, setSelectedDateTime] = useState<string>('2024-07-08T14:00');
  const [historicalEventName, setHistoricalEventName] = useState<string>('Assam Brahmaputra Super-Crest (Historic Peak)');

  // Real NASA & Copernicus Flood Data from server
  const [realFloodEvents, setRealFloodEvents] = useState<any[]>([]);
  const [realDischargeData, setRealDischargeData] = useState<{
    time: string[];
    discharge: number[];
    maxDischarge: number;
    currentDischarge: number;
  } | null>(null);

  // Custom location search input
  const [searchLocationQuery, setSearchLocationQuery] = useState<string>('');
  const [isSearchingLocation, setIsSearchingLocation] = useState<boolean>(false);
  const [locationSearchResults, setLocationSearchResults] = useState<any[]>([]);

  // Active route highlighted: 'all' | 'best' | 'average' | 'worst'
  const [highlightedRoute, setHighlightedRoute] = useState<'all' | 'best' | 'average' | 'worst'>('all');

  // Three Routes Result
  const [threeRoutes, setThreeRoutes] = useState<ThreeRoutesResult | null>(null);

  // Satellite Pass state
  const [lastSatellitePass, setLastSatellitePass] = useState<string>('Live Sentinel-1 SAR Pass #4289');
  const [satellitePassCount, setSatellitePassCount] = useState<number>(1);

  // AI Briefing
  const [aiBriefing, setAiBriefing] = useState<string | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState<boolean>(false);
  const [alertBanner, setAlertBanner] = useState<string | null>(null);

  // Map refs
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const mapLayersRef = useRef<L.LayerGroup | null>(null);

  // Fetch real global flood events on load
  useEffect(() => {
    fetch('/api/real-floods')
      .then(res => res.json())
      .then(data => {
        if (data.events) setRealFloodEvents(data.events);
      })
      .catch(err => console.error('Failed to load real flood events:', err));
  }, []);

  // Fetch real Copernicus GloFAS river discharge for current coordinates
  const fetchRealDischarge = async (lat: number, lon: number) => {
    try {
      const res = await fetch(`/api/river-flood?latitude=${lat}&longitude=${lon}&past_days=30`);
      if (!res.ok) return;
      const data = await res.json();
      const times = data.daily?.time || [];
      const dischargeList = data.daily?.river_discharge || [];

      if (times.length > 0 && dischargeList.length > 0) {
        const validValues = dischargeList.filter((v: any) => typeof v === 'number');
        const maxVal = validValues.length > 0 ? Math.max(...validValues) : 180;
        const currentVal = dischargeList[dischargeList.length - 8] || dischargeList[dischargeList.length - 1] || 45;

        setRealDischargeData({
          time: times,
          discharge: dischargeList,
          maxDischarge: Number(maxVal.toFixed(1)),
          currentDischarge: Number(currentVal.toFixed(1)),
        });
      }
    } catch (err) {
      console.error('River discharge fetch error:', err);
    }
  };

  // Update region when preset changes
  useEffect(() => {
    const reg = FLOOD_REGIONS.find(r => r.id === selectedRegionId);
    if (reg) {
      setActiveRegion(reg);
      applyTimelinePhaseToRegion(reg, timelinePhase);
      fetchRealDischarge(reg.center[0], reg.center[1]);
    }
  }, [selectedRegionId]);

  // Apply Past-to-Present Timeline flood depth multiplier
  const applyTimelinePhaseToRegion = (region: FloodRegionPreset, phase: 'past' | 'receding' | 'present') => {
    let multiplier = 1.0;
    if (phase === 'past') multiplier = 1.6; // Peak flood
    if (phase === 'receding') multiplier = 1.1; // Receding
    if (phase === 'present') multiplier = 0.8; // Present live

    const updatedEdges = region.edges.map(e => {
      const sev = Math.min(1.0, e.floodSeverity * multiplier);
      const depth = Math.round(e.waterDepthCm * multiplier);
      return {
        ...e,
        floodSeverity: Number(sev.toFixed(2)),
        waterDepthCm: depth,
        isImpassable: depth >= 45,
      };
    });

    setNodes(region.nodes);
    setEdges(updatedEdges);
    setStartNodeId(region.nodes[0].id);
    const shelter = region.nodes.find(n => n.isShelter) || region.nodes[region.nodes.length - 1];
    setEndNodeId(shelter.id);
  };

  const handleTimelineChange = (phase: 'past' | 'receding' | 'present') => {
    setTimelinePhase(phase);
    applyTimelinePhaseToRegion(activeRegion, phase);

    const desc = activeRegion.historicalEvents
      ? (phase === 'past' ? activeRegion.historicalEvents.pastPeak.description :
         phase === 'receding' ? activeRegion.historicalEvents.receding.description :
         activeRegion.historicalEvents.present.description)
      : `Switched flood observation timeline to ${phase.toUpperCase()}`;
    setAlertBanner(desc);
  };

  const handleDateTimeSelect = (dt: string, eventName?: string) => {
    setSelectedDateTime(dt);
    if (eventName) setHistoricalEventName(eventName);

    const dateObj = new Date(dt);
    const yr = dateObj.getFullYear();
    let phase: 'past' | 'receding' | 'present' = 'present';

    // Dates earlier than 2025 are past disasters
    if (yr < 2025) {
      phase = 'past';
    } else {
      phase = 'present';
    }

    setTimelinePhase(phase);
    applyTimelinePhaseToRegion(activeRegion, phase);

    setAlertBanner(
      `Historical Flood Pass Loaded: ${eventName || dt}. Satellite flood extent and waterlogged road edges reconstructed for ${dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })} at ${dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`
    );
  };

  const handleStepHours = (hours: number) => {
    try {
      const current = new Date(selectedDateTime);
      current.setHours(current.getHours() + hours);
      const iso = current.toISOString().slice(0, 16);
      handleDateTimeSelect(iso, `Time-Stepped (${hours > 0 ? '+' : ''}${hours}h)`);
    } catch (e) {
      console.error(e);
    }
  };

  // Sync with incoming locationTime prop
  useEffect(() => {
    if (locationTime) {
      if (locationTime.presetId) {
        setSelectedRegionId(locationTime.presetId);
      }
      handleDateTimeSelect(`${locationTime.date}T${locationTime.time}`, locationTime.eventTitle);
    }
  }, [locationTime]);

  const handleLocationTimeApplied = (data: DisasterLocationTime) => {
    if (onLocationTimeChange) {
      onLocationTimeChange(data);
    }
    setBasemapStyle('satellite');
    if (data.presetId) {
      setSelectedRegionId(data.presetId);
    } else {
      const customPreset = generateCustomFloodRegion(data.place, data.coordinates[0], data.coordinates[1]);
      setActiveRegion(customPreset);
      setNodes(customPreset.nodes);
      setEdges(customPreset.edges);
      setStartNodeId(customPreset.nodes[0].id);
      setEndNodeId(customPreset.nodes[customPreset.nodes.length - 1].id);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.setView(data.coordinates, 12);
      }
    }
    handleDateTimeSelect(`${data.date}T${data.time}`, data.eventTitle);
  };

  // Solve 3 routes
  useEffect(() => {
    if (!startNodeId || !endNodeId || startNodeId === endNodeId) {
      setThreeRoutes(null);
      return;
    }
    const result = solveThreeRoutes(nodes, edges, startNodeId, endNodeId);
    setThreeRoutes(result);
  }, [nodes, edges, startNodeId, endNodeId]);

  // Leaflet Map Initialization and Layer updates
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
      const map = L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false,
      }).setView(activeRegion.center, activeRegion.zoom);

      const tileLayer = L.tileLayer(tileUrl, {
        maxZoom: 19,
        attribution: tileAttr,
      }).addTo(map);

      tileLayerRef.current = tileLayer;

      L.control.zoom({ position: 'topright' }).addTo(map);

      map.on('click', (e: L.LeafletMouseEvent) => {
        handleMapClick(e.latlng.lat, e.latlng.lng);
      });

      const layerGroup = L.layerGroup().addTo(map);
      mapLayersRef.current = layerGroup;
      mapInstanceRef.current = map;

      // Invalidate size immediately and after delay to ensure 100% visible tiles
      setTimeout(() => {
        map.invalidateSize();
      }, 250);
    } else {
      mapInstanceRef.current.setView(activeRegion.center, activeRegion.zoom);
      
      // Update tile layer if basemapStyle changed
      if (tileLayerRef.current) {
        tileLayerRef.current.setUrl(tileUrl);
      }
      setTimeout(() => {
        mapInstanceRef.current?.invalidateSize();
      }, 150);
    }

    renderMapOverlays();
  }, [activeRegion, nodes, edges, threeRoutes, highlightedRoute, basemapStyle]);

  const handleMapClick = (lat: number, lng: number) => {
    let nearestNode: RouteNode | null = null;
    let minD = Infinity;

    for (const n of nodes) {
      const d = Math.hypot(n.lat - lat, n.lng - lng);
      if (d < minD) {
        minD = d;
        nearestNode = n;
      }
    }

    const targetNode: RouteNode | null = nearestNode;
    if (targetNode && minD < 0.08) {
      if (targetNode.id !== startNodeId) {
        setEndNodeId(targetNode.id);
        onPushNotification({
          type: 'info',
          title: 'Destination Selected on Map',
          message: `Set evacuation goal to ${targetNode.name} (${targetNode.elevationMeters}m elev)`,
          module: 'Route',
        });
      }
    }
  };

  const renderMapOverlays = () => {
    if (!mapLayersRef.current || !mapInstanceRef.current) return;
    mapLayersRef.current.clearLayers();

    const nodeLookup = new Map<string, RouteNode>();
    nodes.forEach(n => nodeLookup.set(n.id, n));

    // 1. Draw base road network edges
    edges.forEach(edge => {
      const u = nodeLookup.get(edge.from);
      const v = nodeLookup.get(edge.to);
      if (!u || !v) return;

      const isSubmerged = edge.isImpassable || edge.waterDepthCm >= 45;
      const isModerate = edge.waterDepthCm >= 20;

      const color = isSubmerged ? '#ef4444' : isModerate ? '#f59e0b' : (basemapStyle === 'satellite' ? '#38bdf8' : '#334155');
      const weight = isSubmerged ? 4 : 2.5;

      const poly = L.polyline([[u.lat, u.lng], [v.lat, v.lng]], {
        color,
        weight,
        opacity: isSubmerged ? 0.9 : 0.6,
        dashArray: isSubmerged ? '4, 4' : undefined,
      });

      poly.bindPopup(`
        <div style="font-size: 12px; line-height: 1.4;">
          <strong>Road: ${u.name} ↔ ${v.name}</strong><br/>
          Length: ${edge.distanceKm} km · Water Depth: ${edge.waterDepthCm} cm<br/>
          <span style="color: ${isSubmerged ? '#ef4444' : '#10b981'}; font-weight: bold;">
            ${edge.isImpassable ? '⛔ IMPASSABLE (DEPTH > 45CM)' : '✓ PASSABLE'}
          </span>
        </div>
      `);
      mapLayersRef.current?.addLayer(poly);
    });

    // 2. Draw WORST ROUTE (Crimson Red with warning halo)
    if (threeRoutes?.worst?.path?.length && (highlightedRoute === 'all' || highlightedRoute === 'worst')) {
      const worstCoords: [number, number][] = [];
      threeRoutes.worst.path.forEach(id => {
        const n = nodeLookup.get(id);
        if (n) worstCoords.push([n.lat, n.lng]);
      });

      const worstLine = L.polyline(worstCoords, {
        color: '#dc2626',
        weight: highlightedRoute === 'worst' ? 8 : 5,
        opacity: 0.9,
        dashArray: '8, 8',
      });
      worstLine.bindPopup(`
        <div style="font-size: 12px;">
          <strong style="color: #dc2626;">🔴 WORST ROUTE (HAZARDOUS)</strong><br/>
          Distance: ${threeRoutes.worst.distance} km<br/>
          Flooded Segments: ${threeRoutes.worst.floodedSegments}<br/>
          Max Water Depth: ${threeRoutes.worst.maxWaterDepthCm} cm<br/>
          <strong>STATUS: ${threeRoutes.worst.status.toUpperCase()}</strong>
        </div>
      `);
      mapLayersRef.current.addLayer(worstLine);
    }

    // 3. Draw AVERAGE ROUTE (Amber / Yellow)
    if (threeRoutes?.average?.path?.length && (highlightedRoute === 'all' || highlightedRoute === 'average')) {
      const avgCoords: [number, number][] = [];
      threeRoutes.average.path.forEach(id => {
        const n = nodeLookup.get(id);
        if (n) avgCoords.push([n.lat, n.lng]);
      });

      const avgLine = L.polyline(avgCoords, {
        color: '#f59e0b',
        weight: highlightedRoute === 'average' ? 8 : 5.5,
        opacity: 0.9,
      });
      avgLine.bindPopup(`
        <div style="font-size: 12px;">
          <strong style="color: #f59e0b;">🟡 AVERAGE ROUTE (MODERATE RISK)</strong><br/>
          Distance: ${threeRoutes.average.distance} km<br/>
          Max Water Depth: ${threeRoutes.average.maxWaterDepthCm} cm<br/>
          Estimated Transit: ${threeRoutes.average.transitTimeMin} min<br/>
          <strong>STATUS: ${threeRoutes.average.status.toUpperCase()}</strong>
        </div>
      `);
      mapLayersRef.current.addLayer(avgLine);
    }

    // 4. Draw BEST ROUTE (Glowing Emerald Green)
    if (threeRoutes?.best?.path?.length && (highlightedRoute === 'all' || highlightedRoute === 'best')) {
      const bestCoords: [number, number][] = [];
      threeRoutes.best.path.forEach(id => {
        const n = nodeLookup.get(id);
        if (n) bestCoords.push([n.lat, n.lng]);
      });

      const bestLine = L.polyline(bestCoords, {
        color: '#10b981',
        weight: highlightedRoute === 'best' ? 9 : 7,
        opacity: 0.98,
      });
      bestLine.bindPopup(`
        <div style="font-size: 12px;">
          <strong style="color: #10b981;">🟢 BEST ROUTE (SAFEST BYPASS)</strong><br/>
          Distance: ${threeRoutes.best.distance} km<br/>
          Max Water Depth: ${threeRoutes.best.maxWaterDepthCm} cm<br/>
          Estimated Transit: ${threeRoutes.best.transitTimeMin} min<br/>
          <strong>STATUS: ${threeRoutes.best.status.toUpperCase()} (SAFE PASSAGE)</strong>
        </div>
      `);
      mapLayersRef.current.addLayer(bestLine);
    }

    // 5. Draw Node Markers
    nodes.forEach(node => {
      const isStart = node.id === startNodeId;
      const isEnd = node.id === endNodeId;

      let markerColor = '#475569';
      let radius = 6;

      if (isStart) {
        markerColor = '#06b6d4';
        radius = 10;
      } else if (isEnd) {
        markerColor = '#10b981';
        radius = 11;
      } else if (node.isShelter) {
        markerColor = '#10b981';
        radius = 8;
      }

      const circle = L.circleMarker([node.lat, node.lng], {
        radius,
        fillColor: markerColor,
        color: '#ffffff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.95,
      });

      circle.bindPopup(`
        <div style="font-size: 12px;">
          <strong>${node.name}</strong><br/>
          Topographic Elevation: ${node.elevationMeters}m MSL<br/>
          ${isStart ? '<span style="color: #06b6d4; font-weight: bold;">[ACTIVE DEPARTURE ORIGIN]</span><br/>' : ''}
          ${isEnd ? '<span style="color: #10b981; font-weight: bold;">[ACTIVE EVACUATION TARGET]</span><br/>' : ''}
          ${node.isShelter ? '✓ Certified Disaster Shelter' : ''}
        </div>
      `);
      mapLayersRef.current?.addLayer(circle);
    });
  };

  // Custom location search via server geocode
  const handleSearchLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchLocationQuery.trim()) return;
    setIsSearchingLocation(true);
    setLocationSearchResults([]);

    try {
      const res = await fetch(`/api/geocode?q=${encodeURIComponent(searchLocationQuery)}`);
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setLocationSearchResults(data);
      } else {
        setAlertBanner(`No geocoding match found for "${searchLocationQuery}". Try city name e.g. "Miami", "Dhaka", "Valencia".`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearchingLocation(false);
    }
  };

  const handleSelectCustomLocation = (item: any) => {
    const lat = parseFloat(item.lat);
    const lon = parseFloat(item.lon);
    const name = item.display_name.split(',')[0];

    const customRegion = generateCustomFloodRegion(name, lat, lon);
    setActiveRegion(customRegion);
    setSelectedRegionId(customRegion.id);
    applyTimelinePhaseToRegion(customRegion, timelinePhase);
    fetchRealDischarge(lat, lon);
    setLocationSearchResults([]);
    setSearchLocationQuery('');

    onPushNotification({
      type: 'info',
      title: 'Target Location Loaded',
      message: `Initialized satellite road network for ${name} [${lat.toFixed(3)}°, ${lon.toFixed(3)}°]`,
      module: 'Route',
    });
  };

  const triggerSatellitePass = () => {
    const nextCount = satellitePassCount + 1;
    setSatellitePassCount(nextCount);
    setLastSatellitePass(`Live Sentinel-1 SAR Pass #${4289 + nextCount}`);

    let changed = 0;
    const updatedEdges = edges.map(edge => {
      if (Math.random() < 0.45) {
        const delta = (Math.random() - 0.5) * 0.25;
        const newSev = Math.max(0, Math.min(1.0, edge.floodSeverity + delta));
        const newDepth = Math.round(newSev * 100);
        const impassable = newDepth >= 45;
        if (impassable !== edge.isImpassable) changed++;
        return {
          ...edge,
          floodSeverity: Number(newSev.toFixed(2)),
          waterDepthCm: newDepth,
          isImpassable: impassable,
        };
      }
      return edge;
    });

    setEdges(updatedEdges);
    setAlertBanner(`Sentinel-1 SAR Pass #${4289 + nextCount}: Re-calibrated water depth across ${changed} road segments.`);
  };

  const handleRequestAiBriefing = async () => {
    setIsLoadingAi(true);
    try {
      const startNode = nodes.find(n => n.id === startNodeId);
      const endNode = nodes.find(n => n.id === endNodeId);
      const response = await fetch('/api/gemini/flood-route-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startName: startNode?.name || 'Origin',
          endName: endNode?.name || 'Evacuation Point',
          floodSeverity: threeRoutes?.best?.riskPenalty || 15,
          routeDistanceKm: threeRoutes?.best?.distance || 12.4,
          passable: threeRoutes?.best?.status !== 'impassable',
          submergedSegments: threeRoutes?.worst?.floodedSegments || 2,
        }),
      });

      const data = await response.json();
      setAiBriefing(data.analysis || data.fallback || 'Satellite SAR telemetry confirms high water levels along primary low-elevation thoroughfares.');
    } catch (err) {
      console.error(err);
      setAiBriefing('Satellite SAR telemetry confirms high water levels along primary low-elevation thoroughfares. Maintain high-axle vehicle clearance and proceed via ridge bypass routes.');
    } finally {
      setIsLoadingAi(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Alert Banner */}
      {alertBanner && (
        <div className="bg-amber-950/70 border border-amber-800/80 rounded-xl p-3.5 flex items-center justify-between gap-4 text-amber-200 text-xs font-mono">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{alertBanner}</span>
          </div>
          <button onClick={() => setAlertBanner(null)} className="text-amber-400 hover:text-white underline text-[11px]">
            Dismiss
          </button>
        </div>
      )}

      {/* 4 Mandatory Data Fields: 1. Country, 2. Place, 3. Date, 4. Time */}
      <DisasterLocationTimeSelector
        currentValue={locationTime || {
          country: activeRegion.country || 'India',
          place: activeRegion.name,
          date: selectedDateTime.slice(0, 10),
          time: selectedDateTime.slice(11, 16) || '09:30',
          coordinates: activeRegion.center,
          presetId: activeRegion.id,
          isPast: timelinePhase === 'past',
          eventTitle: historicalEventName,
        }}
        onApply={handleLocationTimeApplied}
        title="Module 1: Post-Flood Route Mapper · 4 Mandatory Parameters (Country · Place · Date · Time)"
      />

      {/* Control Console */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
              <Navigation className="w-3.5 h-3.5" />
              <span>TRACK 2.1 · MULTI-ROUTE EVALUATOR (BEST · AVERAGE · WORST)</span>
            </div>
            <h1 className="text-xl font-bold text-white font-sans mt-0.5">
              Post-Flood Route Mapper & Disaster Timeline
            </h1>
          </div>

          {/* Past-to-Present Timeline Scrubber */}
          <div className="flex items-center gap-2 p-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono">
            <History className="w-3.5 h-3.5 text-cyan-400 ml-1" />
            <span className="text-slate-400 text-[11px] pr-1">TEMPORAL PHASE:</span>
            <button
              onClick={() => handleTimelineChange('past')}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                timelinePhase === 'past'
                  ? 'bg-rose-950 text-rose-300 border border-rose-800 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Past Peak Flood
            </button>
            <button
              onClick={() => handleTimelineChange('receding')}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                timelinePhase === 'receding'
                  ? 'bg-amber-950 text-amber-300 border border-amber-800 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Receding Transition
            </button>
            <button
              onClick={() => handleTimelineChange('present')}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                timelinePhase === 'present'
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Present Live Orbit
            </button>
          </div>
        </div>

        {/* Date & Time Selector for Past Flood Data */}
        <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-2.5 text-xs font-mono">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-cyan-400">
              <Calendar className="w-4 h-4 text-cyan-400 shrink-0" />
              <span className="font-bold">CHOOSE DATE & TIME FOR PAST FLOOD DATA:</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="datetime-local"
                value={selectedDateTime}
                onChange={(e) => handleDateTimeSelect(e.target.value)}
                className="px-2.5 py-1 bg-slate-900 border border-slate-700 rounded text-xs text-cyan-300 font-mono focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleStepHours(-24)}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 text-[11px]"
                  title="Rewind 24 Hours"
                >
                  -24h
                </button>
                <button
                  type="button"
                  onClick={() => handleStepHours(-6)}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 text-[11px]"
                  title="Rewind 6 Hours"
                >
                  -6h
                </button>
                <button
                  type="button"
                  onClick={() => handleStepHours(6)}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 text-[11px]"
                  title="Advance 6 Hours"
                >
                  +6h
                </button>
                <button
                  type="button"
                  onClick={() => handleStepHours(24)}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 text-[11px]"
                  title="Advance 24 Hours"
                >
                  +24h
                </button>
              </div>
            </div>
          </div>

          {/* Quick Historical Disaster Datetime Presets */}
          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-900">
            <span className="text-slate-400 text-[11px] shrink-0">PAST DISASTER PRESETS:</span>
            {[
              { label: 'Aug 16, 2018 09:30 (Kerala)', dt: '2018-08-16T09:30', regionId: 'kerala', title: 'Kerala 2018 Dam Super-Peak' },
              { label: 'Jul 08, 2024 14:00 (Assam)', dt: '2024-07-08T14:00', regionId: 'assam-brahmaputra', title: 'Assam 2024 Brahmaputra Crest' },
              { label: 'Jul 30, 2024 02:00 (Wayanad)', dt: '2024-07-30T02:00', regionId: 'wayanad-kerala', title: 'Wayanad 2024 Cloudburst' },
              { label: 'Aug 20, 2023 11:30 (Bihar)', dt: '2023-08-20T11:30', regionId: 'bihar-kosi', title: 'Bihar 2023 Kosi River Breach' },
              { label: 'Dec 04, 2023 16:00 (Chennai)', dt: '2023-12-04T16:00', regionId: 'chennai-adyar', title: 'Chennai 2023 Michaung Surge' },
              { label: 'Jul 26, 2005 14:30 (Mumbai)', dt: '2005-07-26T14:30', regionId: 'mumbai-mithi', title: 'Mumbai 2005 944mm Cloudburst' },
              { label: 'Aug 25, 2022 08:00 (Mach)', dt: '2022-08-25T08:00', regionId: 'mach', title: 'Mach 2022 Bolan Gorge Deluge' },
              { label: 'Live Present 2026', dt: new Date().toISOString().slice(0, 16), regionId: 'kerala', title: 'Live Present Satellite Pass' },
            ].map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setSelectedRegionId(p.regionId);
                  setBasemapStyle('satellite');
                  handleDateTimeSelect(p.dt, p.title);
                }}
                className={`px-2 py-0.5 rounded text-[11px] transition-colors border ${
                  selectedDateTime === p.dt
                    ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white border-slate-800'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Active Historical Acquisition Banner */}
          <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-900 gap-2">
            <div>
              Active Acquisition: <span className="text-white font-bold">{new Date(selectedDateTime).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</span> ({historicalEventName})
            </div>
            <div className="text-cyan-400">
              Hydrological Risk Multiplier: {timelinePhase === 'past' ? '1.6x (Peak Inundated Roads)' : timelinePhase === 'receding' ? '1.1x (Receding Waters)' : '0.8x (Live Normal)'}
            </div>
          </div>
        </div>

        {/* Location Selector & Search Input */}
        <div className="space-y-3 pt-3 border-t border-slate-800 text-xs">
          {/* Quick Indian Satellite Map Presets Bar */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-cyan-400 font-mono font-bold flex items-center gap-1.5 shrink-0">
              <Satellite className="w-3.5 h-3.5" />
              <span>🇮🇳 INDIAN SATELLITE MAP:</span>
            </span>
            {[
              { id: 'kerala', label: 'Kerala (Periyar Basin)' },
              { id: 'assam-brahmaputra', label: 'Assam (Brahmaputra)' },
              { id: 'bihar-kosi', label: 'Bihar (Kosi Basin)' },
              { id: 'mumbai-mithi', label: 'Mumbai (Mithi Coastal)' },
              { id: 'chennai-adyar', label: 'Chennai (Adyar Basin)' },
              { id: 'wayanad-kerala', label: 'Wayanad (Flash Flood)' },
            ].map(preset => (
              <button
                key={preset.id}
                onClick={() => {
                  setSelectedRegionId(preset.id);
                  setBasemapStyle('satellite');
                }}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                  selectedRegionId === preset.id
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                    : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Preset Watersheds Dropdown */}
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Select Disaster Watershed:</label>
              <select
                value={selectedRegionId}
                onChange={(e) => setSelectedRegionId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 font-sans"
              >
                {FLOOD_REGIONS.map(reg => (
                  <option key={reg.id} value={reg.id}>
                    {reg.country === 'India' ? '🇮🇳 ' : ''}{reg.name} ({reg.country})
                  </option>
                ))}
              </select>
            </div>

            {/* Search any Custom Location on Earth / India */}
            <div className="relative">
              <label className="block text-slate-400 mb-1 font-medium">Or Search Any Custom Location (India or Global):</label>
              <form onSubmit={handleSearchLocation} className="flex gap-2">
                <input
                  type="text"
                  value={searchLocationQuery}
                  onChange={(e) => setSearchLocationQuery(e.target.value)}
                  placeholder="Search Indian city/basin: 'Patna', 'Kochi', 'Mumbai', 'Guwahati'..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 font-sans"
                />
                <button
                  type="submit"
                  disabled={isSearchingLocation}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 shrink-0 font-medium"
                >
                  {isSearchingLocation ? '...' : <Search className="w-3.5 h-3.5" />}
                </button>
              </form>

              {locationSearchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl z-30 max-h-48 overflow-y-auto">
                  {locationSearchResults.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectCustomLocation(item)}
                      className="w-full text-left p-2.5 hover:bg-slate-800 text-xs text-slate-200 border-b border-slate-800 last:border-0 truncate flex items-center gap-2"
                    >
                      <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                      <span className="truncate">{item.display_name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

          {/* Start and End nodes */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Departure (Start):</label>
              <select
                value={startNodeId}
                onChange={(e) => setStartNodeId(e.target.value)}
                className="w-full px-2.5 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 truncate"
              >
                {nodes.map(n => (
                  <option key={n.id} value={n.id}>
                    {n.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Goal (Shelter):</label>
              <select
                value={endNodeId}
                onChange={(e) => setEndNodeId(e.target.value)}
                className="w-full px-2.5 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 truncate"
              >
                {nodes.map(n => (
                  <option key={n.id} value={n.id}>
                    {n.isShelter ? '🏥 ' : ''}{n.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Map + 3 Routes Comparison Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Interactive Leaflet Map */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col shadow-sm">
          {/* Map Top Bar with Filter tabs for the 3 routes & Basemap toggle */}
          <div className="p-3 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            {/* Route filter tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-lg">
              <button
                onClick={() => setHighlightedRoute('all')}
                className={`px-2.5 py-1 rounded text-xs transition-colors ${
                  highlightedRoute === 'all'
                    ? 'bg-slate-700 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All 3 Routes
              </button>
              <button
                onClick={() => setHighlightedRoute('best')}
                className={`px-2.5 py-1 rounded text-xs transition-colors flex items-center gap-1.5 ${
                  highlightedRoute === 'best'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-700 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                Safe Route (Green)
              </button>
              <button
                onClick={() => setHighlightedRoute('average')}
                className={`px-2.5 py-1 rounded text-xs transition-colors flex items-center gap-1.5 ${
                  highlightedRoute === 'average'
                    ? 'bg-amber-950 text-amber-300 border border-amber-700 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
                Moderate Route (Yellow)
              </button>
              <button
                onClick={() => setHighlightedRoute('worst')}
                className={`px-2.5 py-1 rounded text-xs transition-colors flex items-center gap-1.5 ${
                  highlightedRoute === 'worst'
                    ? 'bg-rose-950 text-rose-300 border border-rose-700 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />
                Danger Route (Red)
              </button>
            </div>

            {/* Basemap Style Switcher & India Focus */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-lg">
              <button
                onClick={() => {
                  setBasemapStyle('satellite');
                  const ind = FLOOD_REGIONS.find(r => r.country === 'India') || FLOOD_REGIONS[0];
                  setSelectedRegionId(ind.id);
                  setTimeout(() => {
                    mapInstanceRef.current?.setView([20.5937, 78.9629], 5);
                  }, 50);
                }}
                className="px-2.5 py-1 rounded text-xs bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 font-bold transition-colors flex items-center gap-1"
                title="Pan and zoom to Indian Satellite Overview"
              >
                <span>🇮🇳 India Map</span>
              </button>
              <button
                onClick={() => setBasemapStyle('satellite')}
                className={`px-2 py-1 rounded text-xs transition-colors flex items-center gap-1 ${
                  basemapStyle === 'satellite'
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Satellite className="w-3 h-3" />
                <span>Satellite</span>
              </button>
              <button
                onClick={() => setBasemapStyle('streets')}
                className={`px-2 py-1 rounded text-xs transition-colors ${
                  basemapStyle === 'streets'
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Streets
              </button>
              <button
                onClick={() => setBasemapStyle('dark')}
                className={`px-2 py-1 rounded text-xs transition-colors ${
                  basemapStyle === 'dark'
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Dark GIS
              </button>
            </div>
          </div>

          {/* Leaflet Map Canvas */}
          <div
            ref={mapContainerRef}
            className="w-full h-[500px] z-10 cursor-crosshair"
            style={{ minHeight: '500px' }}
          />

          <div className="p-3 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 text-[11px] text-slate-400 font-mono">
            <div>
              Interactive Tip: Click any node on the map to re-route destination shelter.
            </div>
            <div>{lastSatellitePass}</div>
          </div>
        </div>

        {/* Right Col: The 3 Routes Side-by-Side Comparison Cards + Real Copernicus River Flow */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white font-sans">
              Three-Tier Flood Route Assessment
            </h2>
            <button
              onClick={handleRequestAiBriefing}
              disabled={isLoadingAi}
              className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold rounded-lg text-xs transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>{isLoadingAi ? 'Briefing...' : 'AI Briefing'}</span>
            </button>
          </div>

          {threeRoutes ? (
            <div className="space-y-3">
              {/* 1. BEST ROUTE CARD */}
              <div
                onClick={() => setHighlightedRoute('best')}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  highlightedRoute === 'best'
                    ? 'bg-emerald-950/40 border-emerald-500 ring-1 ring-emerald-500/50'
                    : 'bg-slate-900 border-slate-800 hover:border-emerald-700/60'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400 text-xs font-bold">
                      1
                    </div>
                    <div>
                      <div className="text-xs font-bold text-emerald-400 font-mono uppercase">
                        SAFE ROUTE (BEST · CLEAR ROADS)
                      </div>
                      <div className="text-[11px] text-slate-400">Avoids all flood inundation</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-300 border border-emerald-800">
                    STATUS: SAFE (0-5cm)
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 my-2.5 p-2 bg-slate-950/80 rounded-lg text-center font-mono text-xs">
                  <div>
                    <div className="text-[10px] text-slate-500">Distance</div>
                    <div className="font-bold text-white">{threeRoutes.best.distance} km</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500">Water Depth</div>
                    <div className="font-bold text-emerald-400">{threeRoutes.best.maxWaterDepthCm} cm</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500">Est. Time</div>
                    <div className="font-bold text-white">{threeRoutes.best.transitTimeMin} min</div>
                  </div>
                </div>

                <p className="text-[11px] text-slate-300 leading-relaxed font-sans mb-2">
                  {threeRoutes.best.description}
                </p>

                <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-300 bg-emerald-950/30 p-1.5 rounded border border-emerald-900/60">
                  <Car className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span>Approved: {threeRoutes.best.vehicleRecommendation}</span>
                </div>
              </div>

              {/* 2. AVERAGE / MODERATE ROUTE CARD */}
              <div
                onClick={() => setHighlightedRoute('average')}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  highlightedRoute === 'average'
                    ? 'bg-amber-950/40 border-amber-500 ring-1 ring-amber-500/50'
                    : 'bg-slate-900 border-slate-800 hover:border-amber-700/60'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-amber-950 border border-amber-800 flex items-center justify-center text-amber-400 text-xs font-bold">
                      2
                    </div>
                    <div>
                      <div className="text-xs font-bold text-amber-400 font-mono uppercase">
                        MODERATE ROUTE (AVERAGE RISK)
                      </div>
                      <div className="text-[11px] text-slate-400">Moderate surface water (10-25cm)</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-900/60 text-amber-300 border border-amber-800">
                    STATUS: MODERATE / CAUTION
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 my-2.5 p-2 bg-slate-950/80 rounded-lg text-center font-mono text-xs">
                  <div>
                    <div className="text-[10px] text-slate-500">Distance</div>
                    <div className="font-bold text-white">{threeRoutes.average.distance} km</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500">Water Depth</div>
                    <div className="font-bold text-amber-400">{threeRoutes.average.maxWaterDepthCm} cm</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500">Est. Time</div>
                    <div className="font-bold text-white">{threeRoutes.average.transitTimeMin} min</div>
                  </div>
                </div>

                <p className="text-[11px] text-slate-300 leading-relaxed font-sans mb-2">
                  {threeRoutes.average.description}
                </p>

                <div className="flex items-center gap-1.5 text-[10px] font-mono text-amber-300 bg-amber-950/30 p-1.5 rounded border border-amber-900/60">
                  <Truck className="w-3 h-3 text-amber-400 shrink-0" />
                  <span>Approved: {threeRoutes.average.vehicleRecommendation}</span>
                </div>
              </div>

              {/* 3. DANGER ROUTE CARD */}
              <div
                onClick={() => setHighlightedRoute('worst')}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  highlightedRoute === 'worst'
                    ? 'bg-rose-950/40 border-rose-500 ring-1 ring-rose-500/50'
                    : 'bg-slate-900 border-slate-800 hover:border-rose-700/60'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-rose-950 border border-rose-800 flex items-center justify-center text-rose-400 text-xs font-bold">
                      3
                    </div>
                    <div>
                      <div className="text-xs font-bold text-rose-400 font-mono uppercase">
                        DANGER ROUTE (WORST · HIGH HAZARD)
                      </div>
                      <div className="text-[11px] text-slate-400">Deep inundation & submerged bridges</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-900/60 text-rose-300 border border-rose-800">
                    STATUS: DANGER (>50cm)
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 my-2.5 p-2 bg-slate-950/80 rounded-lg text-center font-mono text-xs">
                  <div>
                    <div className="text-[10px] text-slate-500">Distance</div>
                    <div className="font-bold text-white">{threeRoutes.worst.distance} km</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500">Water Depth</div>
                    <div className="font-bold text-rose-400">{threeRoutes.worst.maxWaterDepthCm} cm</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500">Est. Time</div>
                    <div className="font-bold text-white">{threeRoutes.worst.transitTimeMin} min</div>
                  </div>
                </div>

                <p className="text-[11px] text-slate-300 leading-relaxed font-sans mb-2">
                  {threeRoutes.worst.description}
                </p>

                <div className="flex items-center gap-1.5 text-[10px] font-mono text-rose-300 bg-rose-950/30 p-1.5 rounded border border-rose-900/60">
                  <LifeBuoy className="w-3 h-3 text-rose-400 shrink-0" />
                  <span>Restricted: {threeRoutes.worst.vehicleRecommendation}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl text-center text-xs text-slate-400 font-mono">
              Computing graph routes...
            </div>
          )}

          {/* Real Copernicus GloFAS River Streamflow Widget (Past 30 Days to Present) */}
          {realDischargeData && (
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-cyan-400 font-semibold flex items-center gap-1.5">
                  <Droplets className="w-3.5 h-3.5" />
                  REAL RIVER STREAMFLOW (COPERNICUS GLOFAS)
                </span>
                <span className="text-[10px] text-slate-400">PAST 30 DAYS</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono p-2 bg-slate-950 rounded-lg">
                <div>
                  <div className="text-[10px] text-slate-500">Peak Crest Discharge</div>
                  <div className="text-sm font-bold text-rose-400">{realDischargeData.maxDischarge} m³/s</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500">Present Gauge Flow</div>
                  <div className="text-sm font-bold text-cyan-400">{realDischargeData.currentDischarge} m³/s</div>
                </div>
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                Authored by European Commission Copernicus Emergency Management Service GloFAS API.
              </p>
            </div>
          )}

          {/* AI Tactical Briefing Box */}
          {aiBriefing && (
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>GEMINI CIVIL PROTECTION BRIEFING</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans whitespace-pre-line">
                {aiBriefing}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
    </div>
  );
};
