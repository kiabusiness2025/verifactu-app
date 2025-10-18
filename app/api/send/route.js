import { NextResponse } from 'next/server';
import { makeResend } from '../../../lib/resend';

export async function POST(req) {
  try {
    const provided = req.headers.get('x-api-key') || '';
    const expected = process.env.SEND_API_KEY || '';
    if (!expected || provided !== expected) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { to, subject, html, from } = await req.json();
    if (!to || !subject || !html) {
      return NextResponse.json({ ok: false, error: 'Faltan campos: to, subject, html' }, { status: 400 });
    }

    const fromAddress = from || process.env.DEFAULT_FROM || 'onboarding@resend.dev';
    const resend = makeResend();
    const result = await resend.emails.send({
      from: fromAddress,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
    });

    return NextResponse.json({ ok: true, id: result?.data?.id || null });
  } catch (err) {
    const msg = err?.message || String(err);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
