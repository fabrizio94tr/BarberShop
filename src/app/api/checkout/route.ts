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

    // 1. Recupera i dati reali dal DB (Mock per ora)
    // In produzione faremo: await supabase.from('services').select('*').eq('id', serviceId).single()
    const mockServices = [
      { id: '1', name: 'Taglio Classico', price: 25 },
      { id: '2', name: 'Taglio & Barba', price: 35 },
      { id: '3', name: 'Regolazione Barba', price: 15 },
    ];
    const service = mockServices.find(s => s.id === serviceId);

    // 2. Recupera l'account Stripe della sede
    // In produzione faremo: await supabase.from('locations').select('stripe_account_id').eq('id', locationId).single()
    const mockStripeAccounts: Record<string, string> = {
      '1': 'acct_123...', // Esempio account sede Prati
      '2': 'acct_456...', // Esempio account sede Trastevere
    };
    const destinationAccount = mockStripeAccounts[locationId];

    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

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
            unit_amount: service.price * 100, // Stripe usa i centesimi
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${request.headers.get('origin')}/book/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.headers.get('origin')}/book/${locationId}`,
      customer_email: user.email,
      
      // LOGICA CONNECT: Destina i fondi alla sede specifica (meno una eventuale commissione)
      /*
      payment_intent_data: {
        transfer_data: {
          destination: destinationAccount,
        },
      },
      */
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (err: any) {
    console.error('Stripe error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
