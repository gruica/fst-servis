import { Platform } from 'react-native';
import Constants from 'expo-constants';

function getApiUrl(): string {
  // U web modu koristi localhost jer je backend dostupan tamo
  if (Platform.OS === 'web') {
    return 'http://localhost:8082';
  }
  
  // U native modu koristi Replit domenu za eksterni pristup
  const replitDevDomain = process.env.EXPO_PUBLIC_REPLIT_DEV_DOMAIN || 
    Constants.expoConfig?.extra?.replitDevDomain;
  
  if (replitDevDomain) {
    return `https://3000-${replitDevDomain}`;
  }
  
  return 'http://localhost:8082';
}

const API_URL = getApiUrl();

console.log('[API] Using API URL:', API_URL);

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    console.log('[API] Request:', API_URL + endpoint);
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.log('[API] Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// AUTH
export const authApi = {
  login: (email: string, password: string) =>
    request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (email: string, password: string, name: string) =>
    request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    }),
};

// CUSTOMERS
export const customersApi = {
  list: () => request('/api/customers'),

  get: (id: string) => request(`/api/customers/${id}`),

  create: (data: { name: string; phone: string; email?: string; address?: string }) =>
    request('/api/customers', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: any) =>
    request(`/api/customers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    request(`/api/customers/${id}`, { method: 'DELETE' }),
};

// SERVICES
export const servicesApi = {
  list: () => request('/api/services'),

  get: (id: string) => request(`/api/services/${id}`),

  create: (data: any) =>
    request('/api/services', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: any) =>
    request(`/api/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    request(`/api/services/${id}`, { method: 'DELETE' }),
};

// DEVICES
export const devicesApi = {
  list: () => request('/api/devices'),

  get: (id: string) => request(`/api/devices/${id}`),

  create: (data: any) =>
    request('/api/devices', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: any) =>
    request(`/api/devices/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    request(`/api/devices/${id}`, { method: 'DELETE' }),
};

// HEALTH
export const healthApi = {
  check: () => request('/health'),
};
