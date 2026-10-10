export interface UserProfile {
  email: string;
  name: string;
  alias: string;
  isAnonymous: boolean;
  role: string;
  isLoggedIn: boolean;
}

export type ActiveModule = 'start' | 'home' | 'route-mapper' | 'image-search' | 'air-estimator';

export interface AlertNotification {
  id: string;
  timestamp: string;
  type: 'danger' | 'warning' | 'info';
  title: string;
  message: string;
  module: 'Route' | 'Imagery' | 'Air' | 'System';
}

export interface Coordinates {
  lat: number;
  lng: number;
  name?: string;
}

export interface RouteNode {
  id: string;
  name: string;
  lat: number;
  lng: number;
  elevationMeters: number;
  isShelter?: boolean;
}

export interface RouteEdge {
  id: string;
  from: string;
  to: string;
  distanceKm: number;
  roadType: 'highway' | 'arterial' | 'local' | 'bridge';
  floodSeverity: number; // 0 to 1.0 (0 = dry, 1 = deep raging water)
  waterDepthCm: number;
  isImpassable: boolean;
}

export interface RouteResult {
  path: string[];
  totalDistanceKm: number;
  riskPenalty: number;
  submergedSectionsCount: number;
  estimatedTransitMin: number;
  status: 'safe' | 'caution' | 'impassable';
  aiBriefing?: string;
}

export interface SatelliteImageRecord {
  id: string;
  timestamp: string;
  locationName: string;
  country?: string;
  coordinates?: [number, number];
  satelliteMission: 'Sentinel-1 SAR' | 'Sentinel-2 MSI' | 'NASA MODIS' | 'Landsat 9' | 'ISRO RISAT / Sentinel';
  waterCoveragePct: number;
  cloudCoverPct: number;
  resolutionM: number;
  imageUrl: string;
  baselineImageUrl?: string;
  tags: string[];
  floodSeverity: 'Normal' | 'Minor Surge' | 'Severe Inundation' | 'Catastrophic Deluge';
  damageSummary?: string;
  recommendedAction?: string;
  historicalEvents?: {
    pastDate: string;
    pastWaterCoveragePct: number;
    pastDescription: string;
    presentDate: string;
    presentWaterCoveragePct: number;
    presentDescription: string;
  };
  impactData?: FloodImpactData;
}

export interface FloodImpactData {
  structuresDamaged: number;
  bridgesImpacted: number;
  cropHectaresInundated: number;
  displacedPopulation: number;
  fatalitiesRecorded?: number;
  economicLossUsdMillions?: number;
  keyDamagedInfrastructure: string[];
  damageImages: Array<{
    url: string;
    caption: string;
    type: 'satellite' | 'aerial' | 'ground';
  }>;
}

export interface DisasterLocationTime {
  country: string;       // e.g., 'India', 'Pakistan', 'United States', 'Spain', etc.
  place: string;         // e.g., 'Kerala (Periyar River Basin)', 'Assam (Brahmaputra)', etc.
  date: string;          // YYYY-MM-DD
  time: string;          // HH:mm
  coordinates: [number, number]; // [lat, lng]
  presetId?: string;
  isPast: boolean;
  eventTitle?: string;
}

export interface AirQualityMeasurement {
  europeanAqi: number;
  usAqi: number;
  pm25: number;
  pm10: number;
  no2: number;
  co: number;
  so2: number;
  o3: number;
  aerosolDepth?: number;
  temperatureC?: number;
  temperatureF?: number;
  humidityPct?: number;
  windSpeedKmh?: number;
  pressureHpa?: number;
  toxicityScore?: number;
  timestamp: string;
}

export interface ToxicityThreshold {
  pollutant: string;
  unit: string;
  whoLimit: number;
  currentValue: number;
  status: 'safe' | 'moderate' | 'unhealthy' | 'hazardous';
  healthImpact: string;
}

export interface AirForecastPoint {
  time: string;
  aqi: number;
  pm25: number;
  no2: number;
  predictedAqi: number;
  upperBound: number;
  lowerBound: number;
  tempC?: number;
  humidity?: number;
}
