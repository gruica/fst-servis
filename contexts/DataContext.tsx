import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Customer, Device, Service, Maintenance } from "./types";
import { storage, generateId } from "../utils/storage";
import { sendServiceStatusNotification, sendNewServiceNotification } from "../utils/notifications";
import { customersApi, servicesApi } from "../utils/api";

interface DataContextType {
  customers: Customer[];
  devices: Device[];
  services: Service[];
  maintenances: Maintenance[];
  isLoading: boolean;
  refreshData: () => Promise<void>;
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt'>) => Promise<Customer>;
  updateCustomer: (customer: Customer) => Promise<void>;
  deleteCustomer: (id: string) => Promise<void>;
  addDevice: (device: Omit<Device, 'id'>) => Promise<Device>;
  updateDevice: (device: Device) => Promise<void>;
  deleteDevice: (id: string) => Promise<void>;
  addService: (service: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Service>;
  updateService: (service: Service) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
  getCustomerById: (id: string) => Customer | undefined;
  getDeviceById: (id: string) => Device | undefined;
  getDevicesByCustomer: (customerId: string) => Device[];
  getServicesByCustomer: (customerId: string) => Service[];
  getServicesByStatus: (status: Service['status']) => Service[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const SAMPLE_CUSTOMERS: Customer[] = [
  { id: '1', name: 'Jovan Jovanović', phone: '+382 67 111 222', email: 'jovan@email.com', address: 'Ulica Slobode 15, Podgorica', createdAt: '2024-01-15' },
  { id: '2', name: 'Ana Marković', phone: '+382 68 333 444', email: 'ana.m@email.com', address: 'Bulevar Revolucije 42, Nikšić', createdAt: '2024-02-20' },
  { id: '3', name: 'Petar Petrović', phone: '+382 69 555 666', address: 'Hercegovačka 8, Bar', createdAt: '2024-03-10' },
  { id: '4', name: 'Milica Đurović', phone: '+382 67 777 888', email: 'milica.dj@email.com', address: 'Jovana Tomaševića 22, Budva', createdAt: '2024-04-05' },
];

const SAMPLE_DEVICES: Device[] = [
  { id: '1', customerId: '1', type: 'washing_machine', brand: 'Beko', model: 'WTV 8612 XS', serialNumber: 'WM123456', purchaseDate: '2022-06-15' },
  { id: '2', customerId: '1', type: 'refrigerator', brand: 'Gorenje', model: 'NRK 6192 AW', serialNumber: 'RF789012' },
  { id: '3', customerId: '2', type: 'dishwasher', brand: 'Bosch', model: 'SMS46GI55E', purchaseDate: '2023-01-10' },
  { id: '4', customerId: '3', type: 'air_conditioner', brand: 'Daikin', model: 'FTXM35R', serialNumber: 'AC345678' },
  { id: '5', customerId: '4', type: 'oven', brand: 'Electrolux', model: 'EOD5H40X' },
];

const SAMPLE_SERVICES: Service[] = [
  { id: '1', customerId: '1', deviceId: '1', technicianId: '2', status: 'pending', priority: 'high', description: 'Veš mašina ne centrifugira, pravi buku', createdAt: '2024-11-20', updatedAt: '2024-11-20', scheduledDate: '2024-11-25' },
  { id: '2', customerId: '2', deviceId: '3', technicianId: '2', status: 'in_progress', priority: 'medium', description: 'Mašina za sudove ne zagreva vodu', diagnosis: 'Neispravan grejač', createdAt: '2024-11-18', updatedAt: '2024-11-22' },
  { id: '3', customerId: '3', deviceId: '4', status: 'pending', priority: 'low', description: 'Redovan servis klima uređaja', createdAt: '2024-11-21', updatedAt: '2024-11-21' },
  { id: '4', customerId: '1', deviceId: '2', technicianId: '2', status: 'completed', priority: 'urgent', description: 'Frižider ne hladi', diagnosis: 'Curenje freona', solution: 'Dopunjen freon, popravljena cijev', cost: 85, createdAt: '2024-11-10', updatedAt: '2024-11-12', completedDate: '2024-11-12' },
  { id: '5', customerId: '4', deviceId: '5', status: 'cancelled', priority: 'medium', description: 'Rerna se ne uključuje', createdAt: '2024-11-15', updatedAt: '2024-11-16' },
];

export function DataProvider({ children }: { children: ReactNode }) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [maintenances, setMaintenances] = useState<Maintenance[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Pokušaj da učita sa backend API-ja
      const [customersRes, servicesRes] = await Promise.all([
        customersApi.list(),
        servicesApi.list(),
      ]);

      if (customersRes.success && customersRes.data) {
        setCustomers(customersRes.data as Customer[]);
      } else {
        // Fallback na lokalno skladištenje
        const [loadedCustomers, loadedDevices, loadedServices, loadedMaintenances] = await Promise.all([
          storage.getCustomers(),
          storage.getDevices(),
          storage.getServices(),
          storage.getMaintenances(),
        ]);

        if (loadedCustomers.length === 0) {
          await storage.setCustomers(SAMPLE_CUSTOMERS);
          await storage.setDevices(SAMPLE_DEVICES);
          await storage.setServices(SAMPLE_SERVICES);
          setCustomers(SAMPLE_CUSTOMERS);
          setDevices(SAMPLE_DEVICES);
          setServices(SAMPLE_SERVICES);
        } else {
          setCustomers(loadedCustomers);
          setDevices(loadedDevices);
          setServices(loadedServices);
        }
        setMaintenances(loadedMaintenances);
      }

      if (servicesRes.success && servicesRes.data) {
        setServices(servicesRes.data as Service[]);
      }
    } catch {
      // Fallback na lokalno skladištenje
      const [loadedCustomers, loadedDevices, loadedServices, loadedMaintenances] = await Promise.all([
        storage.getCustomers(),
        storage.getDevices(),
        storage.getServices(),
        storage.getMaintenances(),
      ]);
      setCustomers(loadedCustomers);
      setDevices(loadedDevices);
      setServices(loadedServices);
      setMaintenances(loadedMaintenances);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const refreshData = async () => {
    await loadData();
  };

  const addCustomer = async (data: Omit<Customer, 'id' | 'createdAt'>): Promise<Customer> => {
    // Pokušaj sa API-jem
    const apiRes = await customersApi.create(data as any);
    if (apiRes.success && apiRes.data) {
      const customer = apiRes.data as Customer;
      setCustomers(prev => [...prev, customer]);
      return customer;
    }

    // Fallback na lokalno skladištenje
    const customer: Customer = {
      ...data,
      id: generateId(),
      createdAt: new Date().toISOString().split('T')[0],
    };
    await storage.addCustomer(customer);
    setCustomers(prev => [...prev, customer]);
    return customer;
  };

  const updateCustomer = async (customer: Customer) => {
    // Pokušaj sa API-jem
    await customersApi.update(customer.id, customer);
    // I lokalno
    await storage.updateCustomer(customer);
    setCustomers(prev => prev.map(c => c.id === customer.id ? customer : c));
  };

  const deleteCustomer = async (id: string) => {
    await customersApi.delete(id);
    await storage.deleteCustomer(id);
    setCustomers(prev => prev.filter(c => c.id !== id));
  };

  const addDevice = async (data: Omit<Device, 'id'>): Promise<Device> => {
    const device: Device = { ...data, id: generateId() };
    await storage.addDevice(device);
    setDevices(prev => [...prev, device]);
    return device;
  };

  const updateDevice = async (device: Device) => {
    await storage.updateDevice(device);
    setDevices(prev => prev.map(d => d.id === device.id ? device : d));
  };

  const deleteDevice = async (id: string) => {
    await storage.deleteDevice(id);
    setDevices(prev => prev.filter(d => d.id !== id));
  };

  const addService = async (data: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>): Promise<Service> => {
    const apiRes = await servicesApi.create(data);
    let service: Service;
    
    if (apiRes.success && apiRes.data) {
      service = apiRes.data as Service;
    } else {
      const now = new Date().toISOString().split('T')[0];
      service = {
        ...data,
        id: generateId(),
        createdAt: now,
        updatedAt: now,
      };
      await storage.addService(service);
    }
    
    setServices(prev => [...prev, service]);
    
    const customer = customers.find(c => c.id === data.customerId);
    const device = devices.find(d => d.id === data.deviceId);
    if (customer && device) {
      try {
        await sendNewServiceNotification(
          service.id,
          customer.name,
          `${device.brand} ${device.model}`
        );
      } catch (error) {
        console.log('Failed to send new service notification:', error);
      }
    }
    
    return service;
  };

  const updateService = async (service: Service) => {
    const existingService = services.find(s => s.id === service.id);
    const updated = { ...service, updatedAt: new Date().toISOString().split('T')[0] };
    await servicesApi.update(updated.id, updated);
    await storage.updateService(updated);
    setServices(prev => prev.map(s => s.id === updated.id ? updated : s));
    
    if (existingService && existingService.status !== service.status) {
      const customer = customers.find(c => c.id === service.customerId);
      if (customer) {
        try {
          await sendServiceStatusNotification(
            service.id,
            customer.name,
            service.status
          );
        } catch (error) {
          console.log('Failed to send status notification:', error);
        }
      }
    }
  };

  const deleteService = async (id: string) => {
    await servicesApi.delete(id);
    await storage.deleteService(id);
    setServices(prev => prev.filter(s => s.id !== id));
  };

  const getCustomerById = (id: string) => customers.find(c => c.id === id);
  const getDeviceById = (id: string) => devices.find(d => d.id === id);
  const getDevicesByCustomer = (customerId: string) => devices.filter(d => d.customerId === customerId);
  const getServicesByCustomer = (customerId: string) => services.filter(s => s.customerId === customerId);
  const getServicesByStatus = (status: Service['status']) => services.filter(s => s.status === status);

  return (
    <DataContext.Provider
      value={{
        customers,
        devices,
        services,
        maintenances,
        isLoading,
        refreshData,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        addDevice,
        updateDevice,
        deleteDevice,
        addService,
        updateService,
        deleteService,
        getCustomerById,
        getDeviceById,
        getDevicesByCustomer,
        getServicesByCustomer,
        getServicesByStatus,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
