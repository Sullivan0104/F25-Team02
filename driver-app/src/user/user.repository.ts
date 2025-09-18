//driver-app/src/user/user.repository.ts
import { Injectable } from '@nestjs/common';
import { User, UserRole } from './user.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class InMemoryUserRepository {
  private readonly users = new Map<string, User>(); // key = id

  // ---------- CRUD ----------
  async create(partial: Omit<User, 'id'>): Promise<User> {
    const id = uuidv4();
    const user: User = { id, ...partial };
    this.users.set(id, user);
    return user;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return [...this.users.values()].find(u => u.email === email);
  }

  async findByUsername(username: string): Promise<User | undefined> {
    return [...this.users.values()].find(u => u.username === username);
  }

  async findById(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async listAll(): Promise<User[]> {
    return [...this.users.values()];
  }
}