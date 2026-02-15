export interface UserItem {
  id: number;
  username: string;
  email: string;
  roles: { id: number; name: string }[];
}

export interface RoleItem {
  id: number;
  name: string;
}

export interface RoleDetailWithUsers {
  id: number;
  name: string;
  users: { id: number; username: string; email: string }[];
}
