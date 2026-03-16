import React, { useState } from 'react';
import { Search, ShoppingBag, X, ArrowRight } from 'lucide-react';
import { MENU_ITEMS, CATEGORIES } from '../../data/menuData';

// Fallback to named export aliases if old names were used
const menuItems = MENU_ITEMS || [];
const menuCategories = CATEGORIES || [];

const MODE_META = {
  'dine-in':  { emoji: '🍽️', label: 'Sur Place',   color: 'bg-orange-500/15 border-orange-500/40 text-orange-500' },
  'takeaway': { emoji: '🥡', label: 'À Emporter',  color: 'bg-green-500/15 border-green-500/40 text-green-500'   },
  'online':   { emoji: '🌐', label: 'En Ligne',    color: 'bg-blue-500/15 border-blue-500/40 text-blue-500'       },
};

const MenuPage = ({
  navigate,
  addToCart,
  cart,
  cartCount = 0,
  cartTotal = 0,
  language = 'fr',
  theme = 'dark',
  isLight = false,
  activeDiscount = 0,
  getDiscountedPrice,
  orderMode = null,
  setOrderMode,
}) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');

  const getPrice = getDiscountedPrice || ((p) => p);

  const filtered = menuItems.filter((item) => {
    const matchCat = activeCategory === 'all' || item.category === activeCategory;
    const q = search.toLowerCase();
    const matchSearch = !search ||
      item.name.toLowerCase().includes(q) ||
      (item.description || '').toLowerCase().includes(q) ||
      (item.tags || []).some(t => t.includes(q));
    return matchCat && matchSearch;
  });

  const cartQty = (itemId) => {
    const c = cart.find(c => c.item.id === itemId);
    return c ? c.qty : 0;
  };

  const handleAddToCart = (e, item) => {
    e.stopPropagation();
    addToCart({ ...item, price: getPrice(item.price) });
  };

  // Translations
  const labels = {
    title: language === 'ar' ? 'قائمتنا' : language === 'en' ? 'Our Menu' : 'Notre Carte',
    subtitle: language === 'ar' ? 'طازج يومياً، تقنيات أصيلة.' : language === 'en' ? 'Fresh daily, authentic techniques.' : 'Fraîcheur quotidienne, techniques authentiques.',
    search: language === 'ar' ? 'بحث...' : language === 'en' ? 'Search...' : 'Rechercher un plat...',
    all: language === 'ar' ? 'الكل' : language === 'en' ? 'All' : 'Tout',
    noResults: language === 'ar' ? `لا توجد نتائج لـ "${search}"` : language === 'en' ? `No results for "${search}"` : `Aucun résultat pour "${search}"`,
    add: language === 'ar' ? 'إضافة' : language === 'en' ? 'Add' : 'Ajouter',
    pieces: language === 'ar' ? 'قطع' : language === 'en' ? 'pcs' : 'pcs',
    signature: language === 'ar' ? '★ مميز' : language === 'en' ? '★ Signature' : '★ Signature',
    popular: language === 'ar' ? 'الأكثر طلباً' : language === 'en' ? 'Popular' : 'Populaire',
  };

  // Theme classes
  const pageClass = isLight ? 'min-h-screen pt-20 sm:pt-24 pb-16' : 'min-h-screen pt-20 sm:pt-24 pb-16';
  const headingColor = isLight ? 'text-gray-900' : 'text-white';
  const subColor = isLight ? 'text-gray-500' : 'text-zinc-400';
  const accentColor = 'text-orange-500';
  const inputClass = isLight
    ? 'w-full pl-11 pr-4 py-3 bg-white border border-gray-200 focus:border-orange-400 rounded-xl text-gray-900 placeholder:text-gray-400 outline-none transition-all text-sm shadow-sm'
    : 'w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 focus:border-orange-500/50 rounded-xl text-white placeholder:text-zinc-600 outline-none transition-all text-sm';
  const catActive = 'bg-orange-500 text-white shadow-lg shadow-orange-500/30';
  const catInactive = isLight
    ? 'bg-white border border-gray-200 text-gray-600 hover:text-orange-600 hover:border-orange-200 shadow-sm'
    : 'bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10';
  const cardClass = isLight
    ? 'group bg-white border border-gray-200 hover:border-orange-300 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10 flex flex-col'
    : 'group bg-white/5 hover:bg-white/8 border border-white/10 hover:border-orange-500/30 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-orange-500/10 flex flex-col';
  const cardTitle = isLight ? 'text-gray-900 font-bold text-sm mb-1' : 'text-white font-bold text-sm mb-1';
  const cardDesc = isLight ? 'text-gray-400 text-xs line-clamp-2 flex-1 mb-3' : 'text-zinc-500 text-xs line-clamp-2 flex-1 mb-3';

  const categoryLabel = (cat) => {
    if (!cat) return '';
    if (language === 'en') return cat.nameEn || cat.name;
    if (language === 'ar') return cat.nameAr || cat.name;
    return cat.name;
  };

  return (
    <div className={pageClass}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Discount Banner */}
        {activeDiscount > 0 && (
          <div className="mb-6 p-4 bg-orange-500/10 border border-orange-500/30 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-orange-500 font-bold text-lg">-{activeDiscount}% </span>
              <span className={isLight ? 'text-gray-700 text-sm' : 'text-zinc-300 text-sm'}>
                {language === 'ar' ? 'خصم على جميع الأصناف!' : language === 'en' ? 'discount on all items!' : 'de réduction sur tout le menu !'}
              </span>
            </div>
            <span className="text-2xl">🎉</span>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <p className={`${accentColor} text-xs sm:text-sm font-semibold uppercase tracking-widest mb-3`}>
            {language === 'ar' ? 'تشكيلتنا' : language === 'en' ? 'Our Selection' : 'Notre Sélection'}
          </p>
          <h1 className={`text-4xl sm:text-5xl font-extrabold ${headingColor} mb-3`}>{labels.title}</h1>
          <p className={`${subColor} max-w-lg mx-auto text-sm sm:text-base`}>{labels.subtitle}</p>
        </div>

        {/* Search */}
        <div className="relative mb-6 max-w-md mx-auto">
          <Search size={16} className={`absolute left-4 top-1/2 -translate-y-1/2 ${isLight ? 'text-gray-400' : 'text-zinc-500'}`} />
          <input
            type="text"
            placeholder={labels.search}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className={inputClass}
          />
          {search && (
            <button onClick={() => setSearch('')} className={`absolute right-4 top-1/2 -translate-y-1/2 ${isLight ? 'text-gray-400' : 'text-zinc-500'}`}>
              <X size={14} />
            </button>
          )}
        </div>

        {/* Categories */}
        <div className="flex space-x-2 overflow-x-auto pb-3 mb-6 sm:mb-10 no-scrollbar">
          <button
            onClick={() => setActiveCategory('all')}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all flex-shrink-0 ${activeCategory === 'all' ? catActive : catInactive}`}
          >
            <span>🍽️</span>
            <span>{labels.all}</span>
          </button>
          {menuCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center space-x-1.5 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all flex-shrink-0 ${activeCategory === cat.id ? catActive : catInactive}`}
            >
              <span>{cat.emoji}</span>
              <span>{categoryLabel(cat)}</span>
            </button>
          ))}
        </div>

        {/* Results Count */}
        {search && (
          <p className={`${subColor} text-sm mb-4`}>
            {filtered.length} {language === 'ar' ? 'نتيجة' : language === 'en' ? 'results' : 'résultats'}
          </p>
        )}

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <p className={`text-lg font-medium ${subColor}`}>{labels.noResults}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {filtered.map((item) => {
              const qty = cartQty(item.id);
              const displayPrice = getPrice(item.price);
              const hasDiscount = displayPrice < item.price;
              return (
                <div
                  key={item.id}
                  className={cardClass}
                  onClick={() => navigate('product', { itemId: item.id })}
                >
                  {/* Gradient header */}
                  <div className={`h-28 sm:h-36 bg-gradient-to-br ${item.gradient || 'from-orange-900 to-red-900'} flex items-center justify-center relative flex-shrink-0`}>
                    <span className="text-4xl sm:text-5xl drop-shadow-lg group-hover:scale-110 transition-transform duration-300">
                      {item.emoji}
                    </span>
                    <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                      {item.isSignature && (
                        <span className="px-1.5 py-0.5 bg-black/60 border border-orange-500/50 rounded-full text-orange-400 text-[8px] sm:text-[9px] font-bold uppercase">
                          {labels.signature}
                        </span>
                      )}
                    </div>
                    {item.pieces && item.pieces > 1 && (
                      <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/50 backdrop-blur-sm rounded-full text-white text-[10px] font-medium">
                        {item.pieces} {labels.pieces}
                      </div>
                    )}
                    {hasDiscount && (
                      <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-orange-500 rounded-full text-white text-[9px] font-bold">
                        -{activeDiscount}%
                      </div>
                    )}
                  </div>

                  <div className="p-3 sm:p-4 flex flex-col flex-1">
                    <h3 className={cardTitle}>{item.name}</h3>
                    <p className={cardDesc}>{item.description}</p>
                    <div className="flex items-center justify-between mt-auto">
                      <div>
                        <span className="text-orange-500 font-extrabold text-sm sm:text-base">
                          {displayPrice} <span className="text-xs font-semibold">Dh</span>
                        </span>
                        {hasDiscount && (
                          <span className={`ml-1.5 text-xs line-through ${isLight ? 'text-gray-400' : 'text-zinc-600'}`}>
                            {item.price} Dh
                          </span>
                        )}
                      </div>
                      <button
                        onClick={(e) => handleAddToCart(e, item)}
                        className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                          qty > 0
                            ? 'bg-orange-500 text-white shadow-md'
                            : isLight
                            ? 'bg-orange-50 hover:bg-orange-100 text-orange-600 border border-orange-200'
                            : 'bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/20'
                        }`}
                      >
                        {qty > 0 ? (
                          <>
                            <ShoppingBag size={12} />
                            <span>{qty}</span>
                          </>
                        ) : (
                          <span>+ {labels.add}</span>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Mode badge ─────────────────────────────────────────────────────── */}
      {orderMode && MODE_META[orderMode] && (
        <div className="fixed bottom-6 left-4 z-40 flex items-center space-x-2">
          <div className={`flex items-center space-x-2 px-3 py-2 rounded-2xl border backdrop-blur-sm text-xs font-bold shadow-lg ${MODE_META[orderMode].color}`}>
            <span>{MODE_META[orderMode].emoji}</span>
            <span>{MODE_META[orderMode].label}</span>
            {setOrderMode && (
              <button
                onClick={() => setOrderMode(null)}
                className="ml-1 opacity-60 hover:opacity-100 text-xs font-black"
                title="Changer de mode"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── Cart FAB ────────────────────────────────────────────────────────── */}
      {cartCount > 0 && (
        <div className="fixed bottom-6 right-4 z-40">
          <button
            onClick={() => navigate('cart')}
            className="flex items-center space-x-3 px-5 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl shadow-2xl shadow-orange-500/40 transition-all hover:scale-105 active:scale-95"
          >
            <ShoppingBag size={20} />
            <span>{cartCount} article{cartCount > 1 ? 's' : ''}</span>
            <span className="opacity-80">·</span>
            <span className="font-extrabold">{cartTotal} Dh</span>
            <ArrowRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default MenuPage;
