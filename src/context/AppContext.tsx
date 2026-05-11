import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { api, AppUser, Application, AuthPayload, Pet } from '../lib/api';

interface AppState {
  user: AppUser | null;
  pets: Pet[];
  loading: boolean;
  error: string | null;
  login: (payload?: AuthPayload) => Promise<void>;
  register: (payload?: AuthPayload) => Promise<void>;
  logout: () => void;
  favorites: string[];
  toggleFavorite: (petId: string) => Promise<void>;
  applications: Application[];
  applyForPet: (petId: string, payload?: Record<string, unknown>) => Promise<void>;
}

const AppContext = createContext<AppState | undefined>(undefined);
const SESSION_KEY = 'stray-stories-user';

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(() => {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  });
  const [pets, setPets] = useState<Pet[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    api.getPets()
      .then(({ pets }) => {
        if (mounted) setPets(pets);
      })
      .catch((err) => {
        if (mounted) setError(err.message);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!user?.id) {
      setFavorites([]);
      setApplications([]);
      return;
    }

    Promise.all([api.getFavorites(user.id), api.getApplications(user.id)])
      .then(([favoriteResult, applicationResult]) => {
        setFavorites(favoriteResult.favorites);
        setApplications(applicationResult.applications);
      })
      .catch((err) => setError(err.message));
  }, [user?.id]);

  const persistUser = (nextUser: AppUser) => {
    setUser(nextUser);
    localStorage.setItem(SESSION_KEY, JSON.stringify(nextUser));
  };

  const login = async (payload: AuthPayload = {}) => {
    const { user } = await api.login(payload.phone || payload.email ? payload : { phone: 'demo-user' });
    persistUser(user);
  };

  const register = async (payload: AuthPayload = {}) => {
    const { user } = await api.register(payload.phone || payload.email ? payload : { phone: 'demo-user' });
    persistUser(user);
  };
  
  const logout = () => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
  };

  const toggleFavorite = async (id: string) => {
    if (!user?.id) return;
    const previous = favorites;
    setFavorites(prev => prev.includes(id) ? prev.filter(p => p !== id) : [id, ...prev]);
    try {
      const result = await api.toggleFavorite(user.id, id);
      setFavorites(result.favorites);
    } catch (err) {
      setFavorites(previous);
      setError(err instanceof Error ? err.message : '收藏失败');
    }
  };

  const applyForPet = async (id: string, payload?: Record<string, unknown>) => {
    if (!user?.id) return;
    const result = await api.applyForPet(user.id, id, payload);
    setApplications(prev => [result.application, ...prev]);
  };

  return (
    <AppContext.Provider value={{ user, pets, loading, error, login, register, logout, favorites, toggleFavorite, applications, applyForPet }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
}
