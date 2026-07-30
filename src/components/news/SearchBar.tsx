'use client';

interface SearchBarProps {
  darkMode: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  categories: { id: string; label: string }[];
}

export default function SearchBar({
  darkMode,
  searchQuery,
  setSearchQuery,
  activeCategory,
  setActiveCategory,
  categories,
}: SearchBarProps) {
  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Search macro topics, ticker symbols, or keywords..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className={`w-full text-sm rounded-xl px-4 py-3 border focus:outline-none focus:border-[#3A86FF] ${
          darkMode
            ? 'bg-[#1C2541] border-slate-700 text-slate-100'
            : 'bg-white border-slate-300 text-slate-900'
        }`}
      />

      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3.5 py-2 text-xs font-bold rounded-lg border whitespace-nowrap shrink-0 ${
              activeCategory === cat.id
                ? 'bg-[#3A86FF] text-white border-[#3A86FF]'
                : darkMode
                ? 'bg-[#1C2541] text-slate-300 border-slate-700'
                : 'bg-white text-slate-600 border-slate-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
}
