import React, { useState } from 'react';
import { X, User, Lock, Phone, Mail, Eye, EyeOff, ChefHat } from 'lucide-react';

const CustomerAuth = ({ mode, setMode, onLogin, onSignup, onClose, frontCustomers, theme = 'dark', language = 'fr' }) => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isLight = theme === 'light';

  const update = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { setError('Veuillez remplir tous les champs.'); return; }
    const found = frontCustomers.find(
      c => c.email.toLowerCase() === form.email.toLowerCase() && c.password === form.password
    );
    if (!found) { setError('Email ou mot de passe incorrect.'); return; }
    setLoading(true);
    setTimeout(() => onLogin(found), 500);
  };

  const handleSignup = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) { setError('Nom, email et mot de passe sont requis.'); return; }
    if (form.password.length < 6) { setError('Le mot de passe doit contenir au moins 6 caractères.'); return; }
    const exists = frontCustomers.find(c => c.email.toLowerCase() === form.email.toLowerCase());
    if (exists) { setError('Un compte avec cet email existe déjà.'); return; }
    setLoading(true);
    setTimeout(() => onSignup({ ...form }), 500);
  };

  // Theme classes
  const modalBg   = isLight ? 'bg-white border-gray-200 shadow-2xl shadow-gray-300/50'   : 'bg-[#111111] border-white/10 shadow-2xl shadow-black/60';
  const labelColor = isLight ? 'text-gray-800'     : 'text-white';
  const subColor  = isLight ? 'text-gray-500'       : 'text-zinc-500';
  const toggleBg  = isLight ? 'bg-gray-100 border border-gray-200' : 'bg-white/5 border border-white/10';
  const toggleInactive = isLight ? 'text-gray-500 hover:text-gray-800' : 'text-zinc-400 hover:text-white';
  const inputBase = isLight
    ? 'w-full py-3 bg-gray-50 border border-gray-200 focus:border-orange-400 focus:bg-white rounded-xl text-gray-900 placeholder:text-gray-400 text-sm outline-none transition-all'
    : 'w-full py-3 bg-white/5 border border-white/10 focus:border-orange-500/60 rounded-xl text-white placeholder:text-zinc-600 text-sm outline-none transition-all';
  const iconColor = isLight ? 'text-gray-400' : 'text-zinc-500';
  const eyeBtn    = isLight ? 'text-gray-400 hover:text-gray-700' : 'text-zinc-500 hover:text-zinc-300';
  const closeBtn  = isLight ? 'text-gray-400 hover:text-gray-700' : 'text-zinc-500 hover:text-white';
  const benefitCard = isLight ? 'bg-orange-50 border border-orange-100' : 'bg-white/3 border border-white/5';
  const benefitText = isLight ? 'text-gray-500' : 'text-zinc-500';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className={`relative w-full max-w-md border rounded-3xl overflow-hidden ${modalBg}`}>
        {/* Top gradient bar */}
        <div className="h-1 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500" />

        {/* Close */}
        <button onClick={onClose} className={`absolute top-4 right-4 p-2 transition-colors rounded-full ${closeBtn}`}>
          <X size={20} />
        </button>

        <div className="px-8 py-8">
          {/* Header */}
          <div className="text-center mb-7">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center mx-auto mb-4 shadow-xl shadow-orange-500/30">
              <ChefHat size={26} className="text-white" />
            </div>
            <h2 className={`text-2xl font-extrabold ${labelColor}`}>
              {mode === 'login' ? 'Bon Retour !' : 'Rejoignez-Nous'}
            </h2>
            <p className={`text-sm mt-1 ${subColor}`}>
              {mode === 'login'
                ? 'Connectez-vous pour accéder à vos points et historique.'
                : 'Créez votre compte et commencez à gagner des points.'}
            </p>
          </div>

          {/* Mode Toggle */}
          <div className={`flex rounded-xl p-1 mb-6 ${toggleBg}`}>
            {['login', 'signup'].map(m => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(''); }}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                  mode === m ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30' : toggleInactive
                }`}
              >
                {m === 'login' ? 'Connexion' : "S'inscrire"}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={mode === 'login' ? handleLogin : handleSignup} className="space-y-4">
            {mode === 'signup' && (
              <div className="relative">
                <User size={16} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${iconColor}`} />
                <input
                  type="text"
                  placeholder="Votre nom complet"
                  value={form.name}
                  onChange={e => update('name', e.target.value)}
                  className={`${inputBase} pl-10 pr-4`}
                />
              </div>
            )}

            <div className="relative">
              <Mail size={16} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${iconColor}`} />
              <input
                type="email"
                placeholder="Votre email"
                value={form.email}
                onChange={e => update('email', e.target.value)}
                className={`${inputBase} pl-10 pr-4`}
              />
            </div>

            {mode === 'signup' && (
              <div className="relative">
                <Phone size={16} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${iconColor}`} />
                <input
                  type="tel"
                  placeholder="Téléphone ou WhatsApp (optionnel)"
                  value={form.phone}
                  onChange={e => update('phone', e.target.value)}
                  className={`${inputBase} pl-10 pr-4`}
                />
              </div>
            )}

            <div className="relative">
              <Lock size={16} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${iconColor}`} />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Mot de passe"
                value={form.password}
                onChange={e => update('password', e.target.value)}
                className={`${inputBase} pl-10 pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors ${eyeBtn}`}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {error && (
              <div className={`px-4 py-2.5 border rounded-xl text-xs text-center ${
                isLight ? 'bg-red-50 border-red-200 text-red-600' : 'bg-red-900/30 border-red-500/30 text-red-400'
              }`}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-bold rounded-xl transition-all shadow-lg shadow-orange-500/30 text-sm"
            >
              {loading ? '...' : mode === 'login' ? 'Se Connecter' : 'Créer mon Compte'}
            </button>
          </form>

          {mode === 'signup' && (
            <div className={`mt-5 pt-5 border-t ${isLight ? 'border-gray-100' : 'border-white/10'}`}>
              <p className={`text-xs text-center mb-3 ${subColor}`}>En créant un compte vous bénéficiez de:</p>
              <div className="grid grid-cols-3 gap-2 text-center">
                {[
                  { emoji: '⭐', text: 'Points fidélité' },
                  { emoji: '🏆', text: 'Badges exclusifs' },
                  { emoji: '📋', text: 'Historique' },
                ].map((b, i) => (
                  <div key={i} className={`px-2 py-2.5 rounded-xl ${benefitCard}`}>
                    <div className="text-xl mb-1">{b.emoji}</div>
                    <div className={`text-[10px] font-medium ${benefitText}`}>{b.text}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerAuth;
