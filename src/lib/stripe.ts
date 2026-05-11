import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-04-22.dahlia', // Versione richiesta dai tipi attuali
  appInfo: {
    name: 'BarberShop Booking',
    version: '0.1.0',
  },
});
