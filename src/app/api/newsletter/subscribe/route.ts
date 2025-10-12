import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { validateEmail } from '@/data/bannerConfig';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { email, name, consent, source, bannerId, ipAddress, userAgent } = body;

    // Validate required fields
    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      );
    }

    // Validate email format
    if (!validateEmail(email)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const { data: existingSubscriber, error: checkError } = await supabase
      .from('newsletter_subscribers')
      .select('id, email, consent, created_at')
      .eq('email', email.toLowerCase())
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking existing subscriber:', checkError);
      return NextResponse.json(
        { success: false, message: 'Database error' },
        { status: 500 }
      );
    }

    // If subscriber exists, update their consent and source
    if (existingSubscriber) {
      const { error: updateError } = await supabase
        .from('newsletter_subscribers')
        .update({
          consent: consent,
          source: source,
          banner_id: bannerId,
          ip_address: ipAddress,
          user_agent: userAgent,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingSubscriber.id);

      if (updateError) {
        console.error('Error updating subscriber:', updateError);
        return NextResponse.json(
          { success: false, message: 'Failed to update subscription' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Subscription updated successfully',
        isNewSubscriber: false
      });
    }

    // Create new subscriber
    const { data: newSubscriber, error: insertError } = await supabase
      .from('newsletter_subscribers')
      .insert({
        email: email.toLowerCase(),
        name: name || null,
        consent: consent,
        source: source,
        banner_id: bannerId,
        ip_address: ipAddress,
        user_agent: userAgent,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error creating subscriber:', insertError);
      return NextResponse.json(
        { success: false, message: 'Failed to create subscription' },
        { status: 500 }
      );
    }

    // Log subscription event
    console.log('New newsletter subscription:', {
      email: newSubscriber.email,
      source: source,
      bannerId: bannerId,
      consent: consent
    });

    return NextResponse.json({
      success: true,
      message: 'Subscription created successfully',
      isNewSubscriber: true,
      subscriber: {
        id: newSubscriber.id,
        email: newSubscriber.email
      }
    });

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email parameter is required' },
        { status: 400 }
      );
    }

    // Check if email is subscribed
    const { data: subscriber, error } = await supabase
      .from('newsletter_subscribers')
      .select('id, email, consent, source, created_at')
      .eq('email', email.toLowerCase())
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error checking subscriber:', error);
      return NextResponse.json(
        { success: false, message: 'Database error' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      isSubscribed: !!subscriber,
      subscriber: subscriber || null
    });

  } catch (error) {
    console.error('Newsletter check error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      );
    }

    // Delete subscriber
    const { error } = await supabase
      .from('newsletter_subscribers')
      .delete()
      .eq('email', email.toLowerCase());

    if (error) {
      console.error('Error deleting subscriber:', error);
      return NextResponse.json(
        { success: false, message: 'Failed to unsubscribe' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Unsubscribed successfully'
    });

  } catch (error) {
    console.error('Newsletter unsubscribe error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
