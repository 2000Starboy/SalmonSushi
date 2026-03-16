import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, UtensilsCrossed, ShoppingCart, Globe } from 'lucide-react';

const POINTS_VALUE = 0.1; // 1 point = 0.1 Dh
const PICKUP_TIMES   = ['Dans 15 min', 'Dans 30 min', 'Dans 45 min', 'Dans 1h', 'Dans 1h30'];
const DELIVERY_TIMES = ['Dans 30 min', 'Dans 45 min', 'Dans 1h', 'Dans 1h30', 'Dans 2h'];
const TIP_OPTIONS    = [0, 5, 10, 15, 20];

const UnifiedCheckout = ({
  cart = [],
  cartTotal = 0,
  orderMode,
  setOrderMode,
  tableNumber,
  setTableNumber,
  placeOrder,
  currentCustomer,
  navigate,
  isLight = false,
  language = 'fr',
  activeDiscount = 0,
}) => {
  const t = (fr, en, ar) => language === 'ar' ? ar : language === 'en' ? en : fr;

  // ── Tip ───────────────────────────────────────────
  const [tipPct, setTipPct]     = useState(10);
  const [customTip, setCustomTip] = useState('');
  const tipAmount = customTip !== '' ? Number(customTip) : Math.round(cartTotal * tipPct / 100);

  // ── Payment ───────────────────────────────────────
  const [paymentMethod, setPaymentMethod] = useState('cash');

  // ── Points ────────────────────────────────────────
  const [usePoints, setUsePoints] = useState(false);
  const availablePoints = currentCustomer?.points || 0;
  const pointsDiscount  = usePoints ? Math.floor(availablePoints * POINTS_VALUE) : 0;

  // ── Mode-specific fields ──────────────────────────
  const [tableInput,       setTableInput]       = useState(tableNumber || '');
  const [pickupName,       setPickupName]       = useState(currentCustomer?.name || '');
  const [pickupPhone,      setPickupPhone]      = useState('');
  const [pickupTime,       setPickupTime]       = useState(PICKUP_TIMES[1]);
  const [deliveryName,     setDeliveryName]     = useState(currentCustomer?.name || '');
  const [deliveryPhone,    setDeliveryPhone]    = useState('');
  const [deliveryAddress,  setDeliveryAddress]  = useState('');
  const [deliveryTime,     setDeliveryTime]     = useState(DELIVERY_TIMES[1]);

  // ── Totals ────────────────────────────────────────
  const discountFromOffer = activeDiscount > 0 ? Math.round(cartTotal * activeDiscount / 100) : 0;
  const total = Math.max(0, cartTotal + tipAmount - pointsDiscount - discountFromOffer);
  const pointsToEarn = Math.floor(total);

  // ── Validation ────────────────────────────────────
  const canConfirm = cart.length > 0 && orderMode && (
    (orderMode === 'dine-in'  && tableInput.trim())       ||
    (orderMode === 'takeaway' && pickupName.trim() && pickupTime) ||
    (orderMode === 'online'   && deliveryName.trim() && deliveryAddress.trim())
  );

  const handleConfirm = () => {
    if (!canConfirm) return;
    if (orderMode === 'dine-in') setTableNumber(tableInput.trim());
    placeOrder({
      tip: tipAmount,
      paymentMethod,
      pointsUsed: usePoints ? availablePoints : 0,
      extra: {
        type: orderMode,
        tableNumber: orderMode === 'dine-in' ? tableInput.trim() : undefined,
        name:            orderMode !== 'dine-in' ? (orderMode === 'takeaway' ? pickupName : deliveryName) : undefined,
        phone:           orderMode !== 'dine-in' ? (orderMode === 'takeaway' ? pickupPhone : deliveryPhone) : undefined,
        pickupTime:      orderMode === 'takeaway' ? pickupTime : undefined,
        deliveryAddress: orderMode === 'online'   ? deliveryAddress.trim() : undefined,
        deliveryTime:    orderMode === 'online'   ? deliveryTime : undefined,
      },
    });
    navigate('confirmation');
  };

  // ── Theme ─────────────────────────────────────────
  const textPrimary  = isLight ? 'text-gray-900'   : 'text-white';
  const textMuted    = isLight ? 'text-gray-500'   : 'text-zinc-400';
  const cardBg       = isLight ? 'bg-white border-gray-200' : 'bg-white/5 border-white/10';
  const inputCls     = isLight
    ? 'w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-orange-400 rounded-xl text-gray-900 placeholder:text-gray-400 outline-none text-sm transition-all'
    : 'w-full px-4 py-3 bg-white/5 border border-white/10 focus:border-orange-500/50 rounded-xl text-white placeholder:text-zinc-600 outline-none text-sm transition-all';
  const selectCls    = inputCls + (isLight ? ' bg-gray-50' : ' bg-[#1a1a1a]');
  const backBtn      = isLight ? 'text-gray-500 hover:text-gray-800' : 'text-zinc-400 hover:text-white';
  const divider      = isLight ? 'border-gray-200' : 'border-white/10';
  const tipInactive  = isLight
    ? 'bg-gray-50 border border-gray-200 text-gray-600 hover:text-gray-800'
    : 'bg-white/5 border border-white/10 text-zinc-400 hover:text-white';
  const payBtnInactive = isLight
    ? 'border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100'
    : 'border-white/10 bg-white/3 text-zinc-400 hover:bg-white/5';

  const modes = [
    { id: 'dine-in',  emoji: '🍽️', label: t('Sur Place', 'Dine In', 'هنا'),     active: 'border-orange-500 bg-orange-500/10 text-orange-600' },
    { id: 'takeaway', emoji: '🥡', label: t('À Emporter', 'Take Away', 'للأخذ'), active: 'border-green-500 bg-green-500/10 text-green-600'   },
    { id: 'online',   emoji: '🌐', label: t('En Ligne', 'Online', 'أونلاين'),   active: 'border-blue-500 bg-blue-500/10 text-blue-600'       },
  ];

  const Section = ({ children, className = '' }) => (
    <div className={`p-4 rounded-2xl border mb-4 ${cardBg} ${className}`}>
      {children}
    </div>
  );

  const Label = ({ children }) => (
    <p className={`text-xs font-black uppercase tracking-widest mb-3 ${textMuted}`}>{children}</p>
  );

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6">
      <div className="max-w-xl mx-auto">

        {/* Back */}
        <button onClick={() => navigate('cart')} className={`flex items-center space-x-2 text-sm mb-6 transition-colors ${backBtn}`}>
          <ArrowLeft size={16} />
          <span>{t('Retour au panier', 'Back to cart', 'العودة للسلة')}</span>
        </button>

        <h1 className={`text-3xl font-extrabold mb-6 ${textPrimary}`}>
          {t('Finaliser', 'Checkout', 'إتمام الطلب')}
        </h1>

        {/* ── Mode selector ───────────────────────── */}
        <Section>
          <Label>{t('Mode de commande', 'Order type', 'نوع الطلب')}</Label>
          <div className="grid grid-cols-3 gap-2">
            {modes.map(m => (
              <button
                key={m.id}
                onClick={() => setOrderMode(m.id)}
                className={`flex flex-col items-center space-y-1.5 py-3 rounded-xl border-2 transition-all ${
                  orderMode === m.id
                    ? m.active
                    : isLight ? 'border-gray-200 bg-gray-50 text-gray-500 hover:bg-gray-100' : 'border-white/10 bg-white/3 text-zinc-500 hover:bg-white/5'
                }`}
              >
                <span className="text-xl">{m.emoji}</span>
                <span className="text-xs font-bold">{m.label}</span>
              </button>
            ))}
          </div>
        </Section>

        {/* ── Mode-specific form ───────────────────── */}
        {orderMode && (
          <Section>
            {orderMode === 'dine-in' && (
              <>
                <Label>🍽️ {t('Numéro de table', 'Table number', 'رقم الطاولة')}</Label>
                <input
                  type="text"
                  placeholder={t('Ex: 5', 'e.g. 5', 'مثال: 5')}
                  value={tableInput}
                  onChange={e => setTableInput(e.target.value)}
                  className={inputCls}
                />
              </>
            )}

            {orderMode === 'takeaway' && (
              <>
                <Label>🥡 {t('Détails du retrait', 'Pickup details', 'تفاصيل الاستلام')}</Label>
                <div className="space-y-3">
                  <input type="text" placeholder={t('Votre nom', 'Your name', 'اسمك')} value={pickupName} onChange={e => setPickupName(e.target.value)} className={inputCls} />
                  <input type="tel" placeholder={t('Téléphone ou WhatsApp', 'Phone or WhatsApp', 'هاتف أو واتساب')} value={pickupPhone} onChange={e => setPickupPhone(e.target.value)} className={inputCls} />
                  <select value={pickupTime} onChange={e => setPickupTime(e.target.value)} className={selectCls}>
                    {PICKUP_TIMES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </>
            )}

            {orderMode === 'online' && (
              <>
                <Label>🌐 {t('Détails de livraison', 'Delivery details', 'تفاصيل التوصيل')}</Label>
                <div className="space-y-3">
                  <input type="text" placeholder={t('Votre nom', 'Your name', 'اسمك')} value={deliveryName} onChange={e => setDeliveryName(e.target.value)} className={inputCls} />
                  <input type="tel" placeholder={t('Téléphone ou WhatsApp', 'Phone or WhatsApp', 'هاتف أو واتساب')} value={deliveryPhone} onChange={e => setDeliveryPhone(e.target.value)} className={inputCls} />
                  <input type="text" placeholder={t('Adresse de livraison complète', 'Full delivery address', 'عنوان التوصيل الكامل')} value={deliveryAddress} onChange={e => setDeliveryAddress(e.target.value)} className={inputCls} />
                  <select value={deliveryTime} onChange={e => setDeliveryTime(e.target.value)} className={selectCls}>
                    {DELIVERY_TIMES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </>
            )}
          </Section>
        )}

        {/* ── Order summary ────────────────────────── */}
        <Section>
          <Label>{t('Récapitulatif', 'Summary', 'ملخص')}</Label>
          <div className="space-y-2">
            {cart.map(({ item, qty }) => (
              <div key={item.id} className={`flex justify-between text-sm ${textMuted}`}>
                <span>{qty}× {item.name}</span>
                <span className="font-medium">{item.price * qty} Dh</span>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Tip ─────────────────────────────────── */}
        <Section>
          <Label>{t('Pourboire', 'Tip', 'إكرامية')}</Label>
          <div className="flex space-x-2 mb-3">
            {TIP_OPTIONS.map(pct => (
              <button
                key={pct}
                onClick={() => { setTipPct(pct); setCustomTip(''); }}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  tipPct === pct && customTip === ''
                    ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
                    : tipInactive
                }`}
              >
                {pct === 0 ? t('Sans', 'None', 'لا') : `${pct}%`}
              </button>
            ))}
          </div>
          <input
            type="number"
            placeholder={t('Montant personnalisé (Dh)', 'Custom amount (Dh)', 'مبلغ مخصص (درهم)')}
            value={customTip}
            onChange={e => { setCustomTip(e.target.value); setTipPct(-1); }}
            className={inputCls}
          />
          {tipAmount > 0 && (
            <p className="text-orange-400 text-xs mt-2">
              🙏 {t('Pourboire', 'Tip', 'إكرامية')} : +{tipAmount} Dh
            </p>
          )}
        </Section>

        {/* ── Points ──────────────────────────────── */}
        {currentCustomer && availablePoints >= 100 && (
          <Section>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-bold ${textPrimary}`}>⭐ {t('Utiliser mes Points', 'Use my Points', 'استخدام نقاطي')}</p>
                <p className={`text-xs mt-0.5 ${textMuted}`}>{availablePoints} pts → -{Math.floor(availablePoints * POINTS_VALUE)} Dh</p>
              </div>
              <button
                onClick={() => setUsePoints(!usePoints)}
                className={`w-12 h-6 rounded-full transition-all relative flex-shrink-0 ${usePoints ? 'bg-orange-500' : isLight ? 'bg-gray-200' : 'bg-white/10'}`}
              >
                <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${usePoints ? 'left-6' : 'left-0.5'}`} />
              </button>
            </div>
            {usePoints && <p className="text-green-500 text-xs mt-2">✓ -{pointsDiscount} Dh appliqué</p>}
          </Section>
        )}

        {/* ── Payment method ───────────────────────── */}
        <Section>
          <Label>{t('Paiement', 'Payment', 'الدفع')}</Label>
          <div className="space-y-2">
            {[
              { id: 'cash', icon: '💵', label: t('Espèces', 'Cash', 'نقداً') },
              { id: 'card', icon: '💳', label: t('Carte Bancaire', 'Bank Card', 'بطاقة بنكية') },
            ].map(m => (
              <button
                key={m.id}
                onClick={() => setPaymentMethod(m.id)}
                className={`w-full flex items-center space-x-3 p-3.5 rounded-xl border transition-all ${
                  paymentMethod === m.id
                    ? 'border-orange-500 bg-orange-500/10'
                    : payBtnInactive
                }`}
              >
                <span className="text-lg">{m.icon}</span>
                <span className={`font-semibold text-sm ${paymentMethod === m.id ? textPrimary : textMuted}`}>{m.label}</span>
                {paymentMethod === m.id && <CheckCircle2 size={16} className="text-orange-500 ml-auto" />}
              </button>
            ))}
          </div>
        </Section>

        {/* ── Total ───────────────────────────────── */}
        <Section>
          <div className="space-y-2 text-sm">
            <div className={`flex justify-between ${textMuted}`}>
              <span>{t('Sous-total', 'Subtotal', 'المجموع الفرعي')}</span>
              <span>{cartTotal} Dh</span>
            </div>
            {discountFromOffer > 0 && (
              <div className="flex justify-between text-orange-500">
                <span>{t('Réduction offre', 'Offer discount', 'خصم العرض')}</span>
                <span>-{discountFromOffer} Dh</span>
              </div>
            )}
            {tipAmount > 0 && (
              <div className={`flex justify-between ${textMuted}`}>
                <span>{t('Pourboire', 'Tip', 'إكرامية')}</span>
                <span>+{tipAmount} Dh</span>
              </div>
            )}
            {usePoints && (
              <div className="flex justify-between text-green-500">
                <span>{t('Points', 'Points', 'النقاط')}</span>
                <span>-{pointsDiscount} Dh</span>
              </div>
            )}
            <div className={`flex justify-between font-extrabold text-lg pt-3 border-t ${divider} ${textPrimary}`}>
              <span>TOTAL</span>
              <span className="text-orange-500">{total} Dh</span>
            </div>
          </div>
          {currentCustomer && (
            <p className="text-amber-500 text-xs mt-3">
              ⭐ +{pointsToEarn} {t('points gagnés après cette commande', 'points earned', 'نقطة ستُكسب')}
            </p>
          )}
        </Section>

        {/* ── Confirm button ───────────────────────── */}
        <button
          onClick={handleConfirm}
          disabled={!canConfirm}
          className="w-full py-4 bg-orange-500 hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-extrabold text-base rounded-2xl transition-all shadow-xl shadow-orange-500/30 hover:shadow-orange-500/50"
        >
          {!orderMode
            ? t('Choisissez un mode de commande ↑', 'Choose order type ↑', 'اختر نوع الطلب ↑')
            : !canConfirm
            ? t('Remplissez les informations requises', 'Fill in required info', 'أكمل المعلومات المطلوبة')
            : `✅ ${t('Confirmer', 'Confirm', 'تأكيد')} · ${total} Dh`
          }
        </button>

        <p className={`text-xs text-center mt-3 ${textMuted}`}>
          {t('Votre commande sera transmise immédiatement à notre équipe.', 'Your order is sent instantly to our team.', 'يُرسل طلبك فورًا لفريقنا.')}
        </p>
      </div>
    </div>
  );
};

export default UnifiedCheckout;
