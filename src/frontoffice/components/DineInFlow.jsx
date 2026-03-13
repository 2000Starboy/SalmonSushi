import React, { useState } from 'react';
import {
  ArrowLeft, ArrowRight, Plus, Minus, Trash2, ShoppingBag,
  MapPin, CreditCard, Wallet, Star, CheckCircle2, ChefHat, Search
} from 'lucide-react';
import { menuItems, menuCategories, POINTS_PER_DH, POINTS_VALUE } from '../../data/menuData';

// ─── Step 1: Table Select ─────────────────────────────────────────────────────
const TableSelect = ({ tableNumber, setTableNumber, onContinue }) => {
  const tables = Array.from({ length: 20 }, (_, i) => String(i + 1));
  const [selected, setSelected] = useState(tableNumber || '');

  const confirm = () => {
    if (!selected) return;
    setTableNumber(selected);
    onContinue();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-20">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 rounded-3xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center mx-auto mb-6">
          <MapPin size={36} className="text-orange-400" />
        </div>
        <h1 className="text-3xl font-extrabold text-white mb-2">Dîner en Salle ?</h1>
        <p className="text-zinc-400 mb-8 text-sm">
          Sélectionnez votre numéro de table pour commander directement depuis votre place.
        </p>

        {/* Table Grid */}
        <div className="grid grid-cols-5 gap-2 mb-8">
          {tables.map((t) => (
            <button
              key={t}
              onClick={() => setSelected(t)}
              className={`h-11 rounded-xl font-bold text-sm transition-all ${
                selected === t
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/40 scale-105'
                  : 'bg-white/5 border border-white/10 text-zinc-300 hover:bg-white/10 hover:border-orange-500/30'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Manual input */}
        <div className="flex items-center space-x-2 mb-6">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-zinc-600 text-xs">ou entrez manuellement</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>
        <input
          type="text"
          placeholder="Numéro de table (ex: 12)"
          value={selected}
          onChange={e => setSelected(e.target.value)}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 focus:border-orange-500/50 rounded-xl text-white placeholder:text-zinc-600 outline-none text-sm text-center mb-6"
        />

        <button
          onClick={confirm}
          disabled={!selected}
          className="w-full py-4 bg-orange-500 hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-2xl transition-all shadow-xl shadow-orange-500/30 flex items-center justify-center space-x-2"
        >
          <span>Choisir la Table {selected && `N° ${selected}`}</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};

// ─── Step 2: Menu Browse ──────────────────────────────────────────────────────
const MenuBrowse = ({ cart, addToCart, updateCartQty, navigate, onViewCart, tableNumber }) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = menuItems.filter((item) => {
    const matchCat = activeCategory === 'all' || item.category === activeCategory;
    const matchSearch = !search ||
      item.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const cartQty = (id) => {
    const c = cart.find(c => c.item.id === id);
    return c ? c.qty : 0;
  };

  const cartTotal = cart.reduce((s, c) => s + c.item.price * c.qty, 0);
  const cartCount = cart.reduce((s, c) => s + c.qty, 0);

  return (
    <div className="min-h-screen pt-20 pb-32">
      {/* Sticky header */}
      <div className="sticky top-16 z-30 bg-[#0d0d0d]/95 backdrop-blur-md border-b border-white/10 px-6 py-3">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="px-3 py-1 bg-orange-500/15 border border-orange-500/30 rounded-full text-orange-400 text-xs font-bold">
                Table {tableNumber}
              </div>
              <span className="text-white font-semibold text-sm">Commander</span>
            </div>
          </div>
          {/* Search */}
          <div className="relative mb-3">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-zinc-600 text-xs outline-none"
            />
          </div>
          {/* Categories */}
          <div className="flex space-x-2 overflow-x-auto pb-1">
            {menuCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap flex-shrink-0 transition-all ${
                  activeCategory === cat.id
                    ? 'bg-orange-500 text-white'
                    : 'bg-white/5 border border-white/10 text-zinc-400 hover:text-white'
                }`}
              >
                <span>{cat.emoji}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Items Grid */}
      <div className="max-w-6xl mx-auto px-6 pt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((item) => {
            const qty = cartQty(item.id);
            return (
              <div
                key={item.id}
                className="group bg-white/5 border border-white/10 hover:border-orange-500/30 rounded-2xl overflow-hidden cursor-pointer transition-all hover:scale-[1.01]"
                onClick={() => navigate('product', { itemId: item.id })}
              >
                <div className={`h-28 bg-gradient-to-br ${item.gradient} flex items-center justify-center relative`}>
                  <span className="text-5xl group-hover:scale-110 transition-transform">{item.emoji}</span>
                  {item.spicy && <span className="absolute top-2 right-2 text-sm">🌶️</span>}
                </div>
                <div className="p-3">
                  <h3 className="text-white font-bold text-xs mb-1 truncate">{item.name}</h3>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-orange-400 font-extrabold text-sm">{item.price} Dh</span>
                    {qty > 0 ? (
                      <div
                        className="flex items-center space-x-2"
                        onClick={e => e.stopPropagation()}
                      >
                        <button
                          onClick={() => updateCartQty(item.id, qty - 1)}
                          className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-sm transition-all"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="text-orange-400 font-bold text-sm min-w-[16px] text-center">{qty}</span>
                        <button
                          onClick={() => updateCartQty(item.id, qty + 1)}
                          className="w-6 h-6 rounded-full bg-orange-500 hover:bg-orange-600 flex items-center justify-center text-white transition-all"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={(e) => { e.stopPropagation(); addToCart(item); }}
                        className="w-7 h-7 rounded-full bg-orange-500 hover:bg-orange-600 flex items-center justify-center text-white font-bold transition-all shadow-md shadow-orange-500/30"
                      >
                        +
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cart FAB */}
      {cartCount > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
          <button
            onClick={onViewCart}
            className="flex items-center space-x-3 px-6 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl shadow-2xl shadow-orange-500/40 transition-all hover:scale-105"
          >
            <ShoppingBag size={20} />
            <span>Voir le Panier ({cartCount})</span>
            <span className="font-extrabold">{cartTotal} Dh</span>
          </button>
        </div>
      )}
    </div>
  );
};

// ─── Step 3: Cart Review ──────────────────────────────────────────────────────
const CartReview = ({ cart, updateCartQty, removeFromCart, onBack, onCheckout, tableNumber }) => {
  const subtotal = cart.reduce((s, c) => s + c.item.price * c.qty, 0);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold text-white mb-2">Panier Vide</h2>
          <p className="text-zinc-400 mb-6">Ajoutez des plats depuis le menu.</p>
          <button onClick={onBack} className="px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold">
            Retour au Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-xl mx-auto">
        <button onClick={onBack} className="flex items-center space-x-2 text-zinc-400 hover:text-white text-sm mb-6 transition-colors">
          <ArrowLeft size={16} />
          <span>Continuer les achats</span>
        </button>

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-extrabold text-white">Mon Panier</h1>
          <div className="px-3 py-1 bg-orange-500/15 border border-orange-500/30 rounded-full text-orange-400 text-xs font-bold">
            Table {tableNumber}
          </div>
        </div>

        {/* Items */}
        <div className="space-y-3 mb-8">
          {cart.map(({ item, qty }) => (
            <div key={item.id} className="flex items-center space-x-4 p-4 bg-white/5 border border-white/10 rounded-2xl">
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center flex-shrink-0`}>
                <span className="text-3xl">{item.emoji}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-semibold text-sm truncate">{item.name}</h3>
                <p className="text-orange-400 font-bold text-sm">{item.price * qty} Dh</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => updateCartQty(item.id, qty - 1)}
                  className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all"
                >
                  <Minus size={13} />
                </button>
                <span className="text-white font-bold w-5 text-center">{qty}</span>
                <button
                  onClick={() => updateCartQty(item.id, qty + 1)}
                  className="w-7 h-7 rounded-full bg-orange-500 hover:bg-orange-600 flex items-center justify-center text-white transition-all"
                >
                  <Plus size={13} />
                </button>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="w-7 h-7 rounded-full hover:bg-red-500/20 flex items-center justify-center text-zinc-500 hover:text-red-400 transition-all ml-1"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="p-5 bg-white/5 border border-white/10 rounded-2xl mb-6">
          <div className="flex justify-between text-zinc-400 text-sm mb-2">
            <span>Sous-total</span>
            <span>{subtotal} Dh</span>
          </div>
          <div className="flex justify-between text-zinc-500 text-xs mb-3">
            <span>Pourboire</span>
            <span>À choisir</span>
          </div>
          <div className="flex justify-between text-white font-bold text-lg border-t border-white/10 pt-3">
            <span>Total estimé</span>
            <span className="text-orange-400">{subtotal} Dh +</span>
          </div>
        </div>

        <button
          onClick={onCheckout}
          className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl transition-all shadow-xl shadow-orange-500/30 flex items-center justify-center space-x-2"
        >
          <span>Passer à la Caisse</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};

// ─── Step 4: Checkout ─────────────────────────────────────────────────────────
const Checkout = ({ cart, onBack, onPlaceOrder, currentCustomer, tableNumber }) => {
  const subtotal = cart.reduce((s, c) => s + c.item.price * c.qty, 0);
  const [tipPercent, setTipPercent] = useState(10);
  const [customTip, setCustomTip] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [usePoints, setUsePoints] = useState(false);

  const tipAmount = customTip !== '' ? Number(customTip) : Math.round(subtotal * tipPercent / 100);
  const availablePoints = currentCustomer?.points || 0;
  const pointsDiscount = usePoints ? Math.floor(availablePoints * POINTS_VALUE) : 0;
  const total = Math.max(0, subtotal + tipAmount - pointsDiscount);

  const pointsToEarn = Math.floor(total) * POINTS_PER_DH;

  const handleConfirm = () => {
    onPlaceOrder({
      tip: tipAmount,
      paymentMethod,
      pointsUsed: usePoints ? availablePoints : 0,
    });
  };

  const tipOptions = [
    { label: 'Sans', value: 0 },
    { label: '5%', value: 5 },
    { label: '10%', value: 10 },
    { label: '15%', value: 15 },
    { label: '20%', value: 20 },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-xl mx-auto">
        <button onClick={onBack} className="flex items-center space-x-2 text-zinc-400 hover:text-white text-sm mb-6 transition-colors">
          <ArrowLeft size={16} />
          <span>Retour au panier</span>
        </button>

        <h1 className="text-3xl font-extrabold text-white mb-8">Finaliser</h1>

        {/* Order Summary */}
        <div className="p-4 bg-white/5 border border-white/10 rounded-2xl mb-6">
          <h3 className="text-white font-semibold mb-3 text-sm">Récapitulatif — Table {tableNumber}</h3>
          <div className="space-y-1.5">
            {cart.map(({ item, qty }) => (
              <div key={item.id} className="flex justify-between text-xs text-zinc-400">
                <span>{qty}× {item.name}</span>
                <span>{item.price * qty} Dh</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tip */}
        <div className="p-5 bg-white/5 border border-white/10 rounded-2xl mb-4">
          <h3 className="text-white font-semibold mb-4">Pourboire</h3>
          <div className="flex space-x-2 mb-4">
            {tipOptions.map(opt => (
              <button
                key={opt.value}
                onClick={() => { setTipPercent(opt.value); setCustomTip(''); }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                  tipPercent === opt.value && customTip === ''
                    ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
                    : 'bg-white/5 border border-white/10 text-zinc-400 hover:text-white'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <div className="flex items-center space-x-3">
            <input
              type="number"
              placeholder="Montant personnalisé (Dh)"
              value={customTip}
              onChange={e => { setCustomTip(e.target.value); setTipPercent(-1); }}
              className="flex-1 px-3 py-2 bg-white/5 border border-white/10 focus:border-orange-500/50 rounded-xl text-white placeholder:text-zinc-600 text-sm outline-none"
            />
          </div>
          {tipAmount > 0 && (
            <p className="text-orange-400/70 text-xs mt-2">
              Pourboire: +{tipAmount} Dh — Merci pour votre générosité! 🙏
            </p>
          )}
        </div>

        {/* Points */}
        {currentCustomer && availablePoints >= 100 && (
          <div className="p-5 bg-white/5 border border-white/10 rounded-2xl mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Star size={20} className="text-amber-400" />
                <div>
                  <h3 className="text-white font-semibold text-sm">Utiliser mes Points</h3>
                  <p className="text-zinc-500 text-xs">{availablePoints} pts → -{Math.floor(availablePoints * POINTS_VALUE)} Dh</p>
                </div>
              </div>
              <button
                onClick={() => setUsePoints(!usePoints)}
                className={`w-12 h-6 rounded-full transition-all relative ${usePoints ? 'bg-orange-500' : 'bg-white/10'}`}
              >
                <span
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${usePoints ? 'left-6' : 'left-0.5'}`}
                />
              </button>
            </div>
            {usePoints && (
              <div className="mt-2 text-green-400 text-xs font-medium">
                ✓ Réduction de {pointsDiscount} Dh appliquée
              </div>
            )}
          </div>
        )}

        {/* Payment Method */}
        <div className="p-5 bg-white/5 border border-white/10 rounded-2xl mb-6">
          <h3 className="text-white font-semibold mb-4">Mode de Paiement</h3>
          <div className="space-y-3">
            {[
              { id: 'cash', icon: <Wallet size={18} />, label: 'Espèces', desc: 'Payer en liquide à la caisse' },
              { id: 'card', icon: <CreditCard size={18} />, label: 'Carte Bancaire', desc: 'CB, Visa, Mastercard' },
              ...(currentCustomer && availablePoints >= 1000 ? [{
                id: 'points',
                icon: <Star size={18} />,
                label: 'Points Entièrement',
                desc: `Tout payer avec vos ${availablePoints} pts`
              }] : []),
            ].map((method) => (
              <button
                key={method.id}
                onClick={() => setPaymentMethod(method.id)}
                className={`w-full flex items-center space-x-3 p-3.5 rounded-xl border transition-all text-left ${
                  paymentMethod === method.id
                    ? 'border-orange-500/60 bg-orange-500/10 text-white'
                    : 'border-white/10 bg-white/3 text-zinc-400 hover:border-white/20'
                }`}
              >
                <div className={paymentMethod === method.id ? 'text-orange-400' : 'text-zinc-500'}>
                  {method.icon}
                </div>
                <div>
                  <div className="text-sm font-semibold">{method.label}</div>
                  <div className="text-xs text-zinc-500">{method.desc}</div>
                </div>
                {paymentMethod === method.id && (
                  <div className="ml-auto">
                    <CheckCircle2 size={18} className="text-orange-400" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Total */}
        <div className="p-5 bg-white/5 border border-white/10 rounded-2xl mb-6">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-zinc-400">
              <span>Sous-total</span>
              <span>{subtotal} Dh</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>Pourboire</span>
              <span>+{tipAmount} Dh</span>
            </div>
            {usePoints && (
              <div className="flex justify-between text-green-400">
                <span>Réduction Points</span>
                <span>-{pointsDiscount} Dh</span>
              </div>
            )}
            <div className="flex justify-between text-white font-extrabold text-lg pt-2 border-t border-white/10">
              <span>TOTAL</span>
              <span className="text-orange-400">{total} Dh</span>
            </div>
          </div>

          {currentCustomer && (
            <div className="mt-3 pt-3 border-t border-white/10 flex items-center space-x-2 text-xs text-amber-400">
              <Star size={13} />
              <span>Vous gagnerez +{pointsToEarn} points avec cette commande</span>
            </div>
          )}
        </div>

        {/* Confirm */}
        <button
          onClick={handleConfirm}
          className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-base rounded-2xl transition-all shadow-xl shadow-orange-500/30 hover:shadow-orange-500/50 flex items-center justify-center space-x-3"
        >
          <ChefHat size={22} />
          <span>Confirmer la Commande · {total} Dh</span>
        </button>
        <p className="text-zinc-600 text-xs text-center mt-3">
          Votre commande sera transmise en cuisine immédiatement.
        </p>
      </div>
    </div>
  );
};

// ─── Step 5: Confirmation ─────────────────────────────────────────────────────
const Confirmation = ({ orderId, navigate, currentCustomer, pointsEarned, tableNumber }) => (
  <div className="min-h-screen flex items-center justify-center px-6">
    <div className="max-w-md w-full text-center">
      {/* Success animation */}
      <div className="relative w-28 h-28 mx-auto mb-8">
        <div className="w-28 h-28 rounded-full bg-emerald-500/20 border-2 border-emerald-500/50 flex items-center justify-center animate-[ping_1s_ease-out_1]">
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <CheckCircle2 size={56} className="text-emerald-400" />
        </div>
      </div>

      <h1 className="text-3xl font-extrabold text-white mb-2">Commande Envoyée !</h1>
      <p className="text-zinc-400 mb-1">Table {tableNumber} · Commande {orderId}</p>
      <p className="text-zinc-500 text-sm mb-8">
        Votre commande a été transmise en cuisine. Détendez-vous, notre équipe s'en occupe !
      </p>

      {/* Points earned */}
      {currentCustomer && pointsEarned > 0 && (
        <div className="flex items-center justify-center space-x-2 px-5 py-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl mb-8">
          <Star size={18} className="text-amber-400 fill-amber-400" />
          <span className="text-amber-400 font-bold">+{pointsEarned} points gagnés !</span>
          <Star size={18} className="text-amber-400 fill-amber-400" />
        </div>
      )}

      <div className="p-5 bg-white/5 border border-white/10 rounded-2xl mb-8 text-left">
        <h3 className="text-white font-semibold mb-2 text-sm">Prochaines Étapes</h3>
        <div className="space-y-2 text-xs text-zinc-400">
          <div className="flex items-start space-x-2">
            <span className="text-orange-400">①</span>
            <span>Votre commande est confirmée en cuisine</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-orange-400">②</span>
            <span>Préparation en cours (~15-25 min)</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-orange-400">③</span>
            <span>Service à votre table</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-orange-400">④</span>
            <span>Paiement à la fin du repas</span>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => navigate('dine-in')}
          className="flex-1 py-3 bg-white/10 border border-white/20 text-white font-semibold rounded-xl text-sm hover:bg-white/15 transition-colors"
        >
          Commander Plus
        </button>
        <button
          onClick={() => navigate('home')}
          className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl text-sm transition-colors shadow-lg shadow-orange-500/30"
        >
          Accueil
        </button>
      </div>
    </div>
  </div>
);

// ─── Main DineInFlow ──────────────────────────────────────────────────────────
const DineInFlow = ({
  navigate,
  cart,
  addToCart,
  updateCartQty,
  removeFromCart,
  clearCart,
  cartTotal,
  cartCount,
  tableNumber,
  setTableNumber,
  placeOrder,
  currentCustomer,
}) => {
  const [step, setStep] = useState(tableNumber ? 'menu' : 'table');
  const [confirmedOrderId, setConfirmedOrderId] = useState(null);
  const [earnedPoints, setEarnedPoints] = useState(0);

  const handleTableConfirmed = () => setStep('menu');
  const handleViewCart = () => setStep('cart');
  const handleBackToMenu = () => setStep('menu');
  const handleCheckout = () => setStep('checkout');
  const handleBackToCart = () => setStep('cart');

  const handlePlaceOrder = (checkoutData) => {
    const orderId = placeOrder(checkoutData);
    const subtotal = cart.reduce((s, c) => s + c.item.price * c.qty, 0);
    const tipAmount = checkoutData.tip || 0;
    const discount = (checkoutData.pointsUsed || 0) * 0.1;
    const total = subtotal + tipAmount - discount;
    setEarnedPoints(Math.floor(total) * POINTS_PER_DH);
    setConfirmedOrderId(orderId);
    setStep('confirmation');
  };

  switch (step) {
    case 'table':
      return (
        <TableSelect
          tableNumber={tableNumber}
          setTableNumber={setTableNumber}
          onContinue={handleTableConfirmed}
        />
      );
    case 'menu':
      return (
        <MenuBrowse
          cart={cart}
          addToCart={addToCart}
          updateCartQty={updateCartQty}
          navigate={navigate}
          onViewCart={handleViewCart}
          tableNumber={tableNumber}
        />
      );
    case 'cart':
      return (
        <CartReview
          cart={cart}
          updateCartQty={updateCartQty}
          removeFromCart={removeFromCart}
          onBack={handleBackToMenu}
          onCheckout={handleCheckout}
          tableNumber={tableNumber}
        />
      );
    case 'checkout':
      return (
        <Checkout
          cart={cart}
          onBack={handleBackToCart}
          onPlaceOrder={handlePlaceOrder}
          currentCustomer={currentCustomer}
          tableNumber={tableNumber}
        />
      );
    case 'confirmation':
      return (
        <Confirmation
          orderId={confirmedOrderId}
          navigate={navigate}
          currentCustomer={currentCustomer}
          pointsEarned={earnedPoints}
          tableNumber={tableNumber}
        />
      );
    default:
      return null;
  }
};

export default DineInFlow;
