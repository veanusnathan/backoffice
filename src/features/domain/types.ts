/**
 * Domain record aligned with Namecheap API (namecheap.domains.getList) and DB.
 * Namecheap: ID, Name, User, Created, Expires, IsExpired, IsLocked, AutoRenew, WhoisGuard, IsPremium, IsOurDNS.
 * DB may add: description, nameServers (from getInfo or stored).
 */
export interface Domain {
  id: string;
  name: string;
  user?: string;
  created?: string;
  /** Expiry date (from Namecheap Expires, e.g. "02/15/2022") */
  expires: string;
  isExpired: boolean;
  isLocked: boolean;
  autoRenew: boolean;
  whoisGuard?: string;
  isPremium?: boolean;
  isOurDNS?: boolean;
  /** Optional; from DB / notes */
  description?: string | null;
  /** Optional; from DB or Namecheap getInfo */
  nameServers?: string[];
  /** Blocked (nawala) status; false = Not blocked, true = Blocked. Read-only. */
  nawala?: boolean;
  /** Whether domain is in use; false = Not used, true = Used */
  isUsed?: boolean;
  /** Domain category: MS, WP, LP, RTP, or Other */
  category?: string | null;
  /** Linked cPanel account; null if not linked */
  cpanel?: {
    id: number;
    ipServer: string;
    username: string;
    mainDomain?: string | null;
  } | null;
}

export const PAGE_SIZE_OPTIONS = [10, 50, 100] as const;
export type PageSizeOption = (typeof PAGE_SIZE_OPTIONS)[number];

export interface DomainListResponse {
  data: Domain[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/** Derive display status from Namecheap flags */
export function getDomainStatusDisplay(domain: Domain): string {
  if (domain.isExpired) return 'Expired';
  if (domain.isLocked) return 'Locked';
  return 'Active';
}

/** Namecheap Expires format: MM/DD/YYYY */
function parseExpiresDate(expires: string): Date | null {
  const parts = expires.split('/');
  if (parts.length !== 3) return null;
  const month = parseInt(parts[0], 10) - 1;
  const day = parseInt(parts[1], 10);
  const year = parseInt(parts[2], 10);
  const d = new Date(year, month, day);
  return isNaN(d.getTime()) ? null : d;
}

/** Action type for list: Reactivate (expired), Renew (≤7 days left), or Details */
export type DomainListAction = 'reactivate' | 'renew' | 'details';

export function getDomainListAction(domain: Domain): DomainListAction {
  if (domain.isExpired) return 'reactivate';
  const exp = parseExpiresDate(domain.expires);
  if (!exp) return 'details';
  const now = new Date();
  const msPerDay = 24 * 60 * 60 * 1000;
  const daysLeft = Math.ceil((exp.getTime() - now.getTime()) / msPerDay);
  if (daysLeft <= 7 && daysLeft >= 0) return 'renew';
  return 'details';
}
