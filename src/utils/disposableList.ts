import fs from 'fs';
import path from 'path';

let cached: Set<string> | null = null;
export function loadDisposableSet(): Set<string> {
  if (cached) return cached;
  const filePath = path.resolve(__dirname, '../../data/disposable_domains.json');
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    const domains: string[] = JSON.parse(raw);
    cached = new Set(domains.map(d => d.toLowerCase()));
  } catch (err) {
    console.error('Failed to load disposable domains:', err);
    cached = new Set();
  }
  return cached;
}
