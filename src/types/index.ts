// ===== DATABASE MODEL TYPES =====

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'editor';
  createdAt?: Date;
  updatedAt?: Date;
}

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
  dimensions: {
    width: number;
    height: number;
    depth: number;
    unit: string;
  };
  weight: number;
  weightUnit: string;
  image: string;
  inStock: boolean;
  featured: boolean;
  saleType: 'direto' | 'editora';
  saleNote?: string;
  order: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICourse {
  _id?: string;
  slug: string;
  title: string;
  subtitle?: string;
  description: string;
  longDescription: string;
  instructor: string;
  image: string;
  price: number;
  originalPrice?: number;
  duration: string;
  modules: ICourseModule[];
  level: 'iniciante' | 'intermediario' | 'avancado';
  category: string;
  topics: string[];
  featured: boolean;
  isActive: boolean;
  status: 'rascunho' | 'publicado' | 'arquivado';
  order: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICourseModule {
  title: string;
  description: string;
  lessons: string[];
  duration: string;
}

export interface IArticle {
  _id?: string;
  title: string;
  year: number;
  publisher: string;
  url?: string;
  coauthors?: string[];
  description?: string;
  type: 'artigo' | 'capitulo';
  isActive: boolean;
  order: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ISiteContent {
  _id?: string;
  key: string; // e.g. "home.hero.title", "sobre.bio.text"
  page: string; // e.g. "home", "sobre", "faq"
  section: string; // e.g. "hero", "bio", "stats"
  field: string; // e.g. "title", "subtitle", "text"
  value: string;
  type: 'text' | 'textarea' | 'richtext' | 'json';
  label: string; // human-readable label for admin UI
  description?: string; // help text for the admin
  updatedAt?: Date;
  updatedBy?: string;
}

// ===== API RESPONSE TYPES =====

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// ===== FORM TYPES =====

export interface BookFormData {
  slug: string;
  title: string;
  subtitle: string;
  author: string;
  coauthor: boolean;
  year: number;
  publisher: string;
  pages: number;
  isbn: string;
  edition: string;
  price: number;
  originalPrice: number;
  description: string;
  longDescription: string;
  topics: string;
  dimensions: {
    width: number;
    height: number;
    depth: number;
    unit: string;
  };
  weight: number;
  weightUnit: string;
  image: string;
  inStock: boolean;
  featured: boolean;
  saleType: 'direto' | 'editora';
  saleNote: string;
  order: number;
  isActive: boolean;
}

export interface CourseFormData {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  longDescription: string;
  instructor: string;
  image: string;
  price: number;
  originalPrice: number;
  duration: string;
  modules: ICourseModule[];
  level: 'iniciante' | 'intermediario' | 'avancado';
  category: string;
  topics: string;
  featured: boolean;
  isActive: boolean;
  status: 'rascunho' | 'publicado' | 'arquivado';
  order: number;
}

export interface ArticleFormData {
  title: string;
  year: number;
  publisher: string;
  url: string;
  coauthors: string;
  description: string;
  type: 'artigo' | 'capitulo';
  isActive: boolean;
  order: number;
}

// ===== SESSION TYPES =====

export interface AdminSession {
  user: {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'editor';
  };
}
