// lib/actions/orders.ts
'use server';

import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { db } from '@/lib/db';
import { orders, orderItems, users } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import ImageKit from 'imagekit';

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
});

const createOrderSchema = z.object({
  total: z.number().positive('El total debe ser mayor a 0'),
  status: z.string().min(1, 'El estado es requerido'),
  customerEmail: z.string().email('Email inválido'),
  customerName: z.string().optional(),
  phone: z.string().optional(),
  country: z.string().optional(),
  cardNumber: z.string().optional(),
  paymentProof: z.string().optional(),
  paymentMethod: z.string().optional(),
  paypalOrderId: z.string().optional(),
  additionalInfo: z.string().optional(),
});

const createOrderItemsSchema = z.object({
  orderId: z.number().positive('ID de pedido inválido'),
  items: z.array(z.object({
    name: z.string().min(1, 'El nombre del item es requerido'),
    price: z.number().positive('El precio debe ser mayor a 0'),
  })).min(1, 'Debe haber al menos un item')
});

interface OrderResponse {
  success: boolean;
  error?: string;
  orderId?: number;
  data?: any;
}

async function getUserIdFromTokenOptional(): Promise<number | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('authToken')?.value;
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as { userId: number };
    return decoded.userId;
  } catch {
    return null;
  }
}

async function getUserEmailFromToken(): Promise<string | null> {
  const userId = await getUserIdFromTokenOptional();
  if (!userId) return null;

  const user = await db.select({ email: users.email }).from(users).where(eq(users.id, userId)).limit(1);
  return user[0]?.email || null;
}

export async function createOrderAction(formData: FormData): Promise<OrderResponse> {
  try {
    const total = parseFloat(formData.get('total')?.toString() || '0');
    const status = formData.get('status')?.toString() || '';
    const customerEmail = formData.get('customerEmail')?.toString() || '';
    const customerName = formData.get('customerName')?.toString() || '';
    const file = formData.get('file') as File;
    const paymentMethod = formData.get('paymentMethod')?.toString() || undefined;
    const paypalOrderId = formData.get('paypalOrderId')?.toString() || undefined;
    const additionalInfo = formData.get('additionalInfo')?.toString() || undefined;

    let paymentProof: string | undefined;
    if (file) {
      if (file.size > 1024 * 1024) {
        return { success: false, error: 'File size must be less than 1MB' };
      }
      const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        return { success: false, error: 'Invalid file type. Only JPG, PNG, PDF allowed' };
      }
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const result = await imagekit.upload({
        file: buffer,
        fileName: file.name,
        folder: '/payment-proofs',
      });
      paymentProof = result.url;
    }

    const userId = await getUserIdFromTokenOptional();

    let finalCustomerEmail = customerEmail;
    if (userId && !finalCustomerEmail) {
      finalCustomerEmail = await getUserEmailFromToken() || '';
    }

    const validatedData = createOrderSchema.parse({
      total,
      status,
      customerEmail: finalCustomerEmail,
      customerName,
      paymentProof,
      paymentMethod,
      paypalOrderId,
      additionalInfo,
    });

    const result = await db.insert(orders).values({
      userId,
      customerEmail: validatedData.customerEmail,
      customerName: validatedData.customerName || null,
      total: validatedData.total,
      status: validatedData.status,
      paymentProof: validatedData.paymentProof,
      paymentMethod: validatedData.paymentMethod,
      paypalOrderId: validatedData.paypalOrderId,
      additionalInfo: validatedData.additionalInfo,
    }).returning({
      id: orders.id,
      userId: orders.userId,
      customerEmail: orders.customerEmail,
      customerName: orders.customerName,
      total: orders.total,
      status: orders.status,
      paymentProof: orders.paymentProof,
      paymentMethod: orders.paymentMethod,
      paypalOrderId: orders.paypalOrderId,
      additionalInfo: orders.additionalInfo,
    });

    return {
      success: true,
      data: { order: result[0] },
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0]?.message || 'Datos inválidos' };
    }
    console.error('Create order error:', error);
    return { success: false, error: 'Error creating order' };
  }
}

export async function createOrderItemsAction(formData: FormData): Promise<OrderResponse> {
  try {
    const orderId = parseInt(formData.get('orderId')?.toString() || '0');
    const itemsJson = formData.get('items')?.toString() || '[]';

    let items: Array<{ name: string; price: number }>;
    try {
      items = JSON.parse(itemsJson);
    } catch {
      return { success: false, error: 'Invalid items format' };
    }

    const validatedData = createOrderItemsSchema.parse({ orderId, items });

    const orderExists = await db.select().from(orders).where(eq(orders.id, validatedData.orderId)).limit(1);
    if (orderExists.length === 0) {
      return { success: false, error: 'Order not found' };
    }

    const itemsToInsert = validatedData.items.map(item => ({
      orderId: validatedData.orderId,
      name: item.name,
      price: item.price,
    }));

    const result = await db.insert(orderItems).values(itemsToInsert).returning({
      id: orderItems.id,
      orderId: orderItems.orderId,
      name: orderItems.name,
      price: orderItems.price,
    });

    return {
      success: true,
      data: { items: result },
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0]?.message || 'Datos inválidos' };
    }
    console.error('Create order items error:', error);
    return { success: false, error: 'Error creating order items' };
  }
}

export async function getAllOrdersAction(): Promise<OrderResponse> {
  try {
    const ordersResult = await db.select({
      id: orders.id,
      userId: orders.userId,
      customerEmail: orders.customerEmail,
      customerName: orders.customerName,
      total: orders.total,
      status: orders.status,
      paymentProof: orders.paymentProof,
      paymentMethod: orders.paymentMethod,
      paypalOrderId: orders.paypalOrderId,
      additionalInfo: orders.additionalInfo,
    }).from(orders);

    // Get items for each order
    const ordersWithItems = await Promise.all(
      ordersResult.map(async (order) => {
        const items = await db.select({
          id: orderItems.id,
          name: orderItems.name,
          price: orderItems.price,
        }).from(orderItems).where(eq(orderItems.orderId, order.id));

        return { ...order, items };
      })
    );

    return {
      success: true,
      data: { orders: ordersWithItems },
    };
  } catch (error) {
    console.error('Get all orders error:', error);
    return { success: false, error: 'Error fetching orders' };
  }
}

export async function updateOrderStatusAction(formData: FormData): Promise<OrderResponse> {
  try {
    const orderId = parseInt(formData.get('orderId')?.toString() || '0');
    const status = formData.get('status')?.toString() || '';

    if (!orderId || !status) {
      return { success: false, error: 'Order ID and status are required' };
    }

    await db.update(orders).set({ status }).where(eq(orders.id, orderId));

    return {
      success: true,
    };
  } catch (error) {
    console.error('Update order status error:', error);
    return { success: false, error: 'Error updating order status' };
  }
}

export async function getUserOrdersAction(): Promise<OrderResponse> {
  try {
    const userId = await getUserIdFromTokenOptional();
    if (!userId) {
      return { success: false, error: 'User not authenticated' };
    }

    const ordersResult = await db.select({
      id: orders.id,
      userId: orders.userId,
      customerEmail: orders.customerEmail,
      customerName: orders.customerName,
      total: orders.total,
      status: orders.status,
      paymentProof: orders.paymentProof,
      paymentMethod: orders.paymentMethod,
      paypalOrderId: orders.paypalOrderId,
      additionalInfo: orders.additionalInfo,
      createdAt: orders.createdAt,
    }).from(orders).where(eq(orders.userId, userId));

    // Get items for each order
    const ordersWithItems = await Promise.all(
      ordersResult.map(async (order) => {
        const items = await db.select({
          id: orderItems.id,
          name: orderItems.name,
          price: orderItems.price,
          quantity: orderItems.quantity,
          image: orderItems.image,
        }).from(orderItems).where(eq(orderItems.orderId, order.id));

        return { ...order, items };
      })
    );

    return {
      success: true,
      data: { orders: ordersWithItems },
    };
  } catch (error) {
    console.error('Get user orders error:', error);
    return { success: false, error: 'Error fetching user orders' };
  }
}

export async function completeOrderAction(formData: FormData): Promise<OrderResponse> {
  try {
    const email = formData.get('email')?.toString() || '';
    const name = formData.get('name')?.toString() || '';
    const address = formData.get('address')?.toString() || '';
    const city = formData.get('city')?.toString() || '';
    const phone = formData.get('phone')?.toString() || '';
    const additionalInfo = formData.get('additionalInfo')?.toString() || '';
    const paymentMethod = formData.get('paymentMethod')?.toString() || 'transfer';
    const file = formData.get('file') as File;

    // Leer total del formulario (calculado en el checkout con descuentos)
    const total = parseFloat(formData.get('total')?.toString() || '0');

    // Verificar si usuario está logueado
    const userId = await getUserIdFromTokenOptional();

    let finalEmail = email;
    if (!userId) {
      // Registrar usuario automáticamente
      const tempPassword = Math.random().toString(36).slice(-8); // password temporal
      const hashedPassword = await bcrypt.hash(tempPassword, 12);

      // Verificar si email ya existe
      const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
      if (existingUser.length === 0) {
        const newUser = await db.insert(users).values({
          email,
          password: hashedPassword,
          name: name || null,
          address,
          city,
          department: null, // no en form
          whatsappNumber: phone,
        }).returning({ id: users.id });

        // Set cookie
        const token = jwt.sign(
          { userId: newUser[0].id, email, role: 'user' },
          process.env.JWT_SECRET || 'fallback-secret',
          { expiresIn: '7d' }
        );
        const cookieStore = await cookies();
        cookieStore.set('authToken', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: 60 * 60 * 24 * 7,
        });
      }
    } else {
      // Usuario logueado, usar su email
      const userEmail = await getUserEmailFromToken();
      if (userEmail) finalEmail = userEmail;
    }

    let paymentProofUrl: string | undefined;
    if (paymentMethod === 'transfer' && file) {
      if (file.size > 1024 * 1024) {
        return { success: false, error: 'File size must be less than 1MB' };
      }
      const allowedTypes = ['image/jpeg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        return { success: false, error: 'Invalid file type' };
      }
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const result = await imagekit.upload({
        file: buffer,
        fileName: file.name,
        folder: '/payment-proofs',
      });
      paymentProofUrl = result.url;
    }

    const validatedData = createOrderSchema.parse({
      total,
      status: 'pending',
      customerEmail: finalEmail,
      customerName: name,
      paymentProof: paymentProofUrl,
      paymentMethod,
      additionalInfo,
    });

    const finalUserId = await getUserIdFromTokenOptional();

    const result = await db.insert(orders).values({
      userId: finalUserId,
      customerEmail: validatedData.customerEmail,
      customerName: validatedData.customerName || null,
      customerPhone: validatedData.phone || null,
      country: validatedData.country || null,
      cardNumber: validatedData.cardNumber || null,
      total: validatedData.total,
      status: validatedData.status,
      paymentProof: validatedData.paymentProof,
      paymentMethod: validatedData.paymentMethod,
      additionalInfo: validatedData.additionalInfo,
    }).returning({ id: orders.id });

    // Insertar items reales desde el formData
    const itemsJson = formData.get('items')?.toString() || '[]';
    let itemsToInsert: Array<{
      orderId: number;
      name: string;
      price: number;
      quantity: number;
      image?: string | null;
    }> = [];

    try {
      const parsedItems = JSON.parse(itemsJson);
      itemsToInsert = parsedItems.map((item: any) => ({
        orderId: result[0].id,
        name: item.name,
        price: item.price,
        quantity: item.quantity || 1,
        image: item.image || null,
      }));
    } catch {
      // Si no hay items válidos, usar array vacío
      itemsToInsert = [];
    }

    if (itemsToInsert.length > 0) {
      await db.insert(orderItems).values(itemsToInsert);
    }

    return { success: true, orderId: result[0].id };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0]?.message || 'Datos inválidos' };
    }
    console.error('Complete order error:', error);
    return { success: false, error: 'Error al completar el pedido' };
  }
}