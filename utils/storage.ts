import AsyncStorage from '@react-native-async-storage/async-storage';
import { Customer, Device, Service, Maintenance, User } from "./types";

const KEYS = {
  USER: '@fst_user',
  AUTH_TOKEN: '@fst_auth_token',
  CUSTOMERS: '@fst_customers',
  DEVICES: '@fst_devices',
  SERVICES: '@fst_services',
  MAINTENANCES: '@fst_maintenances',
};

export const storage = {
  async getUser(): Promise<User | null> {
    try {
      const json = await AsyncStorage.getItem(KEYS.USER);
      return json ? JSON.parse(json) : null;
    } catch {
      return null;
    }
  },

  async setUser(user: User | null): Promise<void> {
    try {
      if (user) {
        await AsyncStorage.setItem(KEYS.USER, JSON.stringify(user));
      } else {
        await AsyncStorage.removeItem(KEYS.USER);
      }
    } catch {}
  },

  async getCustomers(): Promise<Customer[]> {
    try {
      const json = await AsyncStorage.getItem(KEYS.CUSTOMERS);
      return json ? JSON.parse(json) : [];
    } catch {
      return [];
    }
  },

  async setCustomers(customers: Customer[]): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.CUSTOMERS, JSON.stringify(customers));
    } catch {}
  },

  async addCustomer(customer: Customer): Promise<void> {
    const customers = await this.getCustomers();
    customers.push(customer);
    await this.setCustomers(customers);
  },

  async updateCustomer(customer: Customer): Promise<void> {
    const customers = await this.getCustomers();
    const index = customers.findIndex(c => c.id === customer.id);
    if (index !== -1) {
      customers[index] = customer;
      await this.setCustomers(customers);
    }
  },

  async deleteCustomer(id: string): Promise<void> {
    const customers = await this.getCustomers();
    await this.setCustomers(customers.filter(c => c.id !== id));
  },

  async getDevices(): Promise<Device[]> {
    try {
      const json = await AsyncStorage.getItem(KEYS.DEVICES);
      return json ? JSON.parse(json) : [];
    } catch {
      return [];
    }
  },

  async setDevices(devices: Device[]): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.DEVICES, JSON.stringify(devices));
    } catch {}
  },

  async addDevice(device: Device): Promise<void> {
    const devices = await this.getDevices();
    devices.push(device);
    await this.setDevices(devices);
  },

  async updateDevice(device: Device): Promise<void> {
    const devices = await this.getDevices();
    const index = devices.findIndex(d => d.id === device.id);
    if (index !== -1) {
      devices[index] = device;
      await this.setDevices(devices);
    }
  },

  async deleteDevice(id: string): Promise<void> {
    const devices = await this.getDevices();
    await this.setDevices(devices.filter(d => d.id !== id));
  },

  async getServices(): Promise<Service[]> {
    try {
      const json = await AsyncStorage.getItem(KEYS.SERVICES);
      return json ? JSON.parse(json) : [];
    } catch {
      return [];
    }
  },

  async setServices(services: Service[]): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.SERVICES, JSON.stringify(services));
    } catch {}
  },

  async addService(service: Service): Promise<void> {
    const services = await this.getServices();
    services.push(service);
    await this.setServices(services);
  },

  async updateService(service: Service): Promise<void> {
    const services = await this.getServices();
    const index = services.findIndex(s => s.id === service.id);
    if (index !== -1) {
      services[index] = service;
      await this.setServices(services);
    }
  },

  async deleteService(id: string): Promise<void> {
    const services = await this.getServices();
    await this.setServices(services.filter(s => s.id !== id));
  },

  async getMaintenances(): Promise<Maintenance[]> {
    try {
      const json = await AsyncStorage.getItem(KEYS.MAINTENANCES);
      return json ? JSON.parse(json) : [];
    } catch {
      return [];
    }
  },

  async setMaintenances(maintenances: Maintenance[]): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.MAINTENANCES, JSON.stringify(maintenances));
    } catch {}
  },

  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.multiRemove(Object.values(KEYS));
    } catch {}
  },
};

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
