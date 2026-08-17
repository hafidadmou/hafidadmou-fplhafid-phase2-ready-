import './globals.css';
import React from 'react';

export const metadata = {
  title: 'FPL Hafid',
  description: 'تحليل فرق Fantasy Premier League — FPL Hafid',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className="antialiased">
      <head>
        {/* خط عربي من Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;700;900&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-hero-pattern bg-cover bg-right">
        <header className="site-header backdrop-blur-sm bg-white/60 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <a href="/" aria-label="FPL Hafid" className="flex items-center gap-3">
                <div className="logo w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-extrabold shadow-lg">FH</div>
                <div className="leading-tight">
                  <div className="text-lg font-extrabold">FPL حفيظ</div>
                  <div className="text-xs text-slate-600">تحليلات الفرق الاحترافية</div>
                </div>
              </a>
            </div>

            <nav className="hidden md:flex items-center gap-6 text-slate-700">
              <a href="#features" className="hover:text-slate-900">الميزات</a>
              <a href="#how" className="hover:text-slate-900">كيف يعمل</a>
              <a href="#contact" className="hover:text-slate-900">تواصل</a>
            </nav>

            <div className="hidden md:flex items-center gap-3">
              <a href="/" className="text-sm text-slate-600">تسعير</a>
              <a href="#" className="btn-primary">تجربة مجانية</a>
            </div>

            <button className="md:hidden p-2 rounded-md bg-white/30">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-slate-700">
                <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </header>

        <main className="min-h-screen">
          {children}
        </main>

        <footer className="mt-12 bg-slate-800 text-slate-200">
          <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row justify-between gap-6">
            <div>
              <div className="text-xl font-bold">FPL حفيظ</div>
              <div className="text-slate-300 text-sm mt-1">تحليلات متقدمة لتشكيلات Fantasy Premier League — بيانات مباشرة وتوصيات ذكية</div>
            </div>

            <div className="flex gap-6">
              <div>
                <div className="font-semibold">روابط</div>
                <ul className="text-sm mt-2 space-y-1">
                  <li><a href="#features" className="text-slate-300 hover:underline">الميزات</a></li>
                  <li><a href="#how" className="text-slate-300 hover:underline">كيف يعمل</a></li>
                </ul>
              </div>

              <div>
                <div className="font-semibold">تواصل</div>
                <div className="text-sm mt-2">email@example.com</div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-700 pt-4 text-center text-xs text-slate-400">© {new Date().getFullYear()} FPL حفيظ — بيانات من Fantasy Premier League</div>
        </footer>
      </body>
    </html>
  );
}
