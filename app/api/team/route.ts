import { NextResponse } from 'next/server';
import { getTeamAnalysis } from '../../../lib/fpl';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Missing id query parameter' }, { status: 400 });
    }
    const entryId = Number(id);
    if (Number.isNaN(entryId) || entryId <= 0) {
      return NextResponse.json({ error: 'Invalid id parameter' }, { status: 400 });
    }

    const analysis = await getTeamAnalysis(entryId);
    return NextResponse.json(analysis);
  } catch (err: any) {
    console.error('API /api/team error:', err?.message || err);
    return NextResponse.json({ error: err?.message || 'Internal error' }, { status: 500 });
  }
}
