export type ServiceStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';
export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type DeviceType = 'washing_machine' | 'dryer' | 'dishwasher' | 'refrigerator' | 'freezer' | 'oven' | 'microwave' | 'air_conditioner' | 'other';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'technician';
  phone?: string;
  avatar?: string;
  specialties?: DeviceType[];
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address: string;
  notes?: string;
  createdAt: string;
}

export interface Device {
  id: string;
  customerId: string;
  type: DeviceType;
  brand: string;
  model: string;
  serialNumber?: string;
  purchaseDate?: string;
  warrantyEnd?: string;
  notes?: string;
}

export interface Service {
  id: string;
  customerId: string;
  deviceId: string;
  technicianId?: string;
  status: ServiceStatus;
  priority: Priority;
  description: string;
  diagnosis?: string;
  solution?: string;
  partsUsed?: string[];
  photos?: string[];
  scheduledDate?: string;
  completedDate?: string;
  cost?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Maintenance {
  id: string;
  deviceId: string;
  customerId: string;
  type: 'regular' | 'warranty' | 'inspection';
  scheduledDate: string;
  notes?: string;
  completed: boolean;
}

export const DEVICE_TYPE_LABELS: Record<DeviceType, string> = {
  washing_machine: 'Veš mašina',
  dryer: 'Sušilica',
  dishwasher: 'Mašina za sudove',
  refrigerator: 'Frižider',
  freezer: 'Zamrzivač',
  oven: 'Rerna',
  microwave: 'Mikrotalasna',
  air_conditioner: 'Klima',
  other: 'Ostalo',
};

export const STATUS_LABELS: Record<ServiceStatus, string> = {
  pending: 'Na čekanju',
  in_progress: 'U toku',
  completed: 'Završeno',
  cancelled: 'Otkazano',
};

export const PRIORITY_LABELS: Record<Priority, string> = {
  low: 'Niska',
  medium: 'Srednja',
  high: 'Visoka',
  urgent: 'Hitno',
};
