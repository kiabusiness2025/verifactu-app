import { NextResponse } from 'next/server';
import { GoogleAuth } from 'google-auth-library';

export async function GET() {
  try {
    const backendUrl = process.env.BACKEND_URL;
    const audience   = process.env.BACKEND_AUDIENCE;
    if (!backendUrl || !audience) {
      return NextResponse.json(
        { ok: false, error: 'Faltan BACKEND_URL/BACKEND_AUDIENCE' },
        { status: 500 }
      );
    }

    const auth = new GoogleAuth();
    const client = await auth.getIdTokenClient(audience);

    // Ajusta el path a uno REAL de tu backend (por ejemplo /health o /status)
    const target = `${backendUrl}/health`;
    const r = await client.request({ url: target, method: 'GET' });

    return NextResponse.json({ ok: true, url: target, status: r.status, data: r.data }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: String(err?.message || err) },
      { status: 500 }
    );
  }
}
