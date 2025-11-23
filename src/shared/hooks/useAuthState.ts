import create from 'zustand';
import { User } from '../types/domain';
import { demoUser } from '../constants/mockData';

type AuthState = {
  user: User | null;
  login: (email: string, password: string) => void;
  logout: () => void;
};

export const useAuthState = create<AuthState>((set) => ({
  user: demoUser,
  login: (email) => {
    // TODO: Replace with real auth integration.
    set({
      user: {
        ...demoUser,
        email,
        id: 'user-temp'
      }
    });
  },
  logout: () => set({ user: null })
}));
