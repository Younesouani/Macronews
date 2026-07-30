'use client';

import { useState, useEffect, useRef } from 'react';
import Hls from 'hls.js';

interface StreamChannel {
  id: string;
  name: string;
  badge: string;
  description: string;
  hlsUrl: string;
  fallbackEmbed?: string;
}

const STREAMS: StreamChannel[] = [
  {
    id: 'aljazeera',
    name: 'Al Jazeera English',
    badge: '🌍 Global News',
    description: 'Direct 24/7 global economy and news broadcast stream.',
    hlsUrl: 'https://live-hls-web-aje.getaj.net/AJE/index.m3u8',
  },
  {
    id: 'dw_hls',
    name: 'Deutsche Welle (DW)',
    badge: '📊 Trade & Macro',
    description: 'European economic updates and international coverage.',
    hlsUrl: 'https://dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/index.m3u8',
  },
];

interface LiveTVProps {
  darkMode: boolean;
}

export default function LiveTV({ darkMode }: LiveTVProps) {
  const [activeStream, setActiveStream] = useState<StreamChannel>(STREAMS[0]);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(activeStream.hlsUrl);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(() => {});
      });

      return () => {
        hls.destroy();
      };
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Native support for Safari / iOS
      video.src = activeStream.hlsUrl;
      video.addEventListener('loadedmetadata', () => {
        video.play().catch(() => {});
      });
    }
  }, [activeStream]);

  return (
    <div className="space-y-6">
      {/* Stream Selection Bar */}
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

      {/* HTML5 Native Live Player Container */}
      <div
        className={`rounded-2xl border overflow-hidden shadow-2xl p-2 ${
          darkMode ? 'bg-[#1C2541]/80 border-slate-800' : 'bg-white border-slate-200'
        }`}
      >
        <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black">
          <video
            ref={videoRef}
            controls
            playsInline
            muted
            className="w-full h-full object-contain"
          ></video>
        </div>

        {/* Stream Details */}
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
            🔴 DIRECT HLS STREAM
          </span>
        </div>
      </div>
    </div>
  );
}
