import { Resend } from 'resend';

export function makeResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error('RESEND_API_KEY no está configurada');
  return new Resend(key);
}
