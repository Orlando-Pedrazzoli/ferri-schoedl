import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISiteContentDocument extends Document {
  key: string;
  page: string;
  section: string;
  field: string;
  value: string;
  type: 'text' | 'textarea' | 'richtext' | 'json';
  label: string;
  description?: string;
  updatedAt: Date;
  updatedBy?: string;
}

const SiteContentSchema = new Schema<ISiteContentDocument>(
  {
    key: {
      type: String,
      required: [true, 'Chave é obrigatória'],
      unique: true,
      trim: true,
    },
    page: {
      type: String,
      required: [true, 'Página é obrigatória'],
      trim: true,
      index: true,
    },
    section: {
      type: String,
      required: [true, 'Secção é obrigatória'],
      trim: true,
    },
    field: {
      type: String,
      required: [true, 'Campo é obrigatório'],
      trim: true,
    },
    value: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      enum: ['text', 'textarea', 'richtext', 'json'],
      default: 'text',
    },
    label: {
      type: String,
      required: [true, 'Label é obrigatório'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    updatedBy: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

SiteContentSchema.index({ page: 1, section: 1 });
SiteContentSchema.index({ key: 1 });

const SiteContent: Model<ISiteContentDocument> =
  mongoose.models.SiteContent ||
  mongoose.model<ISiteContentDocument>('SiteContent', SiteContentSchema);

export default SiteContent;
