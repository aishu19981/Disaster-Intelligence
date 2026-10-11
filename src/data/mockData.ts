import { RouteNode, RouteEdge, SatelliteImageRecord } from '../types';

// Real generated image paths from our asset generator
export const ASSET_IMAGES = {
  earthBg: '/src/assets/images/satellite_earth_bg_1791619812679.jpg',
  floodRouteThumb: '/src/assets/images/flood_route_thumb_1791619830992.jpg',
  satelliteTimelineThumb: '/src/assets/images/satellite_timeline_thumb_1791619847596.jpg',
  airToxicityThumb: '/src/assets/images/air_toxicity_thumb_1791619862780.jpg',
  floodDamageHouses: '/src/assets/images/flood_damage_houses_1791624389119.jpg',
  floodBridgeWashout: '/src/assets/images/flood_bridge_washout_1791624409235.jpg',
};

export interface FloodRegionPreset {
  id: string;
  name: string;
  country: string;
  center: [number, number];
  zoom: number;
  description: string;
  nodes: RouteNode[];
  edges: RouteEdge[];
  historicalEvents?: {
    pastPeak: { date: string; floodCoveragePct: number; description: string };
    receding: { date: string; floodCoveragePct: number; description: string };
    present: { date: string; floodCoveragePct: number; description: string };
  };
}

export const FLOOD_REGIONS: FloodRegionPreset[] = [
  {
    id: 'kerala',
    name: 'Kerala Periyar River Basin (Aluva / Kochi)',
    country: 'India',
    center: [10.0261, 76.3125],
    zoom: 12,
    description: 'Periyar dam overflow with coastal backwater waterlogging along NH 66 corridor and Aluva lowlands.',
    historicalEvents: {
      pastPeak: { date: 'Aug 16, 2018 (Severe Monsoon Dam Discharge)', floodCoveragePct: 78.0, description: 'All 35 dams opened simultaneously; Aluva town center completely submerged under 3-4 meters of river backwash.' },
      receding: { date: 'Aug 24, 2018 (Receding Waters)', floodCoveragePct: 41.5, description: 'Backwaters draining into Arabian Sea; relief camps on Kakkanad hills operating at maximum capacity.' },
      present: { date: 'Present Live Satellite (Sentinel-2 MSI & ISRO)', floodCoveragePct: 15.2, description: 'Live remote sensing confirms clear hilltop escarpments and open drainage along Seaport-Airport bypass.' },
    },
    nodes: [
      { id: 'K1', name: 'Aluva Riverside District (Lowland)', lat: 10.107, lng: 76.353, elevationMeters: 8 },
      { id: 'K2', name: 'Kalamassery High Ridge', lat: 10.054, lng: 76.321, elevationMeters: 28 },
      { id: 'K3', name: 'Edappally Toll Underpass (Submerged)', lat: 10.024, lng: 76.308, elevationMeters: 4 },
      { id: 'K4', name: 'Seaport-Airport Highway Bypass', lat: 10.045, lng: 76.362, elevationMeters: 22 },
      { id: 'K5', name: 'Kakkanad Hilltop Relief Camp', lat: 10.015, lng: 76.348, elevationMeters: 36, isShelter: true },
      { id: 'K6', name: 'Ernakulam Central Hospital', lat: 9.982, lng: 76.289, elevationMeters: 5, isShelter: true },
      { id: 'K7', name: 'Palarivattom Flyover Junction', lat: 10.005, lng: 76.312, elevationMeters: 18 },
    ],
    edges: [
      { id: 'ke1', from: 'K1', to: 'K3', distanceKm: 11.2, roadType: 'highway', floodSeverity: 0.92, waterDepthCm: 95, isImpassable: true },
      { id: 'ke2', from: 'K3', to: 'K6', distanceKm: 5.6, roadType: 'arterial', floodSeverity: 0.85, waterDepthCm: 80, isImpassable: true },
      { id: 'ke3', from: 'K1', to: 'K2', distanceKm: 6.8, roadType: 'arterial', floodSeverity: 0.15, waterDepthCm: 8, isImpassable: false },
      { id: 'ke4', from: 'K2', to: 'K4', distanceKm: 5.1, roadType: 'highway', floodSeverity: 0.08, waterDepthCm: 2, isImpassable: false },
      { id: 'ke5', from: 'K4', to: 'K5', distanceKm: 4.3, roadType: 'arterial', floodSeverity: 0.05, waterDepthCm: 0, isImpassable: false },
      { id: 'ke6', from: 'K5', to: 'K6', distanceKm: 7.9, roadType: 'arterial', floodSeverity: 0.25, waterDepthCm: 15, isImpassable: false },
      { id: 'ke7', from: 'K2', to: 'K7', distanceKm: 6.0, roadType: 'arterial', floodSeverity: 0.38, waterDepthCm: 24, isImpassable: false },
      { id: 'ke8', from: 'K7', to: 'K6', distanceKm: 3.5, roadType: 'local', floodSeverity: 0.42, waterDepthCm: 26, isImpassable: false },
    ]
  },
  {
    id: 'assam-brahmaputra',
    name: 'Assam Brahmaputra River Basin (Guwahati / Kaziranga)',
    country: 'India',
    center: [26.1856, 91.7486],
    zoom: 12,
    description: 'Brahmaputra mega-river monsoon flood corridor with severe embankment overtopping along NH-27 / NH-715.',
    historicalEvents: {
      pastPeak: { date: 'Jul 08, 2024 (Assam Monsoon Super-Crest)', floodCoveragePct: 88.4, description: 'Over 2.4 million people displaced across 30 districts; Kaziranga park submerged by 12ft.' },
      receding: { date: 'Jul 22, 2024 (Downstream Silt Inundation)', floodCoveragePct: 48.0, description: 'Brahmaputra water discharge receding below danger mark at Guwahati gauge.' },
      present: { date: 'Present Live Satellite (Sentinel-1 SAR & Zoom Earth)', floodCoveragePct: 24.2, description: 'Live SAR radar pass tracking braided river channels and open highland routes along Khanapara ridge.' },
    },
    nodes: [
      { id: 'A1', name: 'Guwahati Riverside Ghat (Bharalu Lowland)', lat: 26.175, lng: 91.732, elevationMeters: 52 },
      { id: 'A2', name: 'Saraighat Bridge Crossing (NH-27 Submerged Underpass)', lat: 26.128, lng: 91.682, elevationMeters: 48 },
      { id: 'A3', name: 'Jalukbari Lowland Junction', lat: 26.142, lng: 91.664, elevationMeters: 46 },
      { id: 'A4', name: 'Khanapara Elevated Escarpment', lat: 26.115, lng: 91.825, elevationMeters: 115 },
      { id: 'A5', name: 'Dispur State Secretariat Evacuation Post', lat: 26.142, lng: 91.792, elevationMeters: 74, isShelter: true },
      { id: 'A6', name: 'Kamakhya Hilltop Emergency Camp', lat: 26.166, lng: 91.705, elevationMeters: 198, isShelter: true },
    ],
    edges: [
      { id: 'ae1', from: 'A1', to: 'A2', distanceKm: 7.2, roadType: 'highway', floodSeverity: 0.95, waterDepthCm: 130, isImpassable: true },
      { id: 'ae2', from: 'A2', to: 'A3', distanceKm: 3.5, roadType: 'arterial', floodSeverity: 0.90, waterDepthCm: 105, isImpassable: true },
      { id: 'ae3', from: 'A1', to: 'A6', distanceKm: 3.8, roadType: 'local', floodSeverity: 0.10, waterDepthCm: 4, isImpassable: false },
      { id: 'ae4', from: 'A6', to: 'A5', distanceKm: 10.4, roadType: 'highway', floodSeverity: 0.06, waterDepthCm: 0, isImpassable: false },
      { id: 'ae5', from: 'A5', to: 'A4', distanceKm: 4.8, roadType: 'arterial', floodSeverity: 0.05, waterDepthCm: 0, isImpassable: false },
      { id: 'ae6', from: 'A1', to: 'A5', distanceKm: 6.8, roadType: 'arterial', floodSeverity: 0.38, waterDepthCm: 25, isImpassable: false },
    ]
  },
  {
    id: 'bihar-kosi',
    name: 'Bihar Kosi River Floodplain (Patna / Saharsa)',
    country: 'India',
    center: [25.5941, 85.1376],
    zoom: 12,
    description: 'Kosi "Sorrow of Bihar" braided alluvial floodplain with heavy silt breach and low-lying highway inundation.',
    historicalEvents: {
      pastPeak: { date: 'Aug 20, 2023 (Kosi Embankment Breach)', floodCoveragePct: 82.5, description: 'Over 500,000 cusecs discharge from Nepal barrage inundating northern agricultural arteries.' },
      receding: { date: 'Sep 02, 2023 (Sediment Deposition Phase)', floodCoveragePct: 44.0, description: 'Waters receding into main canal; alluvial silt clearance on NH-31.' },
      present: { date: 'Present Live Satellite (Sentinel-1 SAR)', floodCoveragePct: 18.5, description: 'Highland railway embankments clear; safe transit via elevated bypass.' },
    },
    nodes: [
      { id: 'BK1', name: 'Ganga-Kosi Riparian Lowland', lat: 25.580, lng: 85.110, elevationMeters: 45 },
      { id: 'BK2', name: 'Gandhi Setu Approach Underpass', lat: 25.605, lng: 85.185, elevationMeters: 42 },
      { id: 'BK3', name: 'Submerged Northern Causeway', lat: 25.632, lng: 85.220, elevationMeters: 39 },
      { id: 'BK4', name: 'Patna Elevated Expressway Ridge', lat: 25.615, lng: 85.080, elevationMeters: 62 },
      { id: 'BK5', name: 'AIIMS Patna Emergency Relief Campus', lat: 25.560, lng: 85.045, elevationMeters: 58, isShelter: true },
      { id: 'BK6', name: 'Patna Central Secretariat Disaster Hub', lat: 25.602, lng: 85.125, elevationMeters: 53, isShelter: true },
    ],
    edges: [
      { id: 'bke1', from: 'BK1', to: 'BK2', distanceKm: 7.8, roadType: 'highway', floodSeverity: 0.94, waterDepthCm: 115, isImpassable: true },
      { id: 'bke2', from: 'BK2', to: 'BK3', distanceKm: 4.5, roadType: 'arterial', floodSeverity: 0.90, waterDepthCm: 95, isImpassable: true },
      { id: 'bke3', from: 'BK1', to: 'BK4', distanceKm: 4.2, roadType: 'highway', floodSeverity: 0.08, waterDepthCm: 3, isImpassable: false },
      { id: 'bke4', from: 'BK4', to: 'BK5', distanceKm: 6.8, roadType: 'highway', floodSeverity: 0.04, waterDepthCm: 0, isImpassable: false },
      { id: 'bke5', from: 'BK5', to: 'BK6', distanceKm: 9.1, roadType: 'arterial', floodSeverity: 0.12, waterDepthCm: 8, isImpassable: false },
      { id: 'bke6', from: 'BK1', to: 'BK6', distanceKm: 3.2, roadType: 'local', floodSeverity: 0.35, waterDepthCm: 22, isImpassable: false },
    ]
  },
  {
    id: 'mumbai-mithi',
    name: 'Mumbai Mithi River Coastal Flood Corridor',
    country: 'India',
    center: [19.0760, 72.8777],
    zoom: 12,
    description: 'High-tide coastal monsoon deluge along Mithi river, Kurla lowlands, and Western Express Highway underpasses.',
    historicalEvents: {
      pastPeak: { date: 'Jul 26, 2005 / Monsoon Red Alert Crest', floodCoveragePct: 89.0, description: 'Record 944mm rainfall in 24 hours with 4.5m Arabian Sea spring high tide; entire Kurla submerged.' },
      receding: { date: 'Jul 30, 2005 (Tidal Ebb Drainage)', floodCoveragePct: 38.0, description: 'Drainage through Mahim causeway sluice gates into Mahim bay.' },
      present: { date: 'Present Live Satellite (Sentinel-1 SAR)', floodCoveragePct: 14.0, description: 'Live SAR telemetry monitoring pumping stations and flyover corridors.' },
    },
    nodes: [
      { id: 'MUM1', name: 'Kurla West Mithi River Lowland', lat: 19.068, lng: 72.872, elevationMeters: 6 },
      { id: 'MUM2', name: 'Milan Subway Underpass (Submerged)', lat: 19.088, lng: 72.842, elevationMeters: 3 },
      { id: 'MUM3', name: 'SVT Road Flood Basin', lat: 19.098, lng: 72.855, elevationMeters: 4 },
      { id: 'MUM4', name: 'Western Express Highway Elevated Viaduct', lat: 19.082, lng: 72.852, elevationMeters: 24 },
      { id: 'MUM5', name: 'BKC Emergency Relief Command', lat: 19.065, lng: 72.868, elevationMeters: 14, isShelter: true },
      { id: 'MUM6', name: 'KEM Hospital Evacuation Super-Center', lat: 19.002, lng: 72.842, elevationMeters: 18, isShelter: true },
    ],
    edges: [
      { id: 'mume1', from: 'MUM1', to: 'MUM2', distanceKm: 3.5, roadType: 'arterial', floodSeverity: 0.98, waterDepthCm: 140, isImpassable: true },
      { id: 'mume2', from: 'MUM2', to: 'MUM3', distanceKm: 2.1, roadType: 'local', floodSeverity: 0.92, waterDepthCm: 105, isImpassable: true },
      { id: 'mume3', from: 'MUM1', to: 'MUM4', distanceKm: 2.8, roadType: 'highway', floodSeverity: 0.06, waterDepthCm: 0, isImpassable: false },
      { id: 'mume4', from: 'MUM4', to: 'MUM5', distanceKm: 2.2, roadType: 'highway', floodSeverity: 0.05, waterDepthCm: 0, isImpassable: false },
      { id: 'mume5', from: 'MUM5', to: 'MUM6', distanceKm: 7.4, roadType: 'arterial', floodSeverity: 0.15, waterDepthCm: 10, isImpassable: false },
      { id: 'mume6', from: 'MUM1', to: 'MUM5', distanceKm: 1.2, roadType: 'arterial', floodSeverity: 0.38, waterDepthCm: 24, isImpassable: false },
    ]
  },
  {
    id: 'chennai-adyar',
    name: 'Chennai Coastal Flood Basin (Adyar & Cooum Rivers)',
    country: 'India',
    center: [13.0827, 80.2707],
    zoom: 12,
    description: 'Cyclone Michaung and northeast monsoon urban surge inundating Velachery, Saidapet and airport runways.',
    historicalEvents: {
      pastPeak: { date: 'Dec 04, 2023 (Cyclone Michaung Inundation)', floodCoveragePct: 76.4, description: 'Over 450mm deluge in 24 hours overflowing Chembarambakkam reservoir; Saidapet bridge submerged.' },
      receding: { date: 'Dec 09, 2023 (Storm Surge Discharge)', floodCoveragePct: 32.0, description: 'Water draining into Bay of Bengal; arterial GST road reopening.' },
      present: { date: 'Present Live Satellite (Sentinel-1 SAR)', floodCoveragePct: 12.0, description: 'Live microwave radar confirms dry arterial overpasses and operational port routes.' },
    },
    nodes: [
      { id: 'CHE1', name: 'Velachery Lowland Lake Basin', lat: 12.980, lng: 80.218, elevationMeters: 4 },
      { id: 'CHE2', name: 'Saidapet Adyar River Causeway', lat: 13.018, lng: 80.222, elevationMeters: 3 },
      { id: 'CHE3', name: 'Kathipara Junction Submerged Underpass', lat: 13.006, lng: 80.201, elevationMeters: 5 },
      { id: 'CHE4', name: 'Guindy Elevated Ridge Corridor', lat: 13.008, lng: 80.215, elevationMeters: 19 },
      { id: 'CHE5', name: 'Anna University Disaster Command Post', lat: 13.012, lng: 80.235, elevationMeters: 22, isShelter: true },
      { id: 'CHE6', name: 'Chennai Central Medical Hub', lat: 13.082, lng: 80.275, elevationMeters: 14, isShelter: true },
    ],
    edges: [
      { id: 'chee1', from: 'CHE1', to: 'CHE2', distanceKm: 4.5, roadType: 'highway', floodSeverity: 0.96, waterDepthCm: 125, isImpassable: true },
      { id: 'chee2', from: 'CHE2', to: 'CHE3', distanceKm: 2.8, roadType: 'arterial', floodSeverity: 0.90, waterDepthCm: 100, isImpassable: true },
      { id: 'chee3', from: 'CHE1', to: 'CHE4', distanceKm: 3.2, roadType: 'highway', floodSeverity: 0.07, waterDepthCm: 2, isImpassable: false },
      { id: 'chee4', from: 'CHE4', to: 'CHE5', distanceKm: 2.4, roadType: 'arterial', floodSeverity: 0.04, waterDepthCm: 0, isImpassable: false },
      { id: 'chee5', from: 'CHE5', to: 'CHE6', distanceKm: 8.5, roadType: 'arterial', floodSeverity: 0.14, waterDepthCm: 8, isImpassable: false },
      { id: 'chee6', from: 'CHE1', to: 'CHE5', distanceKm: 4.8, roadType: 'local', floodSeverity: 0.36, waterDepthCm: 23, isImpassable: false },
    ]
  },
  {
    id: 'wayanad-kerala',
    name: 'Wayanad Mountain Flash Flood & Debris Basin',
    country: 'India',
    center: [11.6854, 76.1320],
    zoom: 12,
    description: 'Western Ghats high-intensity cloudburst runoff affecting Chaliyar river basin.',
    historicalEvents: {
      pastPeak: { date: 'Jul 30, 2024 (Chooralmala Catastrophic Debris Surge)', floodCoveragePct: 86.0, description: 'Torrential 372mm cloudburst triggering massive river surge washing away the Chooralmala main bridge.' },
      receding: { date: 'Aug 10, 2024 (Bailey Bridge Military Re-link)', floodCoveragePct: 39.5, description: 'Indian Army constructed 190ft Bailey bridge restoring vehicular access.' },
      present: { date: 'Present Live Satellite (Sentinel-2 MSI)', floodCoveragePct: 18.0, description: 'Live multispectral remote sensing tracking stabilized mountain slopes.' },
    },
    nodes: [
      { id: 'W1', name: 'Chooralmala Riverbank Settlement', lat: 11.542, lng: 76.185, elevationMeters: 780 },
      { id: 'W2', name: 'Washed-Out River Crossing Bridge', lat: 11.558, lng: 76.172, elevationMeters: 765 },
      { id: 'W3', name: 'Meppadi Elevated Hilltop Post', lat: 11.552, lng: 76.128, elevationMeters: 920 },
      { id: 'W4', name: 'Kalpetta District Headquarters', lat: 11.605, lng: 76.082, elevationMeters: 955, isShelter: true },
      { id: 'W5', name: 'Vythiri High Escarpment Relief Post', lat: 11.552, lng: 76.045, elevationMeters: 1040, isShelter: true },
    ],
    edges: [
      { id: 'we1', from: 'W1', to: 'W2', distanceKm: 2.4, roadType: 'local', floodSeverity: 0.98, waterDepthCm: 160, isImpassable: true },
      { id: 'we2', from: 'W2', to: 'W3', distanceKm: 4.8, roadType: 'arterial', floodSeverity: 0.88, waterDepthCm: 95, isImpassable: true },
      { id: 'we3', from: 'W1', to: 'W3', distanceKm: 6.2, roadType: 'local', floodSeverity: 0.35, waterDepthCm: 22, isImpassable: false },
      { id: 'we4', from: 'W3', to: 'W4', distanceKm: 7.9, roadType: 'highway', floodSeverity: 0.08, waterDepthCm: 3, isImpassable: false },
      { id: 'we5', from: 'W4', to: 'W5', distanceKm: 6.5, roadType: 'arterial', floodSeverity: 0.05, waterDepthCm: 0, isImpassable: false },
    ]
  },
  {
    id: 'houston',
    name: 'Houston Metro Basin (Bayou Corridor)',
    country: 'United States',
    center: [29.7604, -95.3698],
    zoom: 12,
    description: 'Buffalo Bayou and White Oak Bayou urban cresting with highway underpass inundation.',
    historicalEvents: {
      pastPeak: { date: 'Aug 28, 2017 (Hurricane Harvey Peak)', floodCoveragePct: 84.5, description: 'Catastrophic rainfall cresting buffalo bayou over 40ft; I-10 and I-610 completely submerged.' },
      receding: { date: 'Sep 03, 2017 (Receding Transition)', floodCoveragePct: 46.2, description: 'Secondary waters draining to Galveston Bay; elevated corridors reopening.' },
      present: { date: 'Present Live Satellite (Sentinel-1 SAR)', floodCoveragePct: 22.8, description: 'Live Sentinel-1 SAR pass tracking localized drainage and safe ridge transit.' },
    },
    nodes: [
      { id: 'H1', name: 'Westchase Residential Sector', lat: 29.728, lng: -95.568, elevationMeters: 24 },
      { id: 'H2', name: 'Memorial City Medical Hub', lat: 29.782, lng: -95.548, elevationMeters: 22 },
      { id: 'H3', name: 'Buffalo Bayou Crossing (I-610 Lowland)', lat: 29.762, lng: -95.452, elevationMeters: 14 },
      { id: 'H4', name: 'High-Elevation Ridge Highway (US-290)', lat: 29.832, lng: -95.465, elevationMeters: 31 },
      { id: 'H5', name: 'Downtown Emergency Shelter', lat: 29.756, lng: -95.362, elevationMeters: 16, isShelter: true },
      { id: 'H6', name: 'George R. Brown Evacuation Super-Hub', lat: 29.752, lng: -95.356, elevationMeters: 17, isShelter: true },
      { id: 'H7', name: 'Washington Ave Elevated Viaduct', lat: 29.771, lng: -95.398, elevationMeters: 27 },
      { id: 'H8', name: 'White Oak Lowlands Bypass', lat: 29.785, lng: -95.385, elevationMeters: 12 },
    ],
    edges: [
      { id: 'e1', from: 'H1', to: 'H2', distanceKm: 6.2, roadType: 'arterial', floodSeverity: 0.15, waterDepthCm: 10, isImpassable: false },
      { id: 'e2', from: 'H2', to: 'H3', distanceKm: 9.4, roadType: 'highway', floodSeverity: 0.88, waterDepthCm: 85, isImpassable: true },
      { id: 'e3', from: 'H3', to: 'H5', distanceKm: 8.7, roadType: 'highway', floodSeverity: 0.95, waterDepthCm: 110, isImpassable: true },
      { id: 'e4', from: 'H2', to: 'H4', distanceKm: 9.8, roadType: 'highway', floodSeverity: 0.05, waterDepthCm: 0, isImpassable: false },
      { id: 'e5', from: 'H4', to: 'H7', distanceKm: 8.9, roadType: 'arterial', floodSeverity: 0.12, waterDepthCm: 5, isImpassable: false },
      { id: 'e6', from: 'H7', to: 'H5', distanceKm: 4.1, roadType: 'arterial', floodSeverity: 0.20, waterDepthCm: 12, isImpassable: false },
      { id: 'e7', from: 'H5', to: 'H6', distanceKm: 1.2, roadType: 'local', floodSeverity: 0.10, waterDepthCm: 6, isImpassable: false },
      { id: 'e8', from: 'H4', to: 'H8', distanceKm: 7.9, roadType: 'arterial', floodSeverity: 0.35, waterDepthCm: 25, isImpassable: false },
      { id: 'e9', from: 'H8', to: 'H6', distanceKm: 5.4, roadType: 'local', floodSeverity: 0.40, waterDepthCm: 28, isImpassable: false },
      { id: 'e10', from: 'H1', to: 'H7', distanceKm: 14.5, roadType: 'arterial', floodSeverity: 0.28, waterDepthCm: 18, isImpassable: false },
    ]
  },
  {
    id: 'mach',
    name: 'Mach (Bolan Pass, Balochistan)',
    country: 'Pakistan',
    center: [29.8631, 67.3323],
    zoom: 12,
    description: 'Bolan River gorge flash flood basin. Historic Bolan pass viaduct and mountain highway crossings.',
    historicalEvents: {
      pastPeak: { date: 'Aug 25, 2022 (Bolan Gorge Catastrophic Flash Surge)', floodCoveragePct: 82.0, description: 'Over 500mm flash deluge in Bolan mountain pass washing away the 130-year-old railway bridge and N-65 highway.' },
      receding: { date: 'Sep 05, 2022 (Mountain Sediment Drainage)', floodCoveragePct: 44.0, description: 'Flash waters drained toward Kachhi plain, leaving heavy alluvial boulder debris.' },
      present: { date: 'Present Live Satellite (Sentinel-1 SAR & Zoom Earth)', floodCoveragePct: 16.5, description: 'Live SAR radar pass tracking active gravel riverbed and reconstructed mountain causeways.' },
    },
    nodes: [
      { id: 'M1', name: 'Mach Town Market (Bolan Lowlands)', lat: 29.863, lng: 67.332, elevationMeters: 1005 },
      { id: 'M2', name: 'Bolan River Gorge Underpass (N-65)', lat: 29.878, lng: 67.348, elevationMeters: 980 },
      { id: 'M3', name: 'Washed-Out Railway Viaduct Crossing', lat: 29.892, lng: 67.362, elevationMeters: 965 },
      { id: 'M4', name: 'Kolpur High Mountain Escarpment', lat: 29.985, lng: 67.125, elevationMeters: 1810 },
      { id: 'M5', name: 'Mach Cantonment Emergency Shelter', lat: 29.855, lng: 67.315, elevationMeters: 1045, isShelter: true },
      { id: 'M6', name: 'Pir Ghaib Mountain Ridge Relief Post', lat: 29.752, lng: 67.308, elevationMeters: 1220, isShelter: true },
    ],
    edges: [
      { id: 'me1', from: 'M1', to: 'M2', distanceKm: 2.8, roadType: 'arterial', floodSeverity: 0.94, waterDepthCm: 110, isImpassable: true },
      { id: 'me2', from: 'M2', to: 'M3', distanceKm: 3.4, roadType: 'highway', floodSeverity: 0.98, waterDepthCm: 145, isImpassable: true },
      { id: 'me3', from: 'M1', to: 'M5', distanceKm: 1.8, roadType: 'local', floodSeverity: 0.15, waterDepthCm: 8, isImpassable: false },
      { id: 'me4', from: 'M5', to: 'M6', distanceKm: 12.4, roadType: 'arterial', floodSeverity: 0.08, waterDepthCm: 4, isImpassable: false },
      { id: 'me5', from: 'M5', to: 'M4', distanceKm: 16.2, roadType: 'highway', floodSeverity: 0.05, waterDepthCm: 0, isImpassable: false },
      { id: 'me6', from: 'M2', to: 'M5', distanceKm: 4.1, roadType: 'local', floodSeverity: 0.42, waterDepthCm: 28, isImpassable: false },
    ]
  },
  {
    id: 'valencia',
    name: 'Valencia Turia Basin (DANA Storm)',
    country: 'Spain',
    center: [39.4699, -0.3763],
    zoom: 12,
    description: 'Flash deluge in the Rambla del Poyo watershed with flash surge through suburban river crossings.',
    historicalEvents: {
      pastPeak: { date: 'Oct 29, 2024 (Catastrophic DANA Surge)', floodCoveragePct: 76.8, description: 'Over 400mm rain in 8 hours; bridge scouring and highway multi-car stranding.' },
      receding: { date: 'Nov 05, 2024 (Mud Silt Transition)', floodCoveragePct: 38.4, description: 'Military emergency units clearing alluvial sediment off V-30 motorway.' },
      present: { date: 'Present Live Satellite (Copernicus EMS)', floodCoveragePct: 12.0, description: 'Live satellite confirmation of rebuilt emergency causeways.' },
    },
    nodes: [
      { id: 'V1', name: 'Paiporta Residential Epicenter', lat: 39.428, lng: -0.418, elevationMeters: 15 },
      { id: 'V2', name: 'Rambla del Poyo Bridge Point', lat: 39.435, lng: -0.405, elevationMeters: 12 },
      { id: 'V3', name: 'Torrent High Ridge Viaduct', lat: 39.438, lng: -0.468, elevationMeters: 45 },
      { id: 'V4', name: 'A-7 Western Mountain Arterial', lat: 39.482, lng: -0.485, elevationMeters: 62 },
      { id: 'V5', name: 'Valencia Central Civil Hospital', lat: 39.475, lng: -0.378, elevationMeters: 22, isShelter: true },
      { id: 'V6', name: 'Feria Valencia Emergency Evacuation Hub', lat: 39.502, lng: -0.428, elevationMeters: 38, isShelter: true },
    ],
    edges: [
      { id: 've1', from: 'V1', to: 'V2', distanceKm: 2.1, roadType: 'arterial', floodSeverity: 0.98, waterDepthCm: 140, isImpassable: true },
      { id: 've2', from: 'V2', to: 'V5', distanceKm: 5.8, roadType: 'highway', floodSeverity: 0.91, waterDepthCm: 110, isImpassable: true },
      { id: 've3', from: 'V1', to: 'V3', distanceKm: 4.8, roadType: 'local', floodSeverity: 0.20, waterDepthCm: 12, isImpassable: false },
      { id: 've4', from: 'V3', to: 'V4', distanceKm: 5.2, roadType: 'highway', floodSeverity: 0.05, waterDepthCm: 0, isImpassable: false },
      { id: 've5', from: 'V4', to: 'V6', distanceKm: 6.4, roadType: 'arterial', floodSeverity: 0.08, waterDepthCm: 2, isImpassable: false },
      { id: 've6', from: 'V6', to: 'V5', distanceKm: 5.5, roadType: 'arterial', floodSeverity: 0.15, waterDepthCm: 10, isImpassable: false },
      { id: 've7', from: 'V3', to: 'V5', distanceKm: 8.9, roadType: 'arterial', floodSeverity: 0.38, waterDepthCm: 22, isImpassable: false },
    ]
  },
  {
    id: 'brisbane',
    name: 'Brisbane Oxley Creek Delta',
    country: 'Australia',
    center: [-27.4698, 153.0251],
    zoom: 12,
    description: 'Oxley Creek catchment surge affecting Ipswich Motorway low points.',
    historicalEvents: {
      pastPeak: { date: 'Feb 28, 2022 (Brisbane River Super-Surge)', floodCoveragePct: 71.2, description: 'Rocklea industrial market flooded; 15,000 homes inundated.' },
      receding: { date: 'Mar 08, 2022 (Tidal Recession)', floodCoveragePct: 35.0, description: 'Tidal backwaters draining into Moreton Bay.' },
      present: { date: 'Present Live Satellite (Sentinel-1 SAR)', floodCoveragePct: 14.5, description: 'Live monitoring shows nominal river banks and open transit lanes.' },
    },
    nodes: [
      { id: 'B1', name: 'Rocklea Floodplain Sector', lat: -27.545, lng: 152.998, elevationMeters: 7 },
      { id: 'B2', name: 'Oxley Creek Bridge Point', lat: -27.538, lng: 152.985, elevationMeters: 5 },
      { id: 'B3', name: 'Corinda Elevated Escarpment', lat: -27.535, lng: 152.972, elevationMeters: 38 },
      { id: 'B4', name: 'Indooroopilly Suspension Ridge', lat: -27.502, lng: 152.975, elevationMeters: 29 },
      { id: 'B5', name: 'Brisbane CBD Emergency Command', lat: -27.469, lng: 153.025, elevationMeters: 18, isShelter: true },
      { id: 'B6', name: 'Moorooka High School Relief Post', lat: -27.525, lng: 153.018, elevationMeters: 32, isShelter: true },
    ],
    edges: [
      { id: 'be1', from: 'B1', to: 'B2', distanceKm: 2.1, roadType: 'arterial', floodSeverity: 0.95, waterDepthCm: 120, isImpassable: true },
      { id: 'be2', from: 'B2', to: 'B5', distanceKm: 9.3, roadType: 'highway', floodSeverity: 0.78, waterDepthCm: 65, isImpassable: true },
      { id: 'be3', from: 'B1', to: 'B3', distanceKm: 3.4, roadType: 'local', floodSeverity: 0.20, waterDepthCm: 14, isImpassable: false },
      { id: 'be4', from: 'B3', to: 'B4', distanceKm: 4.2, roadType: 'arterial', floodSeverity: 0.05, waterDepthCm: 0, isImpassable: false },
      { id: 'be5', from: 'B4', to: 'B5', distanceKm: 6.8, roadType: 'arterial', floodSeverity: 0.12, waterDepthCm: 6, isImpassable: false },
      { id: 'be6', from: 'B1', to: 'B6', distanceKm: 3.8, roadType: 'local', floodSeverity: 0.36, waterDepthCm: 22, isImpassable: false },
      { id: 'be7', from: 'B6', to: 'B5', distanceKm: 6.5, roadType: 'arterial', floodSeverity: 0.28, waterDepthCm: 16, isImpassable: false },
    ]
  }
];

// Helper to dynamically generate a flood region network for ANY user custom search location on Earth!
export function generateCustomFloodRegion(name: string, lat: number, lng: number): FloodRegionPreset {
  const baseLat = lat;
  const baseLng = lng;

  const nodes: RouteNode[] = [
    { id: 'C1', name: `${name} Lowland Sector`, lat: baseLat - 0.025, lng: baseLng - 0.02, elevationMeters: 14 },
    { id: 'C2', name: `${name} Riverbank Basin`, lat: baseLat - 0.01, lng: baseLng - 0.005, elevationMeters: 9 },
    { id: 'C3', name: `${name} Submerged Crossing (Underpass)`, lat: baseLat + 0.005, lng: baseLng + 0.01, elevationMeters: 7 },
    { id: 'C4', name: `${name} High Ridge Viaduct (Elevated)`, lat: baseLat - 0.015, lng: baseLng - 0.045, elevationMeters: 42 },
    { id: 'C5', name: `${name} North Escarpment Bypass`, lat: baseLat + 0.025, lng: baseLng - 0.035, elevationMeters: 48 },
    { id: 'C6', name: `${name} Central Relief Shelter`, lat: baseLat + 0.02, lng: baseLng + 0.02, elevationMeters: 32, isShelter: true },
    { id: 'C7', name: `${name} Intermediate Plateau Connector`, lat: baseLat + 0.01, lng: baseLng - 0.01, elevationMeters: 26 },
  ];

  const edges: RouteEdge[] = [
    // Hazardous direct path (deeply submerged)
    { id: 'ce1', from: 'C1', to: 'C2', distanceKm: 3.2, roadType: 'arterial', floodSeverity: 0.30, waterDepthCm: 20, isImpassable: false },
    { id: 'ce2', from: 'C2', to: 'C3', distanceKm: 4.1, roadType: 'highway', floodSeverity: 0.92, waterDepthCm: 90, isImpassable: true },
    { id: 'ce3', from: 'C3', to: 'C6', distanceKm: 3.5, roadType: 'arterial', floodSeverity: 0.88, waterDepthCm: 80, isImpassable: true },
    // Safe ridge bypass (Best Route)
    { id: 'ce4', from: 'C1', to: 'C4', distanceKm: 4.8, roadType: 'arterial', floodSeverity: 0.08, waterDepthCm: 4, isImpassable: false },
    { id: 'ce5', from: 'C4', to: 'C5', distanceKm: 5.6, roadType: 'highway', floodSeverity: 0.05, waterDepthCm: 0, isImpassable: false },
    { id: 'ce6', from: 'C5', to: 'C6', distanceKm: 6.2, roadType: 'highway', floodSeverity: 0.12, waterDepthCm: 6, isImpassable: false },
    // Average route (moderate risk / shallow water)
    { id: 'ce7', from: 'C1', to: 'C7', distanceKm: 5.2, roadType: 'arterial', floodSeverity: 0.35, waterDepthCm: 24, isImpassable: false },
    { id: 'ce8', from: 'C7', to: 'C6', distanceKm: 4.6, roadType: 'local', floodSeverity: 0.40, waterDepthCm: 27, isImpassable: false },
  ];

  return {
    id: `custom-${lat.toFixed(3)}-${lng.toFixed(3)}`,
    name: name,
    country: 'User Custom Target Location',
    center: [lat, lng],
    zoom: 12,
    description: `User-selected geospatial disaster site at [${lat.toFixed(4)}°, ${lng.toFixed(4)}°]. Synthetic Aperture Radar road graph network instantiated with 3-route risk weighting.`,
    nodes,
    edges,
    historicalEvents: {
      pastPeak: { date: 'Historical Flood Surge Extent', floodCoveragePct: 75.0, description: 'Peak hydrological extent in low-lying riparian drainage.' },
      receding: { date: 'Transitional Drainage Pass', floodCoveragePct: 42.0, description: 'Intermediate water clearance across secondary roads.' },
      present: { date: 'Present Live Satellite Stream', floodCoveragePct: 20.0, description: 'Real-time telemetry showing active safe corridors.' },
    }
  };
}

export interface RouteDetail {
  path: string[];
  distance: number;
  floodedSegments: number;
  maxWaterDepthCm: number;
  riskPenalty: number;
  transitTimeMin: number;
  status: 'safe' | 'caution' | 'impassable';
  label: 'Best Route' | 'Average Route' | 'Worst Route';
  description: string;
  vehicleRecommendation: string;
}

export interface ThreeRoutesResult {
  best: RouteDetail;
  average: RouteDetail;
  worst: RouteDetail;
}

// Graph Solver: Computes BEST, AVERAGE, and WORST routes
export function solveThreeRoutes(
  nodes: RouteNode[],
  edges: RouteEdge[],
  startId: string,
  endId: string
): ThreeRoutesResult | null {
  if (!startId || !endId || startId === endId) return null;

  const nodeMap = new Map<string, RouteNode>();
  nodes.forEach(n => nodeMap.set(n.id, n));

  const adj = new Map<string, { to: string; edge: RouteEdge }[]>();
  nodes.forEach(n => adj.set(n.id, []));

  edges.forEach(e => {
    adj.get(e.from)?.push({ to: e.to, edge: e });
    adj.get(e.to)?.push({ to: e.from, edge: e });
  });

  // Generic Dijkstra helper with custom edge cost function
  const runDijkstra = (costFn: (edge: RouteEdge) => number) => {
    const dist = new Map<string, number>();
    const prev = new Map<string, string | null>();
    nodes.forEach(n => dist.set(n.id, Infinity));
    dist.set(startId, 0);

    const unvisited = new Set(nodes.map(n => n.id));
    while (unvisited.size > 0) {
      let u: string | null = null;
      let minD = Infinity;
      for (const id of unvisited) {
        const d = dist.get(id)!;
        if (d < minD) {
          minD = d;
          u = id;
        }
      }
      if (!u || minD === Infinity) break;
      unvisited.delete(u);
      if (u === endId) break;

      const neighbors = adj.get(u) || [];
      for (const { to, edge } of neighbors) {
        if (unvisited.has(to)) {
          const cost = costFn(edge);
          const alt = dist.get(u)! + cost;
          if (alt < dist.get(to)!) {
            dist.set(to, alt);
            prev.set(to, u);
          }
        }
      }
    }

    const path: string[] = [];
    let curr: string | null = endId;
    while (curr) {
      path.unshift(curr);
      curr = prev.get(curr) || null;
    }
    return path[0] === startId ? path : [];
  };

  // Helper to compile RouteDetail from a node path
  const compileDetail = (
    path: string[], 
    label: 'Best Route' | 'Average Route' | 'Worst Route',
    description: string,
    vehicleRecommendation: string
  ): RouteDetail => {
    let distance = 0;
    let floodedSegments = 0;
    let maxDepth = 0;
    let maxSeverity = 0;

    for (let i = 0; i < path.length - 1; i++) {
      const from = path[i];
      const to = path[i + 1];
      const e = edges.find(ed => (ed.from === from && ed.to === to) || (ed.from === to && ed.to === from));
      if (e) {
        distance += e.distanceKm;
        if (e.waterDepthCm > maxDepth) maxDepth = e.waterDepthCm;
        if (e.floodSeverity > maxSeverity) maxSeverity = e.floodSeverity;
        if (e.floodSeverity > 0.4 || e.isImpassable || e.waterDepthCm >= 30) {
          floodedSegments++;
        }
      }
    }

    const status: 'safe' | 'caution' | 'impassable' = 
      maxDepth >= 45 ? 'impassable' : maxDepth >= 20 ? 'caution' : 'safe';
    
    const speed = status === 'safe' ? 50 : status === 'caution' ? 30 : 15;
    const transitTimeMin = Math.round((distance / speed) * 60);

    return {
      path,
      distance: Number(distance.toFixed(1)),
      floodedSegments,
      maxWaterDepthCm: maxDepth,
      riskPenalty: Number((maxSeverity * 100).toFixed(0)),
      transitTimeMin,
      status,
      label,
      description,
      vehicleRecommendation,
    };
  };

  // 1. BEST ROUTE: Heavily penalizes floodwaters and completely avoids impassable roads
  const bestPath = runDijkstra(e => {
    if (e.isImpassable || e.waterDepthCm >= 45) return e.distanceKm + 10000;
    return e.distanceKm * (1 + Math.pow(e.floodSeverity, 2) * 35);
  });

  // 2. WORST ROUTE: Pure shortest geometric distance (often passes straight through submerged underpasses)
  const worstPath = runDijkstra(e => e.distanceKm);

  // 3. AVERAGE ROUTE: Moderate tolerance; tolerates shallow water (15-25cm) for a shorter detour than the Best Route
  const averagePath = runDijkstra(e => {
    if (e.isImpassable || e.waterDepthCm >= 55) return e.distanceKm + 5000;
    return e.distanceKm * (1 + e.floodSeverity * 3);
  });

  // If average equals best or worst, create an intermediate alternative
  let finalAvgPath = averagePath;
  if (JSON.stringify(averagePath) === JSON.stringify(bestPath) && JSON.stringify(bestPath) !== JSON.stringify(worstPath)) {
    finalAvgPath = runDijkstra(e => e.distanceKm * (1 + Math.pow(e.floodSeverity, 1.5) * 8));
  }

  return {
    best: compileDetail(
      bestPath.length > 0 ? bestPath : worstPath,
      'Best Route',
      'High-elevation escarpment & ridge bypass. Lowest hydrological risk, guaranteed civilian vehicle clearance.',
      'All civilian vehicles, ambulances, and emergency buses'
    ),
    average: compileDetail(
      finalAvgPath.length > 0 ? finalAvgPath : bestPath,
      'Average Route',
      'Balanced transit distance with minor surface pooling (<25cm). Shorter detour than Best Route.',
      'High-clearance SUVs, light military 4x4s, and utility trucks'
    ),
    worst: compileDetail(
      worstPath.length > 0 ? worstPath : bestPath,
      'Worst Route',
      'Geometric shortest path. Traverses low-elevation riverbanks and flooded highway underpasses (>50-90cm).',
      'HIGH DROWNING HAZARD: Amphibious rescue craft or heavy tracked vehicles only'
    ),
  };
}

// Satellite Image Timeline Data for Module 2 - Rich Indian & Global Archive
export const SATELLITE_IMAGE_ARCHIVE: SatelliteImageRecord[] = [
  {
    id: 'SAT-IND-001',
    timestamp: '2026-10-09T06:30:00Z',
    locationName: 'Kerala Periyar River & Aluva Delta (India)',
    country: 'India',
    coordinates: [10.0261, 76.3125],
    satelliteMission: 'ISRO RISAT / Sentinel',
    waterCoveragePct: 78.5,
    cloudCoverPct: 88.0,
    resolutionM: 10,
    imageUrl: ASSET_IMAGES.floodRouteThumb,
    baselineImageUrl: ASSET_IMAGES.satelliteTimelineThumb,
    tags: ['Periyar Dam Inundation', 'Aluva Submerged', 'ISRO RISAT C-band', 'NH-66 Highway Cut'],
    floodSeverity: 'Catastrophic Deluge',
    damageSummary: 'C-band SAR radar imagery confirms catastrophic backwater spread across Aluva, Kalamassery, and Ernakulam lowlands. NH-66 and arterial railway links submerged under 1.2m of water.',
    recommendedAction: 'Immediate amphibious vehicle routing via Kakkanad high ridges; deploy NDRF rescue boats to Aluva market.',
    historicalEvents: {
      pastDate: 'Aug 16, 2018 (Peak Monsoon Flood Disaster)',
      pastWaterCoveragePct: 84.0,
      pastDescription: 'All 35 state reservoir floodgates lifted simultaneously; Aluva submerged by over 3.5m.',
      presentDate: 'Present Live Satellite Stream (Sentinel-1 SAR)',
      presentWaterCoveragePct: 18.2,
      presentDescription: 'Live radar observation confirms water receding into Arabian Sea backwaters; Kakkanad corridor clear.',
    },
    impactData: {
      "structuresDamaged": 28450,
      "bridgesImpacted": 18,
      "cropHectaresInundated": 54600,
      "displacedPopulation": 1450000,
      "fatalitiesRecorded": 483,
      "economicLossUsdMillions": 3800,
      "keyDamagedInfrastructure": [
            "Aluva Railway Bridge approach scouring and abutment settlement",
            "Kalamassery 220kV Electrical Grid Substation flooded under 1.5m water",
            "NH-66 Edappally highway underpass completely submerged (>2.1m)",
            "Cochin International Airport (COK) runway and solar field inundated for 12 days"
      ],
      "damageImages": [
            {
                  "url": "/src/assets/images/flood_damage_houses_1791624389119.jpg",
                  "caption": "Aerial drone reconnaissance of residential neighborhoods submerged under 2.5m floodwaters with NDRF boats navigating rooftops.",
                  "type": "aerial"
            },
            {
                  "url": "/src/assets/images/flood_bridge_washout_1791624409235.jpg",
                  "caption": "Bridge approach collapse and severed roadway over raging Periyar torrent.",
                  "type": "ground"
            },
            {
                  "url": "/src/assets/images/flood_route_thumb_1791619830992.jpg",
                  "caption": "ISRO RISAT / Sentinel-1 SAR microwave flood boundary delineation map.",
                  "type": "satellite"
            }
      ]
},
  },
  {
    id: 'SAT-IND-002',
    timestamp: '2026-10-04T04:15:00Z',
    locationName: 'Assam Brahmaputra River Basin & Kaziranga (India)',
    country: 'India',
    coordinates: [26.1856, 91.7486],
    satelliteMission: 'Sentinel-2 MSI',
    waterCoveragePct: 82.4,
    cloudCoverPct: 22.0,
    resolutionM: 10,
    imageUrl: ASSET_IMAGES.satelliteTimelineThumb,
    baselineImageUrl: ASSET_IMAGES.satelliteTimelineThumb,
    tags: ['Brahmaputra Super-Crest', 'Kaziranga Submerged', 'Multispectral Water Index', 'Embankment Breach'],
    floodSeverity: 'Catastrophic Deluge',
    damageSummary: 'Optical MNDWI (Modified Normalized Difference Water Index) reveals Brahmaputra river channel width expanding from 4km to 18km, inundating over 2,200 villages and 85% of Kaziranga.',
    recommendedAction: 'Maintain wildlife highland corridors along Karbi Anglong hills; emergency barges deployed at Guwahati ghats.',
    historicalEvents: {
      pastDate: 'Jul 08, 2024 (Assam Mega-Flood Crest)',
      pastWaterCoveragePct: 88.4,
      pastDescription: 'Over 2.4 million residents affected across 30 Assam districts; Saraighat underpasses impassable.',
      presentDate: 'Present Live Satellite Stream (Zoom Earth & Sentinel)',
      presentWaterCoveragePct: 24.2,
      presentDescription: 'Braided river sandbars emerging; Khanapara elevated expressway fully passable.',
    },
    impactData: {
      "structuresDamaged": 42100,
      "bridgesImpacted": 32,
      "cropHectaresInundated": 112000,
      "displacedPopulation": 2420000,
      "fatalitiesRecorded": 118,
      "economicLossUsdMillions": 1650,
      "keyDamagedInfrastructure": [
            "Saraighat North bank highway approach breach",
            "NH-715 Kaziranga animal movement highland corridor flooded under 2.8m",
            "Brahmaputra embankment breached in 46 locations across Morigaon and Dhubri",
            "Guwahati Water Intake station inundated by alluvial sediment silt"
      ],
      "damageImages": [
            {
                  "url": "/src/assets/images/flood_damage_houses_1791624389119.jpg",
                  "caption": "Over 2,200 villages inundated along Brahmaputra floodplain with residents evacuated via country boats.",
                  "type": "aerial"
            },
            {
                  "url": "/src/assets/images/flood_bridge_washout_1791624409235.jpg",
                  "caption": "Highway culvert and concrete bridge washed away by violent high-discharge river currents.",
                  "type": "ground"
            },
            {
                  "url": "/src/assets/images/satellite_timeline_thumb_1791619847596.jpg",
                  "caption": "Sentinel-2 MSI optical water index tracking Brahmaputra swell from 4km to 18km wide.",
                  "type": "satellite"
            }
      ]
},
  },
  {
    id: 'SAT-IND-003',
    timestamp: '2026-09-28T08:20:00Z',
    locationName: 'Wayanad Chooralmala & Chaliyar Basin (India)',
    country: 'India',
    coordinates: [11.5520, 76.1280],
    satelliteMission: 'Sentinel-2 MSI',
    waterCoveragePct: 69.0,
    cloudCoverPct: 45.0,
    resolutionM: 10,
    imageUrl: ASSET_IMAGES.floodRouteThumb,
    baselineImageUrl: ASSET_IMAGES.earthBg,
    tags: ['Western Ghats Cloudburst', 'Debris Surge', 'Chooralmala Bridge Loss', 'High Mountain Runoff'],
    floodSeverity: 'Severe Inundation',
    damageSummary: 'Sentinel-2 post-disaster scene clearly delineates 8km mud and boulder track following intense 372mm cloudburst in Western Ghats, severing Chooralmala road connection.',
    recommendedAction: 'Utilize military Bailey bridge crossing; restrict civilian traffic on Meppadi-Chooralmala downhill gradient.',
    historicalEvents: {
      pastDate: 'Jul 30, 2024 (Chooralmala Debris Deluge)',
      pastWaterCoveragePct: 86.0,
      pastDescription: 'Severe mountain flash deluge washing away bridge infrastructure and residential lowlands.',
      presentDate: 'Present Live Satellite Stream (Sentinel-2)',
      presentWaterCoveragePct: 18.0,
      presentDescription: 'Re-stabilized hillside runoff channels and military Bailey bridge traffic operational.',
    },
    impactData: {
      "structuresDamaged": 1250,
      "bridgesImpacted": 4,
      "cropHectaresInundated": 1850,
      "displacedPopulation": 14200,
      "fatalitiesRecorded": 420,
      "economicLossUsdMillions": 420,
      "keyDamagedInfrastructure": [
            "Chooralmala Main Concrete Bridge completely swept away by boulder debris flow",
            "Meppadi-Chooralmala Hilltop Link Road severed into 3 impassable segments",
            "Vellarmala School and tea plantation staff quarters buried under 6m silt",
            "Indian Army 190ft Bailey bridge constructed to restore emergency response"
      ],
      "damageImages": [
            {
                  "url": "/src/assets/images/flood_bridge_washout_1791624409235.jpg",
                  "caption": "Chooralmala bridge concrete spans obliterated by 300,000 tons of mud and granite boulders.",
                  "type": "ground"
            },
            {
                  "url": "/src/assets/images/flood_damage_houses_1791624389119.jpg",
                  "caption": "Western Ghats hillside settlement engulfed by violent debris flow torrent.",
                  "type": "aerial"
            },
            {
                  "url": "/src/assets/images/flood_route_thumb_1791619830992.jpg",
                  "caption": "High-resolution post-disaster satellite footprint tracking 8km debris track.",
                  "type": "satellite"
            }
      ]
},
  },
  {
    id: 'SAT-IND-004',
    timestamp: '2026-09-15T11:40:00Z',
    locationName: 'Bihar Kosi River Floodplain (North Bihar, India)',
    country: 'India',
    coordinates: [25.5941, 85.1376],
    satelliteMission: 'NASA MODIS',
    waterCoveragePct: 74.8,
    cloudCoverPct: 30.0,
    resolutionM: 250,
    imageUrl: ASSET_IMAGES.satelliteTimelineThumb,
    baselineImageUrl: ASSET_IMAGES.earthBg,
    tags: ['Kosi River Avulsion', 'Silt Overwash', 'Ganga Confluence Surge', 'North Bihar Inundation'],
    floodSeverity: 'Severe Inundation',
    damageSummary: 'NASA MODIS Terra/Aqua reflectance shows massive sheet flooding across Saharsa, Supaul, and Madhepura districts following upstream barrage release.',
    recommendedAction: 'Direct supply trucks via Patna elevated expressway; avoid northern causeways.',
    historicalEvents: {
      pastDate: 'Aug 20, 2023 (Kosi Floodplain Peak)',
      pastWaterCoveragePct: 82.5,
      pastDescription: 'Embankment overtopping causing agricultural submerged zones across 400 sq km.',
      presentDate: 'Present Live Satellite Stream (MODIS & Sentinel)',
      presentWaterCoveragePct: 18.5,
      presentDescription: 'Receded water channels and dry elevated highway network in Patna corridor.',
    },
    impactData: {
      "structuresDamaged": 58200,
      "bridgesImpacted": 24,
      "cropHectaresInundated": 180000,
      "displacedPopulation": 3100000,
      "fatalitiesRecorded": 285,
      "economicLossUsdMillions": 1950,
      "keyDamagedInfrastructure": [
            "Kosi Eastern Afflux Bund breach at Kusaha",
            "NH-31 National Highway severed near Saharsa by 1.2m flowing sheet water",
            "Samastipur-Saharsa railway tracks hanging in mid-air due to embankment washout",
            "Over 400 rural causeways completely submerged in alluvial silt"
      ],
      "damageImages": [
            {
                  "url": "/src/assets/images/flood_damage_houses_1791624389119.jpg",
                  "caption": "Endless expanse of submerged North Bihar villages with families on elevated embankments.",
                  "type": "aerial"
            },
            {
                  "url": "/src/assets/images/flood_bridge_washout_1791624409235.jpg",
                  "caption": "Washed-out railway embankment and twisted track spans over Kosi flood channel.",
                  "type": "ground"
            },
            {
                  "url": "/src/assets/images/satellite_timeline_thumb_1791619847596.jpg",
                  "caption": "NASA MODIS reflectance mapping sheet flooding across 5 North Bihar districts.",
                  "type": "satellite"
            }
      ]
},
  },
  {
    id: 'SAT-IND-005',
    timestamp: '2026-08-30T10:15:00Z',
    locationName: 'Chennai Velachery & Adyar Coastal Basin (India)',
    country: 'India',
    coordinates: [13.0827, 80.2707],
    satelliteMission: 'Sentinel-1 SAR',
    waterCoveragePct: 62.0,
    cloudCoverPct: 94.0,
    resolutionM: 10,
    imageUrl: ASSET_IMAGES.floodRouteThumb,
    baselineImageUrl: ASSET_IMAGES.satelliteTimelineThumb,
    tags: ['Cyclone Michaung', 'Adyar River Spate', 'Velachery Lake Overflow', 'Coastal Storm Surge'],
    floodSeverity: 'Severe Inundation',
    damageSummary: 'Sentinel-1 microwave SAR confirms severe urban waterlogging throughout South Chennai basins; Kathipara junction underpass submerged under 1m water.',
    recommendedAction: 'Maintain arterial transit through Guindy and Anna University elevated grounds.',
    historicalEvents: {
      pastDate: 'Dec 04, 2023 (Cyclone Michaung Inundation)',
      pastWaterCoveragePct: 76.4,
      pastDescription: 'Severe cyclonic precipitation submerging Chennai airport runway and residential colonies.',
      presentDate: 'Present Live Satellite Stream (Sentinel-1 SAR)',
      presentWaterCoveragePct: 12.0,
      presentDescription: 'Normal urban drainage active; all major bridges clear.',
    },
    impactData: {
      "structuresDamaged": 36000,
      "bridgesImpacted": 8,
      "cropHectaresInundated": 24000,
      "displacedPopulation": 850000,
      "fatalitiesRecorded": 17,
      "economicLossUsdMillions": 1200,
      "keyDamagedInfrastructure": [
            "Kathipara Multi-level Flyover low underpasses filled with 1.8m stagnant stormwater",
            "Chennai Airport Runway closed due to Adyar river overtopping perimeter wall",
            "Velachery Lake residential layouts submerged up to first floor balconies",
            "Ennore creek oil refinery runoff contaminated stormwater drainage"
      ],
      "damageImages": [
            {
                  "url": "/src/assets/images/flood_damage_houses_1791624389119.jpg",
                  "caption": "Velachery residential colonies with parked cars submerged and rescue rubber boats.",
                  "type": "aerial"
            },
            {
                  "url": "/src/assets/images/flood_bridge_washout_1791624409235.jpg",
                  "caption": "Collapsed retaining wall and flooded underpass along South Chennai arterial corridor.",
                  "type": "ground"
            },
            {
                  "url": "/src/assets/images/flood_route_thumb_1791619830992.jpg",
                  "caption": "Sentinel-1 microwave radar delineating standing water in urban built-up areas.",
                  "type": "satellite"
            }
      ]
},
  },
  {
    id: 'SAT-IND-006',
    timestamp: '2026-08-18T14:00:00Z',
    locationName: 'Mumbai Mithi River & Kurla Basin (India)',
    country: 'India',
    coordinates: [19.0760, 72.8777],
    satelliteMission: 'Sentinel-1 SAR',
    waterCoveragePct: 68.5,
    cloudCoverPct: 91.0,
    resolutionM: 10,
    imageUrl: ASSET_IMAGES.floodRouteThumb,
    baselineImageUrl: ASSET_IMAGES.earthBg,
    tags: ['Monsoon High Tide', 'Mithi River Overflow', 'Subway Submersion', 'Coastal Deluge'],
    floodSeverity: 'Severe Inundation',
    damageSummary: 'Synthetic Aperture Radar detects water pooling exceeding 1.2m along Milan subway and Kurla lowlands coinciding with 4.5m Arabian Sea high tide.',
    recommendedAction: 'Evacuate traffic via Western Express Highway elevated flyovers; activate pumping stations.',
    historicalEvents: {
      pastDate: 'Jul 26, 2005 (Mumbai Historic Deluge)',
      pastWaterCoveragePct: 89.0,
      pastDescription: 'Record 944mm rainfall submerging Mithi corridor and suburban rail networks.',
      presentDate: 'Present Live Satellite Stream (Sentinel-1 SAR)',
      presentWaterCoveragePct: 14.0,
      presentDescription: 'Pumps active, Western Express Highway viaduct fully passable.',
    },
    impactData: {
      "structuresDamaged": 65000,
      "bridgesImpacted": 12,
      "cropHectaresInundated": 8500,
      "displacedPopulation": 1800000,
      "fatalitiesRecorded": 1094,
      "economicLossUsdMillions": 4500,
      "keyDamagedInfrastructure": [
            "Milan Subway and Khar Subway flooded to ceilings (over 3.5m water)",
            "Mithi River bank overflow at Kurla and BKC business district",
            "Central and Western Railway suburban lines paralyzed by waterlogged tracks",
            "Chhatrapati Shivaji Maharaj International Airport closed for 30 hours"
      ],
      "damageImages": [
            {
                  "url": "/src/assets/images/flood_damage_houses_1791624389119.jpg",
                  "caption": "Kurla lowlands and suburban transit corridor engulfed in 944mm record rainfall.",
                  "type": "aerial"
            },
            {
                  "url": "/src/assets/images/flood_bridge_washout_1791624409235.jpg",
                  "caption": "Submerged rail viaduct and washed out suburban road connections in Mumbai.",
                  "type": "ground"
            },
            {
                  "url": "/src/assets/images/satellite_timeline_thumb_1791619847596.jpg",
                  "caption": "Synthetic aperture radar tracking urban water accumulation along Arabian sea high tide.",
                  "type": "satellite"
            }
      ]
},
  },
  {
    id: 'SAT-005',
    timestamp: '2026-08-25T07:30:00Z',
    locationName: 'Mach (Bolan Gorge, Balochistan)',
    country: 'Pakistan',
    coordinates: [29.8631, 67.3323],
    satelliteMission: 'Sentinel-1 SAR',
    waterCoveragePct: 74.2,
    cloudCoverPct: 82.0,
    resolutionM: 10,
    imageUrl: ASSET_IMAGES.floodRouteThumb,
    baselineImageUrl: ASSET_IMAGES.earthBg,
    tags: ['Bolan Pass Mountain Deluge', 'Washed-Out Railway Viaduct', 'Alluvial Flash Flood', 'SAR Microwave'],
    floodSeverity: 'Catastrophic Deluge',
    damageSummary: 'Sentinel-1 microwave radar observes Bolan River mountain gorge swelling past 800% capacity, severing N-65 national highway and the historic 130-year-old railway link.',
    recommendedAction: 'Immediate high-altitude helicopter evacuations along Kolpur escarpment.',
    historicalEvents: {
      pastDate: 'Aug 25, 2022 (Bolan Pass Disaster)',
      pastWaterCoveragePct: 82.0,
      pastDescription: 'Mountain cloudburst destroying historic railway viaduct and national highway.',
      presentDate: 'Present Live Satellite Stream (Zoom Earth & SAR)',
      presentWaterCoveragePct: 16.5,
      presentDescription: 'Dry boulder riverbed with newly reconstructed causeway open for emergency convoy.',
    },
    impactData: {
      "structuresDamaged": 8500,
      "bridgesImpacted": 6,
      "cropHectaresInundated": 34000,
      "displacedPopulation": 340000,
      "fatalitiesRecorded": 76,
      "economicLossUsdMillions": 620,
      "keyDamagedInfrastructure": [
            "Historic 130-year-old Bolan Gorge Railway Bridge No. 3 washed away",
            "N-65 National Highway severed at multiple mountain hairpin bends",
            "High-pressure Sui gas transmission pipeline exposed and fractured by boulder impact",
            "Mach railway station yard submerged under 1.5m gravel and alluvial silt"
      ],
      "damageImages": [
            {
                  "url": "/src/assets/images/flood_bridge_washout_1791624409235.jpg",
                  "caption": "Historic railway viaduct completely destroyed by raging mountain flash torrent.",
                  "type": "ground"
            },
            {
                  "url": "/src/assets/images/flood_damage_houses_1791624389119.jpg",
                  "caption": "Alluvial boulder flood wiping out mud-brick structures along Bolan River banks.",
                  "type": "aerial"
            },
            {
                  "url": "/src/assets/images/flood_route_thumb_1791619830992.jpg",
                  "caption": "Microwave radar footprint identifying mountain gorge swell in Balochistan.",
                  "type": "satellite"
            }
      ]
},
  },
  {
    id: 'SAT-001',
    timestamp: '2026-10-08T09:24:00Z',
    locationName: 'Houston Buffalo Bayou Watershed',
    country: 'United States',
    coordinates: [29.7604, -95.3698],
    satelliteMission: 'Sentinel-1 SAR',
    waterCoveragePct: 78.4,
    cloudCoverPct: 92.1,
    resolutionM: 10,
    imageUrl: ASSET_IMAGES.floodRouteThumb,
    baselineImageUrl: ASSET_IMAGES.satelliteTimelineThumb,
    tags: ['Waterlogged Highways', 'Severe Inundation', 'SAR Microwave Penetration', 'Submerged Underpasses'],
    floodSeverity: 'Catastrophic Deluge',
    damageSummary: 'Synthetic Aperture Radar L-band confirms deep standing water throughout Memorial Corridor and Buffalo Bayou. Interstates I-10 and I-610 low points are completely impassable.',
    recommendedAction: 'Immediate high-water vehicle deployment. Follow Northern Escarpment bypass.',
    historicalEvents: {
      pastDate: 'Aug 28, 2017 (Hurricane Harvey Peak)',
      pastWaterCoveragePct: 84.5,
      pastDescription: 'Over 60 inches of rain flooding Buffalo Bayou; I-10 completely underwater.',
      presentDate: 'Present Live Satellite Stream (Sentinel-1 SAR)',
      presentWaterCoveragePct: 22.8,
      presentDescription: 'Clear elevated ridge highways and stabilized retention basins.',
    },
    impactData: {
      "structuresDamaged": 204000,
      "bridgesImpacted": 15,
      "cropHectaresInundated": 92000,
      "displacedPopulation": 750000,
      "fatalitiesRecorded": 107,
      "economicLossUsdMillions": 125000,
      "keyDamagedInfrastructure": [
            "I-10 Katy Freeway underpasses filled with 4m floodwaters from Addicks Reservoir",
            "Buffalo Bayou overflowing banks into Houston Downtown Theater District",
            "San Jacinto River bridge approach compromised by heavy barge collisions",
            "Over 300,000 vehicles completely flooded across Harris County"
      ],
      "damageImages": [
            {
                  "url": "/src/assets/images/flood_damage_houses_1791624389119.jpg",
                  "caption": "Thousands of residential homes inundated up to roof gutters along Buffalo Bayou.",
                  "type": "aerial"
            },
            {
                  "url": "/src/assets/images/flood_bridge_washout_1791624409235.jpg",
                  "caption": "Interstate highway submerged with abandoned vehicles and rescue boats.",
                  "type": "ground"
            },
            {
                  "url": "/src/assets/images/satellite_timeline_thumb_1791619847596.jpg",
                  "caption": "Sentinel-1 SAR delineation of 60 inches precipitation inundation.",
                  "type": "satellite"
            }
      ]
},
  },
  {
    id: 'SAT-004',
    timestamp: '2026-07-02T13:10:00Z',
    locationName: 'Valencia Turia River Delta (Spain)',
    country: 'Spain',
    coordinates: [39.4699, -0.3763],
    satelliteMission: 'Landsat 9',
    waterCoveragePct: 53.8,
    cloudCoverPct: 8.5,
    resolutionM: 15,
    imageUrl: ASSET_IMAGES.satelliteTimelineThumb,
    baselineImageUrl: ASSET_IMAGES.satelliteTimelineThumb,
    tags: ['Flash Flood Surge', 'Bridge Scouring', 'Mud Sediment Plume', 'High Clarity'],
    floodSeverity: 'Severe Inundation',
    damageSummary: 'Massive alluvial mud fans visible washing into coastal delta. Multiple viaduct spans compromised by high-velocity debris currents.',
    recommendedAction: 'Structural load testing mandated on all crossing bridges before reopening.',
    historicalEvents: {
      pastDate: 'Oct 29, 2024 (Catastrophic DANA Storm)',
      pastWaterCoveragePct: 76.8,
      pastDescription: 'Record cloudburst surging through Rambla del Poyo with multiple bridge collapses.',
      presentDate: 'Present Live Satellite Stream (Copernicus EMS)',
      presentWaterCoveragePct: 12.0,
      presentDescription: 'Reconstructed causeways open; mud silt cleared on major arterials.',
    },
    impactData: {
      "structuresDamaged": 35000,
      "bridgesImpacted": 40,
      "cropHectaresInundated": 45000,
      "displacedPopulation": 280000,
      "fatalitiesRecorded": 227,
      "economicLossUsdMillions": 11000,
      "keyDamagedInfrastructure": [
            "Rambla del Poyo bridge collapses sweeping vehicles into coastal ravines",
            "V-30 Valencia beltway paralyzed by 1.8m rapid alluvial mud torrent",
            "Paiporta and Chiva railway stations submerged under high-velocity mud slurry",
            "Over 100,000 vehicles piled up against bridge piers and road guardrails"
      ],
      "damageImages": [
            {
                  "url": "/src/assets/images/flood_bridge_washout_1791624409235.jpg",
                  "caption": "Devastated road bridge in Paiporta with vehicles crushed against concrete piers.",
                  "type": "ground"
            },
            {
                  "url": "/src/assets/images/flood_damage_houses_1791624389119.jpg",
                  "caption": "Aerial view of Mediterranean town smothered in deep alluvial mud deposit.",
                  "type": "aerial"
            },
            {
                  "url": "/src/assets/images/satellite_timeline_thumb_1791619847596.jpg",
                  "caption": "Landsat 9 multispectral scene showing massive sediment plume flowing into Mediterranean.",
                  "type": "satellite"
            }
      ]
},
  },
  {
    id: 'SAT-003',
    timestamp: '2026-08-14T11:50:00Z',
    locationName: 'Rhine River Basin High Crest (Germany)',
    country: 'Germany',
    coordinates: [50.1109, 8.6821],
    satelliteMission: 'NASA MODIS',
    waterCoveragePct: 41.5,
    cloudCoverPct: 35.4,
    resolutionM: 250,
    imageUrl: ASSET_IMAGES.floodRouteThumb,
    baselineImageUrl: ASSET_IMAGES.earthBg,
    tags: ['Urban Runoff', 'Channel Swelling', 'Commercial Waterway Halt', 'Daily Revisit'],
    floodSeverity: 'Minor Surge',
    damageSummary: 'MODIS Surface Reflectance indicates river discharge peaked at +3.2m above median pool level. Freight vessel shipping halted.',
    recommendedAction: 'Inspect lock gates and monitor lower valley retention basins.',
    historicalEvents: {
      pastDate: 'Jul 15, 2021 (Western Europe Flash Surge)',
      pastWaterCoveragePct: 58.0,
      pastDescription: 'Extreme river discharge inundating riverside towns and rail lines.',
      presentDate: 'Present Live Satellite Stream (NASA MODIS)',
      presentWaterCoveragePct: 15.0,
      presentDescription: 'Normal navigation pool levels restored across all locks.',
    },
    impactData: {
      "structuresDamaged": 18000,
      "bridgesImpacted": 62,
      "cropHectaresInundated": 14000,
      "displacedPopulation": 120000,
      "fatalitiesRecorded": 184,
      "economicLossUsdMillions": 38000,
      "keyDamagedInfrastructure": [
            "Ahr River Valley bridges destroyed: 62 out of 75 bridges completely wiped out",
            "Ahrtal railway line infrastructure ripped from track beds for 30km",
            "Bad Neuenahr historical spa district filled with 2.5m contaminated floodwaters",
            "Drinking water and gas mains severed across the entire lower valley"
      ],
      "damageImages": [
            {
                  "url": "/src/assets/images/flood_bridge_washout_1791624409235.jpg",
                  "caption": "Historic stone arch and modern concrete bridges obliterated along Ahr River gorge.",
                  "type": "ground"
            },
            {
                  "url": "/src/assets/images/flood_damage_houses_1791624389119.jpg",
                  "caption": "Severely damaged timber-framed houses with structural cave-ins along riverbanks.",
                  "type": "aerial"
            },
            {
                  "url": "/src/assets/images/flood_route_thumb_1791619830992.jpg",
                  "caption": "NASA MODIS tracking unprecedented discharge crest along Western European rivers.",
                  "type": "satellite"
            }
      ]
},
  }
];

// Presets for Air Estimator
export interface AirLocationPreset {
  name: string;
  country: string;
  lat: number;
  lng: number;
  defaultAqi: number;
  dominantPollutant: string;
}

export const AIR_LOCATION_PRESETS: AirLocationPreset[] = [
  { name: 'India Subcontinent (All India View)', country: 'India', lat: 22.5937, lng: 78.9629, defaultAqi: 112, dominantPollutant: 'PM2.5 / Wind Plumes' },
  { name: 'Delhi NCR (Indo-Gangetic Plain)', country: 'India', lat: 28.6139, lng: 77.2090, defaultAqi: 184, dominantPollutant: 'PM2.5 / Biomass Smoke' },
  { name: 'Mumbai Coastal Basin', country: 'India', lat: 19.0760, lng: 72.8777, defaultAqi: 88, dominantPollutant: 'NO₂ / Coastal Haze' },
  { name: 'Kolkata & Sundarbans Delta', country: 'India', lat: 22.5726, lng: 88.3639, defaultAqi: 126, dominantPollutant: 'PM10 / Particulates' },
  { name: 'Bengaluru Plateau Tech Basin', country: 'India', lat: 12.9716, lng: 77.5946, defaultAqi: 48, dominantPollutant: 'Ozone' },
  { name: 'Chennai Coastal Metro', country: 'India', lat: 13.0827, lng: 80.2707, defaultAqi: 56, dominantPollutant: 'SO₂ / Maritime Aerosol' },
  { name: 'Assam Brahmaputra Valley (Guwahati)', country: 'India', lat: 26.1856, lng: 91.7486, defaultAqi: 62, dominantPollutant: 'Alluvial Dust / Silt' },
  { name: 'Kerala Periyar Corridor (Kochi)', country: 'India', lat: 10.0261, lng: 76.3125, defaultAqi: 36, dominantPollutant: 'Clean Maritime Breeze' },
  { name: 'Wayanad Mountain Reserve', country: 'India', lat: 11.6854, lng: 76.1320, defaultAqi: 28, dominantPollutant: 'Pristine Canopy Air' },
  { name: 'Mach (Bolan, Balochistan)', country: 'Pakistan', lat: 29.8631, lng: 67.3323, defaultAqi: 74, dominantPollutant: 'PM10 / Mineral Dust' },
  { name: 'Global Earth View', country: 'Worldwide (Zoom Earth)', lat: 20.0, lng: 0.0, defaultAqi: 45, dominantPollutant: 'Global Aerosols' },
  { name: 'Houston, TX', country: 'United States', lat: 29.7604, lng: -95.3698, defaultAqi: 58, dominantPollutant: 'Ozone' },
  { name: 'Valencia Basin', country: 'Spain', lat: 39.4699, lng: -0.3763, defaultAqi: 54, dominantPollutant: 'NO₂' },
];
