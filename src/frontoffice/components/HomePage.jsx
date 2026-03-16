import React, { useState } from 'react';
import { ArrowRight, MapPin, Clock, Phone, Star, ChevronRight, ExternalLink, X, UtensilsCrossed, ShoppingCart, Package } from 'lucide-react';
import { menuItems, restaurantInfo } from '../../data/menuData';

const GLOVO_URL = 'https://glovoapp.com/ma/fr/casablanca/salmon-sushi-csb/';

// ─── Order Picker Modal ───────────────────────────────────────────────────────
const OrderPickerModal = ({ isLight, navigate, onClose, setOrderMode }) => {
  const [onlineOpen, setOnlineOpen] = useState(false);

  const overlay   = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm';
  const card      = isLight ? 'bg-white border border-gray-200 shadow-2xl' : 'bg-[#111111] border border-white/10 shadow-2xl shadow-black/60';
  const titleCol  = isLight ? 'text-gray-900' : 'text-white';
  const subCol    = isLight ? 'text-gray-500' : 'text-zinc-400';
  const closeBtnC = isLight ? 'text-gray-400 hover:text-gray-700 hover:bg-gray-100' : 'text-zinc-500 hover:text-white hover:bg-white/10';
  const onlineBg  = isLight ? 'bg-blue-50 border-blue-200' : 'bg-blue-500/10 border-blue-500/20';
  const subBtnC   = isLight ? 'bg-white border-gray-200 hover:border-blue-300 text-gray-700 hover:shadow-sm' : 'bg-white/5 border-white/10 hover:border-blue-500/40 text-white';

  return (
    <div className={overlay} onClick={onClose}>
      <div className={`w-full max-w-sm rounded-3xl p-6 ${card}`} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className={`text-xl font-extrabold ${titleCol}`}>Comment commander ?</h2>
            <p className={`text-xs mt-0.5 ${subCol}`}>Choisissez votre mode de commande</p>
          </div>
          <button onClick={onClose} className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${closeBtnC}`}>
            <X size={16} />
          </button>
        </div>

        <div className="space-y-2.5">
          {/* Dine In */}
          <button
            onClick={() => { setOrderMode?.('dine-in'); navigate('dine-in'); onClose(); }}
            className={`w-full flex items-center space-x-4 px-4 py-3.5 border rounded-2xl transition-all hover:scale-[1.01] text-left ${
              isLight ? 'bg-white border-gray-200 hover:border-orange-300 hover:shadow-md hover:shadow-orange-100' : 'bg-white/5 border-white/10 hover:border-orange-500/40 hover:bg-white/8'
            }`}
          >
            <div className="w-11 h-11 rounded-xl bg-orange-500/15 flex items-center justify-center flex-shrink-0">
              <UtensilsCrossed size={20} className="text-orange-500" />
            </div>
            <div className="flex-1">
              <p className={`font-bold text-sm ${titleCol}`}>Manger sur Place</p>
              <p className={`text-xs ${subCol}`}>Commandez directement à votre table</p>
            </div>
            <ArrowRight size={15} className={subCol} />
          </button>

          {/* Take Away */}
          <button
            onClick={() => { setOrderMode?.('takeaway'); navigate('takeaway'); onClose(); }}
            className={`w-full flex items-center space-x-4 px-4 py-3.5 border rounded-2xl transition-all hover:scale-[1.01] text-left ${
              isLight ? 'bg-white border-gray-200 hover:border-green-300 hover:shadow-md hover:shadow-green-100' : 'bg-white/5 border-white/10 hover:border-green-500/40 hover:bg-white/8'
            }`}
          >
            <div className="w-11 h-11 rounded-xl bg-green-500/15 flex items-center justify-center flex-shrink-0">
              <ShoppingCart size={20} className="text-green-500" />
            </div>
            <div className="flex-1">
              <p className={`font-bold text-sm ${titleCol}`}>À Emporter</p>
              <p className={`text-xs ${subCol}`}>Click & collect — prêt à récupérer</p>
            </div>
            <ArrowRight size={15} className={subCol} />
          </button>

          {/* Commander en Ligne */}
          <div className={`border rounded-2xl overflow-hidden transition-all ${onlineOpen ? onlineBg : isLight ? 'bg-white border-gray-200' : 'bg-white/5 border-white/10'}`}>
            <button
              onClick={() => setOnlineOpen(o => !o)}
              className="w-full flex items-center space-x-4 px-4 py-3.5 text-left"
            >
              <div className="w-11 h-11 rounded-xl bg-blue-500/15 flex items-center justify-center flex-shrink-0">
                <Package size={20} className="text-blue-500" />
              </div>
              <div className="flex-1">
                <p className={`font-bold text-sm ${titleCol}`}>Commander en Ligne</p>
                <p className={`text-xs ${subCol}`}>Via notre site ou via Glovo</p>
              </div>
              <ChevronRight size={15} className={`transition-transform ${onlineOpen ? 'rotate-90' : ''} ${subCol}`} />
            </button>
            {onlineOpen && (
              <div className="px-4 pb-3 space-y-2">
                <button
                  onClick={() => { setOrderMode?.('online'); navigate('menu'); onClose(); }}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 border rounded-xl text-sm font-medium transition-all ${subBtnC}`}
                >
                  <span>🌐</span>
                  <span className="flex-1 text-left">Commander sur notre site</span>
                  <ArrowRight size={13} className="text-blue-500" />
                </button>
                <a
                  href={GLOVO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={onClose}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 border rounded-xl text-sm font-medium transition-all ${subBtnC}`}
                >
                  <span>🛵</span>
                  <span className="flex-1 text-left">Commander via Glovo</span>
                  <ExternalLink size={13} className="text-blue-500" />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Hero ─────────────────────────────────────────────────────────────────────
const Hero = ({ navigate, isLight, setOrderMode }) => {
  const [showPicker, setShowPicker] = useState(false);
  return (
  <section className={`relative min-h-screen flex items-center justify-center overflow-hidden ${isLight ? 'bg-gradient-to-br from-orange-50 via-white to-red-50' : ''}`}>
    {/* Background */}
    {isLight ? (
      <>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(254,77,9,0.08),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_20%,rgba(245,158,11,0.06),transparent_60%)]" />
      </>
    ) : (
      <>
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-[#1a0a00] to-zinc-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(254,77,9,0.12),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_20%,rgba(245,158,11,0.07),transparent_60%)]" />
      </>
    )}

    {/* Decorative rings */}
    <div className={`absolute top-1/4 right-[15%] w-64 h-64 rounded-full border ${isLight ? 'border-orange-300/30' : 'border-orange-500/10'} animate-[spin_30s_linear_infinite]`} />
    <div className={`absolute top-1/4 right-[15%] w-40 h-40 rounded-full border ${isLight ? 'border-orange-400/20' : 'border-orange-500/15'} animate-[spin_20s_linear_infinite_reverse]`} />

    {/* Floating emoji particles */}
    {['🍣', '🐟', '🌊', '🥢', '🍱', '🌸'].map((e, i) => (
      <div
        key={i}
        className={`absolute text-2xl select-none pointer-events-none ${isLight ? 'opacity-15' : 'opacity-20'}`}
        style={{
          top: `${15 + i * 13}%`,
          left: `${5 + i * 14}%`,
          animation: `float ${4 + i}s ease-in-out infinite alternate`,
          animationDelay: `${i * 0.8}s`,
        }}
      >
        {e}
      </div>
    ))}

    <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
      {/* Heading */}
      <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold leading-tight mb-6 tracking-tight">
        <span className={isLight ? 'text-gray-900' : 'text-white'}>L'Art du </span>
        <span className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent">
          Sushi
        </span>
        <br />
        <span className={isLight ? 'text-gray-900' : 'text-white'}>Authentique</span>
      </h1>

      <p className={`text-lg max-w-xl mx-auto mb-10 leading-relaxed ${isLight ? 'text-gray-600' : 'text-zinc-400'}`}>
        Depuis 2019, nous apportons l'excellence de la cuisine japonaise à Casablanca.
        Fraîcheur quotidienne. Techniques ancestrales. Saveurs inoubliables.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          onClick={() => navigate('menu')}
          className="group flex items-center space-x-2 px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold text-base rounded-full transition-all shadow-2xl shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-105"
        >
          <span>Découvrir le Menu</span>
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
        <button
          onClick={() => setShowPicker(true)}
          className={`group flex items-center space-x-2 px-8 py-4 border font-semibold text-base rounded-full backdrop-blur-sm transition-all ${
            isLight
              ? 'bg-white/80 border-gray-300 text-gray-700 hover:bg-white hover:border-orange-300'
              : 'bg-white/10 hover:bg-white/15 border-white/20 text-white'
          }`}
        >
          <span>🍽️ Commander</span>
          <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Stats */}
      <div className={`flex items-center justify-center gap-8 mt-16 pt-8 border-t ${isLight ? 'border-gray-200' : 'border-white/10'}`}>
        {[
          { value: '5+', label: 'Ans d\'expérience' },
          { value: '25+', label: 'Spécialités' },
          { value: '10k+', label: 'Clients ravis' },
        ].map((stat, i) => (
          <div key={i} className="text-center">
            <div className="text-2xl font-extrabold text-orange-500">{stat.value}</div>
            <div className={`text-xs mt-1 ${isLight ? 'text-gray-500' : 'text-zinc-500'}`}>{stat.label}</div>
          </div>
        ))}
      </div>
    </div>

    {/* Scroll indicator */}
    <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce`}>
      <div className={`w-px h-8 ${isLight ? 'bg-gray-300' : 'bg-zinc-700'}`} />
    </div>

    <style>{`
      @keyframes float {
        0%   { transform: translateY(0px) rotate(0deg); }
        100% { transform: translateY(-20px) rotate(10deg); }
      }
    `}</style>

    {showPicker && (
      <OrderPickerModal
        isLight={isLight}
        navigate={navigate}
        onClose={() => setShowPicker(false)}
        setOrderMode={setOrderMode}
      />
    )}
  </section>
  );
};

// ─── Values ───────────────────────────────────────────────────────────────────
const Values = ({ isLight }) => (
  <section className={`py-24 px-6 ${isLight ? 'bg-white' : ''}`}>
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-14">
        <p className="text-orange-500 text-sm font-semibold uppercase tracking-widest mb-3">Nos Engagements</p>
        <h2 className={`text-4xl font-extrabold ${isLight ? 'text-gray-900' : 'text-white'}`}>Ce Qui Nous Définit</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {restaurantInfo.values.map((v, i) => (
          <div
            key={i}
            className={`group p-6 border rounded-2xl transition-all duration-300 text-center ${
              isLight
                ? 'bg-gray-50 border-gray-200 hover:border-orange-300 hover:bg-orange-50 hover:shadow-md'
                : 'bg-white/5 hover:bg-white/8 border-white/10 hover:border-orange-500/30'
            }`}
          >
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform inline-block">{v.emoji}</div>
            <h3 className={`font-bold mb-2 ${isLight ? 'text-gray-800' : 'text-white'}`}>{v.title}</h3>
            <p className={`text-sm leading-relaxed ${isLight ? 'text-gray-500' : 'text-zinc-400'}`}>{v.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ─── Featured Menu ────────────────────────────────────────────────────────────
const FeaturedMenu = ({ navigate, addToCart, isLight }) => {
  const popular = menuItems.filter(i => i.isPopular).slice(0, 8);
  return (
    <section className={`py-24 px-6 ${isLight ? 'bg-orange-50/50' : 'bg-gradient-to-b from-transparent via-black/30 to-transparent'}`}>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-orange-500 text-sm font-semibold uppercase tracking-widest mb-3">Nos Favoris</p>
            <h2 className={`text-4xl font-extrabold ${isLight ? 'text-gray-900' : 'text-white'}`}>Les Incontournables</h2>
          </div>
          <button
            onClick={() => navigate('menu')}
            className="hidden md:flex items-center space-x-2 text-orange-500 hover:text-orange-600 font-medium text-sm transition-colors"
          >
            <span>Voir tout le menu</span>
            <ArrowRight size={16} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {popular.map((item) => (
            <div
              key={item.id}
              className={`group relative border rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${
                isLight
                  ? 'bg-white border-gray-200 hover:border-orange-300 hover:shadow-orange-100'
                  : 'bg-white/5 hover:bg-white/8 border-white/10 hover:border-orange-500/30 hover:shadow-orange-500/10'
              }`}
              onClick={() => navigate('product', { itemId: item.id })}
            >
              <div className={`h-36 bg-gradient-to-br ${item.gradient || 'from-orange-500 to-red-600'} flex items-center justify-center relative`}>
                <span className="text-6xl drop-shadow-lg group-hover:scale-110 transition-transform duration-300">
                  {item.emoji}
                </span>
                {item.isSignature && (
                  <span className="absolute top-2 left-2 px-2 py-0.5 bg-black/50 backdrop-blur-sm border border-orange-500/50 rounded-full text-orange-300 text-[10px] font-bold uppercase">
                    Signature
                  </span>
                )}
              </div>
              <div className="p-4">
                <h3 className={`font-bold text-sm mb-1 truncate ${isLight ? 'text-gray-800' : 'text-white'}`}>{item.name}</h3>
                <p className={`text-xs line-clamp-2 mb-3 ${isLight ? 'text-gray-500' : 'text-zinc-500'}`}>{item.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-orange-500 font-extrabold text-sm">{item.price} Dh</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); addToCart(item); }}
                    className="w-7 h-7 rounded-full bg-orange-500 hover:bg-orange-600 flex items-center justify-center text-white font-bold text-lg transition-all hover:scale-110 shadow-lg shadow-orange-500/30"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <button
            onClick={() => navigate('menu')}
            className="px-6 py-3 border border-orange-500/40 text-orange-500 rounded-full text-sm font-medium hover:bg-orange-500/10 transition-colors"
          >
            Voir tout le menu →
          </button>
        </div>
      </div>
    </section>
  );
};

// ─── Story ────────────────────────────────────────────────────────────────────
const OurStory = ({ isLight }) => (
  <section id="story" className={`py-24 px-6 ${isLight ? 'bg-white' : ''}`}>
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-14">
        <p className="text-orange-500 text-sm font-semibold uppercase tracking-widest mb-3">Depuis 2019</p>
        <h2 className={`text-4xl font-extrabold ${isLight ? 'text-gray-900' : 'text-white'}`}>Notre Histoire</h2>
      </div>

      <div className="relative">
        <div className={`absolute left-[22px] md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-orange-500/60 via-orange-500/20 to-transparent`} />
        <div className="space-y-10">
          {restaurantInfo.story.map((chapter, i) => (
            <div
              key={i}
              className={`relative flex gap-8 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
            >
              <div className={`absolute left-[14px] md:left-1/2 md:-translate-x-1/2 w-[18px] h-[18px] rounded-full bg-orange-500 border-4 ${isLight ? 'border-white' : 'border-[#0d0d0d]'} shadow-lg shadow-orange-500/40 z-10`} />
              <div className={`ml-14 md:ml-0 md:w-1/2 ${i % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                <span className={`inline-block px-3 py-1 border rounded-full text-orange-500 text-xs font-bold mb-3 ${isLight ? 'bg-orange-50 border-orange-200' : 'bg-orange-500/15 border-orange-500/30'}`}>
                  {chapter.year}
                </span>
                <h3 className={`text-lg font-bold mb-2 ${isLight ? 'text-gray-800' : 'text-white'}`}>{chapter.title}</h3>
                <p className={`text-sm leading-relaxed ${isLight ? 'text-gray-500' : 'text-zinc-400'}`}>{chapter.content}</p>
              </div>
              <div className="hidden md:block md:w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

// ─── Location ─────────────────────────────────────────────────────────────────
const Location = ({ isLight }) => {
  // Salmon Sushi Casablanca – Sidi Maarouf coordinates / search
  const MAPS_EMBED_URL =
    'https://maps.google.com/maps?q=Salmon+Sushi+Casablanca+Sidi+Maarouf&output=embed&z=15&hl=fr';
  const MAPS_DIRECTIONS_URL =
    'https://www.google.com/maps/dir/?api=1&destination=Salmon+Sushi+Casablanca';

  return (
    <section id="location" className={`py-24 px-6 ${isLight ? 'bg-orange-50/40' : 'bg-gradient-to-b from-transparent via-black/40 to-transparent'}`}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-orange-500 text-sm font-semibold uppercase tracking-widest mb-3">Nous Trouver</p>
          <h2 className={`text-4xl font-extrabold ${isLight ? 'text-gray-900' : 'text-white'}`}>Venez Nous Rendre Visite</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Embedded Map */}
          <div className={`relative rounded-2xl overflow-hidden border h-72 lg:h-[420px] ${isLight ? 'border-gray-200 shadow-md' : 'border-white/10'}`}>
            {/* Google Maps iframe */}
            <iframe
              title="Salmon Sushi Location"
              src={MAPS_EMBED_URL}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 w-full h-full"
            />

            {/* Directions overlay button — anchored bottom */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10">
              <a
                href={MAPS_DIRECTIONS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold rounded-full shadow-xl shadow-orange-500/30 transition-all hover:scale-105"
              >
                <MapPin size={15} />
                <span>Itinéraire</span>
                <ExternalLink size={13} />
              </a>
            </div>
          </div>

          {/* Info Cards */}
          <div className="space-y-4">
            {/* Address */}
            <div className={`p-5 border rounded-2xl flex items-start space-x-4 ${isLight ? 'bg-white border-gray-200' : 'bg-white/5 border-white/10'}`}>
              <div className="w-10 h-10 rounded-xl bg-orange-500/15 flex items-center justify-center flex-shrink-0">
                <MapPin size={20} className="text-orange-500" />
              </div>
              <div>
                <h3 className={`font-semibold mb-1 ${isLight ? 'text-gray-800' : 'text-white'}`}>Adresse</h3>
                <p className={`text-sm ${isLight ? 'text-gray-500' : 'text-zinc-400'}`}>{restaurantInfo.location.address}</p>
                <a
                  href={MAPS_DIRECTIONS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1 text-orange-500 hover:text-orange-400 text-xs font-medium mt-1.5 transition-colors"
                >
                  <span>Obtenir l'itinéraire</span>
                  <ExternalLink size={11} />
                </a>
              </div>
            </div>

            {/* Hours */}
            <div className={`p-5 border rounded-2xl flex items-start space-x-4 ${isLight ? 'bg-white border-gray-200' : 'bg-white/5 border-white/10'}`}>
              <div className="w-10 h-10 rounded-xl bg-orange-500/15 flex items-center justify-center flex-shrink-0">
                <Clock size={20} className="text-orange-500" />
              </div>
              <div>
                <h3 className={`font-semibold mb-2 ${isLight ? 'text-gray-800' : 'text-white'}`}>Horaires d'Ouverture</h3>
                <div className="space-y-1 text-sm">
                  <div className={`flex justify-between gap-6 ${isLight ? 'text-gray-600' : 'text-zinc-300'}`}>
                    <span>Lun – Ven</span>
                    <span className="text-orange-500 font-semibold">12h – 23h</span>
                  </div>
                  <div className={`flex justify-between gap-6 ${isLight ? 'text-gray-600' : 'text-zinc-300'}`}>
                    <span>Sam – Dim</span>
                    <span className="text-orange-500 font-semibold">12h – 00h</span>
                  </div>
                  <div className={`flex justify-between gap-6 ${isLight ? 'text-gray-600' : 'text-zinc-300'}`}>
                    <span>Jours fériés</span>
                    <span className="text-orange-500 font-semibold">12h – 00h</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className={`p-5 border rounded-2xl flex items-start space-x-4 ${isLight ? 'bg-white border-gray-200' : 'bg-white/5 border-white/10'}`}>
              <div className="w-10 h-10 rounded-xl bg-orange-500/15 flex items-center justify-center flex-shrink-0">
                <Phone size={20} className="text-orange-500" />
              </div>
              <div>
                <h3 className={`font-semibold mb-1 ${isLight ? 'text-gray-800' : 'text-white'}`}>Contact</h3>
                <a href={`tel:${restaurantInfo.location.phone}`} className="text-orange-500 hover:text-orange-400 text-sm font-medium transition-colors block">
                  {restaurantInfo.location.phone}
                </a>
                <a href={`mailto:${restaurantInfo.location.email}`} className={`text-sm transition-colors mt-0.5 block ${isLight ? 'text-gray-500 hover:text-gray-700' : 'text-zinc-400 hover:text-zinc-300'}`}>
                  {restaurantInfo.location.email}
                </a>
              </div>
            </div>

            {/* Delivery */}
            <div className={`p-5 border rounded-2xl ${isLight ? 'bg-white border-gray-200' : 'bg-white/5 border-white/10'}`}>
              <h3 className={`font-semibold mb-3 ${isLight ? 'text-gray-800' : 'text-white'}`}>Aussi Disponible Sur</h3>
              <div className="flex space-x-3">
                <a
                  href="https://glovoapp.com/ma/fr/casablanca/salmon-sushi-csb/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-[#ffb800]/15 border border-[#ffb800]/30 text-[#c89000] dark:text-[#ffb800] text-xs font-bold rounded-full hover:bg-[#ffb800]/25 transition-colors"
                >
                  🟡 Glovo
                </a>
                <span className={`px-3 py-1.5 border text-xs font-bold rounded-full ${isLight ? 'bg-gray-100 border-gray-200 text-gray-600' : 'bg-zinc-700/50 border-zinc-600 text-zinc-300'}`}>
                  ⚫ Jumia Food
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ─── Social ───────────────────────────────────────────────────────────────────
const SocialSection = ({ isLight }) => {
  const GOOGLE_REVIEW_URL =
    'https://www.google.com/search?q=Salmon+Sushi+Casablanca+Sidi+Maarouf+avis&hl=fr#lrd=0x0:0x0,1,,,,';
  // Better: direct link to write review via Google Maps search
  const GOOGLE_WRITE_REVIEW_URL =
    'https://search.google.com/local/writereview?placeid=ChIJK4HQfUTJwxARBf0kcj5YXNQ';

  return (
    <section className={`py-20 px-6 ${isLight ? 'bg-white' : ''}`}>
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-orange-500 text-sm font-semibold uppercase tracking-widest mb-3">Rejoignez la Communauté</p>
        <h2 className={`text-4xl font-extrabold mb-4 ${isLight ? 'text-gray-900' : 'text-white'}`}>Suivez-Nous</h2>
        <p className={`mb-10 ${isLight ? 'text-gray-500' : 'text-zinc-400'}`}>
          Découvrez nos créations, offres exclusives et coulisses sur nos réseaux sociaux.
        </p>

        {/* Social Links */}
        <div className="flex items-center justify-center gap-4 flex-wrap mb-10">
          {[
            {
              icon: '📸', name: 'Instagram',
              handle: '@salmonsushisidimaaroufofficiel',
              url: restaurantInfo.social.instagram,
              hoverClass: isLight ? 'hover:border-pink-400 hover:bg-pink-50' : 'hover:border-pink-500/50 hover:bg-pink-500/10',
            },
            {
              icon: '📘', name: 'Facebook',
              handle: 'Salmon Sushi',
              url: restaurantInfo.social.facebook,
              hoverClass: isLight ? 'hover:border-blue-400 hover:bg-blue-50' : 'hover:border-blue-500/50 hover:bg-blue-500/10',
            },
            {
              icon: '🎵', name: 'TikTok',
              handle: '@salmonsushi',
              url: restaurantInfo.social.tiktok,
              hoverClass: isLight ? 'hover:border-gray-400 hover:bg-gray-100' : 'hover:border-white/40 hover:bg-white/10',
            },
          ].map((s, i) => (
            <a
              key={i}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center space-x-3 px-5 py-3 border rounded-xl transition-all duration-300 group ${
                isLight ? 'bg-gray-50 border-gray-200' : 'bg-white/5 border-white/10'
              } ${s.hoverClass}`}
            >
              <span className="text-2xl">{s.icon}</span>
              <div className="text-left">
                <div className={`font-semibold text-sm ${isLight ? 'text-gray-800' : 'text-white'}`}>{s.name}</div>
                <div className={`text-xs transition-colors ${isLight ? 'text-gray-500 group-hover:text-gray-700' : 'text-zinc-500 group-hover:text-zinc-400'}`}>{s.handle}</div>
              </div>
            </a>
          ))}
        </div>

        {/* ── Google Reviews CTA ──────────────────────────────────────── */}
        <div className={`inline-flex flex-col items-center gap-4 px-8 py-6 rounded-2xl border ${
          isLight ? 'bg-blue-50 border-blue-200' : 'bg-white/5 border-white/10'
        }`}>
          <div className="flex items-center space-x-2">
            <div className="flex">
              {[1,2,3,4,5].map(i => (
                <Star key={i} size={22} className="text-amber-400 fill-amber-400" />
              ))}
            </div>
            <span className={`font-bold text-lg ${isLight ? 'text-gray-800' : 'text-zinc-200'}`}>4.9/5</span>
            <span className={`text-sm ${isLight ? 'text-gray-500' : 'text-zinc-500'}`}>• 500+ avis Google</span>
          </div>
          <p className={`text-sm ${isLight ? 'text-gray-600' : 'text-zinc-400'}`}>
            Vous avez aimé votre expérience ? Partagez votre avis sur Google !
          </p>
          <a
            href={GOOGLE_WRITE_REVIEW_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 px-6 py-3 bg-[#4285f4] hover:bg-[#3367d6] text-white font-semibold text-sm rounded-full transition-all shadow-lg shadow-blue-500/25 hover:scale-105"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#fff"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#fff"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#fff"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#fff"/>
            </svg>
            <span>Laisser un Avis Google</span>
          </a>
        </div>
      </div>
    </section>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const HomePage = ({ navigate, addToCart, isLight = false, setOrderMode }) => {
  return (
    <div>
      <Hero navigate={navigate} isLight={isLight} setOrderMode={setOrderMode} />
      <Values isLight={isLight} />
      <FeaturedMenu navigate={navigate} addToCart={addToCart} isLight={isLight} />
      <OurStory isLight={isLight} />
      <Location isLight={isLight} />
      <SocialSection isLight={isLight} />
    </div>
  );
};

export default HomePage;
