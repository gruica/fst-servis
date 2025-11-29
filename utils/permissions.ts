import { User } from "./types";

export type Permission =
  | 'view_all_customers'
  | 'create_customers'
  | 'edit_customers'
  | 'delete_customers'
  | 'view_all_services'
  | 'create_services'
  | 'edit_services'
  | 'delete_services'
  | 'manage_technicians'
  | 'manage_partners'
  | 'view_reports'
  | 'manage_devices'
  | 'manage_maintenance';

export const ROLE_PERMISSIONS: Record<User['role'], Permission[]> = {
  admin: [
    'view_all_customers',
    'create_customers',
    'edit_customers',
    'delete_customers',
    'view_all_services',
    'create_services',
    'edit_services',
    'delete_services',
    'manage_technicians',
    'manage_partners',
    'view_reports',
    'manage_devices',
    'manage_maintenance',
  ],
  technician: [
    'view_all_customers',
    'create_customers',
    'view_all_services',
    'create_services',
    'edit_services',
    'manage_devices',
  ],
  business_partner: [
    'create_customers', // Kreiraju samo svoje klijente
    'view_all_customers', // Ali vide samo svoje
    'create_services', // Kreiraju servise za svoje klijente
    'view_all_services', // Ali vide samo svoje
    'manage_devices', // Upravljaju uređajima svojih klijenata
  ],
  supplier: [
    'view_reports', // Samo pregled izvještaja
  ],
};

export const BUSINESS_PARTNER_CAPABILITIES = {
  customer_management: {
    title: 'Upravljanje Klijentima',
    features: [
      'Kreiranje novih klijenata',
      'Pregled samo svojih klijenata',
      'Ažuriranje podataka o klijentima',
      'Dodavanje beleški i kontaktnih informacija',
    ],
  },
  device_management: {
    title: 'Upravljanje Uređajima',
    features: [
      'Registracija uređaja za svoje klijente',
      'Praćenje serijskih brojeva',
      'Upravljanje garancijom',
      'QR kod skeniranje (na mobilnom)',
    ],
  },
  service_creation: {
    title: 'Kreiranje Zahtjeva za Servis',
    features: [
      'Kreiranje novih zahtjeva za servis',
      'Dodavanje problema i opisa',
      'Praćenje statusa servisa',
      'Dodavanje fotografija dokumentacije',
      'Praćenje troškova servisa',
    ],
  },
  monitoring: {
    title: 'Monitoring i Praćenje',
    features: [
      'Push notifikacije za promene statusa',
      'Email obaveštenja',
      'Pregled istorije servisa',
      'Analiza troškova po klijentu',
    ],
  },
};

export const BUSINESS_PARTNER_RESTRICTIONS = [
  'Mogu videti samo servise koje su sami kreirali',
  'Mogu videti samo klijente koje su sami dodali',
  'Ne mogu pristupiti servisima drugih partnera',
  'Ne mogu videti interne izvještaje',
  'Ne mogu upravljati tehnicijarima',
  'Ne mogu upravljati drugim partnerima',
];

export function hasPermission(user: User | null, permission: Permission): boolean {
  if (!user) return false;
  const userPermissions = ROLE_PERMISSIONS[user.role];
  return userPermissions.includes(permission);
}

export function hasAnyPermission(user: User | null, permissions: Permission[]): boolean {
  if (!user) return false;
  const userPermissions = ROLE_PERMISSIONS[user.role];
  return permissions.some(p => userPermissions.includes(p));
}

export function hasAllPermissions(user: User | null, permissions: Permission[]): boolean {
  if (!user) return false;
  const userPermissions = ROLE_PERMISSIONS[user.role];
  return permissions.every(p => userPermissions.includes(p));
}

export function canManageBusinessPartners(user: User | null): boolean {
  return hasPermission(user, 'manage_partners');
}

export function canViewAllData(user: User | null): boolean {
  return user?.role === 'admin' || user?.role === 'technician';
}
