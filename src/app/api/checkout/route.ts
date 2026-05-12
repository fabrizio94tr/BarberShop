import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: Request) {
  try {
    const { serviceId, locationId, barberId, appointmentDate, appointmentTime } = await request.json();
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 1. Recupera i dati reali dal DB
    const { data: service } = await supabase
      .from('services')
      .select('*')
      .eq('id', serviceId)
      .single();

    if (!service) {
      return NextResponse.json({ error: 'Servizio non trovato' }, { status: 404 });
    }

    // 2. Recupera l'account Stripe della sede
    const { data: location } = await supabase
      .from('locations')
      .select('stripe_account_id')
      .eq('id', locationId)
      .single();

    const destinationAccount = location?.stripe_account_id;

    // 3. Crea la Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: service.name,
              description: `Appuntamento il ${appointmentDate} alle ${appointmentTime}`,
            },
            unit_amount: Math.round(service.price * 100), // Stripe usa i centesimi
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${request.headers.get('origin')}/book/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.headers.get('origin')}/book/${location.slug || locationId}`,
      customer_email: user.email,
      
      // Metadata per ritrovare le info nel webhook
      metadata: {
        userId: user.id,
        locationId,
        serviceId,
        barberId,
        appointmentDate,
        appointmentTime,
      },

      // LOGICA CONNECT (Attivare quando gli account sono pronti)
      ...(destinationAccount && {
        payment_intent_data: {
          transfer_data: {
            destination: destinationAccount,
          },
        },
      })
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (err: any) {
    console.error('Stripe error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
