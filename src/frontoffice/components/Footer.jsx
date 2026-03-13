import React from 'react';
import { ChefHat, Instagram, ExternalLink, MapPin, Phone, Clock } from 'lucide-react';
import { restaurantInfo } from '../../data/menuData';

const Footer = ({ navigate, onGoToBackoffice, language = 'fr', theme = 'dark', isLight = false }) => {
  const t = {
    nav: language === 'ar' ? 'التنقل' : language === 'en' ? 'Navigation' : 'Navigation',
    menu_label: language === 'ar' ? 'قائمتنا' : language === 'en' ? 'Our Menu' : 'Notre Carte',
    contact: language === 'ar' ? 'اتصل بنا' : language === 'en' ? 'Contact' : 'Contact',
    rights: language === 'ar' ? '© 2025 Salmon Sushi — الدار البيضاء. جميع الحقوق محفوظة.' : language === 'en' ? '© 2025 Salmon Sushi — Casablanca. All rights reserved.' : '© 2025 Salmon Sushi — Casablanca. Tous droits réservés.',
    staff: language === 'ar' ? 'دخول الموظفين' : language === 'en' ? 'Staff Access' : 'Accès Staff',
  };

  const navItems = language === 'ar'
    ? [{ label: 'الرئيسية', page: 'home' }, { label: 'القائمة', page: 'menu' }, { label: 'اطلب هنا', page: 'dine-in' }, { label: 'ملفي', page: 'profile' }]
    : language === 'en'
    ? [{ label: 'Home', page: 'home' }, { label: 'Menu', page: 'menu' }, { label: 'Dine In', page: 'dine-in' }, { label: 'Profile', page: 'profile' }]
    : [{ label: 'Accueil', page: 'home' }, { label: 'Menu', page: 'menu' }, { label: 'Commander', page: 'dine-in' }, { label: 'Mon Profil', page: 'profile' }];

  const menuCategories = language === 'ar'
    ? ['سوشي فراي', 'أروماكي', 'كاليفورنيا', 'سبيسيو', 'وك تاي', 'الحلويات']
    : language === 'en'
    ? ['Sushi Fry', 'Aromaki', 'California', 'Specials', 'Wok & Thai', 'Desserts']
    : ['Sushi Fry', 'Aromaki', 'California', 'Spéciaux', 'Wok & Thaï', 'Desserts'];

  const footerBg = isLight ? 'bg-gray-100 border-t border-gray-200' : 'bg-black/60 border-t border-white/10';
  const headingClass = isLight ? 'text-gray-800 font-semibold mb-4 text-xs uppercase tracking-wider' : 'text-white font-semibold mb-4 text-xs uppercase tracking-wider';
  const linkClass = isLight ? 'text-gray-500 hover:text-orange-600 text-sm transition-colors' : 'text-zinc-500 hover:text-zinc-200 text-sm transition-colors';
  const mutedClass = isLight ? 'text-gray-500 text-sm' : 'text-zinc-500 text-sm';
  const bottomBg = isLight ? 'border-t border-gray-200' : 'border-t border-white/5';
  const bottomText = isLight ? 'text-gray-400 text-xs' : 'text-zinc-600 text-xs';
  const logoText = isLight ? 'text-gray-900' : 'text-white';

  return (
    <footer className={footerBg}>
      <div className="max-w-6xl mx-auto px-5 sm:px-6 py-10 sm:py-14">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-2 md:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                <ChefHat size={16} className="text-white" />
              </div>
              <span className="text-base font-bold">
                <span className={logoText}>Salmon</span>
                <span className="text-orange-500"> Sushi</span>
              </span>
            </div>
            <p className={`${mutedClass} leading-relaxed mb-5`}>
              {language === 'ar'
                ? 'فن السوشي الأصيل في قلب الدار البيضاء. طازج، شغوف، متميز منذ 2019.'
                : language === 'en'
                ? 'The art of authentic sushi in the heart of Casablanca. Fresh, passionate, excellent since 2019.'
                : "L'art du sushi authentique au cœur de Casablanca. Fraîcheur, passion, excellence depuis 2019."}
            </p>
            <div className="flex space-x-2.5">
              <a href={restaurantInfo.social.instagram} target="_blank" rel="noopener noreferrer"
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all border ${isLight ? 'bg-gray-200 hover:bg-pink-50 border-gray-200 hover:border-pink-200' : 'bg-white/10 hover:bg-pink-500/20 border-white/10 hover:border-pink-500/30'}`}>
                <Instagram size={15} className={isLight ? 'text-gray-500 hover:text-pink-500' : 'text-zinc-400'} />
              </a>
              <a href={restaurantInfo.social.facebook} target="_blank" rel="noopener noreferrer"
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all border text-xs font-bold ${isLight ? 'bg-gray-200 hover:bg-blue-50 border-gray-200 hover:border-blue-200 text-gray-500' : 'bg-white/10 hover:bg-blue-500/20 border-white/10 hover:border-blue-500/30 text-zinc-400'}`}>
                f
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className={headingClass}>{t.nav}</h4>
            <ul className="space-y-2">
              {navItems.map(item => (
                <li key={item.label}>
                  <button onClick={() => navigate(item.page)} className={linkClass}>{item.label}</button>
                </li>
              ))}
            </ul>
          </div>

          {/* Menu Categories */}
          <div>
            <h4 className={headingClass}>{t.menu_label}</h4>
            <ul className="space-y-2">
              {menuCategories.map(cat => (
                <li key={cat}>
                  <button onClick={() => navigate('menu')} className={linkClass}>{cat}</button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className={headingClass}>{t.contact}</h4>
            <ul className="space-y-3">
              {restaurantInfo.locations.map((loc, i) => (
                <li key={i} className="space-y-1">
                  <p className={`font-medium text-sm ${isLight ? 'text-gray-700' : 'text-zinc-300'}`}>{loc.name}</p>
                  <p className={mutedClass + ' flex items-start gap-1.5'}>
                    <MapPin size={12} className="mt-0.5 flex-shrink-0 text-orange-500" />
                    <span className="text-xs">{loc.address}</span>
                  </p>
                  <p className={mutedClass + ' flex items-center gap-1.5'}>
                    <Phone size={12} className="flex-shrink-0 text-orange-500" />
                    <span className="text-xs">{loc.phone[0]}</span>
                  </p>
                </li>
              ))}
              <li className={`flex items-start gap-1.5 ${mutedClass} pt-1`}>
                <Clock size={12} className="mt-0.5 flex-shrink-0 text-orange-500" />
                <div className="text-xs">
                  <div>{language === 'ar' ? 'غداء: 12:00 - 15:00 (إثنين-جمعة)' : language === 'en' ? 'Lunch: 12pm - 3pm (Mon-Fri)' : 'Déjeuner: 12h - 15h (Lun-Ven)'}</div>
                  <div>{language === 'ar' ? 'عشاء: 19:00 - 23:30' : language === 'en' ? 'Dinner: 7pm - 11:30pm' : 'Dîner: 19h - 23h30'}</div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className={`${bottomBg} px-5 sm:px-6 py-4`}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className={bottomText}>{t.rights}</span>
          <div className="flex items-center gap-3">
            <span className={bottomText}>
              {language === 'ar' ? 'سياسة الخصوصية' : language === 'en' ? 'Privacy Policy' : 'Confidentialité'}
            </span>
            <span className={bottomText}>·</span>
            {onGoToBackoffice && (
              <button
                onClick={onGoToBackoffice}
                className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs border transition-all ${
                  isLight
                    ? 'bg-gray-200 hover:bg-orange-50 border-gray-300 hover:border-orange-200 text-gray-500 hover:text-orange-600'
                    : 'bg-white/5 hover:bg-orange-500/10 border-white/10 hover:border-orange-500/30 text-zinc-400 hover:text-orange-400'
                }`}
              >
                <ExternalLink size={11} />
                <span>{t.staff}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
