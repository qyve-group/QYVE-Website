import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productName = searchParams.get('productName');
    const category = searchParams.get('category');
    const productId = searchParams.get('productId');

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: 'Supabase configuration missing' },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const associationValues: string[] = [];
    if (productId) associationValues.push(productId);
    if (productName) associationValues.push(productName);
    if (category) associationValues.push(category);

    const { data: associations, error: assocError } = await supabase
      .from('bundle_associations')
      .select('bundle_id, priority')
      .in('association_value', associationValues)
      .order('priority', { ascending: false });

    if (assocError) {
      console.error('Error fetching bundle associations:', assocError);
      return NextResponse.json(
        { error: 'Failed to fetch bundle associations' },
        { status: 500 }
      );
    }

    if (!associations || associations.length === 0) {
      return NextResponse.json({ bundles: [] });
    }

    const bundleIds = [...new Set(associations.map((a: any) => a.bundle_id))];

    const { data: bundles, error: bundlesError } = await supabase
      .from('product_bundles')
      .select('*')
      .in('id', bundleIds)
      .eq('is_active', true)
      .order('is_featured', { ascending: false })
      .order('display_order', { ascending: true })
      .limit(3);

    if (bundlesError) {
      console.error('Error fetching bundles:', bundlesError);
      return NextResponse.json(
        { error: 'Failed to fetch bundles' },
        { status: 500 }
      );
    }

    for (const bundle of bundles || []) {
      const { data: items } = await supabase
        .from('bundle_items')
        .select('*')
        .eq('bundle_id', bundle.id)
        .order('display_order', { ascending: true });

      bundle.items = items || [];
    }

    return NextResponse.json({ bundles: bundles || [] });
  } catch (error) {
    console.error('Error in relevant bundles API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
