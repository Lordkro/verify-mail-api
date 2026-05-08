
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { loadDisposableSet } from '../utils/disposableList';
import { hasMxRecord } from '../utils/mxLookup';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }
  const { email } = req.body || {};
  if (!email || typeof email !== 'string') {
    res.status(400).json({ error: 'Invalid request body' });
    return;
  }
  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) {
    res.status(400).json({ error: 'Invalid email format' });
    return;
  }
  // Load (or mocked) disposable set on each request so tests can stub it
  const disposableSet = loadDisposableSet();
  const isDisposable = disposableSet.has(domain);
  const mxExists = await hasMxRecord(domain);
  const reason = isDisposable ? 'disposable' : mxExists ? 'non-disposable' : 'mx-failure';
  res.status(200).json({
    email,
    domain,
    isDisposable,
    reason,
    cached: true
  });
}
