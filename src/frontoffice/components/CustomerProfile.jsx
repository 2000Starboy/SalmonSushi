import React from 'react';
import { ArrowLeft, Star, Award, ShoppingBag, TrendingUp, LogOut, Clock } from 'lucide-react';
import { getBadge, getNextBadge, POINTS_VALUE, MIN_REDEEM } from '../../data/menuData';

const CustomerProfile = ({ navigate, currentCustomer, handleLogout, openAuth }) => {
  if (!currentCustomer) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <div className="text-6xl mb-6">👤</div>
          <h2 className="text-2xl font-extrabold text-white mb-3">Mon Compte</h2>
          <p className="text-zinc-400 mb-6">Connectez-vous pour accéder à votre profil, vos points et vos badges.</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => openAuth('login')}
              className="px-6 py-3 bg-white/10 border border-white/20 text-white font-semibold rounded-xl text-sm hover:bg-white/15 transition-colors"
            >
              Se Connecter
            </button>
            <button
              onClick={() => openAuth('signup')}
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl text-sm shadow-lg shadow-orange-500/30 transition-colors"
            >
              Créer un Compte
            </button>
          </div>
        </div>
      </div>
    );
  }

  const badge = getBadge(currentCustomer.totalOrders);
  const nextBadge = getNextBadge(currentCustomer.totalOrders);
  const points = currentCustomer.points || 0;
  const totalOrders = currentCustomer.totalOrders || 0;
  const totalSpent = currentCustomer.totalSpent || 0;
  const orderHistory = currentCustomer.orderHistory || [];

  const progressToNext = nextBadge
    ? Math.min(100, ((totalOrders / nextBadge.threshold) * 100))
    : 100;

  const allBadges = [
    { emoji: '🌱', label: 'Graines de Riz', threshold: 1, unlocked: totalOrders >= 1 },
    { emoji: '🥢', label: 'Habitué', threshold: 5, unlocked: totalOrders >= 5 },
    { emoji: '🐟', label: 'Passionné', threshold: 10, unlocked: totalOrders >= 10 },
    { emoji: '🍣', label: 'VIP Salmon', threshold: 25, unlocked: totalOrders >= 25 },
    { emoji: '👑', label: 'Sushi Master', threshold: 50, unlocked: totalOrders >= 50 },
  ];

  return (
    <div className="min-h-screen pt-20 pb-16 px-6">
      <div className="max-w-2xl mx-auto">

        {/* Back */}
        <button
          onClick={() => navigate('home')}
          className="flex items-center space-x-2 text-zinc-400 hover:text-white text-sm mb-8 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Retour</span>
        </button>

        {/* Profile Card */}
        <div className={`relative p-6 rounded-3xl bg-gradient-to-br ${badge.color} mb-6 overflow-hidden shadow-2xl`}>
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 right-4 text-[120px] leading-none select-none">{badge.emoji}</div>
          </div>

          <div className="relative flex items-start justify-between">
            <div className="flex items-center space-x-4">
              {/* Avatar */}
              <div className="w-16 h-16 rounded-2xl bg-black/30 backdrop-blur-sm border border-white/20 flex items-center justify-center text-3xl font-extrabold text-white">
                {currentCustomer.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-white">{currentCustomer.name}</h1>
                <p className="text-white/70 text-sm">{currentCustomer.email}</p>
                <div className="flex items-center space-x-2 mt-1.5">
                  <span className="text-xl">{badge.emoji}</span>
                  <span className="text-white font-bold text-sm">{badge.label}</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => { handleLogout(); navigate('home'); }}
              className="p-2 bg-black/20 hover:bg-black/40 rounded-xl text-white/70 hover:text-white transition-all"
            >
              <LogOut size={16} />
            </button>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            {[
              { icon: <Star size={16} />, value: points, label: 'Points' },
              { icon: <ShoppingBag size={16} />, value: totalOrders, label: 'Commandes' },
              { icon: <TrendingUp size={16} />, value: `${Math.round(totalSpent)} Dh`, label: 'Dépensé' },
            ].map((stat, i) => (
              <div key={i} className="bg-black/20 backdrop-blur-sm rounded-xl p-3 text-center">
                <div className="text-white/60 flex justify-center mb-1">{stat.icon}</div>
                <div className="text-white font-extrabold text-lg">{stat.value}</div>
                <div className="text-white/60 text-xs">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Member since */}
          {currentCustomer.joinedDate && (
            <p className="text-white/50 text-xs mt-4">
              Membre depuis le {currentCustomer.joinedDate}
            </p>
          )}
        </div>

        {/* Points Card */}
        <div className="p-5 bg-white/5 border border-white/10 rounded-2xl mb-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-white font-bold flex items-center space-x-2">
              <Star size={18} className="text-amber-400" />
              <span>Mes Points</span>
            </h2>
            <span className="text-3xl font-extrabold text-amber-400">{points}</span>
          </div>
          <div className="text-zinc-400 text-xs mb-4">
            Valeur: <span className="text-amber-400 font-bold">{(points * POINTS_VALUE).toFixed(1)} Dh</span>
            {points >= MIN_REDEEM && (
              <span className="ml-2 text-green-400">✓ Utilisables à la prochaine commande</span>
            )}
          </div>
          <div className="p-3 bg-amber-500/5 border border-amber-500/20 rounded-xl text-xs text-zinc-400 space-y-1">
            <p>🟡 1 Dh dépensé = 1 point gagné</p>
            <p>💫 100 points = 10 Dh de réduction</p>
            <p>⭐ Activez vos points lors du checkout</p>
          </div>
        </div>

        {/* Badge Progress */}
        <div className="p-5 bg-white/5 border border-white/10 rounded-2xl mb-5">
          <h2 className="text-white font-bold mb-4 flex items-center space-x-2">
            <Award size={18} className="text-orange-400" />
            <span>Badges & Progression</span>
          </h2>

          <div className="grid grid-cols-5 gap-2 mb-5">
            {allBadges.map((b) => (
              <div
                key={b.label}
                className={`flex flex-col items-center p-2 rounded-xl border transition-all text-center ${
                  b.unlocked
                    ? 'bg-orange-500/10 border-orange-500/40 shadow-md shadow-orange-500/10'
                    : 'bg-white/3 border-white/10 opacity-40'
                }`}
              >
                <span className="text-2xl mb-1">{b.emoji}</span>
                <span className={`text-[9px] font-bold leading-tight ${b.unlocked ? 'text-orange-300' : 'text-zinc-600'}`}>
                  {b.label}
                </span>
                <span className="text-[9px] text-zinc-600 mt-0.5">{b.threshold}+</span>
              </div>
            ))}
          </div>

          {nextBadge && (
            <div>
              <div className="flex justify-between text-xs text-zinc-500 mb-1.5">
                <span>Prochain badge: <span className="text-orange-400 font-bold">{nextBadge.badge.label} {nextBadge.badge.emoji}</span></span>
                <span>{totalOrders} / {nextBadge.threshold} commandes</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                <div
                  className="h-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all duration-700"
                  style={{ width: `${progressToNext}%` }}
                />
              </div>
              <p className="text-zinc-600 text-xs mt-1">
                Encore <span className="text-white">{nextBadge.remaining}</span> commande{nextBadge.remaining > 1 ? 's' : ''} pour débloquer ce badge
              </p>
            </div>
          )}

          {!nextBadge && (
            <div className="text-center py-2">
              <span className="text-yellow-400 font-bold text-sm">👑 Vous avez atteint le niveau maximum !</span>
            </div>
          )}
        </div>

        {/* Order History */}
        <div className="p-5 bg-white/5 border border-white/10 rounded-2xl mb-5">
          <h2 className="text-white font-bold mb-4 flex items-center space-x-2">
            <Clock size={18} className="text-zinc-400" />
            <span>Historique des Commandes</span>
          </h2>

          {orderHistory.length === 0 ? (
            <div className="text-center py-8 text-zinc-600">
              <ShoppingBag size={36} className="mx-auto mb-3 opacity-30" />
              <p>Aucune commande pour l'instant.</p>
              <button
                onClick={() => navigate('dine-in')}
                className="mt-4 text-orange-400 hover:text-orange-300 text-sm font-medium transition-colors"
              >
                Commander maintenant →
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {orderHistory.slice(0, 5).map((order, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-white/3 border border-white/5 rounded-xl">
                  <div>
                    <div className="text-white text-sm font-semibold">{order.id}</div>
                    <div className="text-zinc-500 text-xs mt-0.5">{order.date}</div>
                    {order.items && (
                      <div className="text-zinc-600 text-xs mt-0.5 truncate max-w-[200px]">
                        {order.items.slice(0, 2).join(', ')}{order.items.length > 2 ? '...' : ''}
                      </div>
                    )}
                  </div>
                  <div className="text-orange-400 font-bold text-sm">
                    {Math.round(order.total)} Dh
                  </div>
                </div>
              ))}
              {orderHistory.length > 5 && (
                <p className="text-zinc-600 text-xs text-center">
                  + {orderHistory.length - 5} commandes précédentes
                </p>
              )}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate('menu')}
            className="py-3 bg-white/5 border border-white/10 hover:border-orange-500/30 rounded-2xl text-white font-semibold text-sm transition-all text-center"
          >
            🍣 Voir le Menu
          </button>
          <button
            onClick={() => navigate('dine-in')}
            className="py-3 bg-orange-500 hover:bg-orange-600 rounded-2xl text-white font-semibold text-sm shadow-lg shadow-orange-500/30 transition-all text-center"
          >
            🍽️ Commander
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;
