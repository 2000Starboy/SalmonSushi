import React, { useState, useEffect } from 'react';
import { AppProvider } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import AdminDatabase from './components/AdminDatabase';
import Customers from './components/Customers';
import Settings from './components/Settings';
import Login from './components/Login';
import OrderManagement from './components/OrderManagement';
import OffersModule from './components/OffersModule';
import Analytics from './components/Analytics';
import FrontApp from './frontoffice/FrontApp';

function AppInner() {
  // ── View: 'front' | 'back' ────────────────────────────────────────────────
  const [view, setView] = useState('front');

  // ── Backoffice auth ────────────────────────────────────────────────────────
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [theme, setTheme] = useState(() => localStorage.getItem('salmon_theme') || 'dark');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('salmon_theme', theme);
  }, [theme]);

  const handleLogin = () => setIsAuthenticated(true);
  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  // ── Offers/Promotions State ───────────────────────────────────────────────
  const [offers, setOffers] = useState([
    {
      id: '1',
      name: 'Ramadan 2025',
      holidayType: 'ramadan',
      isActive: false,
      startDate: '2025-03-01',
      endDate: '2025-03-30',
      discountPercent: 15,
      affectsAllMenu: true,
      showBanner: true,
      bannerColor: '#c2400c',
      slides: [
        {
          id: 's1',
          imageUrl: '',
          title: 'Ramadan Kareem 🌙',
          subtitle: 'Profitez de 15% de réduction sur tout le menu pendant le mois sacré',
          ctaText: 'Découvrir les offres',
        }
      ],
      deals: [
        { id: 'd1', name: 'Menu Iftar', description: 'Soupe + Plat + Dessert', originalPrice: 120, discountedPrice: 99 }
      ],
    }
  ]);

  // Active offers = isActive && within date range
  const activeOffers = offers.filter(o => {
    if (!o.isActive) return false;
    const now = new Date();
    const start = new Date(o.startDate);
    const end = new Date(o.endDate);
    end.setHours(23, 59, 59);
    return now >= start && now <= end;
  });

  // ── Shared Database State ─────────────────────────────────────────────────
  const [inventoryData, setInventoryData] = useState([
    { name: 'Saumon frais (kg)', stock: 4.5, min: 10, cost: 280, status: 'critical' },
    { name: 'Riz à sushi (kg)', stock: 45, min: 25, cost: 25, status: 'good' },
    { name: 'Nori (paquet)', stock: 12, min: 15, cost: 45, status: 'warning' },
    { name: 'Avocat (kg)', stock: 3.2, min: 8, cost: 35, status: 'critical' },
    { name: 'Sauce soja (L)', stock: 18, min: 10, cost: 40, status: 'good' },
    { name: 'Crevettes (kg)', stock: 14, min: 10, cost: 120, status: 'good' },
    { name: 'Tobiko (boîte)', stock: 6, min: 8, cost: 95, status: 'warning' },
    { name: 'Surimi (kg)', stock: 22, min: 12, cost: 55, status: 'good' },
  ]);

  const [ordersData, setOrdersData] = useState([
    { id: '#1042', customer: 'Youssef B.', items: '2x Crunchy Salmon, 1x Soupe Royale', total: '195 Dh', status: 'ready', platform: 'Glovo', time: '2 min', location: 'Maarif' },
    { id: '#1043', customer: 'Amina S.', items: 'Okibox 38pcs', total: '230 Dh', status: 'prep', platform: 'Direct', time: '5 min', location: 'Dine-in (Table 4)' },
    { id: '#1044', customer: 'Mehdi N.', items: '1x Boom Cheese, 2x Nems Poulet', total: '169 Dh', status: 'prep', platform: 'Jumia', time: '8 min', location: 'Gauthier' },
    { id: '#1045', customer: 'Sara K.', items: 'Wok Ecstasy, 2x Poke Taco Saumon', total: '178 Dh', status: 'new', platform: 'Glovo', time: 'Maintenant', location: 'Bourgogne' },
    { id: '#1046', customer: 'Tariq A.', items: 'Tartare Mixte, 4x Sashimi Saumon', total: '245 Dh', status: 'delivering', platform: 'Direct', time: '15 min', location: 'Anfa' },
  ]);

  const [customersData, setCustomersData] = useState([
    { id: 'CUST-001', name: 'Youssef B.', phone: '06 12 34 56 78', totalOrders: 12, totalSpent: '2 840 Dh', status: 'VIP', lastOrder: 'il y a 2 jours' },
    { id: 'CUST-002', name: 'Amina S.', phone: '06 98 76 54 32', totalOrders: 4, totalSpent: '950 Dh', status: 'Regular', lastOrder: 'il y a 1 semaine' },
    { id: 'CUST-003', name: 'Mehdi N.', phone: '06 11 22 33 44', totalOrders: 1, totalSpent: '180 Dh', status: 'New', lastOrder: "Aujourd'hui" },
    { id: 'CUST-004', name: 'Sara K.', phone: '06 55 44 33 22', totalOrders: 28, totalSpent: '5 200 Dh', status: 'VIP', lastOrder: "Aujourd'hui" },
    { id: 'CUST-005', name: 'Tariq A.', phone: '06 77 88 99 00', totalOrders: 8, totalSpent: '1 680 Dh', status: 'Regular', lastOrder: 'il y a 3 jours' },
  ]);

  const [usersData, setUsersData] = useState([
    { id: 'USR-001', name: 'Admin', email: 'admin@salmonsushi.ma', role: 'Admin', status: 'Active', lastLogin: 'Maintenant' },
    { id: 'USR-002', name: 'Manager', email: 'manager@salmonsushi.ma', role: 'Manager', status: 'Active', lastLogin: 'il y a 2h' },
    { id: 'USR-003', name: 'Chef', email: 'chef@salmonsushi.ma', role: 'Staff', status: 'Active', lastLogin: 'il y a 1h' },
  ]);

  // ── Front office customer accounts ────────────────────────────────────────
  const [frontCustomers, setFrontCustomers] = useState([
    {
      id: 'FC-DEMO',
      name: 'Demo Client',
      email: 'demo@salmonsushi.ma',
      phone: '06 00 00 00 00',
      password: 'demo123',
      points: 350,
      totalOrders: 7,
      totalSpent: 1450,
      orderHistory: [
        { id: '#1010', date: '01/03/2026', total: 240, items: ['Crunchy Salmon Roll', 'Soupe Royale'] },
        { id: '#0998', date: '15/02/2026', total: 450, items: ['Okibox 38pcs'] },
      ],
      joinedDate: '01/01/2026',
    },
  ]);

  // ── Backoffice renderer ───────────────────────────────────────────────────
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard ordersData={ordersData} customersData={customersData} />;
      case 'orders':
        return <OrderManagement ordersData={ordersData} setOrdersData={setOrdersData} />;
      case 'customers':
        return <Customers customersData={customersData} />;
      case 'offers':
      case 'ramadan':
        return <OffersModule offers={offers} setOffers={setOffers} />;
      case 'inventory':
        return <Inventory inventoryData={inventoryData} setInventoryData={setInventoryData} />;
      case 'analytics':
        return <Analytics ordersData={ordersData} customersData={customersData} />;
      case 'admin':
        return (
          <AdminDatabase
            inventoryData={inventoryData}
            setInventoryData={setInventoryData}
            ordersData={ordersData}
            setOrdersData={setOrdersData}
            customersData={customersData}
            setCustomersData={setCustomersData}
          />
        );
      case 'settings':
        return <Settings usersData={usersData} setUsersData={setUsersData} />;
      default:
        return <Dashboard ordersData={ordersData} customersData={customersData} />;
    }
  };

  // ── Front Office view ─────────────────────────────────────────────────────
  if (view === 'front') {
    return (
      <FrontApp
        onGoToBackoffice={() => { setView('back'); setIsAuthenticated(false); }}
        ordersData={ordersData}
        setOrdersData={setOrdersData}
        frontCustomers={frontCustomers}
        setFrontCustomers={setFrontCustomers}
        activeOffers={activeOffers}
      />
    );
  }

  // ── Back Office view ──────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <Login
        onLogin={handleLogin}
        onGoToWebsite={() => setView('front')}
      />
    );
  }

  return (
    <div className={`${theme} font-sans`}>
      <div className="flex h-screen bg-gray-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 overflow-hidden transition-colors duration-200">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onGoToWebsite={() => setView('front')}
        />
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <Header theme={theme} toggleTheme={toggleTheme} />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-zinc-950 p-4 md:p-6 transition-colors duration-200">
            <div className="max-w-7xl mx-auto">
              {renderContent()}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  );
}

export default App;
