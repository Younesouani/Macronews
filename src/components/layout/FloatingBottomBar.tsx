'use client';

interface FloatingBottomBarProps {
  darkMode: boolean;
  activeView: 'news' | 'charts';
  setActiveView: (view: 'news' | 'charts') => void;
}

export default function FloatingBottomBar({
  darkMode,
  activeView,
  setActiveView,
}: FloatingBottomBarProps) {
  return (
    <div className="fixed bottom-6 inset-x-0 sm:hidden flex justify-center z-50 pointer-events-none">
      <div
        className={`pointer-events-auto p-1.5 rounded-full border backdrop-blur-md shadow-2xl flex items-center gap-1 ${
          darkMode
            ? 'bg-[#0B132B]/90 border-slate-700 text-white'
            : 'bg-white/90 border-slate-300 text-slate-900'
        }`}
      >
        <button
          onClick={() => setActiveView('news')}
          className={`px-4 py-2 rounded-full text-xs font-black transition-all ${
            activeView === 'news'
              ? 'bg-[#3A86FF] text-white shadow-md'
              : darkMode
              ? 'text-slate-400 hover:text-white'
              : 'text-slate-600 hover:text-black'
          }`}
        >
          📰 Feed
        </button>
        <button
          onClick={() => setActiveView('charts')}
          className={`px-4 py-2 rounded-full text-xs font-black transition-all ${
            activeView === 'charts'
              ? 'bg-[#3A86FF] text-white shadow-md'
              : darkMode
              ? 'text-slate-400 hover:text-white'
              : 'text-slate-600 hover:text-black'
          }`}
        >
          📊 Charts
        </button>
      </div>
    </div>
  );
}
