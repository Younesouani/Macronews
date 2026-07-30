'use client';

interface HeaderProps {
  darkMode: boolean;
  activeView: 'news' | 'charts';
  setActiveView: (view: 'news' | 'charts') => void;
  toggleTheme: () => void;
}

export default function Header({
  darkMode,
  activeView,
  setActiveView,
  toggleTheme,
}: HeaderProps) {
  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5 ${
        darkMode ? 'border-[#1C2541]' : 'border-slate-200'
      }`}
    >
      <div>
        <h1 className="text-3xl font-black tracking-tight flex items-center gap-2">
          <span className={darkMode ? 'text-white' : 'text-[#0B132B]'}>MACRO</span>
          <span className="text-[#3A86FF]">NEWS</span>
        </h1>
        <p
          className={`text-xs mt-1 flex items-center gap-2 ${
            darkMode ? 'text-slate-400' : 'text-slate-500'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-[#3A86FF] animate-pulse"></span>
          Institutional macro catalyst & liquidity monitor
        </p>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {/* Desktop View Switcher Toggle */}
        <div
          className={`hidden sm:flex p-1 rounded-xl border ${
            darkMode ? 'bg-[#1C2541] border-slate-700' : 'bg-slate-200/70 border-slate-300'
          }`}
        >
          <button
            onClick={() => setActiveView('news')}
            className={`px-3 py-1.5 text-xs font-extrabold rounded-lg transition-all ${
              activeView === 'news'
                ? 'bg-[#3A86FF] text-white shadow-sm'
                : darkMode
                ? 'text-slate-400 hover:text-white'
                : 'text-slate-600 hover:text-black'
            }`}
          >
            📰 Feed
          </button>
          <button
            onClick={() => setActiveView('charts')}
            className={`px-3 py-1.5 text-xs font-extrabold rounded-lg transition-all ${
              activeView === 'charts'
                ? 'bg-[#3A86FF] text-white shadow-sm'
                : darkMode
                ? 'text-slate-400 hover:text-white'
                : 'text-slate-600 hover:text-black'
            }`}
          >
            📊 Liquidity Charts
          </button>
        </div>

        {/* Theme Switcher Button */}
        <button
          onClick={toggleTheme}
          className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-all ${
            darkMode
              ? 'bg-[#1C2541] text-amber-300 border-slate-700'
              : 'bg-white text-slate-700 border-slate-300'
          }`}
        >
          {darkMode ? '☀️ Light' : '🌙 Dark'}
        </button>
      </div>
    </div>
  );
}
