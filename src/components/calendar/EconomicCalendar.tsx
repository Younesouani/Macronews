'use client';

import { useState } from 'react';
import EventDetailModal, { CalendarEvent } from './EventDetailModal';

const MOCK_EVENTS: CalendarEvent[] = [
  {
    id: '1',
    time: '12:30',
    country: 'US',
    currency: 'USD',
    event: 'Core CPI (MoM) (Jun)',
    impact: 'HIGH',
    actual: '0.3%',
    forecast: '0.2%',
    previous: '0.2%',
  },
  {
    id: '2',
    time: '14:00',
    country: 'US',
    currency: 'USD',
    event: 'FOMC Press Conference',
    impact: 'HIGH',
    actual: '5.50%',
    forecast: '5.50%',
    previous: '5.50%',
  },
  {
    id: '3',
    time: '15:30',
    country: 'US',
    currency: 'USD',
    event: 'EIA Crude Oil Stocks',
    impact: 'MEDIUM',
    actual: '-2.5M',
    forecast: '-1.2M',
    previous: '+1.8M',
  },
];

interface EconomicCalendarProps {
  darkMode: boolean;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export default function EconomicCalendar({
  darkMode,
  soundEnabled,
  onToggleSound,
}: EconomicCalendarProps) {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  return (
    <div className="space-y-4">
      {/* Calendar Header */}
      <div
        className={`p-4 rounded-xl border flex items-center justify-between ${
          darkMode ? 'bg-[#1C2541] border-slate-700' : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">📅</span>
          <div>
            <h3 className="text-sm font-bold">Economic Catalyst Schedule</h3>
            <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Click any catalyst event for asset sensitivity & leverage calculator
            </p>
          </div>
        </div>

        <button
          onClick={onToggleSound}
          className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${
            soundEnabled
              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
              : darkMode
              ? 'bg-[#0B132B] text-slate-400 border-slate-700'
              : 'bg-slate-100 text-slate-600 border-slate-300'
          }`}
        >
          {soundEnabled ? '🔔 Alert On' : '🔕 Alert Off'}
        </button>
      </div>

      {/* Events List */}
      <div className="space-y-2">
        {MOCK_EVENTS.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedEvent(item)}
            className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
              darkMode
                ? 'bg-[#1C2541]/80 hover:bg-[#1C2541] border-slate-800 hover:border-slate-600'
                : 'bg-white hover:bg-slate-50 border-slate-200 shadow-sm'
            }`}
          >
            <div className="flex items-center gap-4">
              <span className={`text-xs font-black ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {item.time}
              </span>
              <span className="text-lg">{item.country === 'US' ? '🇺🇸' : '🇪🇺'}</span>
              <div>
                <h4 className="text-sm font-bold">{item.event}</h4>
                <div className="flex items-center gap-2 mt-0.5">
                  <span
                    className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                      item.impact === 'HIGH'
                        ? 'bg-rose-500/20 text-rose-500'
                        : 'bg-amber-500/20 text-amber-500'
                    }`}
                  >
                    {item.impact}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-right">
              <div>
                <span className={`text-[10px] block ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Actual / Consensus
                </span>
                <span className="text-xs font-black text-[#3A86FF]">
                  {item.actual} <span className="text-slate-500 font-normal">({item.forecast})</span>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      <EventDetailModal
        darkMode={darkMode}
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </div>
  );
}
