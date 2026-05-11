export type Pet = {
  id: string;
  name: string;
  age: string;
  breed: string;
  gender: string;
  tags: string[];
  location: string;
  description: string;
  image: string;
  type: 'cat' | 'dog';
  urgent: boolean;
};

export type AppUser = {
  id: string;
  email: string | null;
  phone: string | null;
  name: string;
  avatar: string;
  createdAt?: string;
};

export type Application = {
  id: string;
  petId: string;
  status: '正在审核' | '已结束';
  date: string;
  payload?: Record<string, unknown>;
  createdAt?: string;
};

export type Notification = {
  id: string;
  category: '申请' | '健康' | '活动' | '进度' | '目击';
  title: string;
  body: string;
  image: string;
  actionLabel: string;
  actionUrl: string;
  status: 'unread' | 'read' | 'archived';
  metadata?: Record<string, unknown>;
  createdAt: string;
};

export type NotificationPreferences = {
  adoptionUpdates: boolean;
  sightingReports: boolean;
  updatedAt?: string;
};

export type EventItem = {
  id: string;
  title: string;
  category: string;
  summary: string;
  description: string;
  image: string;
  location: string;
  startsAt: string;
  capacity: number;
  createdAt?: string;
};

export type ReportItem = {
  id: string;
  userId?: string | null;
  title: string;
  reportType: '丢失' | '目击' | '随手拍' | '已团聚';
  species: string;
  location: string;
  happenedAt: string;
  description: string;
  image: string;
  reward?: number | null;
  status: 'open' | 'resolved' | 'archived';
  createdAt: string;
};

export type AuthPayload = {
  email?: string;
  phone?: string;
  password?: string;
  code?: string;
  name?: string;
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  });

  if (!response.ok) {
    const detail = await response.json().catch(() => ({}));
    throw new Error(detail.error || `Request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export const api = {
  login(payload: AuthPayload) {
    return request<{ user: AppUser }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  register(payload: AuthPayload) {
    return request<{ user: AppUser }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  getPets() {
    return request<{ pets: Pet[] }>('/api/pets');
  },

  getPet(id: string) {
    return request<{ pet: Pet }>(`/api/pets/${encodeURIComponent(id)}`);
  },

  getFavorites(userId: string) {
    return request<{ favorites: string[] }>(`/api/favorites?userId=${encodeURIComponent(userId)}`);
  },

  toggleFavorite(userId: string, petId: string) {
    return request<{ favorites: string[] }>(`/api/favorites/${encodeURIComponent(petId)}/toggle`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  },

  getApplications(userId: string) {
    return request<{ applications: Application[] }>(`/api/applications?userId=${encodeURIComponent(userId)}`);
  },

  applyForPet(userId: string, petId: string, payload?: Record<string, unknown>) {
    return request<{ application: Application }>('/api/applications', {
      method: 'POST',
      body: JSON.stringify({ userId, petId, payload }),
    });
  },

  getNotifications(userId: string, status = 'unread', category = '全部') {
    const params = new URLSearchParams({ userId, status, category });
    return request<{ notifications: Notification[] }>(`/api/notifications?${params.toString()}`);
  },

  archiveNotification(userId: string, id: string) {
    return request<{ notification: Notification }>(`/api/notifications/${encodeURIComponent(id)}/archive`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  },

  getNotificationPreferences(userId: string) {
    return request<{ preferences: NotificationPreferences }>(`/api/notification-preferences?userId=${encodeURIComponent(userId)}`);
  },

  updateNotificationPreferences(userId: string, preferences: NotificationPreferences) {
    return request<{ preferences: NotificationPreferences }>('/api/notification-preferences', {
      method: 'POST',
      body: JSON.stringify({ userId, ...preferences }),
    });
  },

  getEvents(category = '全部') {
    return request<{ events: EventItem[] }>(`/api/events?category=${encodeURIComponent(category)}`);
  },

  getEvent(id: string) {
    return request<{ event: EventItem }>(`/api/events/${encodeURIComponent(id)}`);
  },

  registerEvent(userId: string, eventId: string) {
    return request<{ registration: { id: string; user_id: string; event_id: string } }>(`/api/events/${encodeURIComponent(eventId)}/register`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  },

  getReports(filter = '全部报告') {
    return request<{ reports: ReportItem[] }>(`/api/reports?filter=${encodeURIComponent(filter)}`);
  },

  getReport(id: string) {
    return request<{ report: ReportItem }>(`/api/reports/${encodeURIComponent(id)}`);
  },

  createReport(payload: Partial<ReportItem> & { userId?: string; reportType: string }) {
    return request<{ report: ReportItem }>('/api/reports', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};
