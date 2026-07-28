'use client';

import { useState } from 'react';
import Navigation from '../Navigation';
import { BookOpen, Book, CheckCircle2, Bookmark } from 'lucide-react';

export default function BooksPage() {
  const [lang, setLang] = useState<'en' | 'ar'>('ar');
  const isAr = lang === 'ar';

  const sunnahBooks = [
    { title: "صحيح البخاري", engTitle: "Sahih al-Bukhari", count: "7,563 Hadiths", desc: "The most authentic collection of Hadith compiled by Imam al-Bukhari." },
    { title: "صحيح مسلم", engTitle: "Sahih Muslim", count: "7,500 Hadiths", desc: "Authentic prophetic traditions collected by Imam Muslim ibn al-Hajjaj." },
    { title: "سنن النسائي", engTitle: "Sunan an-Nasa'i", count: "5,758 Hadiths", desc: "Selected sunnan traditions with rigorous verification standards." },
    { title: "جامع الترمذي", engTitle: "Jami' at-Tirmidhi", count: "3,956 Hadiths", desc: "Comprehensive collection including commentary on juristic views." }
  ];

  const tafsirBooks = [
    { title: "تفسير ابن كثير", engTitle: "Tafsir Ibn Kathir", author: "إسماعيل بن عمر بن كثير", desc: "Classic Quranic exegesis using Quran, Hadith, and statements of the Sahabah." },
    { title: "تفسير السعدي", engTitle: "Tafsir al-Sa'di", author: "عبد الرحمن بن ناصر السعدي", desc: "Clear, concise, and modern explanation of Quranic meanings." },
    { title: "تفسير الجلالين", engTitle: "Tafsir al-Jalalayn", author: "جلال الدين المحلي والسيوطي", desc: "Famous concise commentary accessible for all levels of students." }
  ];

  return (
    <div dir={isAr ? 'rtl' : 'ltr'} className="min-h-screen bg-neutral-950 text-amber-50 flex flex-col justify-between selection:bg-amber-500 selection:text-neutral-950">
      <Navigation lang={lang} setLang={setLang} />

      <main className="relative z-10 max-w-4xl mx-auto px-4 py-10 w-full">
        {/* Header Title */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-5xl font-black text-amber-200 mb-3">
            {isAr ? 'مكتبة كتب السنة والتفاسير' : 'Books of Sunnah & Quran Tafsir'}
          </h1>
          <p className="text-amber-100/70 text-sm sm:text-base max-w-xl mx-auto">
            {isAr ? 'مجموعة متكاملة من أمهات كتب الحديث والتفاسير المعتمدة مدمجة داخل التطبيق.' : 'Comprehensive reference library of authentic Hadith collections and Tafsir integrated in the app.'}
          </p>
        </div>

        {/* Section 1: Books of Sunnah */}
        <section className="mb-12">
          <h2 className="text-xl sm:text-2xl font-bold text-amber-300 mb-6 flex items-center gap-2 border-b border-amber-500/20 pb-3">
            <BookOpen className="w-6 h-6 text-amber-400" />
            <span>{isAr ? 'كتب السنة النبوية المطهرة' : 'Authentic Sunnah Collections'}</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {sunnahBooks.map((book, idx) => (
              <div key={idx} className="bg-neutral-900/80 border border-amber-500/30 rounded-2xl p-5 hover:border-amber-400/60 transition-all shadow-lg flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xl font-black text-amber-300">{book.title}</span>
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold">
                      {isAr ? 'مضمن' : 'Included'}
                    </span>
                  </div>
                  <h3 className="font-bold text-white text-xs mb-2">{book.engTitle}</h3>
                  <p className="text-xs text-amber-100/70 leading-relaxed mb-4">{book.desc}</p>
                </div>

                <div className="pt-3 border-t border-amber-500/10 flex items-center justify-between text-xs text-amber-400/80">
                  <span className="flex items-center gap-1"><Bookmark className="w-3.5 h-3.5 text-amber-400" /> {book.count}</span>
                  <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-amber-400" /> {isAr ? 'بدون نت' : 'Offline'}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: Tafsir of Quran */}
        <section className="mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-amber-300 mb-6 flex items-center gap-2 border-b border-amber-500/20 pb-3">
            <Book className="w-6 h-6 text-amber-400" />
            <span>{isAr ? 'تفاسير القرآن الكريم' : 'Quranic Tafsir Exegesis'}</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {tafsirBooks.map((tafsir, idx) => (
              <div key={idx} className="bg-neutral-900/80 border border-amber-500/30 rounded-2xl p-5 hover:border-amber-400/60 transition-all shadow-lg">
                <span className="text-lg font-black text-amber-300 block mb-1">{tafsir.title}</span>
                <span className="text-xs font-bold text-white block mb-2">{tafsir.engTitle}</span>
                <span className="text-[11px] text-amber-400/80 font-mono block mb-3">بقلم: {tafsir.author}</span>
                <p className="text-xs text-amber-100/70 leading-relaxed">{tafsir.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-amber-500/20 py-6 text-center text-xs text-amber-400/60">
        <p>© {new Date().getFullYear()} Quran App • Sunnah & Tafsir Library</p>
      </footer>
    </div>
  );
}

