import React, { useState } from 'react';
import { CheckCircle2, Star, ExternalLink, RotateCcw, Home, UserPlus } from 'lucide-react';

// Replace with your real Google Maps Place ID review URL
const GOOGLE_REVIEW_URL = 'https://search.google.com/local/writereview?placeid=ChIJSalmonSushiCasablanca';

const OrderConfirmation = ({
  navigate,
  currentCustomer,
  openAuth,
  orderMode,
  setOrderMode,
  lastOrderId,
  lastOrderPoints = 0,
  lastOrderTotal  = 0,
  isLight = false,
  language = 'fr',
}) => {
  const t = (fr, en, ar) => language === 'ar' ? ar : language === 'en' ? en : fr;
  const [reviewClicked, setReviewClicked] = useState(false);

  const textPrimary = isLight ? 'text-gray-900'   : 'text-white';
  const textMuted   = isLight ? 'text-gray-500'   : 'text-zinc-400';
  const cardBg      = isLight ? 'bg-white border-gray-200 shadow-sm' : 'bg-white/5 border-white/10';
  const divider     = isLight ? 'border-gray-100' : 'border-white/8';
  const moreBtn     = isLight
    ? 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
    : 'bg-white/5 border-white/15 text-white hover:bg-white/10';

  const modeLabel = {
    'dine-in':  { emoji: '🍽️', text: t('Sur Place', 'Dine In', 'هنا') },
    'takeaway': { emoji: '🥡', text: t('À Emporter', 'Take Away', 'للأخذ') },
    'online':   { emoji: '🌐', text: t('En Ligne', 'Online', 'أونلاين') },
  }[orderMode] || { emoji: '📦', text: t('Commande', 'Order', 'طلب') };

  const firstName = currentCustomer?.name?.split(' ')[0] || '';

  const handleOrderMore = () => {
    setOrderMode(null);
    navigate('menu');
  };

  const handleGoHome = () => {
    setOrderMode(null);
    navigate('home');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-20">
      <div className="max-w-md w-full text-center">

        {/* ── Success animation ────────────────────── */}
        <div className="relative w-28 h-28 mx-auto mb-8">
          <div className="absolute inset-0 rounded-full bg-emerald-500/20 border-2 border-emerald-500/30 animate-pulse" />
          <div className="relative w-28 h-28 rounded-full bg-emerald-500/15 border-2 border-emerald-500/50 flex items-center justify-center">
            <CheckCircle2 size={52} className="text-emerald-500" />
          </div>
        </div>

        {/* ── Title (personalized if logged in) ────── */}
        {currentCustomer ? (
          <h1 className={`text-3xl font-extrabold mb-1 ${textPrimary}`}>
            {t(`Merci, ${firstName} ! 🎉`, `Thank you, ${firstName}! 🎉`, `شكراً، ${firstName}! 🎉`)}
          </h1>
        ) : (
          <h1 className={`text-3xl font-extrabold mb-1 ${textPrimary}`}>
            {t('Commande Confirmée ! 🎉', 'Order Confirmed! 🎉', 'تم تأكيد طلبك! 🎉')}
          </h1>
        )}
        <p className={`text-sm mb-4 ${textMuted}`}>
          {t('Votre commande est en cours de préparation.', 'Your order is being prepared.', 'طلبك قيد التحضير.')}
        </p>

        {/* ── Order badge ──────────────────────────── */}
        {lastOrderId && (
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/30 mb-6">
            <span className="text-orange-500 font-bold text-sm">{lastOrderId}</span>
            <span className="text-orange-400/40">·</span>
            <span className="text-orange-500 text-sm">{modeLabel.emoji} {modeLabel.text}</span>
            <span className="text-orange-400/40">·</span>
            <span className="text-orange-500 font-bold text-sm">{lastOrderTotal} Dh</span>
          </div>
        )}

        {/* ── Points earned (only if logged in) ────── */}
        {currentCustomer && lastOrderPoints > 0 && (
          <div className="flex items-center justify-center space-x-2 px-5 py-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl mb-5">
            <Star size={17} className="text-amber-400 fill-amber-400" />
            <span className="text-amber-500 font-bold text-sm">
              +{lastOrderPoints} {t('points fidélité gagnés !', 'loyalty points earned!', 'نقطة ولاء مكتسبة!')}
            </span>
            <Star size={17} className="text-amber-400 fill-amber-400" />
          </div>
        )}

        {/* ── Google Review CTA ────────────────────── */}
        <div className={`p-5 rounded-2xl border mb-5 ${cardBg}`}>
          <div className="flex items-center justify-center space-x-2 mb-2">
            <span className="text-xl">⭐</span>
            <p className={`font-bold text-sm ${textPrimary}`}>
              {currentCustomer
                ? t(`${firstName}, partagez votre avis !`, `${firstName}, share your feedback!`, `${firstName}، شاركنا رأيك!`)
                : t('Partagez votre expérience !', 'Share your experience!', 'شاركنا تجربتك!')}
            </p>
          </div>
          <p className={`text-xs mb-4 leading-relaxed ${textMuted}`}>
            {currentCustomer
              ? t('Votre avis aide d\'autres amateurs de sushi à nous découvrir. Merci pour votre fidélité !', 'Your review helps sushi lovers discover us. Thank you for your loyalty!', 'رأيك يساعد محبي السوشي على اكتشافنا. شكراً لولائك!')
              : t('Un simple avis Google est précieux pour nous. Cela ne prend que 30 secondes !', 'A quick Google review means a lot to us. It only takes 30 seconds!', 'تقييم Google بسيط يعني لنا الكثير. يستغرق 30 ثانية فقط!')}
          </p>
          <a
            href={GOOGLE_REVIEW_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setReviewClicked(true)}
            className={`flex items-center justify-center space-x-2 w-full py-3 rounded-xl font-bold text-sm transition-all border ${
              reviewClicked
                ? 'bg-green-500/10 border-green-500/30 text-green-600'
                : isLight
                ? 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:shadow-sm hover:border-gray-300'
                : 'bg-white/5 border-white/15 text-white hover:bg-white/10'
            }`}
          >
            <span className="font-black text-base" style={{ color: reviewClicked ? undefined : '#4285F4' }}>G</span>
            <span>
              {reviewClicked
                ? t('Merci pour votre avis ! 🙏', 'Thank you for your review! 🙏', 'شكراً على تقييمك! 🙏')
                : t('Laisser un avis Google', 'Leave a Google Review', 'اترك تقييماً على Google')}
            </span>
            {!reviewClicked && <ExternalLink size={13} className="opacity-60" />}
          </a>

          {/* Create account nudge if not logged in */}
          {!currentCustomer && (
            <div className={`mt-4 pt-4 border-t ${divider}`}>
              <p className={`text-xs mb-3 ${textMuted}`}>
                {t('Créez un compte pour accumuler des points et profiter d\'offres exclusives à chaque commande.', 'Create an account to earn points and enjoy exclusive offers every order.', 'أنشئ حساباً لتجميع النقاط والاستمتاع بعروض حصرية.')}
              </p>
              <button
                onClick={() => openAuth('signup')}
                className="flex items-center justify-center space-x-2 w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs transition-all shadow-md shadow-orange-500/30"
              >
                <UserPlus size={14} />
                <span>{t("Créer mon compte — c'est gratuit", "Create my account — it's free", 'إنشاء حساب — مجاناً')}</span>
              </button>
            </div>
          )}
        </div>

        {/* ── Actions ──────────────────────────────── */}
        <div className="flex gap-3">
          <button
            onClick={handleOrderMore}
            className={`flex-1 flex items-center justify-center space-x-2 py-3.5 rounded-xl font-semibold text-sm border transition-all ${moreBtn}`}
          >
            <RotateCcw size={15} />
            <span>{t('Commander encore', 'Order more', 'اطلب مجدداً')}</span>
          </button>
          <button
            onClick={handleGoHome}
            className="flex-1 flex items-center justify-center space-x-2 py-3.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-orange-500/30"
          >
            <Home size={15} />
            <span>{t('Accueil', 'Home', 'الرئيسية')}</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default OrderConfirmation;
