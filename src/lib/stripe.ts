import Stripe from 'stripe';

const key = process.env.STRIPE_SECRET_KEY;
if (!key) {
  throw new Error('STRIPE_SECRET_KEY não configurada');
}

export const stripe = new Stripe(key, {
  appInfo: {
    name: 'Ferri Schoedl Advocacia',
    url: 'https://www.ferrischoedl.adv.br',
  },
});

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ferrischoedl.adv.br'
).replace(/\/$/, '');
