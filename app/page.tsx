'use client';

import React, { useEffect, useState } from 'react';

function StarIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.955a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.45a1 1 0 00-.364 1.118l1.287 3.955c.3.921-.755 1.688-1.54 1.118l-3.37-2.45a1 1 0 00-1.176 0l-3.37 2.45c-.784.57-1.84-.197-1.54-1.118l1.287-3.955a1 1 0 00-.364-1.118L2.063 9.382c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.955z" />
    </svg>
  );
}

export default function Home() {
  const [teamId, setTeamId] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  async function analyze(id: string) {
    setError(null);
    setData(null);
    if (!id) return setError('الرجاء إدخال معرّف الفريق');
    setLoading(true);
    try {
      const res = await fetch(`/api/team?id=${encodeURIComponent(id)}`);
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || res.statusText || 'فشل جلب البيانات');
      }
      const json = await res.json();
      if (json?.error) throw new Error(json.error);
      setData(json);
    } catch (e: any) {
      setError(e.message || 'فشل جلب البيانات');
    }
    setLoading(false);
  }

  useEffect(() => {
    try {
      const params = new URLSearchParams(location.search);
      const id = params.get('id');
      if (id) {
        setTeamId(id);
        analyze(id);
      }
    } catch (e) {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50 text-slate-900">
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">F</div>
            <div>
              <div className="font-bold text-lg">FPL حفيظ</div>
              <div className="text-xs text-slate-500">تحليلات فرق Fantasy Premier League</div>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-slate-700">
            <a href="#features" className="hover:text-slate-900">الميزات</a>
            <a href="#how" className="hover:text-slate-900">كيف يعمل</a>
            <a href="#contact" className="hover:text-slate-900">تواصل</a>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold mb-4">حلّل فريقك في Fantasy Premier League سريعا وبثقة</h1>
            <p className="text-slate-600 mb-6">أدخل معرّف فريق FPL الخاص بك لتحصل فوراً على تقييم شامل لتشكيلتك، تحليل نقاط القوة والضعف، توصيات نقل، وتحليل لكل لاعب — بيانات مباشرة ومحدثة.</p>

            <div className="bg-white p-4 rounded-lg shadow-sm">
              <label className="block text-sm font-medium mb-2">معرّف الفريق (Team ID)</label>
              <div className="flex gap-2">
                <input
                  value={teamId}
                  onChange={(e) => setTeamId(e.target.value)}
                  placeholder="مثال: 2281 أو أدخل رقم فريقك"
                  className="flex-1 border border-slate-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  inputMode="numeric"
                />
                <button
                  onClick={() => analyze(teamId)}
                  disabled={loading}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-60"
                >
                  {loading ? 'جاري التحميل...' : 'حلّل تشكيلتك'}
                </button>
              </div>
              <div className="text-xs text-slate-500 mt-2">ستحصل على تقييم فوري، قائمة اللاعبين، الأسعار، نقاط الموسم، وتوصيات النقل.</div>
            </div>

            <div className="mt-6 flex gap-3 flex-wrap">
              <div className="px-3 py-2 bg-white rounded shadow-sm text-sm">
                🔒 بيانات آمنة — لا نجمع بيانات الدخول الخاصة بك
              </div>
              <div className="px-3 py-2 bg-white rounded shadow-sm text-sm">
                ⚡ تحديث مباشر — بيانات FPL الحالية
              </div>
              <div className="px-3 py-2 bg-white rounded shadow-sm text-sm">
                📱 تصميم متجاوب — يعمل على الهاتف والكمبيوتر
              </div>
            </div>
          </div>

          <div>
            <div className="bg-gradient-to-br from-indigo-600 to-indigo-400 text-white rounded-lg p-6 shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm">متوسط تقييم الفريق</div>
                  <div className="text-4xl font-extrabold">— /100</div>
                </div>
                <div className="text-right">
                  <div className="text-sm">آخر تحديث</div>
                  <div className="text-sm">المباشر</div>
                </div>
              </div>

              <div className="mt-6">
                <div className="text-sm text-indigo-100">أدخل معرّف فريقك وسترى تقييم الفريق هنا مباشرة.</div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="bg-white rounded shadow-sm p-3">
                <div className="text-sm text-slate-500">توصية اليوم</div>
                <div className="font-semibold mt-2">تحقق من لاعبيك المصابين ودرجة الغياب</div>
              </div>
              <div className="bg-white rounded shadow-sm p-3">
                <div className="text-sm text-slate-500">أفضل لاعب</div>
                <div className="font-semibold mt-2">—</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="mt-12">
          <h2 className="text-2xl font-bold mb-4">ماذا نقدم؟</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-sm p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded flex items-center justify-center">📊</div>
                <div className="font-semibold">تقييم الفريق</div>
              </div>
              <div className="text-sm text-slate-600">نحسب تقييماً موضوعياً للفريق (0-100) بناءً على نقاط اللاعبين، دقائق اللعب، والأداء الأخير.</div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded flex items-center justify-center">🧠</div>
                <div className="font-semibold">تحليل اللاعبين</div>
              </div>
              <div className="text-sm text-slate-600">عرض تفصيلي لكل لاعب: نقاط الموسم، السعر، الفورم، والتوصية ما إذا كان يجب الاحتفاظ أو البيع.</div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded flex items-center justify-center">⚔️</div>
                <div className="font-semibold">القوة والضعف</div>
              </div>
              <div className="text-sm text-slate-600">نحدد مراكز القوة والضعف ونقترح تغييرات لتقوية التشكيلة وتقليل المخاطر.</div>
            </div>
          </div>
        </section>

        {/* Live result area */}
        <section className="mt-10">
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-700 p-4 rounded">خطأ: {error}</div>
          )}

          {data && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-slate-500">الفريق</div>
                    <div className="text-xl font-bold">{data.team?.entry_name || '—'}</div>
                    <div className="text-sm text-slate-500">المدير: {data.team?.player_first_name} {data.team?.player_last_name}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-slate-500">تقييم الفريق</div>
                    <div className="text-3xl font-extrabold">{Math.round((data.players||[]).reduce((s:number,p:any)=>s+(p.rating||0),0)/Math.max(1,(data.players||[]).length))} <span className="text-sm">/100</span></div>
                    <div className="text-sm text-slate-500">الجولة: {data.gameweek}</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-5">
                <h3 className="font-semibold mb-3">توصيات سريعة</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-3 border rounded">
                    <div className="text-sm text-slate-500">نقطة قوة</div>
                    <div className="font-semibold mt-1">{data.players && data.players.length? data.players.slice(0,1)[0].web_name : '—'}</div>
                  </div>
                  <div className="p-3 border rounded">
                    <div className="text-sm text-slate-500">خطر</div>
                    <div className="font-semibold mt-1">تحقق من اللاعبين المصابين/اللاعبين غير الأساسين</div>
                  </div>
                  <div className="p-3 border rounded">
                    <div className="text-sm text-slate-500">اقتراح نقل</div>
                    <div className="font-semibold mt-1">راجع لاعبيك ذوي التقييم الأقل من 40</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-5">
                <h3 className="font-semibold mb-3">تشكيلة الفريق</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {(data.players||[]).map((p:any)=> (
                    <div key={p.id} className="p-3 border rounded flex items-center justify-between">
                      <div>
                        <div className="font-semibold">{p.web_name}</div>
                        <div className="text-sm text-slate-500">{p.element_type_name} — {p.team_name}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">{p.total_points} نقطة</div>
                        <div className="text-sm text-slate-500">{(p.now_cost/10).toFixed(1)}M — تقييم {p.rating}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {!data && !error && (
            <div className="text-center text-slate-500 py-12">ادخل معرّف فريقك ثم اضغط حلّل تشكيلتك لبدء التحليل المباشر</div>
          )}
        </section>

        {/* How it works */}
        <section id="how" className="mt-12">
          <h2 className="text-2xl font-bold mb-4">كيف يعمل الموقع</h2>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <ol className="list-decimal pr-6 space-y-3 text-slate-700">
              <li>أدخل معرّف فريق FPL الخاص بك أو افتح الرابط مع ?id=TEAM_ID</li>
              <li>النظام يجلب البيانات مباشرة من واجهة FPL عبر خادمنا (لا يعتمد على متصفحات المستخدم)</li>
              <li>نحسب تقييم الفريق، نقاط اللاعبين، ونعرض توصيات قابلة للتنفيذ</li>
            </ol>
          </div>
        </section>

        <section id="contact" className="mt-12 mb-20">
          <h2 className="text-2xl font-bold mb-4">اتصل بنا</h2>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-sm text-slate-600">للملاحظات أو اقتراحات الميزات راسلنا عبر email@example.com</div>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t">
        <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-slate-600">© {new Date().getFullYear()} FPL حفيظ — بيانات من Fantasy Premier League</div>
          <div className="flex gap-4 text-sm text-slate-600">
            <a href="#features">الميزات</a>
            <a href="#how">كيف يعمل</a>
            <a href="#contact">تواصل</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
