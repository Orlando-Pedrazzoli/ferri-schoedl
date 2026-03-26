import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IArticleDocument extends Document {
  title: string;
  year: number;
  publisher: string;
  url?: string;
  coauthors: string[];
  description?: string;
  type: 'artigo' | 'capitulo';
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const ArticleSchema = new Schema<IArticleDocument>(
  {
    title: {
      type: String,
      required: [true, 'Título é obrigatório'],
      trim: true,
    },
    year: {
      type: Number,
      required: [true, 'Ano é obrigatório'],
    },
    publisher: {
      type: String,
      required: [true, 'Publicação é obrigatória'],
      trim: true,
    },
    url: {
      type: String,
      trim: true,
    },
    coauthors: [{ type: String, trim: true }],
    description: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      enum: ['artigo', 'capitulo'],
      default: 'artigo',
    },
    isActive: {
      type: Boolean,
      default: true,
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

ArticleSchema.index({ isActive: 1, year: -1 });

const Article: Model<IArticleDocument> =
  mongoose.models.Article ||
  mongoose.model<IArticleDocument>('Article', ArticleSchema);

export default Article;
