import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBookDocument extends Document {
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
  createdAt: Date;
  updatedAt: Date;
}

const BookSchema = new Schema<IBookDocument>(
  {
    slug: {
      type: String,
      required: [true, 'Slug é obrigatório'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    title: {
      type: String,
      required: [true, 'Título é obrigatório'],
      trim: true,
    },
    subtitle: {
      type: String,
      trim: true,
    },
    author: {
      type: String,
      required: [true, 'Autor é obrigatório'],
      trim: true,
    },
    coauthor: {
      type: Boolean,
      default: false,
    },
    year: {
      type: Number,
      required: [true, 'Ano é obrigatório'],
    },
    publisher: {
      type: String,
      required: [true, 'Editora é obrigatória'],
      trim: true,
    },
    pages: {
      type: Number,
      required: [true, 'Número de páginas é obrigatório'],
    },
    isbn: {
      type: String,
      trim: true,
    },
    edition: {
      type: String,
      required: [true, 'Edição é obrigatória'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Preço é obrigatório'],
      min: [0, 'Preço não pode ser negativo'],
    },
    originalPrice: {
      type: Number,
      min: [0, 'Preço original não pode ser negativo'],
    },
    description: {
      type: String,
      required: [true, 'Descrição é obrigatória'],
    },
    longDescription: {
      type: String,
      required: [true, 'Descrição longa é obrigatória'],
    },
    topics: [{ type: String, trim: true }],
    dimensions: {
      width: { type: Number, required: true },
      height: { type: Number, required: true },
      depth: { type: Number, required: true },
      unit: { type: String, default: 'cm' },
    },
    weight: {
      type: Number,
      required: true,
    },
    weightUnit: {
      type: String,
      default: 'g',
    },
    image: {
      type: String,
      required: [true, 'Imagem é obrigatória'],
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    saleType: {
      type: String,
      enum: ['direto', 'editora'],
      required: [true, 'Tipo de venda é obrigatório'],
    },
    saleNote: {
      type: String,
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

// Index for common queries
BookSchema.index({ isActive: 1, order: 1 });
BookSchema.index({ slug: 1 });
BookSchema.index({ featured: 1, isActive: 1 });

const Book: Model<IBookDocument> =
  mongoose.models.Book || mongoose.model<IBookDocument>('Book', BookSchema);

export default Book;
