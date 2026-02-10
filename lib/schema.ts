// lib/schema.ts
import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').unique().notNull(),
  password: text('password').notNull(),
  name: text('name'),
  address: text('address'),
  city: text('city'),
  department: text('department'),
  whatsappNumber: text('whatsapp_number'),
  role: text('role').notNull().default('user'),
  resetToken: text('reset_token'),
  resetTokenExpires: integer('reset_token_expires'),
  createdAt: integer('created_at').default(Date.now()),
});

export const products = sqliteTable('products', {
  id: text('id').primaryKey(), // Using text ID for flexibility (e.g. UUID or custom slug)
  name: text('name').notNull(),
  description: text('description'),
  price: real('price').notNull(),
  image: text('image').notNull(),
  category: text('category').notNull().default('General'),
  stock: integer('stock').default(0),
  active: integer('active').default(1),
  // Storing arrays as JSON strings if needed, or relation tables
});

export const orders = sqliteTable('orders', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').references(() => users.id), // Nullable for guest checkout
  customerEmail: text('customer_email').notNull(),
  customerName: text('customer_name'),
  customerPhone: text('customer_phone'),
  country: text('country'),
  cardNumber: text('card_number'),
  address: text('address'),
  city: text('city'),
  department: text('department'),
  total: real('total').notNull(),
  status: text('status').notNull().default('pending'), // pending, paid, shipped, delivered, cancelled
  paymentProof: text('payment_proof'),
  paymentMethod: text('payment_method'),
  paypalOrderId: text('paypal_order_id'),
  additionalInfo: text('additional_info'),
  createdAt: integer('created_at').default(Date.now()),
  updatedAt: integer('updated_at').default(Date.now()),
});

export const orderItems = sqliteTable('order_items', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  orderId: integer('order_id').references(() => orders.id).notNull(),
  productId: text('product_id').references(() => products.id),
  name: text('name').notNull(),
  price: real('price').notNull(),
  quantity: integer('quantity').notNull().default(1),
  color: text('color'),
  size: text('size'),
  brand: text('brand'),
  image: text('image'),
});

export const behavior = sqliteTable('behavior', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  scroll: real('scroll').notNull(),
  time: integer('time').notNull(),
  clicks: integer('clicks').notNull(),
  ctaSeen: integer('cta_seen').default(0),
  converted: integer('converted').default(0),
  sessionId: text('session_id'),
  timestamp: integer('timestamp').default(Date.now()),
});