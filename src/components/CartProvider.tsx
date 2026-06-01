'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import type { Livro } from '@/lib/data';

export type BookFormat = 'physical' | 'ebook';

export interface CartItem {
  id: string; // `${slug}__${format}` — separa físico e ebook do mesmo título
  livro: Livro;
  quantity: number;
  format: BookFormat;
}

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  addItem: (livro: Livro, format?: BookFormat) => void;
  removeItem: (idOrSlug: string) => void;
  updateQuantity: (idOrSlug: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  totalWeight: number;
}

const makeId = (slug: string, format: BookFormat) => `${slug}__${format}`;

const CartContext = createContext<CartContextType>({
  items: [],
  isOpen: false,
  setIsOpen: () => {},
  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  totalItems: 0,
  totalPrice: 0,
  totalWeight: 0,
});

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const addItem = useCallback(
    (livro: Livro, format: BookFormat = 'physical') => {
      const id = makeId(livro.slug, format);
      setItems(prev => {
        const existing = prev.find(i => i.id === id);
        if (existing) {
          // Ebook é arquivo digital: mantém a quantidade fixa em 1
          if (format === 'ebook') return prev;
          return prev.map(i =>
            i.id === id ? { ...i, quantity: i.quantity + 1 } : i,
          );
        }
        return [...prev, { id, livro, quantity: 1, format }];
      });
      setIsOpen(true);
    },
    [],
  );

  // Aceita o id composto (`slug__format`) ou, por compatibilidade, o slug puro
  const removeItem = useCallback((idOrSlug: string) => {
    setItems(prev => {
      const matchesId = prev.some(i => i.id === idOrSlug);
      return prev.filter(i =>
        matchesId ? i.id !== idOrSlug : i.livro.slug !== idOrSlug,
      );
    });
  }, []);

  const updateQuantity = useCallback((idOrSlug: string, quantity: number) => {
    setItems(prev => {
      const matchesId = prev.some(i => i.id === idOrSlug);
      const match = (i: CartItem) =>
        matchesId ? i.id === idOrSlug : i.livro.slug === idOrSlug;
      if (quantity <= 0) {
        return prev.filter(i => !match(i));
      }
      return prev.map(i => {
        if (!match(i)) return i;
        // Ebook permanece sempre com quantidade 1
        if (i.format === 'ebook') return { ...i, quantity: 1 };
        return { ...i, quantity };
      });
    });
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce(
    (sum, i) => sum + i.livro.price * i.quantity,
    0,
  );
  // Apenas itens físicos contam para o peso (frete). Ebook não tem peso.
  const totalWeight = items.reduce(
    (sum, i) =>
      i.format === 'ebook' ? sum : sum + i.livro.weight * i.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        setIsOpen,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        totalWeight,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
