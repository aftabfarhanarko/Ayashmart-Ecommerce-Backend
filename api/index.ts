import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getApp } from '../src/get-app';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 🔥 FORCE CORS HEADERS (this is the fix)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization',
  );

  // Preflight
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  const app = await getApp();
  const server = app.getHttpAdapter().getInstance();
  return server(req, res);
}
