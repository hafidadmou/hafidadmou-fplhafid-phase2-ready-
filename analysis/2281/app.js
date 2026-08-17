(async function(){
  const ENTRY_ID = 2281;
  const BASE = 'https://fantasy.premierleague.com/api';
  const elMeta = document.getElementById('meta');
  const elPlayers = document.getElementById('players');

  function showError(msg){ elMeta.textContent = 'خطأ: '+msg }

  try{
    elMeta.textContent = 'جاري جلب البيانات...';
    const bsRes = await fetch(BASE+'/bootstrap-static/');
    const bs = await bsRes.json();
    const events = bs.events || [];
    let currentEvent = events.find(e=>e.is_current)?.id || events.find(e=>e.is_next)?.id || (events.length? events[events.length-1].id : 1);

    const entryRes = await fetch(BASE+`/entry/${ENTRY_ID}/`);
    const entry = await entryRes.json();

    const picksRes = await fetch(BASE+`/entry/${ENTRY_ID}/event/${currentEvent}/picks/`);
    const picksObj = await picksRes.json();

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
