'use client';

interface FloatingBottomBarProps {
  darkMode: boolean;
  activeView: 'news' | 'charts' | 'calendar' | 'media' | 'calc';
  setActiveView: (view: 'news' | 'charts' | 'calendar' | 'media' | 'calc') => void;
}

export default function FloatingBottomBar({
  darkMode,
  activeView,
  setActiveView,
}: FloatingBottomBarProps) {
  const tabs = [
    { id: 'news', label: 'News', icon: '📰' },
    { id: 'charts', label: 'Charts', icon: '📊' },
    { id: 'calendar', label: 'Calendar', icon: '📅' },
    { id: 'media', label: 'Live TV', icon: '📺' },
    { id: 'calc', label: 'Risk', icon: '🧮' },
  ];

  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-md md:hidden">
      <div
        className={`p-1.5 rounded-2xl border backdrop-blur-md shadow-2xl flex items-center justify-around ${
          darkMode
            ? 'bg-[#0B132B]/90 border-slate-700/80 text-slate-200'
            : 'bg-white/90 border-slate-200/80 text-slate-800'
        }`}
      >
        {tabs.map((tab) => {
          const isActive = activeView === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id as any)}
              className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-all ${
                isActive
                  ? 'bg-[#3A86FF] text-white shadow-md scale-105 font-bold'
                  : darkMode
                  ? 'text-slate-400 hover:text-white'
                  : 'text-slate-600 hover:text-black'
              }`}
            >
              <span className="text-base">{tab.icon}</span>
              <span className="text-[9px] font-black tracking-wider uppercase mt-0.5">
                {tab.label}
              </span>
            </button>
          );
        })}

        {/* Direct APK Action Button */}
        <a
          href="/api/download"
          download="MacroTerminal.apk"
          className="flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl bg-gradient-to-b from-emerald-500 to-teal-600 text-white font-bold shadow-md active:scale-95 border border-emerald-300/30 ml-1"
          title="Direct Download App"
        >
          <span className="text-base">📲</span>
          <span className="text-[9px] font-black tracking-wider uppercase mt-0.5">APP</span>
        </a>
      </div>
    </div>
  );
}
