import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/libs/supabaseServer';

// PUT /api/refunds/[id] - Update refund request status
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const supabase = await createClient();
    const { id } = params;
    const body = await request.json();
    const { status, notes, processed_by } = body;

    // Validate status
    const validStatuses = ['pending', 'approved', 'rejected', 'processed'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, message: 'Invalid status' },
        { status: 400 }
      );
    }

    // Update refund request
    const updateData: any = {
      status,
      updated_at: new Date().toISOString()
    };

    if (notes) {
      updateData.notes = notes;
    }

    if (processed_by) {
      updateData.processed_by = processed_by;
    }

    if (status === 'processed') {
      updateData.processed_at = new Date().toISOString();
    }

    const { data: refund, error } = await supabase
      .from('refund_requests')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        orders!inner(
          id,
          order_number,
          total_price,
          status,
          delivered_at,
          customer_name,
          customer_email
        )
      `)
      .single();

    if (error) {
      console.error('Error updating refund:', error);
      return NextResponse.json(
        { success: false, message: 'Failed to update refund', error: error.message },
        { status: 500 }
      );
    }

    if (!refund) {
      return NextResponse.json(
        { success: false, message: 'Refund request not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      refund,
      message: 'Refund status updated successfully'
    });
  } catch (error: any) {
    console.error('Update refund API error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update refund', error: error.message },
      { status: 500 }
    );
  }
}

// GET /api/refunds/[id] - Get specific refund request
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const { id } = params;

    const { data: refund, error } = await supabase
      .from('refund_requests')
      .select(`
        *,
        orders!inner(
          id,
          order_number,
          total_price,
          status,
          delivered_at,
          customer_name,
          customer_email
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching refund:', error);
      return NextResponse.json(
        { success: false, message: 'Failed to fetch refund', error: error.message },
        { status: 500 }
      );
    }

    if (!refund) {
      return NextResponse.json(
        { success: false, message: 'Refund request not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      refund
    });
  } catch (error: any) {
    console.error('Get refund API error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch refund', error: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/refunds/[id] - Delete refund request
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const { id } = params;

    const { error } = await supabase
      .from('refund_requests')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting refund:', error);
      return NextResponse.json(
        { success: false, message: 'Failed to delete refund', error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Refund request deleted successfully'
    });
  } catch (error: any) {
    console.error('Delete refund API error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete refund', error: error.message },
      { status: 500 }
    );
  }
}
