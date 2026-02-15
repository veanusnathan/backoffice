export interface CpanelItem {
  id: number;
  ipServer: string;
  username: string;
  password: string;
  package?: string | null;
  mainDomain?: string | null;
  email?: string | null;
  nameServer?: string | null;
  status?: string | null;
  createdAt: string;
  updatedAt: string;
}
