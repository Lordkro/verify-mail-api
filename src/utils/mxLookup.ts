import dns from 'dns';
import { promisify } from 'util';
const resolveMx = promisify(dns.resolveMx);
export async function hasMxRecord(domain: string): Promise<boolean> {
  try {
    const records = await resolveMx(domain);
    return records && records.length > 0;
  } catch (_) {
    return false;
  }
}
