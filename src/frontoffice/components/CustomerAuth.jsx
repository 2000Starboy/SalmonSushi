// ═══════════════════════════════════════════════════════════
//  ASAKA SUSHI — CustomerAuth
//  Login + Signup modal, Asaka design
//  OWASP: sanitize, validate, rate limit
// ═══════════════════════════════════════════════════════════
import React, { useState, useEffect } from 'react';
import { sanitize, validateForm, rateLimiter } from '../../utils/security';
import { ACCOUNT_DISCOUNT } from '../../data/asakaData';
import { toast } from '../../utils/toast';

const CustomerAuth = ({ mode, setMode, onLogin, onSignup, onClose, frontCustomers = [] }) => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const isLogin = mode === 'login';

  // Prevent background scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const update = (f, v) => {
    setForm(prev => ({ ...prev, [f]: v }));
    setErrors(prev => ({ ...prev, [f]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!isLogin && !sanitize(form.name, 80).trim()) errs.name = 'Nom requis';
    if (!sanitize(form.email, 100).trim()) errs.email = 'Email requis';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Email invalide';
    if (!sanitize(form.phone, 20).trim()) errs.phone = 'Téléphone requis';
    if (!form.password || form.password.length < 6) errs.password = 'Mot de passe (min 6 car.)';
    return errs;
  };

  const handleSubmit = () => {
    if (loading) return;

    if (!rateLimiter.check('auth', 5, 60000)) {
      toast.error('Trop de tentatives. Réessayez dans 1 minute.');
      return;
    }

    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);
    const email = sanitize(form.email, 100).toLowerCase();

    // Simulate async
    setTimeout(() => {
      if (isLogin) {
        const found = frontCustomers.find(
          c => c.email?.toLowerCase() === email && c.password === form.password
        );
        if (found) {
          onLogin(found);
          toast.success(`Bon retour, ${found.name} !`);
        } else {
          setErrors({ email: 'Email ou mot de passe incorrect' });
          setLoading(false);
        }
      } else {
        const exists = frontCustomers.some(c => c.email?.toLowerCase() === email);
        if (exists) {
          setErrors({ email: 'Un compte existe déjà avec cet email' });
          setLoading(false);
          return;
        }
        onSignup({
          name:     sanitize(form.name, 80),
          email,
          phone:    sanitize(form.phone, 20),
          password: form.password,
        });
        toast.success('Compte créé ! Bienvenue chez Asaka Sushi 🍣');
      }
    }, 600);
  };

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-x-0 bottom-0 z-50 sm:inset-0 sm:flex sm:items-center sm:justify-center">
        <div className="bg-asaka-800 border border-asaka-600/40 rounded-t-3xl sm:rounded-3xl
          w-full sm:max-w-md mx-auto overflow-y-auto max-h-[92vh] sm:max-h-[90vh]"
          style={{ animation: 'slideUp 0.35s cubic-bezier(0.34,1.2,0.64,1) forwards' }}>

          {/* Handle */}
          <div className="flex justify-center pt-3 sm:hidden">
            <div className="w-10 h-1 bg-asaka-600 rounded-full" />
          </div>

          <div className="px-6 py-5">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-white font-black text-xl">
                  {isLogin ? 'Connexion' : 'Créer un compte'}
                </h2>
                <p className="text-asaka-muted text-sm mt-0.5">
                  {isLogin
                    ? 'Accédez à votre espace fidélité'
                    : `Profitez de ${ACCOUNT_DISCOUNT}% de réduction dès la 1ère commande`}
                </p>
              </div>
              <button onClick={onClose}
                className="w-9 h-9 rounded-xl glass-light flex items-center justify-center
                  text-asaka-muted hover:text-white transition-colors">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            {/* Discount teaser (signup only) */}
            {!isLogin && (
              <div className="flex items-center gap-3 px-4 py-3 rounded-2xl mb-5
                bg-asaka-500/10 border border-asaka-500/25">
                <span className="text-2xl">💎</span>
                <div>
                  <div className="text-asaka-300 font-bold text-sm">
                    -{ACCOUNT_DISCOUNT}% sur vos commandes
                  </div>
                  <div className="text-asaka-muted text-xs">
                    + Points fidélité dès votre 1ère commande
                  </div>
                </div>
              </div>
            )}

            {/* Fields */}
            <div className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="text-asaka-muted text-xs font-semibold mb-1.5 block">
                    Nom complet *
                  </label>
                  <input type="text" value={form.name}
                    onChange={e => update('name', e.target.value)}
                    placeholder="Votre prénom et nom"
                    className={`input-asaka ${errors.name ? 'border-red-500/60' : ''}`}
                    autoComplete="name" />
                  {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                </div>
              )}

              <div>
                <label className="text-asaka-muted text-xs font-semibold mb-1.5 block">
                  Email *
                </label>
                <input type="email" value={form.email}
                  onChange={e => update('email', e.target.value)}
                  placeholder="votre@email.com"
                  className={`input-asaka ${errors.email ? 'border-red-500/60' : ''}`}
                  autoComplete="email" />
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="text-asaka-muted text-xs font-semibold mb-1.5 block">
                  Téléphone *
                </label>
                <input type="tel" value={form.phone}
                  onChange={e => update('phone', e.target.value)}
                  placeholder="+212 6XX XXX XXX"
                  className={`input-asaka ${errors.phone ? 'border-red-500/60' : ''}`}
                  autoComplete="tel" />
                {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="text-asaka-muted text-xs font-semibold mb-1.5 block">
                  Mot de passe *
                </label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={form.password}
                    onChange={e => update('password', e.target.value)}
                    placeholder="Minimum 6 caractères"
                    className={`input-asaka pr-11 ${errors.password ? 'border-red-500/60' : ''}`}
                    autoComplete={isLogin ? 'current-password' : 'new-password'}
                    onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                  />
                  <button type="button" onClick={() => setShowPass(s => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-asaka-muted
                      hover:text-white transition-colors">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                      className="w-4 h-4">
                      {showPass ? (
                        <path strokeLinecap="round" strokeLinejoin="round"
                          d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"/>
                      ) : (
                        <>
                          <path strokeLinecap="round" strokeLinejoin="round"
                            d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"/>
                          <path strokeLinecap="round" strokeLinejoin="round"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        </>
                      )}
                    </svg>
                  </button>
                </div>
                {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
              </div>
            </div>

            {/* Submit */}
            <button onClick={handleSubmit} disabled={loading}
              className="btn-primary w-full py-4 mt-6 flex items-center justify-center gap-2
                disabled:opacity-50">
              {loading ? (
                <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10"
                    stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
              ) : (
                isLogin ? '✓ Se connecter' : '🍣 Créer mon compte'
              )}
            </button>

            {/* Switch mode */}
            <p className="text-center text-asaka-muted text-sm mt-4">
              {isLogin ? "Pas encore de compte ?" : "Déjà un compte ?"}
              {' '}
              <button onClick={() => { setMode(isLogin ? 'signup' : 'login'); setErrors({}); }}
                className="text-asaka-300 font-bold hover:text-white transition-colors">
                {isLogin ? "S'inscrire" : "Se connecter"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomerAuth;
