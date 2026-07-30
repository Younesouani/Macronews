'usr client';

import { useState } from 'react';
import EventDetailModal, { CalendarEvent } from './EventDetailModal';

const FULL_CALENDAR_EVENTS: CalendarEvent[] = [
  {
    id: '1',
    time: '06:00',
    country: 'GB',
    currency: 'GBP',
    event: 'GDP (MoM) (May)',
    impact: 'HIGH',
    actual: '+0.4%',
    forecast: '+0.2%',
    previous: '0.0%',
  },
  {
    id: '2',
    time: '09:00',
    country: 'EU',
    currency: 'EUR',
    event: 'ECB Monetary Policy Meeting Accounts',
    impact: 'MEDIUM',
    actual: '-',
    forecast: '-',
    previous: '-',
  },
  {
    id: '3',
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
    id: '4',
    time: '12:30',
    country: 'US',
    currency: 'USD',
    event: 'Core CPI (YoY) (Jun)',
    impact: 'HIGH',
    actual: '3.3%',
    forecast: '3.4%',
    previous: '3.4%',
  },
  {
    id: '5',
    time: '14:30',
    country: 'US',
    currency: 'USD',
    event: 'Crude Oil Inventories',
    impact: 'MEDIUM',
    actual: '-2.5M',
    forecast: '-1.2M',
    previous: '+1.8M',
  },
  {
    id: '6',
    time: '18:00',
    country: 'US',
    currency: 'USD',
    event: 'FOMC Member Williams Speaks',
    impact: 'LOW',
    actual: '-',
    forecast: '-',
    previous: '-',
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
  const [currencyFilter, setCurrencyFilter] = useState<string>('ALL');
  const [impactFilter, setImpactFilter] = useState<string>('ALL');

  const filteredEvents = FULL_CALENDAR_EVENTS.filter((item) => {
    const matchesCurr = currencyFilter === 'ALL' || item.currency === currencyFilter;
    const matchesImpact = impactFilter === 'ALL' || item.impact === impactFilter;
    return matchesCurr && matchesImpact;
  });

  return (
    <div className="space-y-4">
      {/* Calendar Header & Filters */}
      <div
        className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
          darkMode ? 'bg-[#1C2541] border-slate-700' : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">📅</span>
          <div>
            <h3 className="text-sm font-bold">ForexFactory-Style Economic Matrix</h3>
            <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Real-time macro catalysts, actuals & consensus forecasts
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Currency Filter */}
          <select
            value={currencyFilter}
            onChange={(e) => setCurrencyFilter(e.target.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border outline-none ${
              darkMode ? 'bg-[#0B132B] border-slate-700 text-slate-200' : 'bg-slate-100 border-slate-300 text-slate-800'
            }`}
          >
            <option value="ALL">All Currencies</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
          </select>

          {/* Impact Filter */}
          <select
            value={impactFilter}
            onChange={(e) => setImpactFilter(e.target.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border outline-none ${
              darkMode ? 'bg-[#0B132B] border-slate-700 text-slate-200' : 'bg-slate-100 border-slate-300 text-slate-800'
            }`}
          >
            <option value="ALL">All Impacts</option>
            <option value="HIGH">High Impact</option>
            <option value="MEDIUM">Medium Impact</option>
          </select>

          {/* Sound Toggle */}
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
            {soundEnabled ? '🔔' : '🔕'}
          </button>
        </div>
      </div>

      {/* FXBook Style Tabular Feed */}
      <div
        className={`rounded-xl border overflow-hidden ${
          darkMode ? 'bg-[#1C2541]/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr
                className={`border-b text-[10px] uppercase font-black tracking-wider ${
                  darkMode ? 'bg-[#0B132B]/60 border-slate-800 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'
                }`}
              >
                <th className="p-3">Time (UTC)</th>
                <th className="p-3">Curr</th>
                <th className="p-3">Impact</th>
                <th className="p-3">Event Description</th>
                <th className="p-3 text-right">Actual</th>
                <th className="p-3 text-right">Forecast</th>
                <th className="p-3 text-right">Previous</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40 text-xs">
              {filteredEvents.map((item) => {
                const isBeat =
                  item.actual !== '-' &&
                  item.forecast !== '-' &&
                  parseFloat(item.actual) > parseFloat(item.forecast);

                return (
                  <tr
                    key={item.id}
                    onClick={() => setSelectedEvent(item)}
                    className={`cursor-pointer transition-colors ${
                      darkMode ? 'hover:bg-[#1C2541]' : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className={`p-3 font-mono font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      {item.time}
                    </td>
                    <td className="p-3 font-extrabold">{item.currency}</td>
                    <td className="p-3">
                      <div className="flex gap-1">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            item.impact === 'HIGH'
                              ? 'bg-rose-500'
                              : item.impact === 'MEDIUM'
                              ? 'bg-amber-500'
                              : 'bg-slate-500'
                          }`}
                          title={`${item.impact} Impact`}
                        ></span>
                      </div>
                    </td>
                    <td className="p-3 font-bold">{item.event}</td>
                    <td
                      className={`p-3 text-right font-black ${
                        isBeat ? 'text-emerald-400' : 'text-[#3A86FF]'
                      }`}
                    >
                      {item.actual}
                    </td>
                    <td className={`p-3 text-right font-semibold ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                      {item.forecast}
                    </td>
                    <td className={`p-3 text-right ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                      {item.previous}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
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
