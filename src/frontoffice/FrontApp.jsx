import React, { useState, useEffect } from 'react';
import FrontNavbar from './components/FrontNavbar';
import OffersBanner from './components/OffersBanner';
import HomePage from './components/HomePage';
import MenuPage from './components/MenuPage';
import ProductPage from './components/ProductPage';
import DineInFlow from './components/DineInFlow';
import CartPage from './components/CartPage';
import TakeAwayFlow from './components/TakeAwayFlow';
import UnifiedCheckout from './components/UnifiedCheckout';
import OrderConfirmation from './components/OrderConfirmation';
import CustomerAuth from './components/CustomerAuth';
import CustomerProfile from './components/CustomerProfile';
import Footer from './components/Footer';

const FrontApp = ({
  onGoToBackoffice,
  ordersData,
  setOrdersData,
  frontCustomers,
  setFrontCustomers,
  activeOffers = [],
}) => {
  // ── Language & Theme ──────────────────────────────
  const [language, setLanguage] = useState(() => localStorage.getItem('salmon_lang') || 'fr');
  const [theme, setTheme] = useState(() => localStorage.getItem('salmon_theme') || 'dark');

  useEffect(() => {
    localStorage.setItem('salmon_lang', language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  useEffect(() => {
    localStorage.setItem('salmon_theme', theme);
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  const isLight = theme === 'light';
  const isRTL = language === 'ar';

  // ── Routing ───────────────────────────────────────
  const [page, setPage] = useState('home');
  const [selectedItemId, setSelectedItemId] = useState(null);

  // ── Order Mode (unified) ──────────────────────────
  // null | 'dine-in' | 'takeaway' | 'online'
  const [orderMode, setOrderMode] = useState(null);

  // ── Last Order (for confirmation page) ───────────
  const [lastOrderId, setLastOrderId] = useState(null);
  const [lastOrderPoints, setLastOrderPoints] = useState(0);
  const [lastOrderTotal, setLastOrderTotal] = useState(0);

  // ── Auth ──────────────────────────────────────────
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [currentCustomer, setCurrentCustomer] = useState(null);

  // ── Cart ──────────────────────────────────────────
  const [cart, setCart] = useState([]);
  const [tableNumber, setTableNumber] = useState('');

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
      if (existing) return prev.map(c => c.item.id === item.id ? { ...c, qty: c.qty + qty } : c);
      return [...prev, { item, qty }];
    });
  };

  const removeFromCart = (itemId) => setCart(prev => prev.filter(c => c.item.id !== itemId));

  const updateCartQty = (itemId, qty) => {
    if (qty <= 0) { removeFromCart(itemId); return; }
    setCart(prev => prev.map(c => c.item.id === itemId ? { ...c, qty } : c));
  };

  const clearCart = () => setCart([]);
  const cartTotal = cart.reduce((sum, c) => sum + c.item.price * c.qty, 0);
  const cartCount = cart.reduce((sum, c) => sum + c.qty, 0);

  // ── Auth helpers ──────────────────────────────────
  const openAuth = (mode = 'login') => { setAuthMode(mode); setShowAuth(true); };
  const handleLogin = (customer) => { setCurrentCustomer(customer); setShowAuth(false); };

  const handleSignup = (newCustomer) => {
    const customer = {
      ...newCustomer,
      id: `FC-${Date.now()}`,
      points: 0,
      totalOrders: 0,
      totalSpent: 0,
      orderHistory: [],
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
  const getDiscountedPrice = (originalPrice) => {
    if (!activeOffers.length) return originalPrice;
    const best = activeOffers.reduce((max, o) => o.discountPercent > max ? o.discountPercent : max, 0);
    return best > 0 ? Math.round(originalPrice * (1 - best / 100)) : originalPrice;
  };

  const activeDiscount = activeOffers.length > 0
    ? Math.max(...activeOffers.map(o => o.discountPercent))
    : 0;

  // ── Order placement ───────────────────────────────
  const placeOrder = ({ tip, paymentMethod, pointsUsed, extra = {} }) => {
    const subtotal = cartTotal;
    const pointsDiscount = (pointsUsed || 0) * 0.1;
    const discountFromOffer = activeDiscount > 0 ? subtotal * (activeDiscount / 100) : 0;
    const total = Math.max(0, subtotal + (tip || 0) - pointsDiscount - discountFromOffer);
    const roundedTotal = Math.round(total);
    const pointsEarned = Math.floor(roundedTotal);

    const mode = extra.type || orderMode || 'dine-in';
    const orderId = `#${1100 + ordersData.length}`;

    // Build location string based on mode
    let location = `Dine-in (Table ${extra.tableNumber || tableNumber})`;
    if (mode === 'takeaway') location = `À Emporter — ${extra.name || ''}`;
    if (mode === 'online')   location = `En Ligne — ${extra.deliveryAddress || ''}`;

    const newOrder = {
      id: orderId,
      customer: currentCustomer ? currentCustomer.name : (extra.name || `Table ${extra.tableNumber || tableNumber}`),
      items: cart.map(c => `${c.qty}x ${c.item.name}`).join(', '),
      total: `${roundedTotal} Dh`,
      status: 'new',
      platform: mode === 'online' ? 'En Ligne' : 'Direct',
      time: 'Maintenant',
      location,
      paymentMethod,
      tip: `${tip || 0} Dh`,
      source: 'frontoffice',
      mode,
    };

    setOrdersData(prev => [newOrder, ...prev]);

    if (currentCustomer) {
      const updatedCustomer = {
        ...currentCustomer,
        points: Math.max(0, (currentCustomer.points || 0) - (pointsUsed || 0)) + pointsEarned,
        totalOrders: (currentCustomer.totalOrders || 0) + 1,
        totalSpent: (currentCustomer.totalSpent || 0) + total,
        orderHistory: [
          { id: orderId, date: new Date().toLocaleDateString('fr-MA'), total, items: cart.map(c => c.item.name) },
          ...(currentCustomer.orderHistory || []),
        ],
      };
      setCurrentCustomer(updatedCustomer);
      setFrontCustomers(prev => prev.map(c => c.id === currentCustomer.id ? updatedCustomer : c));
    }

    // Store last order info for confirmation page
    setLastOrderId(orderId);
    setLastOrderPoints(pointsEarned);
    setLastOrderTotal(roundedTotal);

    clearCart();
    return orderId;
  };

  // ── Shared props (passed to every page) ──────────
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
    tableNumber,
    setTableNumber,
    placeOrder,
    language,
    theme,
    isLight,
    isRTL,
    activeOffers,
    activeDiscount,
    getDiscountedPrice,
    // Order mode (unified flow)
    orderMode,
    setOrderMode,
    // Last order (for confirmation)
    lastOrderId,
    lastOrderPoints,
    lastOrderTotal,
  };

  // ── Page renderer ─────────────────────────────────
  const renderPage = () => {
    switch (page) {
      case 'home':         return <HomePage {...sharedProps} />;
      case 'menu':         return <MenuPage {...sharedProps} />;
      case 'product':      return <ProductPage {...sharedProps} itemId={selectedItemId} />;
      case 'dine-in':      return <DineInFlow {...sharedProps} />;
      case 'takeaway':     return <TakeAwayFlow {...sharedProps} />;
      case 'cart':         return <CartPage {...sharedProps} />;
      case 'checkout':     return <UnifiedCheckout {...sharedProps} />;
      case 'confirmation': return <OrderConfirmation {...sharedProps} />;
      case 'profile':      return <CustomerProfile {...sharedProps} />;
      default:             return <HomePage {...sharedProps} />;
    }
  };

  const pageClass = isLight
    ? 'min-h-screen bg-gray-50 text-gray-900 font-sans'
    : 'min-h-screen bg-[#0d0d0d] text-white font-sans';

  return (
    <div className={pageClass} dir={isRTL ? 'rtl' : 'ltr'}>
      <FrontNavbar
        {...sharedProps}
        currentPage={page}
        onGoToBackoffice={onGoToBackoffice}
        setLanguage={setLanguage}
        toggleTheme={toggleTheme}
      />

      <main>
        {(page === 'home' || page === 'menu') && activeOffers.length > 0 && (
          <div className="pt-16 sm:pt-20">
            <OffersBanner offers={activeOffers} navigate={navigate} language={language} theme={theme} />
          </div>
        )}
        {renderPage()}
      </main>

      <Footer
        navigate={navigate}
        onGoToBackoffice={onGoToBackoffice}
        language={language}
        theme={theme}
        isLight={isLight}
      />

      {showAuth && (
        <CustomerAuth
          mode={authMode}
          setMode={setAuthMode}
          onLogin={handleLogin}
          onSignup={handleSignup}
          onClose={() => setShowAuth(false)}
          frontCustomers={frontCustomers}
          language={language}
          theme={theme}
        />
      )}
    </div>
  );
};

export default FrontApp;
