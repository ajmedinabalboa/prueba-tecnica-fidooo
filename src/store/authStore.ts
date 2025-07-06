import { create } from 'zustand';
import { User } from 'firebase/auth';

interface AuthState {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: true,
  isAuthenticated: false,
  setUser: (user) => set({ 
    user, 
    isAuthenticated: !!user,
    loading: false 
  }),
  setLoading: (loading) => set({ loading }),
  logout: () => set({ 
    user: null, 
    isAuthenticated: false, 
    loading: false 
  }),
}));