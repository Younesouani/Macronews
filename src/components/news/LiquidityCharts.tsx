'use client';

import { useEffect, useRef, useState } from 'react';

interface Props {
  darkMode: boolean;
}

const LIQUIDITY_SYMBOLS = [
  { name: 'S&P 500', symbol: 'FOREXCOM:SPXUSD' },
  { name: 'Nasdaq 100', symbol: 'FOREXCOM:NSXUSD' },
  { name: 'US 10Y Yield', symbol: 'TVC:US10Y' },
  { name: 'Bitcoin Liquidity', symbol: 'BINANCE:BTCUSDT' },
  { name: 'Gold Spot', symbol: 'OANDA:XAUUSD' },
  { name: 'Crude Oil', symbol: 'TVC:USOIL' },
];

export default function LiquidityCharts({ darkMode }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeSymbol, setActiveSymbol] = useState(LIQUIDITY_SYMBOLS[0].symbol);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = '';

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: activeSymbol,
      interval: 'D',
      timezone: 'Etc/UTC',
      theme: darkMode ? 'dark' : 'light',
      style: '1',
      locale: 'en',
      enable_publishing: false,
      hide_side_toolbar: false,
      allow_symbol_change: true,
      calendar: false,
      support_host: 'https://www.tradingview.com'
    });

    containerRef.current.appendChild(script);
  }, [activeSymbol, darkMode]);

  return (
    <div className={`p-4 rounded-2xl border space-y-4 ${
      darkMode ? 'bg-[#1C2541]/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
    }`}>
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-sm font-bold flex items-center gap-2">
          <span>📊</span> Macro Liquidity & Assets
        </h2>
        
        {/* Symbol Quick Ticker Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {LIQUIDITY_SYMBOLS.map((item) => (
            <button
              key={item.symbol}
              onClick={() => setActiveSymbol(item.symbol)}
              className={`px-2.5 py-1 text-[11px] font-semibold rounded-md border transition-all whitespace-nowrap ${
                activeSymbol === item.symbol
                  ? 'bg-[#3A86FF] text-white border-[#3A86FF]'
                  : darkMode
                  ? 'bg-[#0B132B] text-slate-400 border-slate-700 hover:text-white'
                  : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
              }`}
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>

      {/* Embedded Chart Container */}
      <div className="w-full h-[450px] rounded-xl overflow-hidden border border-slate-700/30">
        <div ref={containerRef} className="tradingview-widget-container h-full w-full" />
      </div>
    </div>
  );
}
