'use client';

import { useState, useEffect } from 'react';

export interface EcoEvent {
  id: string;
  title: string;
  country: string;
  flag: string;
  impact: 'HIGH' | 'MEDIUM' | 'LOW';
  time: string; // ISO String
  forecast: string;
  previous: string;
  actual?: string;
}

interface EconomicCalendarProps {
  darkMode: boolean;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

const INITIAL_EVENTS: EcoEvent[] = [
  {
    id: '1',
    title: 'FOMC Rate Decision',
    country: 'USD',
    flag: '🇺🇸',
    impact: 'HIGH',
    time: new Date(Date.now() + 1000 * 60 * 45).toISOString(), // 45 mins from now
    forecast: '5.25%',
    previous: '5.25%',
  },
  {
    id: '2',
    title: 'Core CPI (MoM)',
    country: 'USD',
    flag: '🇺🇸',
    impact: 'HIGH',
    time: new Date(Date.now() + 1000 * 60 * 60 * 18).toISOString(),
    forecast: '0.3%',
    previous: '0.2%',
  },
  {
    id: '3',
    title: 'Non-Farm Payrolls (NFP)',
    country: 'USD',
    flag: '🇺🇸',
    impact: 'HIGH',
    time: new Date(Date.now() + 1000 * 60 * 60 * 42).toISOString(),
    forecast: '185K',
    previous: '206K',
  },
  {
    id: '4',
    title: 'ECB Monetary Policy Statement',
    country: 'EUR',
    flag: '🇪🇺',
    impact: 'HIGH',
    time: new Date(Date.now() + 1000 * 60 * 60 * 65).toISOString(),
    forecast: '3.75%',
    previous: '4.00%',
  },
  {
    id: '5',
    title: 'OPEC+ JMMC Meeting',
    country: 'OIL',
    flag: '🛢️',
    impact: 'MEDIUM',
    time: new Date(Date.now() + 1000 * 60 * 60 * 88).toISOString(),
    forecast: '-',
    previous: '-',
  },
];

export default function EconomicCalendar({
  darkMode,
  soundEnabled,
  onToggleSound,
}: EconomicCalendarProps) {
  const [events] = useState<EcoEvent[]>(INITIAL_EVENTS);
  const [nextEventCountdown, setNextEventCountdown] = useState<string>('');

  useEffect(() => {
    const nextEvent = events[0];
    if (!nextEvent) return;

    const interval = setInterval(() => {
      const diff = new Date(nextEvent.time).getTime() - Date.now();
      if (diff <= 0) {
        setNextEventCountdown('RELEASED');
        clearInterval(interval);
      } else {
        const mins = Math.floor(diff / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);
        setNextEventCountdown(`${mins}m ${secs}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [events]);

  return (
    <div className="space-y-6">
      {/* Alarm Header & Countdown */}
      <div
        className={`p-4 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
          darkMode ? 'bg-[#1C2541] border-slate-700' : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl animate-bounce">⏱️</span>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#3A86FF]">
              Next High-Impact Catalyst
            </span>
            <h3 className="text-sm font-bold flex items-center gap-2">
              {events[0]?.flag} {events[0]?.title}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="px-3 py-1.5 rounded-lg bg-[#3A86FF]/15 border border-[#3A86FF]/30 text-[#3A86FF] font-mono text-xs font-bold">
            Countdown: {nextEventCountdown || 'Calculating...'}
          </div>

          <button
            onClick={onToggleSound}
            className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all flex items-center gap-1.5 ${
              soundEnabled
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                : darkMode
                ? 'bg-[#0B132B] border-slate-700 text-slate-400'
                : 'bg-slate-100 border-slate-300 text-slate-600'
            }`}
          >
            {soundEnabled ? '🔔 Alarm ON' : '🔕 Alarm OFF'}
          </button>
        </div>
      </div>

      {/* Events Table */}
      <div
        className={`rounded-xl border overflow-hidden ${
          darkMode ? 'border-slate-800 bg-[#1C2541]/50' : 'border-slate-200 bg-white shadow-sm'
        }`}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr
                className={`border-b ${
                  darkMode ? 'border-slate-800 bg-[#1C2541]' : 'border-slate-200 bg-slate-100'
                }`}
              >
                <th className="py-3 px-4 font-extrabold">Currency</th>
                <th className="py-3 px-4 font-extrabold">Impact</th>
                <th className="py-3 px-4 font-extrabold">Event</th>
                <th className="py-3 px-4 font-extrabold">Forecast</th>
                <th className="py-3 px-4 font-extrabold">Previous</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {events.map((evt) => (
                <tr
                  key={evt.id}
                  className={`transition-colors ${
                    darkMode ? 'hover:bg-[#1C2541]' : 'hover:bg-slate-50'
                  }`}
                >
                  <td className="py-3 px-4 font-bold flex items-center gap-1.5">
                    <span>{evt.flag}</span>
                    <span className="font-mono">{evt.country}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-black ${
                        evt.impact === 'HIGH'
                          ? 'bg-rose-500/15 text-rose-500 border border-rose-500/30'
                          : 'bg-amber-500/15 text-amber-500 border border-amber-500/30'
                      }`}
                    >
                      {evt.impact}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-semibold">{evt.title}</td>
                  <td className="py-3 px-4 font-mono">{evt.forecast}</td>
                  <td className="py-3 px-4 font-mono text-slate-400">{evt.previous}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
