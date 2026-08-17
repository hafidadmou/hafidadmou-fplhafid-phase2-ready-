import React from 'react';
import { getTeamAnalysis } from '../../../lib/fpl';

type Props = { params: { id: string } };

export default async function AnalysisPage({ params }: Props) {
  const teamId = Number(params.id || 0);
  if (!teamId || isNaN(teamId)) {
    return <div className="card">معرّف الفريق غير صالح.</div>;
  }

  try {
    const data = await getTeamAnalysis(teamId);
    if (!data) {
      return <div className="card">لا توجد بيانات لهذا الفريق.</div>;
    }

    const { team, players, gameweek } = data;

    return (
      <section>
        <div className="card mb-4">
          <h2 className="text-2xl font-bold">تحليل الفريق: {team.entry_name}</h2>
          <p className="text-slate-600">المدير: {team.player_first_name} {team.player_last_name}</p>
          <p className="text-slate-500 text-sm">الجولة الحالية المستخدمة: {gameweek}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {players.map((p: any) => (
            <div key={p.id} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-semibold">{p.web_name} — {p.element_type_name}</div>
                  <div className="text-sm text-slate-600">{p.team_name}</div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold">{p.total_points} نقطة</div>
                  <div className="text-sm text-slate-500">تقييم: {p.rating}</div>
                </div>
              </div>

              <div className="mt-3 text-sm text-slate-600">
                <div>مركز السوق: {p.now_cost / 10} مليون</div>
                <div>قيمة مضافة: {p.value_season ?? '—'}</div>
                <div>نسبة اختيار اللاعبين: {p.selected_by_percent}%</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  } catch (err: any) {
    return <div className="card">حدث خطأ أثناء جلب البيانات: {err.message || String(err)}</div>;
  }
}
