export default function Home() {
  return (
    <section>
      <div className="card">
        <h2 className="text-2xl font-bold mb-2">مرحباً بك في FPL حفيظ</h2>
        <p className="text-slate-600 mb-4">
          هذا المثال يربط بواجهة Fantasy Premier League العامة ويحلل فريق اختبار (ID = 2281).
          اضغط زر التحليل لعرض بيانات الفريق.
        </p>
        <a
          href="/analysis/2281"
          className="inline-block bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          فتح تحليل الفريق 2281
        </a>
      </div>
    </section>
  );
}
