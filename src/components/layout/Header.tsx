'use client';

interface HeaderProps {
  darkMode: boolean;
  activeView: 'news' | 'charts' | 'calendar' | 'media' | 'calc';
  setActiveView: (view: 'news' | 'charts' | 'calendar' | 'media' | 'calc') => void;
  toggleTheme: () => void;
}

export default function Header({
  darkMode,
  activeView,
  setActiveView,
  toggleTheme,
}: HeaderProps) {
  return (
    <header className="flex flex-col md:flex-row items-center justify-between gap-4 pb-2">
      {/* Brand Title */}
      <div className="flex items-center justify-between w-full md:w-auto">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveView('news')}>
          <span className="text-2xl">⚡</span>
          <div>
            <h1 className="text-lg font-black tracking-wider uppercase">
              MACRO<span className="text-[#3A86FF]">TERMINAL</span>
            </h1>
            <p className={`text-[10px] font-bold tracking-widest uppercase ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Institutional Market Intelligence
            </p>
          </div>
        </div>

        {/* Mobile Theme Toggle */}
        <button
          onClick={toggleTheme}
          className={`md:hidden p-2 rounded-xl text-xs font-bold border ${
            darkMode ? 'bg-[#1C2541] border-slate-700 text-amber-400' : 'bg-white border-slate-200 text-slate-700'
          }`}
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1 bg-black/20 p-1 rounded-2xl border border-slate-700/50 w-full md:w-auto justify-center overflow-x-auto no-scrollbar">
        {[
          { id: 'news', label: '📰 News Wire' },
          { id: 'charts', label: '📊 Liquidity' },
          { id: 'calendar', label: '📅 Calendar' },
          { id: 'media', label: '📺 Live TV' },
          { id: 'calc', label: '🧮 Risk Calc' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveView(tab.id as any)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeView === tab.id
                ? 'bg-[#3A86FF] text-white shadow-lg scale-105'
                : darkMode
                ? 'text-slate-400 hover:text-white'
                : 'text-slate-600 hover:text-black'
            }`}
          >
            {tab.label}
          </button>
        ))}

        {/* Desktop Theme Switcher */}
        <button
          onClick={toggleTheme}
          className={`hidden md:block ml-2 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
            darkMode
              ? 'bg-[#1C2541] border-slate-700 text-amber-400 hover:border-amber-400/50'
              : 'bg-white border-slate-200 text-slate-700 hover:border-slate-400'
          }`}
        >
          {darkMode ? '☀️ Light' : '🌙 Dark'}
        </button>
      </div>
    </header>
  );
}
