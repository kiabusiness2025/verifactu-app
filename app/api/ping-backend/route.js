import { NextResponse } from 'next/server';
import { backendFetch } from '../../../lib/backendFetch';

// GET /api/ping-backend?p=/api/version   (por defecto /api/version)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const p = searchParams.get('p') || '/api/version'; // <-- ajusta aquí a tu ruta backend real
    const r = await backendFetch(p);

    return NextResponse.json({
      ok: r.ok,
      url: p,
      status: r.status,
      data: r.data, // si el backend devuelve JSON verás el objeto aquí
    }, { status: r.ok ? 200 : 502 });

  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err?.message || err) }, { status: 500 });
  }
}
