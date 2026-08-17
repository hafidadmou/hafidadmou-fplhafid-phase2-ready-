(function(){
  const ENTRY_INPUT = document.getElementById('teamId');
  const FETCH_BTN = document.getElementById('fetchBtn');
  const RESULT = document.getElementById('result');

  const BASE = 'https://fantasy.premierleague.com/api';
  const PROXIES = [
    'https://api.allorigins.win/raw?url=',
    'https://api.allorigins.ro/raw?url=',
    'https://thingproxy.freeboard.io/fetch/'
  ];

  function renderError(msg){
    RESULT.innerHTML = `<div class="card"><strong>خطأ:</strong> ${escapeHtml(msg)}</div>`;
  }

  function escapeHtml(s){
    return (s+'').replace(/[&<>":']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[c]));
  }

  async function fetchWithProxies(url){
    // try proxies in order, then direct
    for(const p of PROXIES){
      try{
        const res = await fetch(p + encodeURIComponent(url));
        if(!res.ok) throw new Error('proxy:'+p+' status:'+res.status);
        const data = await res.json();
        return data;
      }catch(e){
        // continue
        console.warn('proxy failed', p, e.message);
      }
    }
    // fallback direct
    const direct = await fetch(url);
    if(!direct.ok) throw new Error('Direct fetch failed: '+direct.status);
    return await direct.json();
  }

  function computePlayerRating(player){
    // simplified rating combining points, minutes, form
    // normalized to 0-100
    const pts = player.total_points || 0;
    const minutes = player.minutes || 0;
    const form = parseFloat(player.form || 0) || 0;
    // weight: points 60%, form 30%, minutes 10%
    const score = ( (pts/150)*60 + (form*10)*3 + Math.min(minutes/90,1)*10 );
    return Math.round(Math.max(0, Math.min(100, score)));
  }

  function computeTeamRating(players){
    if(!players || players.length===0) return 0;
    const avg = Math.round(players.reduce((s,p)=>s+(p._rating||0),0)/players.length);
    return avg;
  }

  function analyzeTeam(players){
    const byPosition = {};
    players.forEach(p=>{
      const pos = p.element_type_name || p.element_type || 'Other';
      (byPosition[pos] = byPosition[pos]||[]).push(p);
    });
    const weakPositions = Object.entries(byPosition).filter(([,arr])=>arr.reduce((s,x)=>s+(x._rating||0),0)/arr.length < 40).map(x=>x[0]);
    const strongPositions = Object.entries(byPosition).filter(([,arr])=>arr.reduce((s,x)=>s+(x._rating||0),0)/arr.length > 70).map(x=>x[0]);
    return {weakPositions, strongPositions};
  }

  function renderTeam(entry, players, gameweek){
    const teamRating = computeTeamRating(players);
    const analysis = analyzeTeam(players);

    RESULT.innerHTML = `
      <div class="card">
        <h2>${escapeHtml(entry.entry_name || 'Team')}</h2>
        <div class="muted">Manager: ${escapeHtml((entry.player_first_name||'') + ' ' + (entry.player_last_name||''))} — GW: ${escapeHtml(String(gameweek||'—'))}</div>
        <div style="margin-top:8px"><strong>Team rating:</strong> ${teamRating}/100</div>
        <div style="margin-top:8px"><strong>Strengths:</strong> ${analysis.strongPositions.length? escapeHtml(analysis.strongPositions.join(', ')) : '—'}</div>
        <div style="margin-top:8px"><strong>Weaknesses/Risks:</strong> ${analysis.weakPositions.length? escapeHtml(analysis.weakPositions.join(', ')) : '—'}</div>
      </div>
      <div class="card">
        <h3>Squad</h3>
        <div>
          ${players.map(p=>`
            <div class="player">
              <div>
                <div style="font-weight:600">${escapeHtml(p.web_name || p.name)} — ${escapeHtml(p.element_type_name || p.position || '')}</div>
                <div class="muted">${escapeHtml(p.team_name || p.team)}</div>
              </div>
              <div style="text-align:left">
                <div style="font-weight:700">${escapeHtml(String(p.total_points||p.points||0))} نقطة</div>
                <div class="muted">${escapeHtml(String((p.now_cost||p.cost||0)/10))} مليون — اختيار ${escapeHtml(String(p.selected_by_percent||p.selected||0))}% — Rating: ${escapeHtml(String(p._rating))}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  async function loadTeam(teamId){
    if(!teamId) return renderError('أدخل معرّف الفريق');
    RESULT.innerHTML = '<div class="card">جاري جلب البيانات...</div>';
    try{
      const bs = await fetchWithProxies(BASE + '/bootstrap-static/');
      const events = bs.events || [];
      const currentEvent = events.find(e=>e.is_current)?.id || events.find(e=>e.is_next)?.id || (events.length? events[events.length-1].id : 1);

      const entry = await fetchWithProxies(BASE + `/entry/${teamId}/`);
      const picksObj = await fetchWithProxies(BASE + `/entry/${teamId}/event/${currentEvent}/picks/`);

      const elements = bs.elements || [];
      const teams = bs.teams || [];
      const element_types = bs.element_types || [];

      const picks = (picksObj.picks||[]).map(p=>{
        const el = elements.find(x=>x.id===p.element) || {};
        const teamInfo = teams.find(t=>t.id===el.team) || {};
        const elemType = element_types.find(t=>t.id===el.element_type) || {};
        const out = {
          id: el.id,
          web_name: el.web_name || el.name,
          first_name: el.first_name,
          second_name: el.second_name,
          team_name: teamInfo.name || '',
          total_points: el.total_points || 0,
          now_cost: el.now_cost || el.now_cost,
          selected_by_percent: el.selected_by_percent || el.selected,
          element_type: el.element_type,
          element_type_name: elemType.singular_name_short || elemType.singular_name || '',
          value_season: el.value_season,
          minutes: el.minutes,
          form: el.form
        };
        out._rating = computePlayerRating(el);
        return out;
      });

      // Ensure we display substitutes too if available
      const players = picks;
      renderTeam(entry, players, currentEvent);

    }catch(err){
      console.error(err);
      renderError(err.message || String(err));
    }
  }

  FETCH_BTN.addEventListener('click', ()=>{
    loadTeam(ENTRY_INPUT.value.trim());
  });

  // if query param ?id= present, auto-load
  (function(){
    try{
      const params = new URLSearchParams(location.search);
      const id = params.get('id');
      if(id){ ENTRY_INPUT.value = id; loadTeam(id); }
    }catch(e){}
  })();

})();
