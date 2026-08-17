'use client';

import React, { useEffect, useState } from 'react';

export default function Home() {
  const [teamId, setTeamId] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  async function load(id: string) {
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const res = await fetch(`/api/team?id=${encodeURIComponent(id)}`);
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || res.statusText);
      }
      const json = await res.json();
      setData(json);
    } catch (e: any) {
      setError(e.message || 'Failed to load');
    }
    setLoading(false);
  }

  useEffect(() => {
    try {
      const params = new URLSearchParams(location.search);
      const id = params.get('id');
      if (id) {
        setTeamId(id);
        load(id);
      }
    } catch (e) {}
  }, []);

  return (
    <section>
      <div className="card">
        <h2 className="text-2xl font-bold mb-2">مرحباً بك في FPL حفيظ</h2>
        <p className="text-slate-600 mb-4">
          أدخل معرّف الفريق (Team ID) لتحميل التحليل المباشر من Fantasy Premier League.
        </p>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input
            value={teamId}
            onChange={(e) => setTeamId(e.target.value)}
            placeholder="مثال: 2281"
            className="border px-3 py-2 rounded"
          />
          <button
            onClick={() => load(teamId)}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            disabled={loading}
          >
            {loading ? 'جاري التحميل...' : 'جلب وتحليل'}
          </button>
        </div>

        {error && <div style={{ marginTop: 12 }} className="text-red-600">خطأ: {error}</div>}

        {data && (
          <div style={{ marginTop: 16 }}>
            <h3 className="text-xl font-semibold">{data.team?.entry_name || 'Team'}</h3>
            <div className="muted">Manager: {data.team?.player_first_name} {data.team?.player_last_name} — GW: {data.gameweek}</div>
            <div style={{ marginTop: 8 }}><strong>Players:</strong></div>
            <div style={{ marginTop: 8 }}>
              {(data.players || []).map((p: any) => (
                <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{p.web_name} — {p.element_type_name}</div>
                    <div className="muted">{p.team_name}</div>
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 700 }}>{p.total_points} نقطة</div>
                    <div className="muted">{(p.now_cost/10).toFixed(1)} مليون — Rating: {p.rating}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
