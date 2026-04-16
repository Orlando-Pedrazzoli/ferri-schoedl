// src/models/PendingOtp.ts
import mongoose, { Schema, Model, Document } from 'mongoose';

export interface IPendingOtpDocument extends Document {
  email: string;
  name: string;
  otpCode: string;
  otpExpires: Date;
  otpAttempts: number;
  createdAt: Date;
  updatedAt: Date;
}

const PendingOtpSchema = new Schema<IPendingOtpDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    otpCode: {
      type: String,
      required: true,
    },
    otpExpires: {
      type: Date,
      required: true,
    },
    otpAttempts: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

// TTL: documentos expiram automaticamente após 1 hora (segurança extra)
PendingOtpSchema.index({ createdAt: 1 }, { expireAfterSeconds: 3600 });

const PendingOtp: Model<IPendingOtpDocument> =
  mongoose.models.PendingOtp ||
  mongoose.model<IPendingOtpDocument>('PendingOtp', PendingOtpSchema);

export default PendingOtp;
