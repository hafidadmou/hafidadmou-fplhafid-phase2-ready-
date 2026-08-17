(async function(){
  const ENTRY_ID = 2281;
  const BASE = 'https://fantasy.premierleague.com/api';
  const PROXY_PREFIX = 'https://api.allorigins.win/raw?url='; // CORS proxy to avoid FPL CORS restrictions on static hosting
  const elMeta = document.getElementById('meta');
  const elPlayers = document.getElementById('players');

  function showError(msg){ elMeta.textContent = 'خطأ: '+msg }

  async function fetchJson(url){
    // Try via CORS proxy first (reliable for static GitHub Pages). If that fails, try direct fetch as fallback.
    try{
      const proxyUrl = PROXY_PREFIX + encodeURIComponent(url);
      const res = await fetch(proxyUrl);
      if(!res.ok) throw new Error('Proxy fetch failed: '+res.status);
      return await res.json();
    }catch(proxyErr){
      try{
        const res = await fetch(url);
        if(!res.ok) throw new Error('Direct fetch failed: '+res.status);
        return await res.json();
      }catch(directErr){
        // Prefer the proxy error message if available
        throw new Error(proxyErr.message || directErr.message || 'Failed to fetch '+url);
      }
    }
  }

  try{
    elMeta.textContent = 'جاري جلب البيانات...';

    const bs = await fetchJson(BASE + '/bootstrap-static/');
    const events = bs.events || [];
    let currentEvent = events.find(e=>e.is_current)?.id || events.find(e=>e.is_next)?.id || (events.length? events[events.length-1].id : 1);

    const entry = await fetchJson(BASE + `/entry/${ENTRY_ID}/`);
    const picksObj = await fetchJson(BASE + `/entry/${ENTRY_ID}/event/${currentEvent}/picks/`);

    const elements = bs.elements || [];
    const teams = bs.teams || [];
    const element_types = bs.element_types || [];

    elMeta.textContent = `الفريق: ${entry.entry_name} — المدير: ${entry.player_first_name} ${entry.player_last_name} — الجولة: ${currentEvent}`;

    const players = (picksObj.picks||[]).map(p=>{
      const el = elements.find(x=>x.id===p.element) || {};
      const teamInfo = teams.find(t=>t.id===el.team) || {};
      const elemType = element_types.find(t=>t.id===el.element_type) || {};
      return {
        id: el.id,
        name: el.web_name,
        position: elemType.singular_name_short || elemType.singular_name || '',
        team: teamInfo.name || '',
        points: el.total_points || 0,
        cost: el.now_cost/10,
        selected: el.selected_by_percent || '0'
      }
    });

    if(players.length===0){ elPlayers.innerHTML = '<div>لا توجد لاعبين في هذه الجولة.</div>'; return }

    elPlayers.innerHTML = players.map(p=>`
      <div class="player">
        <div>
          <div style="font-weight:600">${p.name} — ${p.position}</div>
          <div style="color:#64748b;font-size:13px">${p.team}</div>
        </div>
        <div style="text-align:left">
          <div style="font-weight:700">${p.points} نقطة</div>
          <div style="color:#64748b;font-size:13px">${p.cost} مليون — اختيار ${p.selected}%</div>
        </div>
      </div>
    `).join('');

  }catch(err){
    showError(err.message||String(err));
    console.error(err);
  }
})();
