import mongoose, { Schema, Document, Model, Types } from 'mongoose';

// --- Tipos ---

export type PaymentMethod = 'credit_card' | 'boleto' | 'pix';

export type OrderStatus =
  | 'pendente'
  | 'pago'
  | 'preparando'
  | 'enviado'
  | 'entregue'
  | 'cancelado'
  | 'falhou';

export type PaymentStatus =
  | 'pending'
  | 'paid'
  | 'failed'
  | 'canceled'
  | 'chargedback';

// --- Interfaces ---

export interface IOrderItem {
  bookId: Types.ObjectId;
  slug: string;
  title: string;
  price: number; // preco unitario em reais
  quantity: number;
  weight: number; // peso unitario em gramas
}

export interface IOrderAddress {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  cep: string;
}

export interface IOrderShipping {
  method: 'PAC' | 'SEDEX';
  price: number;
  estimatedDays: string;
  trackingCode?: string;
  address: IOrderAddress;
}

export interface IOrderPayment {
  method: PaymentMethod;
  status: PaymentStatus;
  pagarmeOrderId?: string;
  pagarmeChargeId?: string;
  installments?: number;
  cardLastDigits?: string;
  cardBrand?: string;
  boletoUrl?: string;
  boletoBarcode?: string;
  boletoDueDate?: Date;
  pixQrCode?: string;
  pixQrCodeUrl?: string;
  pixExpiresAt?: Date;
  paidAt?: Date;
}

export interface IOrderDocument extends Document {
  orderCode: string;
  customerId: Types.ObjectId;
  customerName: string;
  customerEmail: string;
  customerCpf: string;
  customerPhone: string;
  items: IOrderItem[];
  subtotal: number; // em reais
  shipping: IOrderShipping;
  total: number; // subtotal + shipping.price
  payment: IOrderPayment;
  status: OrderStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// --- Schemas ---

const OrderItemSchema = new Schema<IOrderItem>(
  {
    bookId: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
    slug: { type: String, required: true },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    weight: { type: Number, required: true },
  },
  { _id: false },
);

const OrderAddressSchema = new Schema<IOrderAddress>(
  {
    street: { type: String, required: true, trim: true },
    number: { type: String, required: true, trim: true },
    complement: { type: String, trim: true, default: '' },
    neighborhood: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true, maxlength: 2 },
    cep: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const OrderShippingSchema = new Schema<IOrderShipping>(
  {
    method: { type: String, enum: ['PAC', 'SEDEX'], required: true },
    price: { type: Number, required: true },
    estimatedDays: { type: String, required: true },
    trackingCode: { type: String, default: '' },
    address: { type: OrderAddressSchema, required: true },
  },
  { _id: false },
);

const OrderPaymentSchema = new Schema<IOrderPayment>(
  {
    method: {
      type: String,
      enum: ['credit_card', 'boleto', 'pix'],
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'canceled', 'chargedback'],
      default: 'pending',
    },
    pagarmeOrderId: { type: String, default: '' },
    pagarmeChargeId: { type: String, default: '' },
    installments: { type: Number, default: 1 },
    cardLastDigits: { type: String, default: '' },
    cardBrand: { type: String, default: '' },
    boletoUrl: { type: String, default: '' },
    boletoBarcode: { type: String, default: '' },
    boletoDueDate: { type: Date },
    pixQrCode: { type: String, default: '' },
    pixQrCodeUrl: { type: String, default: '' },
    pixExpiresAt: { type: Date },
    paidAt: { type: Date },
  },
  { _id: false },
);

const OrderSchema = new Schema<IOrderDocument>(
  {
    orderCode: {
      type: String,
      required: true,
      unique: true,
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: 'Customer',
      required: true,
    },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    customerCpf: { type: String, required: true },
    customerPhone: { type: String, required: true },
    items: {
      type: [OrderItemSchema],
      required: true,
      validate: [
        (v: IOrderItem[]) => v.length > 0,
        'Pedido deve ter pelo menos 1 item',
      ],
    },
    subtotal: { type: Number, required: true },
    shipping: { type: OrderShippingSchema, required: true },
    total: { type: Number, required: true },
    payment: { type: OrderPaymentSchema, required: true },
    status: {
      type: String,
      enum: [
        'pendente',
        'pago',
        'preparando',
        'enviado',
        'entregue',
        'cancelado',
        'falhou',
      ],
      default: 'pendente',
    },
    notes: { type: String, default: '' },
  },
  {
    timestamps: true,
  },
);

// --- Indices ---
OrderSchema.index({ orderCode: 1 });
OrderSchema.index({ customerId: 1 });
OrderSchema.index({ 'payment.pagarmeOrderId': 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ createdAt: -1 });

// --- Gerar orderCode unico ---
OrderSchema.pre('validate', async function () {
  if (!this.orderCode) {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = 'FS-';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    this.orderCode = code;
  }
});

const Order: Model<IOrderDocument> =
  mongoose.models.Order || mongoose.model<IOrderDocument>('Order', OrderSchema);

export default Order;
