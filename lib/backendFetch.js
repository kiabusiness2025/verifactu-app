import { GoogleAuth } from 'google-auth-library';

const backendUrl   = process.env.BACKEND_URL;
const audience     = process.env.BACKEND_AUDIENCE || backendUrl;

// Llama al backend usando ID Token de Cloud Run
export async function backendFetch(path, { method = 'GET', headers = {}, body } = {}) {
  if (!backendUrl) throw new Error('Falta BACKEND_URL');
  const url = `${backendUrl}${path.startsWith('/') ? path : `/${path}`}`;

  const auth = new GoogleAuth();
  const client = await auth.getIdTokenClient(audience);
  const res = await client.request({
    url,
    method,
    headers: { 'Content-Type': 'application/json', ...headers },
    data: body ? (typeof body === 'string' ? body : JSON.stringify(body)) : undefined,
    validateStatus: () => true, // no lances por 4xx/5xx
  });

  return {
    ok: res.status >= 200 && res.status < 300,
    status: res.status,
    headers: res.headers,
    data: res.data,
  };
}