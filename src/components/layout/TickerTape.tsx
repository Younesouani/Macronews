'use client';

export interface TickerItem {
  symbol: string;
  name: string;
  price: string;
  change: string;
  isUp: boolean;
  icon: string;
}

interface TickerTapeProps {
  darkMode: boolean;
  data: TickerItem[];
}

export default function TickerTape({ darkMode, data }: TickerTapeProps) {
  return (
    <div
      className={`border-b sticky top-0 z-40 backdrop-blur overflow-hidden py-2 ${
        darkMode ? 'border-[#1C2541] bg-[#0B132B]/95' : 'border-slate-200 bg-white/95'
      }`}
    >
      <style jsx global>{`
        @keyframes ticker-slide {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .ticker-track {
          display: flex;
          width: max-content;
          animation: ticker-slide 20s linear infinite;
        }
        .ticker-track:hover {
          animation-play-state: paused;
        }
      `}</style>
      <div className="ticker-track text-xs font-semibold whitespace-nowrap flex gap-8">
        {[...data, ...data].map((item, idx) => (
          <div key={`${item.symbol}-${idx}`} className="flex items-center gap-1.5 shrink-0">
            <span className="text-sm">{item.icon}</span>
            <span className={darkMode ? 'text-slate-200' : 'text-slate-800'}>{item.name}</span>
            <span className="font-mono">{item.price}</span>
            <span
              className={`flex items-center text-[11px] font-bold ${
                item.isUp ? 'text-emerald-500' : 'text-rose-500'
              }`}
            >
              {item.isUp ? '▲' : '▼'} {item.change}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
