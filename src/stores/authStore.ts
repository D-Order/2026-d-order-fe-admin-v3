import { create } from 'zustand';

export interface AuthState {
  username: string | null;
  booth_id: number | null;
  setAuth: (payload: {
    username: string;
    booth_id: number;
    accessToken?: string;
    refreshToken?: string;
  }) => void;
  clearAuth: () => void;
}

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

export const useAuthStore = create<AuthState>((set) => ({
  username: null,
  booth_id: null,

  setAuth: ({ username, booth_id, accessToken, refreshToken }) => {
    if (accessToken != null) {
      localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    }
    if (refreshToken != null) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
    localStorage.setItem('Booth-ID', String(booth_id));
    set({ username, booth_id });
  },

  clearAuth: () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem('Booth-ID');
    set({ username: null, booth_id: null });
  },
}));
