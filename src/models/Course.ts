import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICourseModuleDoc {
  title: string;
  description: string;
  lessons: string[];
  duration: string;
}

export interface ICourseDocument extends Document {
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
  modules: ICourseModuleDoc[];
  level: 'iniciante' | 'intermediario' | 'avancado';
  category: string;
  topics: string[];
  featured: boolean;
  isActive: boolean;
  status: 'rascunho' | 'publicado' | 'arquivado';
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const CourseModuleSchema = new Schema<ICourseModuleDoc>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    lessons: [{ type: String, trim: true }],
    duration: { type: String, trim: true },
  },
  { _id: false },
);

const CourseSchema = new Schema<ICourseDocument>(
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
    description: {
      type: String,
      required: [true, 'Descrição é obrigatória'],
    },
    longDescription: {
      type: String,
      required: [true, 'Descrição longa é obrigatória'],
    },
    instructor: {
      type: String,
      default: 'Dr. Thales Ferri Schoedl',
      trim: true,
    },
    image: {
      type: String,
      required: [true, 'Imagem é obrigatória'],
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
    duration: {
      type: String,
      required: [true, 'Duração é obrigatória'],
      trim: true,
    },
    modules: [CourseModuleSchema],
    level: {
      type: String,
      enum: ['iniciante', 'intermediario', 'avancado'],
      default: 'intermediario',
    },
    category: {
      type: String,
      required: [true, 'Categoria é obrigatória'],
      trim: true,
    },
    topics: [{ type: String, trim: true }],
    featured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ['rascunho', 'publicado', 'arquivado'],
      default: 'rascunho',
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

CourseSchema.index({ isActive: 1, status: 1, order: 1 });
CourseSchema.index({ slug: 1 });

const Course: Model<ICourseDocument> =
  mongoose.models.Course ||
  mongoose.model<ICourseDocument>('Course', CourseSchema);

export default Course;
