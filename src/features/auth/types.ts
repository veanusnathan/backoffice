export interface User {
  id: string;
  username: string;
  email: string;
  roles?: string[];
}

export function isSuperuser(user: User | null): boolean {
  return Boolean(user?.roles?.includes('superuser'));
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  status?: string;
  user: User;
}

export interface VerificationRequest {
  status: string;
  verificationToken: string;
}

export enum Role {
  USER = 'user',
  ADMIN = 'admin',
}
