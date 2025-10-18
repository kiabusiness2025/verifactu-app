import { NextResponse } from 'next/server';
import { GoogleAuth } from 'google-auth-library';

// GET /api/ping-backend?p=/ruta   (si omites ?p, usa "/")
export async function GET(request) {
  try {
    const backendUrl = process.env.BACKEND_URL;
    const audience   = process.env.BACKEND_AUDIENCE;
    if (!backendUrl || !audience) {
      return NextResponse.json(
        { ok: false, error: 'Faltan BACKEND_URL/BACKEND_AUDIENCE' },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const p = searchParams.get('p') || '/';
    const target = backendUrl.replace(/\/+$/,'') + (p.startsWith('/') ? p : `/${p}`);

    const auth = new GoogleAuth();
    const client = await auth.getIdTokenClient(audience);
    const headers = await client.getRequestHeaders();

    const res = await fetch(target, {
      method: 'GET',
      headers: {
        ...headers,
        'Accept': 'application/json,text/plain,*/*',
      },
    });

    let body = null;
    const ct = res.headers.get('content-type') || '';
    if (ct.includes('application/json')) {
      body = await res.json();
    } else {
      body = await res.text();
      if (typeof body === 'string' && body.length > 2000) {
        body = body.slice(0, 2000) + '...<truncated>';
      }
    }

    return NextResponse.json(
      { ok: true, url: target, status: res.status, body },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: String(err?.message || err) },
      { status: 500 }
    );
  }
}
