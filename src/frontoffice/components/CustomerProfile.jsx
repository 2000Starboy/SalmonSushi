// ═══════════════════════════════════════════════════════════
//  ASAKA SUSHI — CustomerProfile
//  Badge tier, points, order history, favorites
// ═══════════════════════════════════════════════════════════
import React, { useState } from 'react';
import { getBadge, getNextBadge, POINTS_VALUE, MIN_REDEEM, BADGES } from '../../data/asakaData';

const CustomerProfile = ({ navigate, currentCustomer, handleLogout, openAuth }) => {
  const [activeTab, setActiveTab] = useState('points');

  if (!currentCustomer) {
    return (
      <div className="min-h-screen bg-asaka-900 flex flex-col items-center justify-center
        px-6 pt-24 text-center">
        <div className="text-7xl mb-5">👤</div>
        <h2 className="text-white font-black text-2xl mb-2">Espace fidélité</h2>
        <p className="text-asaka-muted text-sm mb-8">
          Connectez-vous pour accéder à votre profil et vos points
        </p>
        <button onClick={() => openAuth('login')}
          className="btn-primary px-8 py-3.5 text-sm mb-3">
          Se connecter
        </button>
        <button onClick={() => openAuth('signup')}
          className="btn-secondary px-8 py-3 text-sm">
          Créer un compte
        </button>
      </div>
    );
  }

  const badge    = getBadge(currentCustomer.totalOrders || 0);
  const nextInfo = getNextBadge(currentCustomer.totalOrders || 0);
  const progress = nextInfo
    ? Math.round(((currentCustomer.totalOrders - (badge.minOrders || 0)) /
        (nextInfo.badge.minOrders - (badge.minOrders || 0))) * 100)
    : 100;
  const pointsValue = Math.floor((currentCustomer.points || 0) * POINTS_VALUE);
  const canRedeem   = (currentCustomer.points || 0) >= MIN_REDEEM;

  const TABS = [
    { id: 'points',  label: 'Points',    emoji: '⭐' },
    { id: 'history', label: 'Historique', emoji: '📋' },
  ];

  return (
    <div className="min-h-screen bg-asaka-900 pt-20 pb-28">
      <div className="max-w-xl mx-auto px-4">

        {/* Profile header */}
        <div className="glass rounded-3xl p-6 mb-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-asaka-500/10 rounded-full
            blur-3xl pointer-events-none" />

          <div className="flex items-start gap-4 relative z-10">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br
              from-asaka-600 to-asaka-300 flex items-center justify-center
              text-white font-black text-2xl shadow-glow-blue flex-shrink-0">
              {currentCustomer.name?.[0]?.toUpperCase() || '?'}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-white font-black text-xl truncate">{currentCustomer.name}</h1>
              <p className="text-asaka-muted text-xs mt-0.5 truncate">{currentCustomer.email}</p>
              <div className="flex items-center gap-2 mt-2">
                {/* Badge */}
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full
                  text-xs font-bold ${badge.textColor} bg-asaka-800 border border-asaka-700/40`}>
                  <span>{badge.emoji}</span>
                  <span>{badge.name}</span>
                </span>
                <span className="text-asaka-muted text-xs">
                  {currentCustomer.totalOrders || 0} commandes
                </span>
              </div>
            </div>
          </div>

          {/* Badge progress */}
          <div className="mt-5 relative z-10">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-asaka-muted font-semibold">{badge.emoji} {badge.name}</span>
              {nextInfo ? (
                <span className="text-asaka-muted">
                  {nextInfo.badge.emoji} {nextInfo.badge.name} dans {nextInfo.remaining} commandes
                </span>
              ) : (
                <span className="text-yellow-400 font-bold">Niveau maximum ! 🏆</span>
              )}
            </div>
            <div className="h-2 bg-asaka-900 rounded-full overflow-hidden border border-asaka-700/40">
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{
                  width: `${progress}%`,
                  background: 'linear-gradient(90deg, #1565c0, #4fc3f7)',
                  boxShadow: '0 0 8px rgba(79,195,247,0.5)',
                }}
              />
            </div>
            <p className="text-asaka-600 text-xs mt-1">{badge.perks}</p>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { value: currentCustomer.totalOrders || 0, label: 'Commandes' },
            { value: `${currentCustomer.points || 0}`, label: 'Points', sub: `= ${pointsValue} DH` },
            { value: `${Math.round(currentCustomer.totalSpent || 0)} DH`, label: 'Total dépensé' },
          ].map(s => (
            <div key={s.label} className="glass rounded-2xl py-4 px-3 text-center">
              <div className="text-asaka-300 font-black text-xl leading-none">{s.value}</div>
              <div className="text-asaka-muted text-xs mt-1">{s.label}</div>
              {s.sub && <div className="text-asaka-600 text-[10px] mt-0.5">{s.sub}</div>}
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-asaka-500 text-white'
                  : 'glass-light text-asaka-muted hover:text-white'
              }`}>
              {tab.emoji} {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === 'points' && (
          <div className="space-y-3">
            {/* Points balance */}
            <div className="card-asaka p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-asaka-muted text-xs font-semibold uppercase tracking-wider">
                    Solde de points
                  </div>
                  <div className="text-asaka-300 font-black text-3xl mt-1">
                    {currentCustomer.points || 0}
                    <span className="text-asaka-muted text-base font-normal ml-1">pts</span>
                  </div>
                  <div className="text-asaka-muted text-sm mt-0.5">
                    ≈ {pointsValue} DH de réduction
                  </div>
                </div>
                <div className="text-4xl">⭐</div>
              </div>

              {canRedeem ? (
                <div className="bg-green-900/20 border border-green-700/30 rounded-xl p-3 text-xs">
                  <span className="text-green-400 font-bold">✅ Points utilisables</span>
                  <p className="text-asaka-muted mt-0.5">
                    Utilisez vos points au moment du checkout pour obtenir une réduction.
                  </p>
                </div>
              ) : (
                <div className="bg-asaka-900/50 border border-asaka-700/30 rounded-xl p-3 text-xs">
                  <span className="text-asaka-muted">
                    Encore {MIN_REDEEM - (currentCustomer.points || 0)} points pour utiliser vos récompenses
                  </span>
                  <div className="h-1.5 bg-asaka-900 rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-asaka-500 rounded-full transition-all"
                      style={{ width: `${Math.min(100, ((currentCustomer.points || 0) / MIN_REDEEM) * 100)}%` }} />
                  </div>
                </div>
              )}
            </div>

            {/* All badge tiers */}
            <div className="card-asaka p-5">
              <h3 className="text-white font-bold text-sm mb-3">Niveaux de fidélité</h3>
              <div className="space-y-3">
                {BADGES.map(b => {
                  const unlocked = (currentCustomer.totalOrders || 0) >= b.minOrders;
                  return (
                    <div key={b.name}
                      className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                        unlocked ? 'bg-asaka-700/30' : 'opacity-40'
                      }`}>
                      <span className="text-2xl">{b.emoji}</span>
                      <div className="flex-1">
                        <div className={`font-bold text-sm ${unlocked ? b.textColor : 'text-asaka-muted'}`}>
                          {b.name}
                        </div>
                        <div className="text-asaka-muted text-xs">{b.perks}</div>
                      </div>
                      <div className="text-right text-xs text-asaka-muted">
                        {b.minOrders === 0 ? 'Départ' : `${b.minOrders} cmds`}
                      </div>
                      {unlocked && <span className="text-green-400 text-sm">✓</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-3">
            {(currentCustomer.orderHistory || []).length === 0 ? (
              <div className="card-asaka p-8 text-center">
                <div className="text-4xl mb-3">📋</div>
                <div className="text-white font-bold">Aucune commande</div>
                <div className="text-asaka-muted text-sm mt-1">
                  Vos commandes apparaîtront ici
                </div>
                <button onClick={() => navigate('menu')}
                  className="btn-primary px-6 py-2.5 text-sm mt-4">
                  Commander 🍣
                </button>
              </div>
            ) : (
              (currentCustomer.orderHistory || []).map((order, i) => (
                <div key={i} className="card-asaka p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-asaka-300 font-black text-sm">{order.id}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full
                          bg-green-900/30 text-green-400 border border-green-800/30">
                          ✓ Livré
                        </span>
                      </div>
                      <div className="text-asaka-muted text-xs mt-0.5">{order.date}</div>
                    </div>
                    <div className="text-asaka-300 font-black text-sm">{order.total} DH</div>
                  </div>
                  {order.items && order.items.length > 0 && (
                    <div className="text-asaka-muted text-xs">
                      {order.items.slice(0, 3).join(', ')}
                      {order.items.length > 3 && ` +${order.items.length - 3} autres`}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Logout */}
        <button onClick={handleLogout}
          className="w-full mt-6 py-3.5 rounded-2xl glass-light text-coral-400
            text-sm font-bold hover:bg-red-900/20 transition-all flex items-center
            justify-center gap-2">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"/>
          </svg>
          Se déconnecter
        </button>
      </div>
    </div>
  );
};

export default CustomerProfile;
