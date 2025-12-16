import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim().toLowerCase());

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function verifyAdminAuth(): Promise<{ authorized: boolean; error?: string }> {
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

    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { authorized: false, error: 'Unauthorized' };
    }
    
    const userEmail = user.email?.toLowerCase() || '';
    if (ADMIN_EMAILS.length > 0 && !ADMIN_EMAILS.includes(userEmail)) {
      return { authorized: false, error: 'Forbidden - Admin access required' };
    }
    
    return { authorized: true };
  } catch (error) {
    console.error('Admin auth verification error:', error);
    return { authorized: false, error: 'Authentication failed' };
  }
}

export async function GET(request: NextRequest) {
  const auth = await verifyAdminAuth();
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam) : 100;

    const { data: movements, error } = await supabaseAdmin
      .from('stock_movements')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching stock history:', error);
      return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 });
    }

    return NextResponse.json({ movements: movements || [] });
  } catch (error) {
    console.error('Stock history API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
