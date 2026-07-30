'use client';

import { useState } from 'react';

interface Props {
  darkMode: boolean;
}

const LIQUIDITY_SYMBOLS = [
  { name: 'S&P 500', symbol: 'FOREXCOM:SPXUSD' },
  { name: 'Nasdaq 100', symbol: 'FOREXCOM:NSXUSD' },
  { name: 'US 10Y Yield', symbol: 'TVC:US10Y' },
  { name: 'Bitcoin', symbol: 'BINANCE:BTCUSDT' },
  { name: 'Gold', symbol: 'OANDA:XAUUSD' },
  { name: 'Crude Oil', symbol: 'TVC:USOIL' },
];

export default function LiquidityCharts({ darkMode }: Props) {
  const [activeSymbol, setActiveSymbol] = useState(LIQUIDITY_SYMBOLS[0].symbol);

  const theme = darkMode ? 'dark' : 'light';
  const iframeSrc = `https://s.tradingview.com/widgetembed/?frameElementId=tradingview_widget&symbol=${encodeURIComponent(
    activeSymbol
  )}&interval=D&hidesidetoolbar=0&symboledit=1&saveimage=1&toolbarbg=f1f3f6&studies=[]&theme=${theme}&style=1&timezone=Etc%2FUTC`;

  return (
    <div
      className={`p-3 sm:p-4 rounded-2xl border space-y-3 ${
        darkMode ? 'bg-[#1C2541]/90 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
      }`}
    >
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-xs sm:text-sm font-bold flex items-center gap-1.5 text-white">
          <span>📊</span> Macro Liquidity Monitor
        </h2>

        {/* Quick Ticker Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 max-w-full">
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

      {/* Embedded Chart Frame */}
      <div className="w-full h-[450px] sm:h-[500px] rounded-xl overflow-hidden border border-slate-700/40 bg-black/20">
        <iframe
          key={`${activeSymbol}-${theme}`}
          title="TradingView Chart"
          src={iframeSrc}
          className="w-full h-full border-0"
          allowFullScreen
        />
      </div>
    </div>
  );
}
