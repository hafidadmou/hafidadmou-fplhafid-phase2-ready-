import './globals.css';
import React from 'react';

export const metadata = {
  title: 'FPL Hafid',
  description: 'تحليل فرق Fantasy Premier League — FPL Hafid',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        {/* خط عربي من Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <header className="header px-4 py-3">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <h1 className="text-xl font-bold">FPL حفيظ</h1>
            <nav>
              <a className="mx-2 text-sm text-slate-600" href="/">الرئيسية</a>
              <a className="mx-2 text-sm text-slate-600" href="/analysis/2281">تحليل الفريق 2281</a>
            </nav>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-8">
          {children}
        </main>

        <footer className="mt-12 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} FPL حفيظ — بيانات حقيقية من Fantasy Premier League
        </footer>
      </body>
    </html>
  );
}
