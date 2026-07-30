'use client';

import { useState } from 'react';

interface StreamChannel {
  id: string;
  name: string;
  badge: string;
  description: string;
  embedUrl: string;
}

const STREAMS: StreamChannel[] = [
  {
    id: 'skynews',
    name: 'Sky News Live',
    badge: '🌍 Global News',
    description: '24/7 global breaking news, financial markets, and world reports.',
    embedUrl: 'https://www.youtube-nocookie.com/embed/9Auq9mYxfEE?autoplay=1&mute=1',
  },
  {
    id: 'france24',
    name: 'France 24 English',
    badge: '💶 European Economy',
    description: 'International & European market perspectives, policy and news.',
    embedUrl: 'https://www.youtube-nocookie.com/embed/h3MuIUNCCzI?autoplay=1&mute=1',
  },
  {
    id: 'dw',
    name: 'DW News Live',
    badge: '📊 Macro & Trade',
    description: 'Global trade, macroeconomics, and breaking international events.',
    embedUrl: 'https://www.youtube-nocookie.com/embed/Lu413A23i_c?autoplay=1&mute=1',
  },
];

interface LiveTVProps {
  darkMode: boolean;
}

export default function LiveTV({ darkMode }: LiveTVProps) {
  const [activeStream, setActiveStream] = useState<StreamChannel>(STREAMS[0]);

  return (
    <div className="space-y-6">
      {/* Stream Selector Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {STREAMS.map((stream) => (
          <button
            key={stream.id}
            onClick={() => setActiveStream(stream)}
            className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 shrink-0 ${
              activeStream.id === stream.id
                ? 'bg-[#3A86FF] text-white border-[#3A86FF] shadow-lg scale-[1.02]'
                : darkMode
                ? 'bg-[#1C2541] text-slate-300 border-slate-700 hover:border-slate-500'
                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            <span>{stream.name}</span>
            <span className="text-[10px] opacity-80">({stream.badge})</span>
          </button>
        ))}
      </div>

      {/* Main Video Frame Container */}
      <div
        className={`rounded-2xl border overflow-hidden shadow-2xl p-2 ${
          darkMode ? 'bg-[#1C2541]/80 border-slate-800' : 'bg-white border-slate-200'
        }`}
      >
        <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black">
          <iframe
            key={activeStream.id}
            src={activeStream.embedUrl}
            title={activeStream.name}
            className="absolute top-0 left-0 w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </div>

        {/* Video Info Footer */}
        <div className="p-3 flex items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
              {activeStream.name}
            </h3>
            <p className={`text-xs mt-0.5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              {activeStream.description}
            </p>
          </div>
          <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md bg-rose-500/10 text-rose-500 border border-rose-500/20 shrink-0">
            🔴 LIVE BROADCAST
          </span>
        </div>
      </div>
    </div>
  );
}
