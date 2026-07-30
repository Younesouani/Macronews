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
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-md">
      <div
        className={`p-1.5 rounded-2xl border backdrop-blur-md shadow-2xl flex items-center justify-around ${
          darkMode
            ? 'bg-[#0B132B]/85 border-slate-700/80 text-slate-200'
            : 'bg-white/85 border-slate-200/80 text-slate-800'
        }`}
      >
        {tabs.map((tab) => {
          const isActive = activeView === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id as any)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all ${
                isActive
                  ? 'bg-[#3A86FF] text-white shadow-md scale-105 font-bold'
                  : 'opacity-70 hover:opacity-100'
              }`}
            >
              <span className="text-base">{tab.icon}</span>
              <span className="text-[10px] uppercase font-black tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
