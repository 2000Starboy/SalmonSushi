// ═══════════════════════════════════════════════════════════
//  ASAKA SUSHI — UnifiedCheckout
//  Handles À Emporter + Livraison forms
//  GPS location, WhatsApp confirmation popup
//  OWASP: validated via security.js
// ═══════════════════════════════════════════════════════════
import React, { useState, useEffect } from 'react';
import { sanitize, validateForm, takeawaySchema, deliverySchema,
  getGpsLink, buildWhatsAppMessage, rateLimiter } from '../../utils/security';
import { RESTAURANT, ORDER_CONFIG } from '../../data/asakaData';
import { toast } from '../../utils/toast';

const PICKUP_TIMES = [
  'Dans 15 min', 'Dans 30 min', 'Dans 45 min', 'Dans 1h', 'Dans 1h30',
];

// ── WhatsApp Confirm Modal ────────────────────────────────
const WaConfirmModal = ({ whatsappUrl, onConfirmWeb, onClose, total, mode }) => (
  <>
    <div className="bottom-sheet-overlay" onClick={onClose} />
    <div className="bottom-sheet-panel" style={{ maxHeight: '60vh' }}>
      <div className="flex justify-center pt-3 pb-1">
        <div className="w-10 h-1 bg-asaka-600 rounded-full" />
      </div>
      <div className="px-5 pb-6 pt-3">
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">🍣</div>
          <h2 className="text-white font-black text-xl mb-1">Confirmer la commande</h2>
          <p className="text-asaka-muted text-sm">
            Votre commande est prête. Comment souhaitez-vous confirmer ?
          </p>
          <p className="text-asaka-300 font-bold mt-2">Total : {total} DH</p>
        </div>

        <div className="space-y-3">
          {/* WhatsApp option */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onConfirmWeb}
            className="flex items-center gap-4 p-4 rounded-2xl w-full text-left
              bg-[#25d366]/10 border border-[#25d366]/30 text-[#25d366]
              hover:bg-[#25d366]/20 transition-all active:scale-[0.98]">
            <svg viewBox="0 0 24 24" className="w-7 h-7 flex-shrink-0" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            <div>
              <div className="font-bold text-sm">Confirmer via WhatsApp</div>
              <div className="text-[#25d366]/70 text-xs">Ouverture de WhatsApp avec votre commande pré-remplie</div>
            </div>
          </a>

          {/* Website direct */}
          <button
            onClick={onConfirmWeb}
            className="flex items-center gap-4 p-4 rounded-2xl w-full text-left
              bg-asaka-500/15 border border-asaka-500/30 text-asaka-300
              hover:bg-asaka-500/25 transition-all active:scale-[0.98]">
            <div className="w-7 h-7 rounded-full bg-asaka-500/30 flex items-center justify-center
              text-base flex-shrink-0">
              🌐
            </div>
            <div>
              <div className="font-bold text-sm">Confirmer sur le site</div>
              <div className="text-asaka-muted text-xs">Commande enregistrée directement</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  </>
);

// ════════════════════════════════════════════════════════════
//  UNIFIED CHECKOUT
// ════════════════════════════════════════════════════════════
const UnifiedCheckout = ({
  navigate,
  cart,
  cartTotal,
  orderMode,
  setOrderMode,
  placeOrder,
  currentCustomer,
  activeDiscount,
  getDiscountedPrice,
}) => {
  const [form, setForm]       = useState({
    name:        currentCustomer?.name  || '',
    phone:       currentCustomer?.phone || '',
    address:     currentCustomer?.address || '',
    pickupTime:  PICKUP_TIMES[1],
    gpsLink:     '',
    tip:         0,
    paymentMethod: 'cash',
    pointsUsed:  0,
  });
  const [errors, setErrors]     = useState({});
  const [gpsLoading, setGpsLoading] = useState(false);
  const [showWaModal, setShowWaModal] = useState(false);
  const [pendingOrder, setPendingOrder] = useState(null);
  const [submitting, setSubmitting]     = useState(false);

  const isDelivery = orderMode === 'delivery';
  const isTakeaway = orderMode === 'takeaway';

  // Pre-fill from customer account
  useEffect(() => {
    if (currentCustomer) {
      setForm(prev => ({
        ...prev,
        name:    currentCustomer.name  || prev.name,
        phone:   currentCustomer.phone || prev.phone,
        address: currentCustomer.address || prev.address,
      }));
    }
  }, [currentCustomer]);

  const update = (field, val) => {
    setForm(prev => ({ ...prev, [field]: val }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  // ── GPS handler ────────────────────────────────────────
  const handleGps = async () => {
    setGpsLoading(true);
    try {
      const result = await getGpsLink();
      update('gpsLink', result.link);
      toast.success('Position GPS enregistrée ✓');
    } catch {
      toast.error('GPS non disponible. Saisissez l\'adresse manuellement.');
    } finally {
      setGpsLoading(false);
    }
  };

  // ── Submit handler ─────────────────────────────────────
  const handleSubmit = () => {
    if (submitting) return;

    // Rate limiting
    if (!rateLimiter.check('checkout', 3, 60000)) {
      toast.error('Trop de tentatives. Réessayez dans quelques secondes.');
      return;
    }

    // Sanitize inputs
    const cleaned = {
      name:    sanitize(form.name, 80),
      phone:   sanitize(form.phone, 20),
      address: sanitize(form.address, 200),
      gpsLink: sanitize(form.gpsLink, 300),
    };

    // Validate
    const schema = isDelivery ? deliverySchema : takeawaySchema;
    const { valid, errors: errs } = validateForm(
      { ...cleaned, hasGps: !!cleaned.gpsLink },
      schema
    );

    if (!valid) {
      setErrors(errs);
      toast.error('Veuillez corriger les erreurs ci-dessous.');
      return;
    }

    // Build order extra
    const extra = {
      type:        orderMode,
      name:        cleaned.name,
      phone:       cleaned.phone,
      address:     cleaned.address,
      gpsLink:     cleaned.gpsLink,
      pickupTime:  form.pickupTime,
    };

    // Build WhatsApp message
    const waUrl = buildWhatsAppMessage({
      restaurantPhone: RESTAURANT.whatsapp,
      customerName:    cleaned.name,
      customerPhone:   cleaned.phone,
      mode:            orderMode,
      items:           cart.map(c => ({ name: c.item.name, qty: c.qty, price: c.item.price })),
      address:         isDelivery ? (cleaned.gpsLink || cleaned.address) : undefined,
      pickupTime:      isTakeaway ? form.pickupTime : undefined,
      total:           cartTotal + (isDelivery ? (ORDER_CONFIG?.deliveryFee || 20) : 0),
      tip:             form.tip,
    });

    setPendingOrder({ extra, waUrl });
    setShowWaModal(true);
  };

  // ── After confirmation (web or WA) ─────────────────────
  const confirmOrder = () => {
    if (!pendingOrder || submitting) return;
    setSubmitting(true);
    setShowWaModal(false);

    try {
      const id = placeOrder({
        tip:           form.tip,
        paymentMethod: form.paymentMethod,
        pointsUsed:    form.pointsUsed,
        extra:         pendingOrder.extra,
      });
      navigate('confirmation');
    } catch (e) {
      toast.error('Erreur lors de la commande. Réessayez.');
      setSubmitting(false);
    }
  };

  // Totals
  const deliveryFee = isDelivery ? (ORDER_CONFIG?.deliveryFee || 20) : 0;
  const discount    = activeDiscount > 0 ? Math.round(cartTotal * activeDiscount / 100) : 0;
  const total       = cartTotal + deliveryFee + (form.tip || 0) - discount;

  const fieldClass = (field) =>
    `input-asaka ${errors[field] ? 'border-red-500/60 focus:border-red-500' : ''}`;

  return (
    <div className="min-h-screen bg-asaka-900 pt-16 sm:pt-20 pb-16">
      <div className="max-w-xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 py-5 mb-2">
          <button onClick={() => navigate('cart')}
            className="w-10 h-10 rounded-xl glass-light flex items-center justify-center
              text-asaka-muted hover:text-white transition-colors">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"/>
            </svg>
          </button>
          <div>
            <h1 className="text-white font-black text-xl">
              {isTakeaway ? '🥡 À Emporter' : '🛵 Livraison'}
            </h1>
            <p className="text-asaka-muted text-xs">Renseignez vos informations</p>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="text-asaka-muted text-xs font-semibold mb-1.5 block">
              Nom complet *
            </label>
            <input
              type="text"
              value={form.name}
              onChange={e => update('name', e.target.value)}
              placeholder="Votre prénom et nom"
              className={fieldClass('name')}
              autoComplete="name"
            />
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="text-asaka-muted text-xs font-semibold mb-1.5 block">
              Numéro de téléphone *
            </label>
            <input
              type="tel"
              value={form.phone}
              onChange={e => update('phone', e.target.value)}
              placeholder="+212 6XX XXX XXX"
              className={fieldClass('phone')}
              autoComplete="tel"
            />
            {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
          </div>

          {/* Delivery-specific fields */}
          {isDelivery && (
            <>
              {/* GPS button */}
              <div>
                <label className="text-asaka-muted text-xs font-semibold mb-1.5 block">
                  Localisation GPS (recommandé)
                </label>
                <button
                  type="button"
                  onClick={handleGps}
                  disabled={gpsLoading}
                  className={`w-full flex items-center justify-center gap-3 py-3.5 rounded-xl
                    border text-sm font-semibold transition-all ${
                    form.gpsLink
                      ? 'bg-green-900/30 border-green-600/40 text-green-400'
                      : 'glass-light border-asaka-600/40 text-asaka-300 hover:border-asaka-400'
                  }`}>
                  {gpsLoading ? (
                    <>
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10"
                          stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                      Localisation en cours...
                    </>
                  ) : form.gpsLink ? (
                    <>✅ Position enregistrée — Tap pour actualiser</>
                  ) : (
                    <>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                        className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round"
                          d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/>
                        <path strokeLinecap="round" strokeLinejoin="round"
                          d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/>
                      </svg>
                      Utiliser ma position GPS
                    </>
                  )}
                </button>
              </div>

              {/* Manual address */}
              <div>
                <label className="text-asaka-muted text-xs font-semibold mb-1.5 block">
                  Adresse de livraison {!form.gpsLink && '*'}
                </label>
                <textarea
                  value={form.address}
                  onChange={e => update('address', e.target.value)}
                  placeholder="N° appartement, rue, quartier, ville..."
                  rows={3}
                  className={`${fieldClass('address')} resize-none`}
                  autoComplete="street-address"
                />
                {errors.address && <p className="text-red-400 text-xs mt-1">{errors.address}</p>}
              </div>
            </>
          )}

          {/* Pickup time (takeaway only) */}
          {isTakeaway && (
            <div>
              <label className="text-asaka-muted text-xs font-semibold mb-1.5 block">
                Temps de retrait estimé
              </label>
              <div className="flex gap-2 flex-wrap">
                {PICKUP_TIMES.map(t => (
                  <button key={t}
                    type="button"
                    onClick={() => update('pickupTime', t)}
                    className={`flex-1 min-w-[90px] py-2.5 rounded-xl text-xs font-bold
                      transition-all ${
                      form.pickupTime === t
                        ? 'bg-asaka-500 text-white'
                        : 'glass-light text-asaka-muted hover:text-white'
                    }`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Payment method */}
          <div>
            <label className="text-asaka-muted text-xs font-semibold mb-1.5 block">
              Paiement
            </label>
            <div className="flex gap-2">
              {[
                { id: 'cash', label: '💵 Espèces' },
                { id: 'card', label: '💳 Carte' },
              ].map(pm => (
                <button key={pm.id} type="button"
                  onClick={() => update('paymentMethod', pm.id)}
                  className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
                    form.paymentMethod === pm.id
                      ? 'bg-asaka-500 text-white'
                      : 'glass-light text-asaka-muted hover:text-white'
                  }`}>
                  {pm.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tip */}
          <div>
            <label className="text-asaka-muted text-xs font-semibold mb-1.5 block">
              Pourboire (optionnel)
            </label>
            <div className="flex gap-2">
              {(ORDER_CONFIG?.tipOptions || [0, 5, 10, 15]).map(t => (
                <button key={t} type="button"
                  onClick={() => update('tip', t)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    form.tip === t
                      ? 'bg-asaka-500 text-white'
                      : 'glass-light text-asaka-muted hover:text-white'
                  }`}>
                  {t === 0 ? 'Non' : `+${t} DH`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Order summary */}
        <div className="glass rounded-2xl p-5 mt-6 space-y-3">
          {[
            { label: 'Articles', value: `${cartTotal} DH` },
            ...(deliveryFee > 0 ? [{ label: 'Livraison', value: `+${deliveryFee} DH` }] : []),
            ...(discount > 0 ? [{ label: `Remise (${activeDiscount}%)`, value: `-${discount} DH`, green: true }] : []),
            ...(form.tip > 0 ? [{ label: 'Pourboire', value: `+${form.tip} DH` }] : []),
          ].map(row => (
            <div key={row.label} className="flex justify-between text-sm">
              <span className="text-asaka-muted">{row.label}</span>
              <span className={row.green ? 'text-green-400' : 'text-white'}>{row.value}</span>
            </div>
          ))}
          <div className="border-t border-asaka-700/40 pt-3 flex justify-between">
            <span className="text-white font-bold">Total</span>
            <span className="text-asaka-300 font-black text-xl">{total} DH</span>
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="btn-primary w-full py-4 text-base mt-6 flex items-center justify-center gap-2
            disabled:opacity-50 disabled:cursor-not-allowed">
          {submitting ? (
            <>
              <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10"
                  stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              Traitement...
            </>
          ) : (
            <>Confirmer la commande · {total} DH</>
          )}
        </button>
      </div>

      {/* WhatsApp / Web confirmation modal */}
      {showWaModal && pendingOrder && (
        <WaConfirmModal
          whatsappUrl={pendingOrder.waUrl}
          onConfirmWeb={confirmOrder}
          onClose={() => setShowWaModal(false)}
          total={total}
          mode={orderMode}
        />
      )}
    </div>
  );
};

export default UnifiedCheckout;
