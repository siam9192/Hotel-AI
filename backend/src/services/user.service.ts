// filepath: ai-agent/src/services/user.service.ts
interface User {
  id: string;
  name: string;
  email: string;
  preferences: any;
}

class UserService {
  private users: Map<string, User> = new Map();

  createUser(id: string, name: string, email: string): User {
    const user = { id, name, email, preferences: {} };
    this.users.set(id, user);
    return user;
  }

  getUser(id: string): User | undefined {
    return this.users.get(id);
  }

  updatePreferences(id: string, preferences: any): User | undefined {
    const user = this.users.get(id);
    if (user) {
      user.preferences = preferences;
    }
    return user;
  }
}

export const userService = new UserService();