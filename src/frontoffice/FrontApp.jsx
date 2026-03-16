// ═══════════════════════════════════════════════════════════
//  ASAKA SUSHI — Front Office App Shell
//  State-based routing, global cart, auth, order mode
// ═══════════════════════════════════════════════════════════
import React, { useState, useEffect } from 'react';
import FrontNavbar from './components/FrontNavbar';
import BottomNav from './components/BottomNav';
import OffersBanner from './components/OffersBanner';
import HomePage from './components/HomePage';
import MenuPage from './components/MenuPage';
import CartPage from './components/CartPage';
import UnifiedCheckout from './components/UnifiedCheckout';
import OrderConfirmation from './components/OrderConfirmation';
import CustomerAuth from './components/CustomerAuth';
import CustomerProfile from './components/CustomerProfile';
import Footer from './components/Footer';
import { ToastContainer } from '../utils/toast';
import { ORDER_CONFIG } from '../data/asakaData';

const FrontApp = ({
  onGoToBackoffice,
  ordersData,
  setOrdersData,
  frontCustomers,
  setFrontCustomers,
  activeOffers = [],
}) => {
  // ── Theme (always dark for Asaka) ─────────────────
  const [theme] = useState('dark');
  const isLight = false;

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  // ── Routing ───────────────────────────────────────
  const [page, setPage] = useState('home');
  const [selectedItemId, setSelectedItemId] = useState(null);

  // ── Order Mode ────────────────────────────────────
  // null | 'takeaway' | 'delivery'  (dine-in removed)
  const [orderMode, setOrderModeState] = useState(null);

  const setOrderMode = (mode) => {
    // Enforce only valid modes
    if (mode === null || mode === 'takeaway' || mode === 'delivery') {
      setOrderModeState(mode);
    }
  };

  // ── Last Order ────────────────────────────────────
  const [lastOrderId, setLastOrderId] = useState(null);
  const [lastOrderPoints, setLastOrderPoints] = useState(0);
  const [lastOrderTotal, setLastOrderTotal] = useState(0);
  const [lastOrderMode, setLastOrderMode] = useState(null);

  // ── Auth ──────────────────────────────────────────
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [currentCustomer, setCurrentCustomer] = useState(null);

  // ── Cart ──────────────────────────────────────────
  const [cart, setCart] = useState([]);

  // ── Navigation ────────────────────────────────────
  const navigate = (target, params = {}) => {
    if (params.itemId) setSelectedItemId(params.itemId);
    setPage(target);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ── Cart helpers ──────────────────────────────────
  const addToCart = (item, qty = 1) => {
    setCart(prev => {
      const existing = prev.find(c => c.item.id === item.id);
      if (existing) return prev.map(c =>
        c.item.id === item.id ? { ...c, qty: c.qty + qty } : c
      );
      return [...prev, { item, qty }];
    });
  };

  const removeFromCart = (itemId) =>
    setCart(prev => prev.filter(c => c.item.id !== itemId));

  const updateCartQty = (itemId, qty) => {
    if (qty <= 0) { removeFromCart(itemId); return; }
    setCart(prev => prev.map(c =>
      c.item.id === itemId ? { ...c, qty } : c
    ));
  };

  const clearCart = () => setCart([]);
  const cartTotal = cart.reduce((sum, c) => sum + c.item.price * c.qty, 0);
  const cartCount = cart.reduce((sum, c) => sum + c.qty, 0);

  // ── Auth helpers ──────────────────────────────────
  const openAuth  = (mode = 'login') => { setAuthMode(mode); setShowAuth(true); };
  const handleLogin = (customer) => { setCurrentCustomer(customer); setShowAuth(false); };

  const handleSignup = (newCustomer) => {
    const customer = {
      ...newCustomer,
      id: `AC-${Date.now()}`,
      points: 0,
      totalOrders: 0,
      totalSpent: 0,
      orderHistory: [],
      favorites: [],
      joinedDate: new Date().toLocaleDateString('fr-MA'),
    };
    setFrontCustomers(prev => [...prev, customer]);
    setCurrentCustomer(customer);
    setShowAuth(false);
  };

  const handleLogout = () => {
    setCurrentCustomer(null);
    if (page === 'profile') navigate('home');
  };

  // ── Offer discount ────────────────────────────────
  const activeDiscount = activeOffers.length > 0
    ? Math.max(...activeOffers.map(o => o.discountPercent))
    : 0;

  const getDiscountedPrice = (originalPrice) => {
    if (!activeOffers.length) return originalPrice;
    return activeDiscount > 0
      ? Math.round(originalPrice * (1 - activeDiscount / 100))
      : originalPrice;
  };

  // ── Order placement ───────────────────────────────
  const placeOrder = ({ tip = 0, paymentMethod = 'cash', pointsUsed = 0, extra = {} }) => {
    const subtotal       = cartTotal;
    const pointsDiscount = pointsUsed * (ORDER_CONFIG?.pointsValue ?? 0.1);
    const offerDiscount  = activeDiscount > 0 ? subtotal * (activeDiscount / 100) : 0;
    const deliveryFee    = (extra.type || orderMode) === 'delivery'
      ? (ORDER_CONFIG?.deliveryFee ?? 20)
      : 0;
    const total          = Math.max(0, subtotal + tip - pointsDiscount - offerDiscount + deliveryFee);
    const roundedTotal   = Math.round(total);
    const pointsEarned   = Math.floor(roundedTotal);

    const mode    = extra.type || orderMode || 'takeaway';
    const orderId = `#${1100 + ordersData.length}`;

    const location = mode === 'delivery'
      ? `Livraison — ${extra.address || extra.gpsLink || ''}`
      : `À Emporter — ${extra.name || ''}`;

    const newOrder = {
      id:            orderId,
      customer:      currentCustomer ? currentCustomer.name : (extra.name || 'Client'),
      items:         cart.map(c => `${c.qty}x ${c.item.name}`).join(', '),
      total:         `${roundedTotal} DH`,
      status:        'new',
      platform:      'Site Web',
      time:          'Maintenant',
      location,
      paymentMethod,
      tip:           `${tip} DH`,
      source:        'frontoffice',
      mode,
      phone:         extra.phone || '',
      address:       extra.address || '',
      gpsLink:       extra.gpsLink || '',
      pickupTime:    extra.pickupTime || '',
    };

    setOrdersData(prev => [newOrder, ...prev]);

    // Update customer stats
    if (currentCustomer) {
      const updated = {
        ...currentCustomer,
        points: Math.max(0, (currentCustomer.points || 0) - pointsUsed) + pointsEarned,
        totalOrders: (currentCustomer.totalOrders || 0) + 1,
        totalSpent:  (currentCustomer.totalSpent  || 0) + roundedTotal,
        orderHistory: [
          {
            id:    orderId,
            date:  new Date().toLocaleDateString('fr-MA'),
            total: roundedTotal,
            items: cart.map(c => c.item.name),
            mode,
          },
          ...(currentCustomer.orderHistory || []),
        ],
      };
      setCurrentCustomer(updated);
      setFrontCustomers(prev => prev.map(c =>
        c.id === currentCustomer.id ? updated : c
      ));
    }

    setLastOrderId(orderId);
    setLastOrderPoints(pointsEarned);
    setLastOrderTotal(roundedTotal);
    setLastOrderMode(mode);

    clearCart();
    setOrderMode(null);
    return orderId;
  };

  // ── Shared props ──────────────────────────────────
  const sharedProps = {
    navigate,
    currentCustomer,
    openAuth,
    handleLogout,
    cart,
    cartCount,
    cartTotal,
    addToCart,
    removeFromCart,
    updateCartQty,
    clearCart,
    placeOrder,
    isLight,
    theme,
    activeOffers,
    activeDiscount,
    getDiscountedPrice,
    orderMode,
    setOrderMode,
    lastOrderId,
    lastOrderPoints,
    lastOrderTotal,
    lastOrderMode,
  };

  // ── Page renderer ─────────────────────────────────
  const renderPage = () => {
    switch (page) {
      case 'home':         return <HomePage    {...sharedProps} />;
      case 'menu':         return <MenuPage    {...sharedProps} />;
      case 'cart':         return <CartPage    {...sharedProps} />;
      case 'checkout':     return <UnifiedCheckout {...sharedProps} />;
      case 'confirmation': return <OrderConfirmation {...sharedProps} />;
      case 'profile':      return <CustomerProfile {...sharedProps} />;
      default:             return <HomePage    {...sharedProps} />;
    }
  };

  // Pages that should NOT show the BottomNav
  const hideBottomNav = ['checkout', 'confirmation'].includes(page);

  return (
    <div className="min-h-screen bg-asaka-900 text-white font-sans antialiased">
      {/* Desktop-only top navbar */}
      <FrontNavbar
        {...sharedProps}
        currentPage={page}
        onGoToBackoffice={onGoToBackoffice}
      />

      {/* Offers banner */}
      {(page === 'home' || page === 'menu') && activeOffers.length > 0 && (
        <div className="pt-16 sm:pt-20">
          <OffersBanner
            offers={activeOffers}
            navigate={navigate}
            theme={theme}
          />
        </div>
      )}

      {/* Main content — bottom padding for BottomNav on mobile */}
      <main className={!hideBottomNav ? 'pb-20 sm:pb-0' : ''}>
        {renderPage()}
      </main>

      {/* Desktop footer (hidden on mobile to avoid clash with BottomNav) */}
      {!['checkout', 'confirmation'].includes(page) && (
        <Footer
          navigate={navigate}
          onGoToBackoffice={onGoToBackoffice}
          isLight={isLight}
        />
      )}

      {/* Mobile bottom navigation */}
      {!hideBottomNav && (
        <div className="sm:hidden">
          <BottomNav
            currentPage={page}
            navigate={navigate}
            cartCount={cartCount}
            currentCustomer={currentCustomer}
            openAuth={openAuth}
          />
        </div>
      )}

      {/* Auth modal */}
      {showAuth && (
        <CustomerAuth
          mode={authMode}
          setMode={setAuthMode}
          onLogin={handleLogin}
          onSignup={handleSignup}
          onClose={() => setShowAuth(false)}
          frontCustomers={frontCustomers}
        />
      )}

      {/* Toast notifications */}
      <ToastContainer />
    </div>
  );
};

export default FrontApp;
