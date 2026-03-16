import React, { useState } from 'react';
import { ShoppingBag, Plus, Minus, Trash2, ArrowRight, UtensilsCrossed, ShoppingCart, Package, ExternalLink, ChevronRight, X } from 'lucide-react';

const GLOVO_URL = 'https://glovoapp.com/ma/fr/casablanca/salmon-sushi-csb/';

const MODE_META = {
  'dine-in':  { emoji: '🍽️', label: 'Sur Place',  desc: 'Commandez à table',        color: 'border-orange-500 bg-orange-500/10', text: 'text-orange-600' },
  'takeaway': { emoji: '🥡', label: 'À Emporter', desc: 'Click & collect',           color: 'border-green-500 bg-green-500/10',   text: 'text-green-600'  },
  'online':   { emoji: '🌐', label: 'En Ligne',   desc: 'Livraison à domicile',      color: 'border-blue-500 bg-blue-500/10',     text: 'text-blue-600'   },
};

const CartPage = ({
  navigate,
  cart = [],
  updateCartQty,
  removeFromCart,
  cartTotal = 0,
  isLight = false,
  language = 'fr',
  orderMode = null,
  setOrderMode,
}) => {
  const [onlineOpenEmpty, setOnlineOpenEmpty] = useState(false);
  const [onlineOpenItems, setOnlineOpenItems] = useState(false);
  const t = (fr, en, ar) => language === 'ar' ? ar : language === 'en' ? en : fr;

  const pageBg      = isLight ? 'bg-gray-50'                        : 'bg-[#0d0d0d]';
  const cardBg      = isLight ? 'bg-white border-gray-200'          : 'bg-white/5 border-white/10';
  const textPrimary = isLight ? 'text-gray-900'                     : 'text-white';
  const textMuted   = isLight ? 'text-gray-500'                     : 'text-zinc-400';
  const divider     = isLight ? 'border-gray-200'                   : 'border-white/10';
  const qtyBtn      = isLight ? 'bg-gray-100 hover:bg-gray-200 border-gray-200 text-gray-700' : 'bg-white/10 hover:bg-white/20 border-white/10 text-white';
  const summaryBg   = isLight ? 'bg-orange-50 border-orange-200'    : 'bg-orange-500/10 border-orange-500/20';

  // ── Empty state ────────────────────────────────────────────────────────────
  if (cart.length === 0) {
    return (
      <div className={`min-h-screen flex items-center justify-center px-6 pt-20 pb-20 ${pageBg}`}>
        <div className="text-center max-w-sm mx-auto">
          {/* Bowl illustration */}
          <div className={`w-28 h-28 rounded-full flex items-center justify-center mx-auto mb-8 ${isLight ? 'bg-orange-50 border-2 border-orange-200' : 'bg-white/5 border border-white/10'}`}>
            <ShoppingBag size={44} className={isLight ? 'text-orange-300' : 'text-zinc-600'} />
          </div>

          <h2 className={`text-3xl font-extrabold mb-3 ${textPrimary}`}>
            {t('Votre Panier est Vide', 'Your Cart is Empty', 'سلتك فارغة')}
          </h2>
          <p className={`mb-10 leading-relaxed ${textMuted}`}>
            {t(
              'Parcourez notre menu et ajoutez vos plats favoris pour commencer.',
              'Browse our menu and add your favourite dishes to get started.',
              'تصفح قائمتنا وأضف أطباقك المفضلة للبدء.'
            )}
          </p>

          {/* Order type options */}
          <div className="space-y-3">
            <p className={`text-xs font-bold uppercase tracking-widest mb-4 ${isLight ? 'text-gray-400' : 'text-zinc-500'}`}>
              {t('Comment souhaitez-vous commander ?', 'How would you like to order?', 'كيف تريد أن تطلب؟')}
            </p>

            {/* Dine In */}
            <button
              onClick={() => { setOrderMode?.('dine-in'); navigate('dine-in'); }}
              className={`w-full flex items-center space-x-4 px-5 py-4 border rounded-2xl transition-all hover:scale-[1.01] text-left ${
                isLight ? 'bg-white border-gray-200 hover:border-orange-300 hover:shadow-md hover:shadow-orange-100' : 'bg-white/5 border-white/10 hover:border-orange-500/30 hover:bg-white/8'
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-orange-500/15 flex items-center justify-center flex-shrink-0">
                <UtensilsCrossed size={22} className="text-orange-500" />
              </div>
              <div className="flex-1">
                <p className={`font-bold text-base ${textPrimary}`}>{t('Manger sur Place', 'Dine In', 'أكل هنا')}</p>
                <p className={`text-sm ${textMuted}`}>{t('Choisissez votre table, puis commandez', 'Pick your table, then order', 'اختر طاولتك ثم اطلب')}</p>
              </div>
              <ArrowRight size={18} className={textMuted} />
            </button>

            {/* Take Away */}
            <button
              onClick={() => { setOrderMode?.('takeaway'); navigate('menu'); }}
              className={`w-full flex items-center space-x-4 px-5 py-4 border rounded-2xl transition-all hover:scale-[1.01] text-left ${
                isLight ? 'bg-white border-gray-200 hover:border-green-300 hover:shadow-md hover:shadow-green-100' : 'bg-white/5 border-white/10 hover:border-green-500/30 hover:bg-white/8'
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-green-500/15 flex items-center justify-center flex-shrink-0">
                <ShoppingCart size={22} className="text-green-500" />
              </div>
              <div className="flex-1">
                <p className={`font-bold text-base ${textPrimary}`}>{t('À Emporter', 'Take Away', 'طلب للأخذ')}</p>
                <p className={`text-sm ${textMuted}`}>{t('Click & collect — prêt à récupérer', 'Click & collect', 'اطلب واستلم')}</p>
              </div>
              <ArrowRight size={18} className={textMuted} />
            </button>

            {/* Commander en Ligne — expandable */}
            <div className={`border rounded-2xl overflow-hidden transition-all ${
              onlineOpenEmpty
                ? isLight ? 'border-blue-200 bg-blue-50' : 'border-blue-500/30 bg-blue-500/8'
                : isLight ? 'bg-white border-gray-200' : 'bg-white/5 border-white/10'
            }`}>
              <button
                onClick={() => setOnlineOpenEmpty(o => !o)}
                className="w-full flex items-center space-x-4 px-5 py-4 text-left"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-500/15 flex items-center justify-center flex-shrink-0">
                  <Package size={22} className="text-blue-500" />
                </div>
                <div className="flex-1">
                  <p className={`font-bold text-base ${textPrimary}`}>{t('Commander en Ligne', 'Order Online', 'اطلب أونلاين')}</p>
                  <p className={`text-sm ${textMuted}`}>{t('Via notre site ou via Glovo', 'Via our site or Glovo', 'عبر موقعنا أو Glovo')}</p>
                </div>
                <ChevronRight size={18} className={`transition-transform ${onlineOpenEmpty ? 'rotate-90' : ''} ${textMuted}`} />
              </button>
              {onlineOpenEmpty && (
                <div className="px-5 pb-4 space-y-2">
                  <button
                    onClick={() => { setOrderMode?.('online'); navigate('menu'); }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 border rounded-xl text-sm font-medium transition-all ${
                      isLight ? 'bg-white border-gray-200 hover:border-blue-300 text-gray-700' : 'bg-white/5 border-white/10 hover:border-blue-500/40 text-white'
                    }`}
                  >
                    <span>🌐</span>
                    <span className="flex-1 text-left">{t('Commander sur notre site', 'Order on our site', 'اطلب من موقعنا')}</span>
                    <ArrowRight size={14} className="text-blue-500" />
                  </button>
                  <a
                    href={GLOVO_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full flex items-center space-x-3 px-4 py-3 border rounded-xl text-sm font-medium transition-all ${
                      isLight ? 'bg-white border-gray-200 hover:border-blue-300 text-gray-700' : 'bg-white/5 border-white/10 hover:border-blue-500/40 text-white'
                    }`}
                  >
                    <span>🛵</span>
                    <span className="flex-1 text-left">{t('Commander via Glovo', 'Order via Glovo', 'اطلب عبر Glovo')}</span>
                    <ExternalLink size={14} className="text-blue-500" />
                  </a>
                </div>
              )}
            </div>

            <button
              onClick={() => navigate('menu')}
              className={`w-full py-3 text-sm font-medium transition-colors ${isLight ? 'text-orange-500 hover:text-orange-600' : 'text-orange-400 hover:text-orange-300'}`}
            >
              {t('Voir le Menu →', 'Browse Menu →', 'تصفح القائمة ←')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Cart with items ────────────────────────────────────────────────────────
  return (
    <div className={`min-h-screen pt-20 pb-24 ${pageBg}`}>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-8">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className={`text-3xl font-extrabold ${textPrimary}`}>
              {t('Mon Panier', 'My Cart', 'سلتي')}
            </h1>
            <p className={`text-sm mt-1 ${textMuted}`}>
              {cart.reduce((s, c) => s + c.qty, 0)} {t('articles', 'items', 'عنصر')}
            </p>
          </div>
          <button
            onClick={() => navigate('menu')}
            className={`text-sm font-medium transition-colors ${isLight ? 'text-orange-500 hover:text-orange-600' : 'text-orange-400 hover:text-orange-300'}`}
          >
            + {t('Ajouter', 'Add more', 'إضافة')}
          </button>
        </div>

        {/* Items */}
        <div className="space-y-3 mb-6">
          {cart.map(({ item, qty }) => (
            <div key={item.id} className={`flex items-center space-x-4 p-4 border rounded-2xl ${cardBg}`}>
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.gradient || 'from-orange-500 to-red-600'} flex items-center justify-center flex-shrink-0`}>
                <span className="text-2xl">{item.emoji}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className={`font-bold text-sm truncate ${textPrimary}`}>{item.name}</h3>
                <p className="text-orange-500 font-bold text-sm mt-0.5">{item.price * qty} Dh</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => updateCartQty(item.id, qty - 1)}
                  className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${qtyBtn}`}
                >
                  <Minus size={13} />
                </button>
                <span className={`font-bold w-6 text-center ${textPrimary}`}>{qty}</span>
                <button
                  onClick={() => updateCartQty(item.id, qty + 1)}
                  className="w-8 h-8 rounded-full bg-orange-500 hover:bg-orange-600 flex items-center justify-center text-white transition-all"
                >
                  <Plus size={13} />
                </button>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ml-1 ${isLight ? 'text-gray-400 hover:text-red-500 hover:bg-red-50' : 'text-zinc-600 hover:text-red-400 hover:bg-red-500/15'}`}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className={`p-5 border rounded-2xl mb-6 ${summaryBg}`}>
          <div className={`flex justify-between text-sm mb-2 ${textMuted}`}>
            <span>{t('Sous-total', 'Subtotal', 'المجموع')}</span>
            <span className="font-medium">{cartTotal} Dh</span>
          </div>
          <div className={`flex justify-between font-extrabold text-lg pt-3 border-t ${divider} ${textPrimary}`}>
            <span>{t('Total', 'Total', 'الإجمالي')}</span>
            <span className="text-orange-500">{cartTotal} Dh</span>
          </div>
        </div>

        {/* ── Order mode + Checkout ────────────────────────────────────── */}
        {orderMode ? (
          /* Mode already selected → show badge + big checkout button */
          <div className="space-y-3">
            <div className={`flex items-center justify-between px-4 py-3.5 border rounded-2xl ${MODE_META[orderMode].color}`}>
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{MODE_META[orderMode].emoji}</span>
                <div>
                  <p className={`font-bold text-sm ${MODE_META[orderMode].text}`}>{MODE_META[orderMode].label}</p>
                  <p className={`text-xs ${textMuted}`}>{MODE_META[orderMode].desc}</p>
                </div>
              </div>
              <button
                onClick={() => setOrderMode?.(null)}
                className={`flex items-center space-x-1 text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${
                  isLight ? 'bg-gray-100 hover:bg-gray-200 text-gray-600' : 'bg-white/10 hover:bg-white/20 text-zinc-400'
                }`}
              >
                <X size={11} />
                <span>{t('Changer', 'Change', 'تغيير')}</span>
              </button>
            </div>
            <button
              onClick={() => orderMode === 'dine-in' ? navigate('dine-in') : navigate('checkout')}
              className="w-full flex items-center justify-center space-x-3 py-4 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-base rounded-2xl transition-all shadow-xl shadow-orange-500/30 hover:scale-[1.01] active:scale-[0.99]"
            >
              <span>{t('Passer à la caisse', 'Go to Checkout', 'الدفع')}</span>
              <ArrowRight size={20} />
            </button>
          </div>
        ) : (
          /* No mode selected — show mode picker */
          <div className="space-y-3">
            <p className={`text-xs font-bold uppercase tracking-widest text-center mb-1 ${textMuted}`}>
              {t('Choisissez votre mode de commande', 'Choose how to order', 'اختر طريقة الطلب')}
            </p>

            {/* Sur Place */}
            <button
              onClick={() => { setOrderMode?.('dine-in'); navigate('dine-in'); }}
              className={`w-full flex items-center space-x-4 px-5 py-4 border rounded-2xl transition-all hover:scale-[1.01] text-left ${
                isLight ? 'bg-white border-gray-200 hover:border-orange-300 hover:shadow-md hover:shadow-orange-100' : 'bg-white/5 border-white/10 hover:border-orange-500/30 hover:bg-white/8'
              }`}
            >
              <div className="w-11 h-11 rounded-xl bg-orange-500/15 flex items-center justify-center flex-shrink-0">
                <UtensilsCrossed size={20} className="text-orange-500" />
              </div>
              <div className="flex-1">
                <p className={`font-bold text-sm ${textPrimary}`}>{t('Manger sur Place', 'Dine In', 'أكل هنا')}</p>
                <p className={`text-xs ${textMuted}`}>{t('Choisissez votre table', 'Pick your table', 'اختر طاولتك')}</p>
              </div>
              <ArrowRight size={16} className={textMuted} />
            </button>

            {/* À Emporter */}
            <button
              onClick={() => { setOrderMode?.('takeaway'); navigate('checkout'); }}
              className={`w-full flex items-center space-x-4 px-5 py-4 border rounded-2xl transition-all hover:scale-[1.01] text-left ${
                isLight ? 'bg-white border-gray-200 hover:border-green-300 hover:shadow-md hover:shadow-green-100' : 'bg-white/5 border-white/10 hover:border-green-500/30 hover:bg-white/8'
              }`}
            >
              <div className="w-11 h-11 rounded-xl bg-green-500/15 flex items-center justify-center flex-shrink-0">
                <ShoppingCart size={20} className="text-green-500" />
              </div>
              <div className="flex-1">
                <p className={`font-bold text-sm ${textPrimary}`}>{t('À Emporter', 'Take Away', 'طلب للأخذ')}</p>
                <p className={`text-xs ${textMuted}`}>{t('Click & collect — prêt à récupérer', 'Click & collect', 'اطلب واستلم')}</p>
              </div>
              <ArrowRight size={16} className={textMuted} />
            </button>

            {/* Commander en Ligne — expandable */}
            <div className={`border rounded-2xl overflow-hidden transition-all ${
              onlineOpenItems
                ? isLight ? 'border-blue-200 bg-blue-50' : 'border-blue-500/30 bg-blue-500/8'
                : isLight ? 'bg-white border-gray-200' : 'bg-white/5 border-white/10'
            }`}>
              <button
                onClick={() => setOnlineOpenItems(o => !o)}
                className="w-full flex items-center space-x-4 px-5 py-4 text-left"
              >
                <div className="w-11 h-11 rounded-xl bg-blue-500/15 flex items-center justify-center flex-shrink-0">
                  <Package size={20} className="text-blue-500" />
                </div>
                <div className="flex-1">
                  <p className={`font-bold text-sm ${textPrimary}`}>{t('Commander en Ligne', 'Order Online', 'اطلب أونلاين')}</p>
                  <p className={`text-xs ${textMuted}`}>{t('Via notre site ou via Glovo', 'Via our site or Glovo', 'عبر موقعنا أو Glovo')}</p>
                </div>
                <ChevronRight size={16} className={`transition-transform ${onlineOpenItems ? 'rotate-90' : ''} ${textMuted}`} />
              </button>
              {onlineOpenItems && (
                <div className="px-5 pb-4 space-y-2">
                  <button
                    onClick={() => { setOrderMode?.('online'); navigate('checkout'); }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 border rounded-xl text-sm font-medium transition-all ${
                      isLight ? 'bg-white border-gray-200 hover:border-blue-300 text-gray-700' : 'bg-white/5 border-white/10 hover:border-blue-500/40 text-white'
                    }`}
                  >
                    <span>🌐</span>
                    <span className="flex-1 text-left">{t('Commander sur notre site', 'Order on our site', 'اطلب من موقعنا')}</span>
                    <ArrowRight size={14} className="text-blue-500" />
                  </button>
                  <a
                    href={GLOVO_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full flex items-center space-x-3 px-4 py-3 border rounded-xl text-sm font-medium transition-all ${
                      isLight ? 'bg-white border-gray-200 hover:border-blue-300 text-gray-700' : 'bg-white/5 border-white/10 hover:border-blue-500/40 text-white'
                    }`}
                  >
                    <span>🛵</span>
                    <span className="flex-1 text-left">{t('Commander via Glovo', 'Order via Glovo', 'اطلب عبر Glovo')}</span>
                    <ExternalLink size={14} className="text-blue-500" />
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
