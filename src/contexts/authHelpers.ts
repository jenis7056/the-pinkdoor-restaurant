
import { User, UserRole } from "@/types";
import { toast } from "sonner";

// Predefined users
export const predefinedUsers: User[] = [
  { id: '1', username: 'jenis7056', role: 'admin', name: 'Admin User' },
  { id: '2', username: 'jyot', role: 'waiter', name: 'Jyot Waiter' },
  { id: '3', username: 'chef001', role: 'chef', name: 'Head Chef' },
];

// Predefined passwords
export const passwords: Record<string, string> = {
  'jenis7056': 'Jenis@7056',
  'jyot': 'Jyot@7188',
  'chef001': 'chef@001',
};

export const handleLogin = (
  username: string, 
  password: string, 
  setCurrentUser: (user: User | null) => void
): UserRole | false => {
  const user = predefinedUsers.find(u => u.username === username);
  if (user && passwords[username] === password) {
    setCurrentUser(user);
    toast.success(`Welcome, ${user.name}!`);
    return user.role; // Return the user role for redirection
  }
  toast.error('Invalid username or password');
  return false;
};

export const handleLogout = (setCurrentUser: (user: User | null) => void) => {
  setCurrentUser(null);
  toast.success('Logged out successfully');
};
