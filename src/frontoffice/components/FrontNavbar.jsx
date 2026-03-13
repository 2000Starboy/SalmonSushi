import React, { useState, useEffect, useRef } from 'react';
import {
  ShoppingBag, User, Menu, X, ChefHat, LogOut,
  LayoutDashboard, Sun, Moon, Globe, ChevronDown,
  UtensilsCrossed, ExternalLink, Package,
} from 'lucide-react';

const GLOVO_URL = 'https://glovoapp.com/ma/fr/casablanca/salmon-sushi-csb/';

const FrontNavbar = ({
  navigate,
  currentPage,
  currentCustomer,
  openAuth,
  handleLogout,
  cartCount,
  onGoToBackoffice,
  language = 'fr',
  setLanguage,
  theme = 'dark',
  toggleTheme,
}) => {
  const [scrolled, setScrolled]       = useState(false);
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [langOpen, setLangOpen]       = useState(false);
  const [orderOpen, setOrderOpen]     = useState(false);
  const [onlineOpen, setOnlineOpen]   = useState(false);

  const langRef  = useRef(null);
  const orderRef = useRef(null);

  // Scroll listener
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const onOutside = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false);
      if (orderRef.current && !orderRef.current.contains(e.target)) {
        setOrderOpen(false);
        setOnlineOpen(false);
      }
    };
    document.addEventListener('mousedown', onOutside);
    return () => document.removeEventListener('mousedown', onOutside);
  }, []);

  const isLight = theme === 'light';

  // ── Translations ─────────────────────────────────────────────────────────
  const t = (fr, en, ar) =>
    language === 'ar' ? ar : language === 'en' ? en : fr;

  const navLinks = [
    { label: t('Accueil', 'Home', 'الرئيسية'), page: 'home' },
    { label: t('Menu', 'Menu', 'القائمة'), page: 'menu' },
  ];

  const languages = [
    { code: 'fr', label: 'Français',  flag: '🇫🇷' },
    { code: 'en', label: 'English',   flag: '🇬🇧' },
    { code: 'ar', label: 'العربية',   flag: '🇲🇦' },
  ];

  const currentLang = languages.find(l => l.code === language) || languages[0];

  const handleNav = (page) => {
    navigate(page);
    setMobileOpen(false);
    setOrderOpen(false);
    setOnlineOpen(false);
  };

  // ── Dynamic classes ───────────────────────────────────────────────────────
  const navBg = isLight
    ? (scrolled
        ? 'bg-white/98 backdrop-blur-md border-b border-gray-200 shadow-sm py-3'
        : 'bg-white/90 backdrop-blur-sm py-5')
    : (scrolled
        ? 'bg-black/95 backdrop-blur-md border-b border-white/10 py-3'
        : 'bg-transparent py-5');

  const textBase   = isLight ? 'text-gray-600 hover:text-gray-900'         : 'text-zinc-300 hover:text-white';
  const activeText = isLight ? 'text-orange-600 font-semibold'              : 'text-orange-400 font-semibold';
  const logoBase   = isLight ? 'text-gray-900'                              : 'text-white';
  const iconBtn    = isLight
    ? 'text-gray-500 hover:text-orange-600 hover:bg-orange-50'
    : 'text-zinc-400 hover:text-white hover:bg-white/10';
  const dropBg     = isLight
    ? 'bg-white border-gray-200 shadow-xl'
    : 'bg-[#1a1a1a] border-white/10 shadow-2xl shadow-black/40';
  const dropItem   = isLight
    ? 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'
    : 'text-zinc-300 hover:bg-white/8 hover:text-white';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">

        {/* ── Logo ────────────────────────────────────────────────────── */}
        <button
          onClick={() => navigate('home')}
          className="flex items-center space-x-2 group flex-shrink-0"
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg flex-shrink-0">
            <ChefHat size={16} className="text-white" />
          </div>
          <span className="text-lg sm:text-xl font-extrabold tracking-tight">
            <span className={logoBase}>Salmon</span>
            <span className="text-orange-500"> Sushi</span>
          </span>
        </button>

        {/* ── Desktop Nav ─────────────────────────────────────────────── */}
        <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
          {navLinks.map((link) => (
            <button
              key={link.page}
              onClick={() => handleNav(link.page)}
              className={`px-3 py-2 rounded-lg text-sm transition-colors duration-200 ${
                currentPage === link.page ? activeText : textBase
              }`}
            >
              {link.label}
            </button>
          ))}

          {/* Order Dropdown */}
          <div className="relative" ref={orderRef}>
            <button
              onClick={() => { setOrderOpen(!orderOpen); setOnlineOpen(false); }}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                orderOpen
                  ? (isLight ? 'bg-orange-50 text-orange-600' : 'bg-orange-500/10 text-orange-400')
                  : (isLight ? 'bg-orange-500 hover:bg-orange-600 text-white' : 'bg-orange-500 hover:bg-orange-600 text-white')
              } shadow-md shadow-orange-500/20`}
            >
              <ShoppingBag size={15} />
              <span>{t('Commander', 'Order', 'اطلب')}</span>
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${orderOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {orderOpen && (
              <div className={`absolute top-full mt-2 w-52 rounded-2xl border overflow-hidden z-50 ${dropBg}`}
                style={{ left: language === 'ar' ? 'auto' : '0', right: language === 'ar' ? '0' : 'auto' }}
              >
                {/* Dine In */}
                <button
                  onClick={() => handleNav('dine-in')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 text-sm transition-colors ${dropItem}`}
                >
                  <div className="w-8 h-8 rounded-xl bg-orange-500/15 flex items-center justify-center flex-shrink-0">
                    <UtensilsCrossed size={15} className="text-orange-500" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-sm">{t('Dîner sur Place', 'Dine In', 'تناول الطعام هنا')}</p>
                    <p className={`text-xs ${isLight ? 'text-gray-400' : 'text-zinc-500'}`}>{t('Commander à table', 'Order at table', 'اطلب على الطاولة')}</p>
                  </div>
                </button>

                {/* Divider */}
                <div className={`mx-3 border-t ${isLight ? 'border-gray-100' : 'border-white/8'}`} />

                {/* Order Online (expandable) */}
                <div>
                  <button
                    onClick={() => setOnlineOpen(!onlineOpen)}
                    className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-colors ${dropItem}`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-xl bg-blue-500/15 flex items-center justify-center flex-shrink-0">
                        <Package size={15} className="text-blue-500" />
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-sm">{t('Commander en Ligne', 'Order Online', 'اطلب أونلاين')}</p>
                        <p className={`text-xs ${isLight ? 'text-gray-400' : 'text-zinc-500'}`}>{t('Livraison ou click & collect', 'Delivery or pick-up', 'توصيل أو استلام')}</p>
                      </div>
                    </div>
                    <ChevronDown
                      size={13}
                      className={`transition-transform duration-200 flex-shrink-0 ${onlineOpen ? 'rotate-180' : ''} ${isLight ? 'text-gray-400' : 'text-zinc-500'}`}
                    />
                  </button>

                  {onlineOpen && (
                    <div className={`mx-2 mb-2 rounded-xl overflow-hidden border ${isLight ? 'border-gray-100 bg-gray-50' : 'border-white/5 bg-black/20'}`}>
                      {/* Direct */}
                      <button
                        onClick={() => handleNav('dine-in')}
                        className={`w-full flex items-center space-x-3 px-4 py-2.5 text-sm transition-colors ${dropItem}`}
                      >
                        <span className="text-lg flex-shrink-0">🥡</span>
                        <div className="text-left">
                          <p className="font-medium text-xs">{t('Commander Directement', 'Order Directly', 'اطلب مباشرة')}</p>
                          <p className={`text-[11px] ${isLight ? 'text-gray-400' : 'text-zinc-600'}`}>{t('Sur notre site', 'On our site', 'من موقعنا')}</p>
                        </div>
                      </button>
                      {/* Glovo */}
                      <a
                        href={GLOVO_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => { setOrderOpen(false); setOnlineOpen(false); }}
                        className={`flex items-center justify-between px-4 py-2.5 text-sm transition-colors ${dropItem}`}
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-lg flex-shrink-0">🛵</span>
                          <div className="text-left">
                            <p className="font-medium text-xs">{t('Commander via Glovo', 'Order via Glovo', 'اطلب عبر Glovo')}</p>
                            <p className={`text-[11px] ${isLight ? 'text-gray-400' : 'text-zinc-600'}`}>{t('Livraison rapide', 'Fast delivery', 'توصيل سريع')}</p>
                          </div>
                        </div>
                        <ExternalLink size={12} className={`flex-shrink-0 ${isLight ? 'text-gray-300' : 'text-zinc-600'}`} />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Right Actions ────────────────────────────────────────────── */}
        <div className="flex items-center space-x-1 sm:space-x-2">

          {/* Staff button */}
          {onGoToBackoffice && (
            <button
              onClick={onGoToBackoffice}
              className={`hidden md:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-full text-xs border transition-all ${
                isLight
                  ? 'bg-gray-100 hover:bg-orange-50 border-gray-200 hover:border-orange-200 text-gray-500 hover:text-orange-600'
                  : 'bg-white/5 hover:bg-white/10 border-white/10 hover:border-orange-500/30 text-zinc-400 hover:text-orange-400'
              }`}
            >
              <LayoutDashboard size={12} />
              <span>Staff</span>
            </button>
          )}

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full transition-all ${iconBtn}`}
            title={t('Thème', 'Theme', 'السمة')}
          >
            {isLight ? <Moon size={17} /> : <Sun size={17} />}
          </button>

          {/* Language dropdown */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setLangOpen(!langOpen)}
              className={`flex items-center space-x-1 px-2 py-1.5 rounded-full transition-all ${iconBtn}`}
            >
              <Globe size={16} />
              <span className="text-xs font-medium hidden sm:block">{currentLang.flag}</span>
            </button>
            {langOpen && (
              <div className={`absolute right-0 top-full mt-2 w-36 rounded-xl border overflow-hidden z-50 ${dropBg}`}>
                {languages.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => { if (setLanguage) setLanguage(lang.code); setLangOpen(false); }}
                    className={`w-full flex items-center space-x-2 px-3 py-2.5 text-sm transition-colors ${
                      language === lang.code
                        ? (isLight ? 'bg-orange-50 text-orange-600 font-semibold' : 'bg-orange-500/10 text-orange-400 font-semibold')
                        : dropItem
                    }`}
                  >
                    <span>{lang.flag}</span>
                    <span className="flex-1 text-left">{lang.label}</span>
                    {language === lang.code && <span className="text-orange-500 text-xs">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Cart */}
          <button
            onClick={() => navigate('dine-in')}
            className={`relative p-2 transition-colors rounded-full ${iconBtn}`}
          >
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </button>

          {/* Auth */}
          {currentCustomer ? (
            <div className="flex items-center space-x-1">
              <button
                onClick={() => navigate('profile')}
                className={`flex items-center space-x-2 px-2.5 py-1.5 rounded-full text-sm border transition-all ${
                  isLight
                    ? 'bg-gray-100 hover:bg-gray-200 border-gray-200 text-gray-800'
                    : 'bg-white/10 hover:bg-white/15 border-white/20 text-white'
                }`}
              >
                <span className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                  {currentCustomer.name.charAt(0).toUpperCase()}
                </span>
                <span className="hidden sm:block max-w-[70px] truncate text-sm font-medium">
                  {currentCustomer.name.split(' ')[0]}
                </span>
              </button>
              <button
                onClick={handleLogout}
                className={`p-2 transition-colors rounded-full ${isLight ? 'text-gray-400 hover:text-red-500 hover:bg-red-50' : 'text-zinc-500 hover:text-red-400 hover:bg-red-500/10'}`}
              >
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => openAuth('login')}
              className="flex items-center space-x-1.5 px-3 py-1.5 sm:py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-full transition-all shadow-lg shadow-orange-500/20"
            >
              <User size={15} />
              <span className="hidden sm:block">
                {t('Compte', 'Account', 'حسابي')}
              </span>
            </button>
          )}

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`md:hidden p-2 transition-colors rounded-full ${iconBtn}`}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* ── Mobile Menu ──────────────────────────────────────────────────── */}
      {mobileOpen && (
        <div className={`md:hidden absolute top-full left-0 right-0 ${
          isLight ? 'bg-white/98 border-b border-gray-200' : 'bg-black/98 border-b border-white/10'
        } px-5 py-4`}>

          {/* Nav links */}
          <div className="space-y-1 mb-3">
            {navLinks.map((link) => (
              <button
                key={link.page}
                onClick={() => handleNav(link.page)}
                className={`w-full text-left py-3 px-3 text-sm font-medium rounded-xl transition-colors ${
                  currentPage === link.page
                    ? (isLight ? 'bg-orange-50 text-orange-600' : 'bg-orange-500/10 text-orange-400')
                    : (isLight ? 'text-gray-700 hover:bg-gray-50' : 'text-zinc-300 hover:bg-white/5')
                }`}
              >
                {link.label}
              </button>
            ))}

            {/* Mobile Order section */}
            <div className={`rounded-xl border overflow-hidden ${isLight ? 'border-gray-100' : 'border-white/8'}`}>
              <p className={`px-3 pt-2.5 pb-1.5 text-xs font-bold uppercase tracking-widest ${isLight ? 'text-gray-400' : 'text-zinc-500'}`}>
                {t('Commander', 'Order', 'اطلب')}
              </p>
              <button
                onClick={() => handleNav('dine-in')}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 text-sm transition-colors ${isLight ? 'text-gray-700 hover:bg-gray-50' : 'text-zinc-300 hover:bg-white/5'}`}
              >
                <span className="text-xl">🍽️</span>
                <span className="font-medium">{t('Dîner sur Place', 'Dine In', 'تناول الطعام هنا')}</span>
              </button>
              <button
                onClick={() => handleNav('dine-in')}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 text-sm transition-colors ${isLight ? 'text-gray-700 hover:bg-gray-50' : 'text-zinc-300 hover:bg-white/5'}`}
              >
                <span className="text-xl">🥡</span>
                <span className="font-medium">{t('Commander Directement', 'Order Directly', 'اطلب مباشرة')}</span>
              </button>
              <a
                href={GLOVO_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileOpen(false)}
                className={`flex items-center justify-between px-3 py-2.5 text-sm transition-colors mb-1 ${isLight ? 'text-gray-700 hover:bg-gray-50' : 'text-zinc-300 hover:bg-white/5'}`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-xl">🛵</span>
                  <span className="font-medium">{t('Commander via Glovo', 'Order via Glovo', 'اطلب عبر Glovo')}</span>
                </div>
                <ExternalLink size={13} className={isLight ? 'text-gray-400' : 'text-zinc-600'} />
              </a>
            </div>
          </div>

          {/* Language + Theme row */}
          <div className={`flex items-center gap-2 py-3 border-t ${isLight ? 'border-gray-100' : 'border-white/10'}`}>
            <Globe size={14} className={isLight ? 'text-gray-400' : 'text-zinc-500'} />
            {languages.map(lang => (
              <button
                key={lang.code}
                onClick={() => { if (setLanguage) setLanguage(lang.code); }}
                className={`px-2.5 py-1 text-xs rounded-full border transition-colors ${
                  language === lang.code
                    ? 'bg-orange-500/15 border-orange-500/30 text-orange-500 font-semibold'
                    : isLight ? 'border-gray-200 text-gray-500' : 'border-white/10 text-zinc-500'
                }`}
              >
                {lang.flag} {lang.code.toUpperCase()}
              </button>
            ))}
            <button
              onClick={toggleTheme}
              className={`ml-auto p-1.5 rounded-full ${isLight ? 'bg-gray-100 text-gray-600' : 'bg-white/10 text-zinc-400'}`}
            >
              {isLight ? <Moon size={15} /> : <Sun size={15} />}
            </button>
          </div>

          {/* Auth buttons */}
          {!currentCustomer && (
            <div className="flex space-x-3 pt-2">
              <button
                onClick={() => { openAuth('login'); setMobileOpen(false); }}
                className={`flex-1 py-2.5 border rounded-xl text-sm font-medium ${
                  isLight ? 'border-gray-200 text-gray-700 hover:bg-gray-50' : 'border-white/20 text-white hover:bg-white/5'
                } transition-colors`}
              >
                {t('Connexion', 'Login', 'دخول')}
              </button>
              <button
                onClick={() => { openAuth('signup'); setMobileOpen(false); }}
                className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-600 rounded-xl text-sm text-white font-semibold transition-colors"
              >
                {t("S'inscrire", 'Sign Up', 'إنشاء حساب')}
              </button>
            </div>
          )}

          {onGoToBackoffice && (
            <div className={`pt-3 border-t mt-3 ${isLight ? 'border-gray-100' : 'border-white/5'}`}>
              <button
                onClick={() => { onGoToBackoffice(); setMobileOpen(false); }}
                className={`w-full flex items-center space-x-2 py-2 text-xs ${isLight ? 'text-gray-400 hover:text-orange-600' : 'text-zinc-500 hover:text-orange-400'} transition-colors`}
              >
                <LayoutDashboard size={14} />
                <span>Accès Staff / Backoffice</span>
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default FrontNavbar;
