/* eslint-disable
  no-console,
  @typescript-eslint/naming-convention,
  no-nested-ternary
*/

import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || '')
  .split(',')
  .map((e) => e.trim().toLowerCase());

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

async function verifyAdminAuth(): Promise<{
  authorized: boolean;
  error?: string;
  userEmail?: string;
}> {
  try {
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll() {},
        },
      },
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { authorized: false, error: 'Unauthorized' };
    }

    const userEmail = user.email?.toLowerCase() || '';
    if (ADMIN_EMAILS.length > 0 && !ADMIN_EMAILS.includes(userEmail)) {
      return { authorized: false, error: 'Forbidden - Admin access required' };
    }

    return { authorized: true, userEmail };
  } catch (error) {
    console.error('Admin auth verification error:', error);
    return { authorized: false, error: 'Authentication failed' };
  }
}

export async function POST(request: Request) {
  const auth = await verifyAdminAuth();
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      product_size_id,
      product_id,
      product_name,
      product_size,
      quantity_change,
      movement_type,
      notes,
    } = body;

    if (!product_size_id || quantity_change === undefined || !movement_type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    const { data: currentStock, error: fetchError } = await supabaseAdmin
      .from('products_sizes')
      .select('stock')
      .eq('id', product_size_id)
      .single();

    if (fetchError || !currentStock) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const newStock = currentStock.stock + quantity_change;

    if (newStock < 0) {
      return NextResponse.json(
        { error: 'Insufficient stock. Cannot reduce below 0.' },
        { status: 400 },
      );
    }

    const { error: updateError } = await supabaseAdmin
      .from('products_sizes')
      .update({ stock: newStock })
      .eq('id', product_size_id);

    if (updateError) {
      console.error('Error updating stock:', updateError);
      return NextResponse.json(
        { error: 'Failed to update stock' },
        { status: 500 },
      );
    }

    const { error: movementError } = await supabaseAdmin
      .from('stock_movements')
      .insert({
        product_id,
        product_size_id,
        product_name,
        product_size,
        quantity_change,
        movement_type,
        balance_after: newStock,
        notes,
        created_by: auth.userEmail || 'admin',
      });

    if (movementError) {
      console.error('Error recording movement:', movementError);
    }

    return NextResponse.json({
      success: true,
      balance_after: newStock,
      message: `Stock ${movement_type === 'IN' ? 'added' : movement_type === 'OUT' ? 'removed' : 'adjusted'} successfully`,
    });
  } catch (error) {
    console.error('Stock adjust API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
