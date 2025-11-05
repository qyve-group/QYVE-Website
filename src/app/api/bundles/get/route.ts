import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET(req: Request) {
  try {
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { 
          error: 'Database configuration missing',
          bundles: []
        },
        { status: 200 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { searchParams } = new URL(req.url);
    const bundleId = searchParams.get('id');
    const activeOnly = searchParams.get('active') !== 'false';

    if (bundleId) {
      const { data: bundle, error: bundleError } = await supabase
        .from('product_bundles')
        .select('*')
        .eq('id', bundleId)
        .single();

      if (bundleError) {
        return NextResponse.json(
          { error: 'Bundle not found' },
          { status: 404 }
        );
      }

      const { data: items, error: itemsError } = await supabase
        .from('bundle_items')
        .select('*')
        .eq('bundle_id', bundleId)
        .order('display_order');

      if (itemsError) {
        return NextResponse.json(
          { error: 'Failed to fetch bundle items' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        bundle: {
          ...bundle,
          items,
        },
      });
    }

    let query = supabase
      .from('product_bundles')
      .select('*')
      .order('display_order');

    if (activeOnly) {
      query = query.eq('is_active', true);
    }

    const { data: bundles, error } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch bundles' },
        { status: 500 }
      );
    }

    const bundlesWithItems = await Promise.all(
      (bundles || []).map(async (bundle) => {
        const { data: items } = await supabase
          .from('bundle_items')
          .select('*')
          .eq('bundle_id', bundle.id)
          .order('display_order');

        return {
          ...bundle,
          items: items || [],
        };
      })
    );

    return NextResponse.json({
      success: true,
      bundles: bundlesWithItems,
    });
  } catch (error) {
    console.error('Bundle fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bundles', bundles: [] },
      { status: 500 }
    );
  }
}
