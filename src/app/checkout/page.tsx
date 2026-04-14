import type { Metadata } from 'next';
import { CheckoutForm } from './CheckoutForm';

export const metadata: Metadata = {
  title: 'Checkout — Ferri Schoedl Advocacia',
  description: 'Finalize a compra dos seus livros.',
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return <CheckoutForm />;
}
