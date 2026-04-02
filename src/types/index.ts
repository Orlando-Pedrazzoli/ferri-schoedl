// ============================================================
// Types — Ferri Schoedl Advocacia
// ============================================================

// --- Books ---
export interface IBook {
  _id?: string;
  slug: string;
  title: string;
  subtitle?: string;
  author: string;
  coauthor: boolean;
  year: number;
  publisher: string;
  pages: number;
  isbn?: string;
  edition: string;
  price: number;
  originalPrice?: number;
  description: string;
  longDescription: string;
  topics: string[];
  dimensions: { width: number; height: number; depth: number; unit: string };
  weight: number;
  weightUnit: string;
  image: string;
  inStock: boolean;
  featured: boolean;
  saleType: 'direto' | 'editora';
  saleNote?: string;
  order: number;
  isActive: boolean;
}

// --- Articles ---
export interface IArticle {
  _id?: string;
  slug: string;
  title: string;
  author: string;
  year: number;
  journal?: string;
  abstract: string;
  pdfUrl?: string;
  externalUrl?: string;
  topics: string[];
  order: number;
  isActive: boolean;
}

// --- Courses ---
export interface ICourse {
  _id?: string;
  slug: string;
  title: string;
  description: string;
  longDescription: string;
  instructor: string;
  platform: string;
  platformUrl: string;
  duration: string;
  level: string;
  price: number;
  originalPrice?: number;
  image: string;
  topics: string[];
  isActive: boolean;
  order: number;
}

// --- Admin User ---
export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'editor';
  createdAt?: Date;
  updatedAt?: Date;
}

// --- Customer ---
export interface ICustomerAddress {
  _id?: string;
  label: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  cep: string;
  isDefault: boolean;
}

export interface ICustomer {
  _id?: string;
  name: string;
  email: string;
  password: string;
  cpf: string;
  phone: string;
  role: 'customer';
  emailVerified: boolean;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
  addresses: ICustomerAddress[];
  orders: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

// --- Site Content ---
export interface ISiteContent {
  _id?: string;
  key: string;
  page: string;
  section: string;
  field: string;
  value: string;
  type: 'text' | 'textarea' | 'richtext' | 'json';
  label: string;
  description?: string;
}

// --- Session (NextAuth extended) ---
export type UserRole = 'admin' | 'editor' | 'customer';

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  cpf?: string;
  phone?: string;
}
