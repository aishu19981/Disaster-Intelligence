import React, { useState, useEffect } from 'react';
import { Globe2, MapPin, Calendar, Clock, Search, Satellite, AlertTriangle, CheckCircle2, History } from 'lucide-react';
import { DisasterLocationTime } from '../types';

export interface LocationPresetItem {
  id: string;
  country: string;
  place: string;
  historicalDate: string;
  historicalTime: string;
  eventTitle: string;
  coordinates: [number, number];
}

export const FAMOUS_DISASTER_PRESETS: LocationPresetItem[] = [
  {
    id: 'kerala',
    country: 'India',
    place: 'Kerala (Periyar River & Aluva Delta)',
    historicalDate: '2018-08-16',
    historicalTime: '09:30',
    eventTitle: 'Kerala 2018 Mega Dam Overflow',
    coordinates: [10.0261, 76.3125],
  },
  {
    id: 'assam-brahmaputra',
    country: 'India',
    place: 'Assam (Brahmaputra Basin & Kaziranga)',
    historicalDate: '2024-07-08',
    historicalTime: '14:00',
    eventTitle: 'Assam 2024 Brahmaputra Super-Crest',
    coordinates: [26.1856, 91.7486],
  },
  {
    id: 'wayanad-kerala',
    country: 'India',
    place: 'Wayanad (Chooralmala & Meppadi)',
    historicalDate: '2024-07-30',
    historicalTime: '02:00',
    eventTitle: 'Wayanad 2024 Debris Flow & Cloudburst',
    coordinates: [11.6854, 76.1320],
  },
  {
    id: 'bihar-kosi',
    country: 'India',
    place: 'Bihar (Kosi River Floodplain)',
    historicalDate: '2023-08-20',
    historicalTime: '11:30',
    eventTitle: 'Bihar 2023 Kosi River Embankment Breach',
    coordinates: [25.5941, 85.1376],
  },
  {
    id: 'mumbai-mithi',
    country: 'India',
    place: 'Mumbai (Mithi River & Kurla Delta)',
    historicalDate: '2005-07-26',
    historicalTime: '14:30',
    eventTitle: 'Mumbai 2005 944mm Cloudburst & High Tide',
    coordinates: [19.0760, 72.8777],
  },
  {
    id: 'chennai-adyar',
    country: 'India',
    place: 'Chennai (Velachery & Adyar Basin)',
    historicalDate: '2023-12-04',
    historicalTime: '16:00',
    eventTitle: 'Chennai 2023 Cyclone Michaung Deluge',
    coordinates: [13.0827, 80.2707],
  },
  {
    id: 'mach',
    country: 'Pakistan',
    place: 'Mach (Bolan Gorge & Pass, Balochistan)',
    historicalDate: '2022-08-25',
    historicalTime: '08:00',
    eventTitle: 'Mach 2022 Bolan Gorge Railway Washout',
    coordinates: [29.8631, 67.3323],
  },
  {
    id: 'houston',
    country: 'United States',
    place: 'Houston (Buffalo Bayou & Memorial)',
    historicalDate: '2017-08-28',
    historicalTime: '07:15',
    eventTitle: 'Houston 2017 Hurricane Harvey Deluge',
    coordinates: [29.7604, -95.3698],
  },
  {
    id: 'valencia',
    country: 'Spain',
    place: 'Valencia (Turia River & Rambla del Poyo)',
    historicalDate: '2024-10-29',
    historicalTime: '17:45',
    eventTitle: 'Valencia 2024 DANA Flash Flood Catastrophe',
    coordinates: [39.4699, -0.3763],
  },
  {
    id: 'germany',
    country: 'Germany',
    place: 'Ahrtal (Ahr River Gorge / Rhine Basin)',
    historicalDate: '2021-07-15',
    historicalTime: '23:30',
    eventTitle: 'Germany 2021 Bernd Storm Flash Deluge',
    coordinates: [50.5422, 7.1122],
  },
];

export const AVAILABLE_COUNTRIES = [
  'India',
  'Pakistan',
  'United States',
  'Spain',
  'Germany',
  'Bangladesh',
  'Global / Other',
];

interface Props {
  currentValue: DisasterLocationTime;
  onApply: (data: DisasterLocationTime) => void;
  className?: string;
  title?: string;
}

export const DisasterLocationTimeSelector: React.FC<Props> = ({
  currentValue,
  onApply,
  className = '',
  title = 'Mandatory Disaster Location & Temporal Selection',
}) => {
  const [country, setCountry] = useState<string>(currentValue.country || 'India');
  const [place, setPlace] = useState<string>(currentValue.place || 'Kerala (Periyar River & Aluva Delta)');
  const [date, setDate] = useState<string>(currentValue.date || '2018-08-16');
  const [time, setTime] = useState<string>(currentValue.time || '09:30');
  const [customSearch, setCustomSearch] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  // Calculate if the selected date is in the past
  const now = new Date();
  const selectedDateObj = new Date(`${date}T${time || '00:00'}:00`);
  const isPast = selectedDateObj < now;

  // Sync internal state when currentValue prop changes
  useEffect(() => {
    if (currentValue) {
      if (currentValue.country) setCountry(currentValue.country);
      if (currentValue.place) setPlace(currentValue.place);
      if (currentValue.date) setDate(currentValue.date);
      if (currentValue.time) setTime(currentValue.time);
    }
  }, [currentValue.country, currentValue.place, currentValue.date, currentValue.time]);

  // Filter presets by selected country
  const filteredPresets = FAMOUS_DISASTER_PRESETS.filter(
    p => country === 'Global / Other' || p.country.toLowerCase() === country.toLowerCase()
  );

  const handlePresetSelect = (preset: LocationPresetItem) => {
    setCountry(preset.country);
    setPlace(preset.place);
    setDate(preset.historicalDate);
    setTime(preset.historicalTime);

    onApply({
      country: preset.country,
      place: preset.place,
      date: preset.historicalDate,
      time: preset.historicalTime,
      coordinates: preset.coordinates,
      presetId: preset.id,
      isPast: true,
      eventTitle: preset.eventTitle,
    });
  };

  const handleSetLivePresent = () => {
    const today = new Date().toISOString().slice(0, 10);
    const currHour = new Date().toTimeString().slice(0, 5);
    setDate(today);
    setTime(currHour);

    const activePreset = FAMOUS_DISASTER_PRESETS.find(p => p.place === place) || FAMOUS_DISASTER_PRESETS[0];

    onApply({
      country,
      place,
      date: today,
      time: currHour,
      coordinates: activePreset.coordinates,
      presetId: activePreset.id,
      isPast: false,
      eventTitle: 'Present Live Satellite Pass & Streamflow',
    });
  };

  const handleManualApply = () => {
    const activePreset = FAMOUS_DISASTER_PRESETS.find(p => p.place === place);
    const coords = activePreset ? activePreset.coordinates : currentValue.coordinates;
    const pastFlag = new Date(`${date}T${time || '00:00'}:00`) < new Date();

    onApply({
      country,
      place,
      date,
      time,
      coordinates: coords,
      presetId: activePreset?.id,
      isPast: pastFlag,
      eventTitle: activePreset?.eventTitle || `${place} Observation (${date})`,
    });
  };

  const handleGeocodeSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customSearch.trim()) return;
    setIsSearching(true);
    try {
      const res = await fetch(`/api/geocode?q=${encodeURIComponent(`${customSearch} ${country}`)}`);
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setSearchResults(data);
      } else {
        setSearchResults([]);
      }
    } catch {
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectCustomGeocode = (item: any) => {
    const lat = parseFloat(item.lat);
    const lon = parseFloat(item.lon);
    setPlace(item.display_name.split(',')[0]);
    setSearchResults([]);
    setCustomSearch('');

    onApply({
      country,
      place: item.display_name.split(',')[0],
      date,
      time,
      coordinates: [lat, lon],
      isPast,
      eventTitle: `Custom Satellite Focus: ${item.display_name.split(',')[0]}`,
    });
  };

  return (
    <div className={`bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4 ${className}`}>
      {/* Header with Title and Mode Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400 shrink-0">
            <Satellite className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white font-sans flex items-center gap-2">
              <span>{title}</span>
              <span className="text-[10px] text-cyan-400 font-mono font-normal px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-800">
                4 MANDATORY PARAMETERS
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Select Country, Place, Date, and Time to retrieve exact past disaster occurrences or present live satellite telemetry.
            </p>
          </div>
        </div>

        {/* Temporal Badge */}
        <div className="flex items-center gap-2 shrink-0">
          <div className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-bold flex items-center gap-2 ${
            isPast 
              ? 'bg-rose-950/80 text-rose-300 border-rose-800' 
              : 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
          }`}>
            <span className={`w-2 h-2 rounded-full ${isPast ? 'bg-rose-400 animate-pulse' : 'bg-emerald-400'}`} />
            <span>{isPast ? '🔴 PAST FLOOD OCCURRENCE' : '🟢 PRESENT LIVE SATELLITE PASS'}</span>
          </div>

          <button
            type="button"
            onClick={handleSetLivePresent}
            className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg text-xs font-mono transition-colors"
            title="Set to Current Live Date & Time"
          >
            Live Now
          </button>
        </div>
      </div>

      {/* The 4 Necessary Data Fields Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* FIELD 1: COUNTRY */}
        <div className="space-y-1.5">
          <label className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-700 flex items-center justify-center text-[10px]">
              1
            </span>
            <Globe2 className="w-3.5 h-3.5" />
            <span>COUNTRY</span>
          </label>
          <select
            value={country}
            onChange={(e) => {
              const newC = e.target.value;
              setCountry(newC);
              // auto-select first preset for this country if available
              const found = FAMOUS_DISASTER_PRESETS.find(p => p.country.toLowerCase() === newC.toLowerCase());
              if (found) {
                setPlace(found.place);
                setDate(found.historicalDate);
                setTime(found.historicalTime);
              }
            }}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 font-sans"
          >
            {AVAILABLE_COUNTRIES.map(c => (
              <option key={c} value={c}>
                {c === 'India' ? '🇮🇳 ' : c === 'Pakistan' ? '🇵🇰 ' : c === 'United States' ? '🇺🇸 ' : c === 'Spain' ? '🇪🇸 ' : c === 'Germany' ? '🇩🇪 ' : c === 'Bangladesh' ? '🇧🇩 ' : '🌍 '}{c}
              </option>
            ))}
          </select>
          <div className="flex gap-1.5 pt-1">
            <button
              type="button"
              onClick={() => {
                setCountry('India');
                const ind = FAMOUS_DISASTER_PRESETS[0];
                setPlace(ind.place);
                setDate(ind.historicalDate);
                setTime(ind.historicalTime);
              }}
              className={`px-2 py-0.5 rounded text-[10px] font-mono border transition-colors ${
                country === 'India'
                  ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              🇮🇳 India Focus
            </button>
            <button
              type="button"
              onClick={() => setCountry('Global / Other')}
              className="px-2 py-0.5 rounded text-[10px] font-mono border bg-slate-950 text-slate-400 border-slate-800 hover:text-white transition-colors"
            >
              🌍 Global
            </button>
          </div>
        </div>

        {/* FIELD 2: PLACE */}
        <div className="space-y-1.5">
          <label className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-700 flex items-center justify-center text-[10px]">
              2
            </span>
            <MapPin className="w-3.5 h-3.5" />
            <span>PLACE / BASIN</span>
          </label>
          <select
            value={place}
            onChange={(e) => {
              const newP = e.target.value;
              setPlace(newP);
              const found = FAMOUS_DISASTER_PRESETS.find(p => p.place === newP);
              if (found) {
                setDate(found.historicalDate);
                setTime(found.historicalTime);
              }
            }}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 font-sans truncate"
          >
            {filteredPresets.map(p => (
              <option key={p.id} value={p.place}>
                {p.place}
              </option>
            ))}
          </select>
          <div className="text-[10px] text-slate-400 font-mono truncate">
            Lat/Lng: {FAMOUS_DISASTER_PRESETS.find(p => p.place === place)?.coordinates.join(', ') || currentValue.coordinates.join(', ')}
          </div>
        </div>

        {/* FIELD 3: DATE */}
        <div className="space-y-1.5">
          <label className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-700 flex items-center justify-center text-[10px]">
              3
            </span>
            <Calendar className="w-3.5 h-3.5" />
            <span>DATE (YYYY-MM-DD)</span>
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white font-mono focus:outline-none focus:ring-1 focus:ring-cyan-500"
          />
          <div className="text-[10px] text-slate-400 font-mono">
            {isPast ? '📅 Past historical occurrence' : '📅 Present calendar date'}
          </div>
        </div>

        {/* FIELD 4: TIME */}
        <div className="space-y-1.5">
          <label className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-700 flex items-center justify-center text-[10px]">
              4
            </span>
            <Clock className="w-3.5 h-3.5" />
            <span>TIME (HH:MM UTC/IST)</span>
          </label>
          <div className="flex gap-2">
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white font-mono focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
            <button
              type="button"
              onClick={handleManualApply}
              className="px-3.5 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs font-mono transition-colors shrink-0 shadow-sm flex items-center gap-1"
              title="Apply Location, Date & Time"
            >
              <span>APPLY</span>
            </button>
          </div>
          <div className="text-[10px] text-cyan-400/80 font-mono">
            {time} Satellite pass alignment
          </div>
        </div>
      </div>

      {/* Quick Flood Event Date & Time Chips (Past Occurrences to Present) */}
      <div className="pt-2 border-t border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-[11px] font-mono">
          <span className="text-slate-400 flex items-center gap-1.5">
            <History className="w-3.5 h-3.5 text-cyan-400" />
            <span>1-CLICK PAST FLOOD OCCURRENCES & DISASTER TIMESTAMPS:</span>
          </span>
          <span className="text-slate-500 text-[10px]">
            Click any disaster to populate all 4 fields instantly
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {FAMOUS_DISASTER_PRESETS.map((p) => {
            const isSelected = place === p.place && date === p.historicalDate;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => handlePresetSelect(p)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all border ${
                  isSelected
                    ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400 shadow-sm'
                    : 'bg-slate-950 text-slate-300 hover:bg-slate-800 hover:text-white border-slate-800'
                }`}
              >
                {p.country === 'India' ? '🇮🇳 ' : p.country === 'Pakistan' ? '🇵🇰 ' : p.country === 'United States' ? '🇺🇸 ' : p.country === 'Spain' ? '🇪🇸 ' : '🇩🇪 '}
                {p.place.split('(')[0].trim()} · {p.historicalDate} {p.historicalTime}
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Place Geocoding Search Option */}
      <div className="pt-2 border-t border-slate-800/80">
        <form onSubmit={handleGeocodeSearch} className="flex items-center gap-2">
          <Search className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <input
            type="text"
            value={customSearch}
            onChange={(e) => setCustomSearch(e.target.value)}
            placeholder="Type any other custom city or flood basin (e.g., 'Kochi, Kerala', 'Patna, Bihar', 'Wayanad', 'Bolan Gorge')..."
            className="w-full bg-transparent border-0 text-xs text-white placeholder-slate-500 focus:outline-none font-sans"
          />
          <button
            type="submit"
            disabled={isSearching}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg text-xs font-mono shrink-0"
          >
            {isSearching ? 'Locating...' : 'Search Place'}
          </button>
        </form>

        {searchResults.length > 0 && (
          <div className="mt-2 bg-slate-950 border border-slate-700 rounded-xl p-1 shadow-2xl max-h-40 overflow-y-auto">
            {searchResults.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectCustomGeocode(item)}
                className="w-full text-left p-2 hover:bg-slate-900 rounded-lg text-xs text-slate-200 truncate flex items-center gap-2"
              >
                <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="truncate">{item.display_name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
