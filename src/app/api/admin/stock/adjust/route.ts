import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
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
        { status: 400 }
      );
    }

    const { data: currentStock, error: fetchError } = await supabaseAdmin
      .from('products_sizes')
      .select('stock')
      .eq('id', product_size_id)
      .single();

    if (fetchError || !currentStock) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    const newStock = currentStock.stock + quantity_change;
    
    if (newStock < 0) {
      return NextResponse.json(
        { error: 'Insufficient stock. Cannot reduce below 0.' },
        { status: 400 }
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
        { status: 500 }
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
        created_by: 'admin',
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
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
