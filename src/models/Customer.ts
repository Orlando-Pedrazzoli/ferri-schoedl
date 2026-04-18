// src/models/Customer.ts
import mongoose, { Schema, Document, Model, Types } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IAddress {
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

export interface ICustomerDocument extends Document {
  name: string;
  email: string;
  password: string;
  cpf: string;
  phone: string;
  role: 'customer';
  emailVerified: boolean;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
  // --- OTP de checkout ---
  otpCode?: string;
  otpExpires?: Date;
  otpAttempts?: number;
  // --- Flag de senha definida pelo usuario ---
  hasPassword: boolean;
  // --- Snooze do banner de criacao de senha ---
  passwordReminderSnoozedUntil?: Date;
  // -------------------------------------------
  addresses: IAddress[];
  orders: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const AddressSchema = new Schema<IAddress>(
  {
    label: { type: String, required: true, trim: true },
    street: { type: String, required: true, trim: true },
    number: { type: String, required: true, trim: true },
    complement: { type: String, trim: true, default: '' },
    neighborhood: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true, maxlength: 2 },
    cep: { type: String, required: true, trim: true },
    isDefault: { type: Boolean, default: false },
  },
  { _id: true },
);

const CustomerSchema = new Schema<ICustomerDocument>(
  {
    name: {
      type: String,
      required: [true, 'Nome é obrigatório'],
      trim: true,
      minlength: [2, 'Nome deve ter pelo menos 2 caracteres'],
      maxlength: [100, 'Nome deve ter no máximo 100 caracteres'],
    },
    email: {
      type: String,
      required: [true, 'Email é obrigatório'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Email inválido'],
    },
    password: {
      type: String,
      required: [true, 'Password é obrigatória'],
      minlength: [8, 'Password deve ter pelo menos 8 caracteres'],
      select: false,
    },
    cpf: {
      type: String,
      required: [true, 'CPF é obrigatório'],
      unique: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Telefone é obrigatório'],
      trim: true,
    },
    role: {
      type: String,
      enum: ['customer'],
      default: 'customer',
      immutable: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: {
      type: String,
      select: false,
    },
    emailVerificationExpires: {
      type: Date,
      select: false,
    },
    otpCode: {
      type: String,
      select: false,
    },
    otpExpires: {
      type: Date,
      select: false,
    },
    otpAttempts: {
      type: Number,
      default: 0,
      select: false,
    },
    // Indica se o customer definiu uma senha propria.
    // false = conta criada via OTP com senha aleatoria interna (deve criar senha)
    // true = customer definiu senha (via /conta/registro ou banner pos-compra)
    hasPassword: {
      type: Boolean,
      default: false,
    },
    passwordReminderSnoozedUntil: {
      type: Date,
    },
    addresses: {
      type: [AddressSchema],
      default: [],
    },
    orders: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Order',
      },
    ],
  },
  {
    timestamps: true,
  },
);

CustomerSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

CustomerSchema.methods.comparePassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

CustomerSchema.index({ email: 1 });
CustomerSchema.index({ cpf: 1 });
CustomerSchema.index({ createdAt: -1 });

const Customer: Model<ICustomerDocument> =
  mongoose.models.Customer ||
  mongoose.model<ICustomerDocument>('Customer', CustomerSchema);

export default Customer;
