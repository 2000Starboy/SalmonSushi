// ═══════════════════════════════════════════════════════════
//  ASAKA SUSHI — CartPage
//  2 modes only: À Emporter · Livraison
// ═══════════════════════════════════════════════════════════
import React, { useState } from 'react';
import { ORDER_CONFIG } from '../../data/asakaData';

const MODE_META = {
  takeaway: {
    emoji: '🥡',
    label: 'À Emporter',
    desc: 'Retrait en boutique',
    color: 'border-asaka-500/60 bg-asaka-500/10 text-asaka-300',
  },
  delivery: {
    emoji: '🛵',
    label: 'Livraison',
    desc: 'Livraison à domicile',
    color: 'border-cyan-500/60 bg-cyan-900/20 text-cyan-300',
  },
};

const TIP_OPTIONS = ORDER_CONFIG?.tipOptions ?? [0, 5, 10, 15];
const DELIVERY_FEE = ORDER_CONFIG?.deliveryFee ?? 20;

const CartPage = ({
  navigate,
  cart,
  updateCartQty,
  removeFromCart,
  cartTotal,
  orderMode,
  setOrderMode,
  currentCustomer,
  activeDiscount,
  getDiscountedPrice,
}) => {
  const [tip, setTip]         = useState(0);
  const [customTip, setCustomTip] = useState('');

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-asaka-900 flex flex-col items-center justify-center
        px-6 pt-24 text-center">
        <div className="text-7xl mb-5">🛒</div>
        <h2 className="text-white font-black text-2xl mb-2">Panier vide</h2>
        <p className="text-asaka-muted text-sm mb-8">
          Ajoutez des plats depuis notre menu
        </p>
        <button onClick={() => navigate('menu')} className="btn-primary px-8 py-3.5 text-sm">
          Voir le menu 🍣
        </button>
      </div>
    );
  }

  const subtotal     = cartTotal;
  const deliveryFee  = orderMode === 'delivery' ? DELIVERY_FEE : 0;
  const discount     = activeDiscount > 0 ? Math.round(subtotal * activeDiscount / 100) : 0;
  const tipAmount    = Number(customTip) > 0 ? Number(customTip) : tip;
  const total        = subtotal + deliveryFee + tipAmount - discount;

  return (
    <div className="min-h-screen bg-asaka-900 pt-20 sm:pt-24 pb-32">
      <div className="max-w-xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-white font-black text-2xl">Mon Panier</h1>
          <span className="text-asaka-muted text-sm">
            {cart.reduce((s, c) => s + c.qty, 0)} article{cart.reduce((s, c) => s + c.qty, 0) > 1 ? 's' : ''}
          </span>
        </div>

        {/* Cart items */}
        <div className="space-y-3 mb-6">
          {cart.map(({ item, qty }) => {
            const price = getDiscountedPrice ? getDiscountedPrice(item.price) : item.price;
            return (
              <div key={item.id} className="card-asaka flex items-center gap-4 p-4">
                <div className="text-3xl w-12 h-12 flex items-center justify-center
                  bg-asaka-900 rounded-xl border border-asaka-700/40 flex-shrink-0">
                  {item.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white font-bold text-sm truncate">{item.name}</div>
                  <div className="text-asaka-300 font-black text-sm mt-0.5">
                    {(price * qty).toFixed(0)} DH
                  </div>
                </div>
                {/* Qty controls */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => updateCartQty(item.id, qty - 1)}
                    className="w-8 h-8 rounded-xl glass-light flex items-center justify-center
                      text-asaka-muted hover:text-white transition-colors tap-target">
                    {qty === 1 ? (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                        className="w-3.5 h-3.5 text-coral-400">
                        <path strokeLinecap="round" strokeLinejoin="round"
                          d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/>
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                        className="w-3.5 h-3.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14"/>
                      </svg>
                    )}
                  </button>
                  <span className="text-white font-black text-sm w-5 text-center">{qty}</span>
                  <button onClick={() => updateCartQty(item.id, qty + 1)}
                    className="w-8 h-8 rounded-xl glass-light flex items-center justify-center
                      text-asaka-muted hover:text-white transition-colors tap-target">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                      className="w-3.5 h-3.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14"/>
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mode selector */}
        <div className="card-asaka p-5 mb-5">
          <h2 className="text-white font-bold text-base mb-3">Mode de commande</h2>
          {orderMode ? (
            <div className="space-y-3">
              <div className={`flex items-center justify-between px-4 py-3.5 rounded-2xl
                border ${MODE_META[orderMode].color}`}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{MODE_META[orderMode].emoji}</span>
                  <div>
                    <div className="font-bold text-sm">{MODE_META[orderMode].label}</div>
                    <div className="text-xs opacity-70">{MODE_META[orderMode].desc}</div>
                  </div>
                </div>
                <button onClick={() => setOrderMode(null)}
                  className="text-xs opacity-60 hover:opacity-100 underline transition-opacity">
                  Changer
                </button>
              </div>
              <button
                onClick={() => navigate('checkout')}
                className="btn-primary w-full py-4 flex items-center justify-center gap-2 text-base">
                <span>Passer à la caisse</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                  className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/>
                </svg>
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {Object.entries(MODE_META).map(([mode, meta]) => (
                <button key={mode}
                  onClick={() => { setOrderMode(mode); navigate('checkout'); }}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border
                    transition-all duration-200 hover:border-asaka-500/50 hover:bg-asaka-700/30
                    border-asaka-700/40 bg-asaka-800/50 active:scale-[0.98]`}>
                  <span className="text-2xl">{meta.emoji}</span>
                  <div className="text-left flex-1">
                    <div className="text-white font-bold text-sm">{meta.label}</div>
                    <div className="text-asaka-muted text-xs">{meta.desc}</div>
                  </div>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    className="w-4 h-4 text-asaka-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5"/>
                  </svg>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Tip section */}
        <div className="card-asaka p-5 mb-5">
          <h2 className="text-white font-bold text-base mb-3">Pourboire</h2>
          <div className="flex gap-2 flex-wrap">
            {TIP_OPTIONS.map(t => (
              <button key={t}
                onClick={() => { setTip(t); setCustomTip(''); }}
                className={`flex-1 min-w-[60px] py-2.5 rounded-xl text-sm font-bold transition-all ${
                  tip === t && !customTip
                    ? 'bg-asaka-500 text-white'
                    : 'glass-light text-asaka-muted hover:text-white'
                }`}>
                {t === 0 ? 'Non' : `+${t} DH`}
              </button>
            ))}
            <input
              type="number"
              min="0"
              placeholder="Autre"
              value={customTip}
              onChange={e => { setCustomTip(e.target.value); setTip(0); }}
              className="flex-1 min-w-[70px] input-asaka py-2.5 text-sm text-center"
            />
          </div>
        </div>

        {/* Order summary */}
        <div className="glass rounded-2xl p-5 space-y-3 mb-6">
          <h2 className="text-white font-bold text-base mb-1">Récapitulatif</h2>

          {[
            { label: 'Sous-total', value: `${subtotal} DH` },
            ...(deliveryFee > 0 ? [{ label: 'Frais de livraison', value: `+${deliveryFee} DH` }] : []),
            ...(discount > 0 ? [{ label: `Remise (${activeDiscount}%)`, value: `-${discount} DH`, green: true }] : []),
            ...(tipAmount > 0 ? [{ label: 'Pourboire', value: `+${tipAmount} DH` }] : []),
          ].map(row => (
            <div key={row.label} className="flex justify-between text-sm">
              <span className="text-asaka-muted">{row.label}</span>
              <span className={row.green ? 'text-green-400 font-semibold' : 'text-white'}>
                {row.value}
              </span>
            </div>
          ))}

          <div className="border-t border-asaka-700/40 pt-3 flex justify-between">
            <span className="text-white font-bold text-base">Total</span>
            <span className="text-asaka-300 font-black text-xl">{total} DH</span>
          </div>

          {/* Account discount teaser */}
          {!currentCustomer && (
            <div className="bg-asaka-500/10 border border-asaka-500/25 rounded-xl p-3
              text-xs text-asaka-300">
              💡 <span className="font-semibold">Créez un compte</span> pour obtenir 10% de
              réduction sur vos commandes et cumuler des points fidélité.
            </div>
          )}
        </div>

        {/* Checkout CTA (when mode already selected) */}
        {orderMode && (
          <button
            onClick={() => navigate('checkout')}
            className="btn-primary w-full py-4 text-base flex items-center justify-center gap-2">
            <span>Valider la commande</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
              className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default CartPage;
