// DTO used for both validation and typing
export enum UserRole {
  DRIVER = 'driver',
  SPONSOR = 'sponsor',
  ADMIN = 'admin',
}

export interface User {
  id: string;                
  username: string;
  passwordHash: string;      
  name: string;
  role: UserRole;
  bio?: string;
  address?: string;
  email: string;
  phone?: string;
  profilePicUrl?: string;
  backupEmail?: string;
  securityQuestion?: string;
  points: number;
  archived: boolean;
}