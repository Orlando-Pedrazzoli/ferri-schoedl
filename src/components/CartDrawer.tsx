'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, Minus, Plus, Trash2, Truck, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from './CartProvider';

const FRETE_FAIXAS = [
  { maxWeight: 500, label: 'PAC', price: 18.9, days: '8-12 dias uteis' },
  { maxWeight: 500, label: 'SEDEX', price: 32.5, days: '3-5 dias uteis' },
  { maxWeight: 1500, label: 'PAC', price: 24.9, days: '8-12 dias uteis' },
  { maxWeight: 1500, label: 'SEDEX', price: 42.9, days: '3-5 dias uteis' },
  { maxWeight: 5000, label: 'PAC', price: 34.9, days: '10-15 dias uteis' },
  { maxWeight: 5000, label: 'SEDEX', price: 58.9, days: '4-6 dias uteis' },
];

function calcularFrete(weightG: number) {
  const pac = FRETE_FAIXAS.filter(
    f => f.label === 'PAC' && weightG <= f.maxWeight,
  )[0] || { price: 34.9, days: '10-15 dias uteis' };

  const sedex = FRETE_FAIXAS.filter(
    f => f.label === 'SEDEX' && weightG <= f.maxWeight,
  )[0] || { price: 58.9, days: '4-6 dias uteis' };

  return [
    { label: 'PAC', price: pac.price, days: pac.days },
    { label: 'SEDEX', price: sedex.price, days: sedex.days },
  ];
}

export function CartDrawer() {
  const {
    items,
    isOpen,
    setIsOpen,
    removeItem,
    updateQuantity,
    totalItems,
    totalPrice,
    totalWeight,
  } = useCart();

  const [cep, setCep] = useState('');
  const [freteOpcoes, setFreteOpcoes] = useState<
    { label: string; price: number; days: string }[] | null
  >(null);
  const [freteSelecionado, setFreteSelecionado] = useState<number | null>(null);

  const handleCalcFrete = () => {
    if (cep.length >= 8) {
      setFreteOpcoes(calcularFrete(totalWeight));
      setFreteSelecionado(null);
    }
  };

  const fretePrice =
    freteSelecionado !== null && freteOpcoes
      ? freteOpcoes[freteSelecionado].price
      : 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className='fixed inset-0 z-50 bg-black/50 backdrop-blur-sm'
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className='fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-gold-500/10 bg-navy-950'
          >
            {/* Header */}
            <div className='flex items-center justify-between border-b border-gold-500/10 px-6 py-4'>
              <div className='flex items-center gap-3'>
                <ShoppingBag
                  size={18}
                  strokeWidth={1.5}
                  className='text-gold-500'
                />
                <span className='text-[14px] text-cream-100'>
                  Carrinho ({totalItems})
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className='text-txt-muted transition-colors hover:text-cream-100'
              >
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div className='flex-1 overflow-y-auto px-6 py-4'>
              {items.length === 0 ? (
                <div className='flex h-full flex-col items-center justify-center gap-3 text-txt-muted'>
                  <ShoppingBag
                    size={32}
                    strokeWidth={1}
                    className='text-gold-600/30'
                  />
                  <p className='text-[14px]'>Seu carrinho esta vazio</p>
                </div>
              ) : (
                <div className='space-y-4'>
                  {items.map(item => (
                    <div
                      key={item.livro.slug}
                      className='flex gap-4 border-b border-gold-500/8 pb-4'
                    >
                      <div className='h-24 w-16 shrink-0 bg-navy-800/60 border border-gold-500/10 flex items-center justify-center'>
                        <ShoppingBag
                          size={16}
                          strokeWidth={1}
                          className='text-gold-600/30'
                        />
                      </div>
                      <div className='flex-1 min-w-0'>
                        <h4 className='truncate font-[family-name:var(--font-cormorant)] text-[14px] text-cream-100'>
                          {item.livro.title}
                        </h4>
                        <p className='text-[12px] text-txt-muted'>
                          {item.livro.publisher}, {item.livro.year}
                        </p>
                        <p className='mt-1 text-[14px] text-gold-500'>
                          R$ {item.livro.price.toFixed(2).replace('.', ',')}
                        </p>
                        <div className='mt-2 flex items-center gap-3'>
                          <div className='flex items-center border border-gold-500/15'>
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.livro.slug,
                                  item.quantity - 1,
                                )
                              }
                              className='px-2 py-1 text-txt-muted transition-colors hover:text-cream-100'
                            >
                              <Minus size={12} />
                            </button>
                            <span className='min-w-[24px] text-center text-[13px] text-cream-100'>
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.livro.slug,
                                  item.quantity + 1,
                                )
                              }
                              className='px-2 py-1 text-txt-muted transition-colors hover:text-cream-100'
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                          <button
                            onClick={() => removeItem(item.livro.slug)}
                            className='text-txt-muted transition-colors hover:text-red-400'
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer: shipping + total */}
            {items.length > 0 && (
              <div className='border-t border-gold-500/10 px-6 py-4'>
                {/* Shipping calculator */}
                <div className='mb-4'>
                  <div className='flex items-center gap-2 mb-2'>
                    <Truck size={14} className='text-gold-600' />
                    <span className='text-[11px] uppercase tracking-[1.5px] text-gold-600'>
                      Calcular frete
                    </span>
                  </div>
                  <div className='flex gap-2'>
                    <input
                      type='text'
                      maxLength={9}
                      value={cep}
                      onChange={e => setCep(e.target.value.replace(/\D/g, ''))}
                      placeholder='CEP'
                      className='flex-1 border border-gold-500/12 bg-navy-800/30 px-3 py-2 text-[13px] text-cream-100 outline-none placeholder:text-txt-muted/40 focus:border-gold-500/30'
                    />
                    <button
                      onClick={handleCalcFrete}
                      className='border border-gold-500/30 px-4 py-2 text-[11px] uppercase tracking-[1px] text-gold-500 transition-colors hover:bg-gold-500/5'
                    >
                      Calcular
                    </button>
                  </div>
                  <p className='mt-1 text-[11px] text-txt-muted'>
                    Peso total:{' '}
                    {totalWeight >= 1000
                      ? `${(totalWeight / 1000).toFixed(1).replace('.', ',')}kg`
                      : `${totalWeight}g`}
                  </p>

                  {freteOpcoes && (
                    <div className='mt-3 space-y-2'>
                      {freteOpcoes.map((opt, i) => (
                        <button
                          key={opt.label}
                          onClick={() => setFreteSelecionado(i)}
                          className={`flex w-full items-center justify-between border px-3 py-2 text-left transition-colors ${
                            freteSelecionado === i
                              ? 'border-gold-500/40 bg-gold-500/5'
                              : 'border-gold-500/10 hover:border-gold-500/20'
                          }`}
                        >
                          <div>
                            <span className='text-[13px] text-cream-100'>
                              {opt.label}
                            </span>
                            <span className='ml-2 text-[11px] text-txt-muted'>
                              {opt.days}
                            </span>
                          </div>
                          <span className='text-[13px] text-gold-500'>
                            R$ {opt.price.toFixed(2).replace('.', ',')}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Totals */}
                <div className='space-y-2 border-t border-gold-500/8 pt-3'>
                  <div className='flex justify-between text-[13px]'>
                    <span className='text-txt-muted'>Subtotal</span>
                    <span className='text-cream-100'>
                      R$ {totalPrice.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                  {freteSelecionado !== null && freteOpcoes && (
                    <div className='flex justify-between text-[13px]'>
                      <span className='text-txt-muted'>
                        Frete ({freteOpcoes[freteSelecionado].label})
                      </span>
                      <span className='text-cream-100'>
                        R$ {fretePrice.toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                  )}
                  <div className='flex justify-between border-t border-gold-500/8 pt-2'>
                    <span className='text-[14px] text-cream-100'>Total</span>
                    <span className='font-[family-name:var(--font-cormorant)] text-xl text-gold-500'>
                      R${' '}
                      {(totalPrice + fretePrice).toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                </div>

                <button className='mt-4 w-full bg-gold-500 py-3 text-[12px] font-medium uppercase tracking-[2px] text-navy-950 transition-colors hover:bg-gold-400'>
                  Finalizar compra
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
