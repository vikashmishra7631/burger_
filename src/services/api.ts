// Frontend API Client for Chronova Backend

const API_BASE_URL = 'http://localhost:5000/api';

// Token Management
export const authStorage = {
  getToken: (): string | null => {
    return localStorage.getItem('chronova_token');
  },
  setToken: (token: string) => {
    localStorage.setItem('chronova_token', token);
  },
  removeToken: () => {
    localStorage.removeItem('chronova_token');
  }
};

export interface VaultItem {
  id: string;
  name: string;
  serialNumber: string;
  warrantyExpiry: string;
  certificateNumber?: string;
  certifiedChronometer: boolean;
  acquiredAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  memberId: string;
  tier: string;
  vaultItems?: VaultItem[];
  createdAt?: string;
}

export interface OrderItem {
  watch: { id: string; name: string; price: number; image: string };
  quantity: number;
}

export interface OrderRecord {
  id: string;
  orderRef: string;
  certificateNumber: string;
  userId: string;
  userEmail: string;
  userName: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  total: number;
  shippingAddress: string;
  status: string;
  createdAt: string;
}

export interface SubscriberRecord {
  id: string;
  email: string;
  subscribedAt: string;
}

export interface ConciergeRecord {
  id: string;
  userId: string;
  sender: 'user' | 'concierge';
  text: string;
  time: string;
}

export interface AdminOverviewData {
  metrics: {
    totalPatrons: number;
    totalOrders: number;
    totalRevenue: number;
    totalWatchesSold: number;
    totalSubscribers: number;
  };
  users: UserProfile[];
  orders: OrderRecord[];
  subscribers: SubscriberRecord[];
  conciergeMessages: ConciergeRecord[];
}

export interface OrderPayload {
  items: OrderItem[];
  subtotal: number;
  discount: number;
  total: number;
  shippingAddress?: string;
}

export const api = {
  // 1. Health check
  checkHealth: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/health`);
      return await res.json();
    } catch {
      return null;
    }
  },

  // 2. Authentication
  register: async (email: string, name: string, password?: string) => {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name, password: password || 'LuxuryPatron2026!' })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to register');
    if (data.token) authStorage.setToken(data.token);
    return data;
  },

  login: async (email: string, password?: string) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: password || 'LuxuryPatron2026!' })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to login');
    if (data.token) authStorage.setToken(data.token);
    return data;
  },

  getMe: async (): Promise<UserProfile | null> => {
    const token = authStorage.getToken();
    if (!token) return null;
    try {
      const res = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        authStorage.removeToken();
        return null;
      }
      const data = await res.json();
      return data.user;
    } catch {
      return null;
    }
  },

  // 3. Orders
  createOrder: async (orderPayload: OrderPayload) => {
    const token = authStorage.getToken();
    const res = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(orderPayload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to process order');
    return data;
  },

  getOrders: async (): Promise<OrderRecord[]> => {
    const token = authStorage.getToken();
    if (!token) return [];
    const res = await fetch(`${API_BASE_URL}/orders`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    return data.orders || [];
  },

  // 4. Newsletter
  subscribeNewsletter: async (email: string) => {
    const res = await fetch(`${API_BASE_URL}/newsletter`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    return await res.json();
  },

  // 5. Concierge
  getConciergeMessages: async () => {
    const token = authStorage.getToken();
    if (!token) return [];
    const res = await fetch(`${API_BASE_URL}/concierge`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    return data.messages || [];
  },

  sendConciergeMessage: async (text: string) => {
    const token = authStorage.getToken();
    const res = await fetch(`${API_BASE_URL}/concierge`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ text })
    });
    return await res.json();
  },

  // 6. Admin Overview
  getAdminOverview: async (): Promise<AdminOverviewData | null> => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/overview`);
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }
};
