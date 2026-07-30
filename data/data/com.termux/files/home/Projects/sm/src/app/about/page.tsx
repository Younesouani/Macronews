'use client';

import { useState } from 'react';
import Navigation from '../Navigation';
import { Info, Mic, ShieldCheck, Heart, Star, CheckCircle2 } from 'lucide-react';

export default function AboutPage() {
  const [lang, setLang] = useState<'en' | 'ar'>('ar');
  const isAr = lang === 'ar';

  const reciters = [
    { name: "مشاري راشد العفاسي", engName: "Mishary Rashid Alafasy", style: "حفص عن عاصم" },
    { name: "عبد الرحمن السديد", engName: "Abdul Rahman Al-Sudais", style: "حفص عن عاصم" },
    { name: "سعد الغامدي", engName: "Saad Al-Ghamdi", style: "حفص عن عاصم" },
    { name: "ماهر المعيقلي", engName: "Maher Al-Muaiqly", style: "حفص عن عاصم" },
    { name: "أبو بكر الشاطري", engName: "Abu Bakr Al-Shatri", style: "حفص عن عاصم" },
  ];

  return (
    <div dir={isAr ? 'rtl' : 'ltr'} className="min-h-screen bg-neutral-950 text-amber-50 flex flex-col justify-between selection:bg-amber-500 selection:text-neutral-950">
      <Navigation lang={lang} setLang={setLang} />

      <main className="relative z-10 max-w-4xl mx-auto px-4 py-10 w-full">
        {/* About App Card */}
        <section className="bg-neutral-900/80 border border-amber-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl mb-10">
          <h1 className="text-2xl sm:text-4xl font-black text-amber-200 mb-4 flex items-center gap-3">
            <Info className="w-8 h-8 text-amber-400" />
            <span>{isAr ? 'عن التطبيق والرسالة' : 'About App & Our Mission'}</span>
          </h1>

          <p className="text-amber-100/80 text-sm sm:text-base leading-relaxed mb-6">
            {isAr
              ? 'تطبيق قرآني شامل تم تطويره بأحدث التقنيات ليكون خفيف الوزن، سريع الأداء، ومتاحاً مجاناً بدون أي إعلانات تجارية. يهدف التطبيق لخدمة المسلمين في مشارق الأرض ومغاربها وتيسير تلاوة كتاب الله وتدبره.'
              : 'A modern, high-performance Quran application crafted to be lightweight, fast, and completely free without any commercial advertisements. Designed to serve Muslims globally for daily recitation and study.'}
          </p>

          <div className="space-y-3">
            <div className="flex items-start gap-3 text-xs sm:text-sm text-amber-100/90 bg-neutral-950/60 p-3 rounded-2xl border border-amber-500/10">
              <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong>{isAr ? 'أمان وخصوصية 100%:' : '100% Privacy Protection:'}</strong> {isAr ? 'لا نجمع أي بيانات شخصية ولا نستخدم أي برامج تتبع.' : 'Zero data collection or background trackers.'}
              </span>
            </div>

            <div className="flex items-start gap-3 text-xs sm:text-sm text-amber-100/90 bg-neutral-950/60 p-3 rounded-2xl border border-amber-500/10">
              <Star className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong>{isAr ? 'مجاني للجميع:' : 'Free Forever:'}</strong> {isAr ? 'تطبيق وقفي خالي من الإعلانات تماماً.' : 'Non-profit app built purely for spiritual study.'}
              </span>
            </div>
          </div>
        </section>

        {/* Included Reciters List */}
        <section className="mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-amber-300 mb-6 flex items-center gap-2 border-b border-amber-500/20 pb-3">
            <Mic className="w-6 h-6 text-amber-400" />
            <span>{isAr ? 'القراء المتاحون في التطبيق' : 'Featured Reciters'}</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {reciters.map((reciter, idx) => (
              <div key={idx} className="bg-neutral-900/80 border border-amber-500/30 rounded-2xl p-4 flex items-center gap-4 hover:border-amber-400/60 transition-all shadow-md">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-xl shrink-0">
                  🎙️
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">{isAr ? reciter.name : reciter.engName}</h3>
                  <p className="text-xs text-amber-400/80">{reciter.style}</p>
                  <p className="text-[11px] text-amber-100/50 mt-0.5 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-amber-400" /> {isAr ? 'صوت عالي الدقة' : 'High Quality Audio'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-amber-500/20 py-6 text-center text-xs text-amber-400/60">
        <div className="flex items-center justify-center gap-1 mb-1">
          <span>{isAr ? 'صُنع بكل محبة للأمة الإسلامية' : 'Crafted for the Ummah'}</span>
          <Heart className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
        </div>
        <p>© {new Date().getFullYear()} Quran App • About & Support</p>
      </footer>
    </div>
  );
}
