import React, { useState } from 'react';
import { X, User, Lock, Phone, Mail, Eye, EyeOff, ChefHat } from 'lucide-react';

const CustomerAuth = ({ mode, setMode, onLogin, onSignup, onClose, frontCustomers }) => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const update = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('Veuillez remplir tous les champs.');
      return;
    }
    const found = frontCustomers.find(
      c => c.email.toLowerCase() === form.email.toLowerCase() && c.password === form.password
    );
    if (!found) {
      setError('Email ou mot de passe incorrect.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      onLogin(found);
    }, 500);
  };

  const handleSignup = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      setError('Nom, email et mot de passe sont requis.');
      return;
    }
    if (form.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }
    const exists = frontCustomers.find(c => c.email.toLowerCase() === form.email.toLowerCase());
    if (exists) {
      setError('Un compte avec cet email existe déjà.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      onSignup({ ...form });
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-[#111111] border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
        {/* Top gradient bar */}
        <div className="h-1 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500" />

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-500 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <div className="px-8 py-8">
          {/* Header */}
          <div className="text-center mb-7">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center mx-auto mb-4 shadow-xl shadow-orange-500/30">
              <ChefHat size={26} className="text-white" />
            </div>
            <h2 className="text-2xl font-extrabold text-white">
              {mode === 'login' ? 'Bon Retour !' : 'Rejoignez-Nous'}
            </h2>
            <p className="text-zinc-500 text-sm mt-1">
              {mode === 'login'
                ? 'Connectez-vous pour accéder à vos points et historique.'
                : 'Créez votre compte et commencez à gagner des points.'}
            </p>
          </div>

          {/* Toggle */}
          <div className="flex bg-white/5 border border-white/10 rounded-xl p-1 mb-6">
            <button
              onClick={() => { setMode('login'); setError(''); }}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                mode === 'login' ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Connexion
            </button>
            <button
              onClick={() => { setMode('signup'); setError(''); }}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                mode === 'signup' ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30' : 'text-zinc-400 hover:text-white'
              }`}
            >
              S'inscrire
            </button>
          </div>

          {/* Form */}
          <form onSubmit={mode === 'login' ? handleLogin : handleSignup} className="space-y-4">
            {mode === 'signup' && (
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Votre nom complet"
                  value={form.name}
                  onChange={e => update('name', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 focus:border-orange-500/60 rounded-xl text-white placeholder:text-zinc-600 text-sm outline-none transition-all"
                />
              </div>
            )}

            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="email"
                placeholder="Votre email"
                value={form.email}
                onChange={e => update('email', e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 focus:border-orange-500/60 rounded-xl text-white placeholder:text-zinc-600 text-sm outline-none transition-all"
              />
            </div>

            {mode === 'signup' && (
              <div className="relative">
                <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="tel"
                  placeholder="Votre téléphone (optionnel)"
                  value={form.phone}
                  onChange={e => update('phone', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 focus:border-orange-500/60 rounded-xl text-white placeholder:text-zinc-600 text-sm outline-none transition-all"
                />
              </div>
            )}

            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Mot de passe"
                value={form.password}
                onChange={e => update('password', e.target.value)}
                className="w-full pl-10 pr-10 py-3 bg-white/5 border border-white/10 focus:border-orange-500/60 rounded-xl text-white placeholder:text-zinc-600 text-sm outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Error */}
            {error && (
              <div className="px-4 py-2.5 bg-red-900/30 border border-red-500/30 rounded-xl text-red-400 text-xs text-center">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-bold rounded-xl transition-all shadow-lg shadow-orange-500/30 text-sm"
            >
              {loading
                ? '...'
                : mode === 'login' ? 'Se Connecter' : 'Créer mon Compte'}
            </button>
          </form>

          {/* Benefits for signup */}
          {mode === 'signup' && (
            <div className="mt-5 pt-5 border-t border-white/10">
              <p className="text-zinc-600 text-xs text-center mb-3">En créant un compte vous bénéficiez de:</p>
              <div className="grid grid-cols-3 gap-2 text-center">
                {[
                  { emoji: '⭐', text: 'Points fidélité' },
                  { emoji: '🏆', text: 'Badges exclusifs' },
                  { emoji: '📋', text: 'Historique' },
                ].map((b, i) => (
                  <div key={i} className="px-2 py-2 bg-white/3 border border-white/5 rounded-xl">
                    <div className="text-xl mb-1">{b.emoji}</div>
                    <div className="text-zinc-500 text-[10px]">{b.text}</div>
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
