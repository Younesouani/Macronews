'use client';

import { useState } from 'react';

export interface CalendarEvent {
  id: string;
  time: string;
  country: string;
  currency: string;
  event: string;
  impact: 'HIGH' | 'MEDIUM' | 'LOW';
  actual: string;
  forecast: string;
  previous: string;
  category?: string;
  historicalDevs?: number[];
  assetImpact?: { asset: string; expectedMove: string; direction: 'up' | 'down' | 'volatile' }[];
}

interface EventDetailModalProps {
  darkMode: boolean;
  event: CalendarEvent | null;
  onClose: () => void;
}

export default function EventDetailModal({
  darkMode,
  event,
  onClose,
}: EventDetailModalProps) {
  const [accountSize, setAccountSize] = useState<number>(10000);
  const [leverage, setLeverage] = useState<number>(5);

  if (!event) return null;

  // Simple risk estimation logic
  const volatilityMultiplier = event.impact === 'HIGH' ? 0.015 : event.impact === 'MEDIUM' ? 0.008 : 0.003;
  const estimatedPnlChange = accountSize * (leverage * volatilityMultiplier);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div
        className={`w-full max-w-xl rounded-2xl border p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto no-scrollbar ${
          darkMode ? 'bg-[#0B132B] border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 rounded-xl text-xs font-bold transition-all ${
            darkMode ? 'bg-[#1C2541] hover:bg-slate-700 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
          }`}
        >
          ✕
        </button>

        {/* Header Header */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">{event.country === 'US' ? '🇺🇸' : event.country === 'EU' ? '🇪🇺' : '🇬🇧'}</span>
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                  event.impact === 'HIGH'
                    ? 'bg-rose-500/20 text-rose-500 border border-rose-500/30'
                    : 'bg-amber-500/20 text-amber-500'
                }`}
              >
                {event.impact} IMPACT
              </span>
              <span className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{event.time} UTC</span>
            </div>
            <h2 className="text-xl font-black mt-1">{event.event}</h2>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-3 gap-3 my-5">
          <div className={`p-3 rounded-xl border text-center ${darkMode ? 'bg-[#1C2541]/70 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <span className={`text-[10px] uppercase font-bold block ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Actual</span>
            <span className="text-base font-black text-[#3A86FF]">{event.actual}</span>
          </div>
          <div className={`p-3 rounded-xl border text-center ${darkMode ? 'bg-[#1C2541]/70 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <span className={`text-[10px] uppercase font-bold block ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Consensus</span>
            <span className="text-base font-black">{event.forecast}</span>
          </div>
          <div className={`p-3 rounded-xl border text-center ${darkMode ? 'bg-[#1C2541]/70 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <span className={`text-[10px] uppercase font-bold block ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Prior</span>
            <span className="text-base font-black text-slate-400">{event.previous}</span>
          </div>
        </div>

        {/* Asset Implied Volatility Section */}
        <div className="space-y-3 my-6">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
            📊 Expected Asset Volatility Matrix
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <div className={`p-2.5 rounded-xl border flex justify-between items-center ${darkMode ? 'bg-[#1C2541]/40 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <span className="text-xs font-bold">S&P 500 (SPX)</span>
              <span className="text-xs font-extrabold text-emerald-400">±1.2%</span>
            </div>
            <div className={`p-2.5 rounded-xl border flex justify-between items-center ${darkMode ? 'bg-[#1C2541]/40 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <span className="text-xs font-bold">US Dollar (DXY)</span>
              <span className="text-xs font-extrabold text-amber-400">±0.85%</span>
            </div>
            <div className={`p-2.5 rounded-xl border flex justify-between items-center ${darkMode ? 'bg-[#1C2541]/40 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <span className="text-xs font-bold">Gold (XAU/USD)</span>
              <span className="text-xs font-extrabold text-rose-400">±1.8%</span>
            </div>
            <div className={`p-2.5 rounded-xl border flex justify-between items-center ${darkMode ? 'bg-[#1C2541]/40 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <span className="text-xs font-bold">Bitcoin (BTC)</span>
              <span className="text-xs font-extrabold text-[#3A86FF]">±3.4%</span>
            </div>
          </div>
        </div>

        {/* Interactive Volatility & Leverage Calculator */}
        <div className={`p-4 rounded-xl border space-y-3 ${darkMode ? 'bg-[#1C2541] border-slate-700' : 'bg-slate-100 border-slate-200'}`}>
          <h3 className="text-xs font-black uppercase tracking-wider text-[#3A86FF]">
            ⚡ Position Volatility Risk Calculator
          </h3>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold block mb-1 text-slate-400">Account Size ($)</label>
              <input
                type="number"
                value={accountSize}
                onChange={(e) => setAccountSize(Number(e.target.value))}
                className={`w-full px-3 py-1.5 rounded-lg text-xs font-bold border ${
                  darkMode ? 'bg-[#0B132B] border-slate-700 text-white' : 'bg-white border-slate-300'
                }`}
              />
            </div>
            <div>
              <label className="text-[10px] font-bold block mb-1 text-slate-400">Leverage (x)</label>
              <input
                type="number"
                value={leverage}
                onChange={(e) => setLeverage(Number(e.target.value))}
                className={`w-full px-3 py-1.5 rounded-lg text-xs font-bold border ${
                  darkMode ? 'bg-[#0B132B] border-slate-700 text-white' : 'bg-white border-slate-300'
                }`}
              />
            </div>
          </div>

          <div className="pt-2 border-t border-slate-700/50 flex justify-between items-center">
            <span className="text-xs font-semibold">Estimated 1-Dev Volatility Swing:</span>
            <span className="text-sm font-black text-rose-400">
              ±${estimatedPnlChange.toLocaleString('en-US', { maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
