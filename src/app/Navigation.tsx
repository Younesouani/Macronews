'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Download, BookOpen, Info, Globe, Sparkles } from 'lucide-react';

interface NavProps {
  lang: 'en' | 'ar';
  setLang: (lang: 'en' | 'ar') => void;
  liveVisitors?: number;
}

export default function Navigation({ lang, setLang, liveVisitors }: NavProps) {
  const pathname = usePathname();

  const isAr = lang === 'ar';

  return (
    <header className="relative z-20 max-w-5xl mx-auto w-full px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-amber-500/20 bg-neutral-950/80 backdrop-blur-md sticky top-0">
      {/* Brand & Logo */}
      <div className="flex items-center justify-between w-full sm:w-auto">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 flex items-center justify-center text-xl font-bold text-neutral-950 shadow-lg shadow-amber-500/25 border border-amber-300/40">
            📖
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-wide bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500 bg-clip-text text-transparent block leading-tight">
              {isAr ? 'القرآن الكريم' : 'Quran App'}
            </span>
            <span className="text-[10px] text-amber-500/80 font-mono flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" /> v3.0.1 Direct APK
            </span>
          </div>
        </Link>

        {/* Language Switcher for Mobile */}
        <button
          onClick={() => setLang(isAr ? 'en' : 'ar')}
          className="sm:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300 text-xs font-semibold hover:bg-amber-500/20 transition-all"
        >
          <Globe className="w-3.5 h-3.5" />
          <span>{isAr ? 'English' : 'العربية'}</span>
        </button>
      </div>

      {/* Center Navigation Toggle Tabs */}
      <nav className="bg-neutral-900/90 border border-amber-500/30 p-1 rounded-2xl flex items-center gap-1 w-full sm:w-auto shadow-inner shadow-black">
        <Link
          href="/"
          className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            pathname === '/'
              ? 'bg-gradient-to-r from-amber-400 to-amber-600 text-neutral-950 shadow-md shadow-amber-500/20'
              : 'text-amber-200/70 hover:text-amber-200 hover:bg-neutral-800/60'
          }`}
        >
          <Download className="w-4 h-4" />
          <span>{isAr ? 'التحميل' : 'Download'}</span>
        </Link>

        <Link
          href="/books"
          className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            pathname === '/books'
              ? 'bg-gradient-to-r from-amber-400 to-amber-600 text-neutral-950 shadow-md shadow-amber-500/20'
              : 'text-amber-200/70 hover:text-amber-200 hover:bg-neutral-800/60'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>{isAr ? 'السنة والتفسير' : 'Sunnah & Tafsir'}</span>
        </Link>

        <Link
          href="/about"
          className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            pathname === '/about'
              ? 'bg-gradient-to-r from-amber-400 to-amber-600 text-neutral-950 shadow-md shadow-amber-500/20'
              : 'text-amber-200/70 hover:text-amber-200 hover:bg-neutral-800/60'
          }`}
        >
          <Info className="w-4 h-4" />
          <span>{isAr ? 'عن التطبيق' : 'About Us'}</span>
        </Link>
      </nav>

      {/* Desktop Language Switcher & Visitor Pill */}
      <div className="hidden sm:flex items-center gap-3">
        {typeof liveVisitors === 'number' && (
          <div className="flex items-center gap-2 bg-neutral-900 border border-amber-500/30 px-3 py-1.5 rounded-full text-xs font-medium text-amber-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <span>{liveVisitors} {isAr ? 'قارئ الآن' : 'online'}</span>
          </div>
        )}

        <button
          onClick={() => setLang(isAr ? 'en' : 'ar')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-amber-500/40 bg-amber-500/10 text-amber-300 text-xs font-semibold hover:bg-amber-500/20 transition-all"
        >
          <Globe className="w-3.5 h-3.5" />
          <span>{isAr ? 'English' : 'العربية'}</span>
        </button>
      </div>
    </header>
  );
}
