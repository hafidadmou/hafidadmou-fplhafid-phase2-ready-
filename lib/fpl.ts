import axios from 'axios';

/**
 * مكتبة بسيطة للتعامل مع واجهة FPL العامة.
 * تُرجع تحليل مبسّط للفريق (اللاعبين، نقاطهم، تقييم بسيط).
 */

const BASE = 'https://fantasy.premierleague.com/api';

async function fetchBootstrap() {
  const url = `${BASE}/bootstrap-static/`;
  const res = await axios.get(url);
  return res.data;
}

async function fetchEntry(entryId: number) {
  const url = `${BASE}/entry/${entryId}/`;
  const res = await axios.get(url);
  return res.data;
}

async function fetchPicks(entryId: number, eventId: number) {
  const url = `${BASE}/entry/${entryId}/event/${eventId}/picks/`;
  const res = await axios.get(url);
  return res.data;
}

export async function getTeamAnalysis(entryId: number) {
  // جلب بيانات عامة من bootstrap-static
  const bs = await fetchBootstrap();
  const events = bs.events || [];
  // نحدد الجولة الحالية أو الأقرب
  let currentEvent = events.find((e: any) => e.is_current)?.id;
  if (!currentEvent) {
    currentEvent = events.find((e: any) => e.is_next)?.id ?? events[events.length - 1]?.id;
  }

  // جلب بيانات الفريق والمدفوعات للاعبين
  const team = await fetchEntry(entryId);
  const picksObj = await fetchPicks(entryId, currentEvent);

  // عناصر اللاعبين من bootstrap (لكي نحصل على الأسماء/الفرق)
  const elements = bs.elements || [];
  const teams = bs.teams || [];
  const elementTypes = bs.element_types || [];

  // صفّف قائمة اللاعبين من picks
  const picks = picksObj.picks || [];
  const players = picks.map((p: any) => {
    const el = elements.find((x: any) => x.id === p.element) || {};
    const teamInfo = teams.find((t: any) => t.id === el.team) || {};
    const elemType = elementTypes.find((t: any) => t.id === el.element_type) || {};
    // rating بسيط: نسبة نقاط اللاعب إلى أقصى نقاط (نستخدم total_points)
    return {
      id: el.id,
      web_name: el.web_name,
      first_name: el.first_name,
      second_name: el.second_name,
      team_name: teamInfo.name,
      total_points: el.total_points,
      now_cost: el.now_cost,
      selected_by_percent: el.selected_by_percent,
      element_type: el.element_type,
      element_type_name: elemType.singular_name_short || elemType.singular_name,
      value_season: el.value_season,
      minutes: el.minutes,
    };
  });

  // حساب تقييم مبسط (0-100) بناءً على total_points مقارنة بمتوسط/أعلى
  const maxPoints = Math.max(...players.map((p: any) => p.total_points), 1);
  const avgPoints = Math.max(players.reduce((s: number, it: any) => s + (it.total_points || 0), 0) / players.length, 1);

  const playersWithRating = players.map((p: any) => {
    const score = Math.round(((p.total_points / maxPoints) * 70) + ((p.total_points / avgPoints) * 30));
    return {
      ...p,
      rating: Math.min(100, score),
    };
  });

  return {
    team,
    players: playersWithRating,
    gameweek: currentEvent,
    meta: {
      total_elements: elements.length,
      teams_count: teams.length,
    },
  };
}
