import { lazy, Suspense } from 'react';
import { FaFacebookF, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';

const AICarAssistant = lazy(() => import('./AICarAssistant'));

const WHATSAPP_NUMBER = '212707852423';
const INSTAGRAM_URL = 'https://www.instagram.com/autosmart.maroc/';
const FACEBOOK_URL = 'https://www.facebook.com/share/1FbVLk3yJx/?mibextid=wwXIfr';

const WhatsAppButton = ({
  carName,
  price,
  disabled = false,
  className = '',
  floating = false,
  carId,
}) => {
  const { language, t } = useLanguage();

  const handleClick = async () => {
    if (disabled) return;

    const message = encodeURIComponent(carName && price
      ? `${t('whatsapp.buy')}: ${carName}, ${new Intl.NumberFormat(language === 'ar' ? 'ar-MA' : 'fr-MA').format(price)} DH`
      : t('home.contactDesc')
    );

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;

    if (carId) {
      try {
        await api.patch(`/cars/${carId}/whatsapp-click`);
      } catch (error) {
        console.error('Error tracking WhatsApp click:', error);
      }
    }

    window.open(whatsappUrl, '_blank');
  };

  if (floating) {
    return (
      <div className={`floating-socials whatsapp-floating ${className}`} aria-label={t('social.contact')}>
        <Suspense fallback={null}>
          <AICarAssistant />
        </Suspense>
        <button
          type="button"
          className="floating-social whatsapp"
          onClick={handleClick}
          aria-label={t('whatsapp.contact')}
        >
          <FaWhatsapp size={28} />
        </button>
        <a
          className="floating-social instagram"
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t('social.instagram')}
        >
          <FaInstagram size={24} />
        </a>
        <a
          className="floating-social facebook"
          href={FACEBOOK_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t('social.facebook')}
        >
          <FaFacebookF size={22} />
        </a>
      </div>
    );
  }

  return (
    <button
      type="button"
      className={`btn btn-whatsapp ${className}`}
      onClick={handleClick}
      disabled={disabled}
      id="whatsapp-buy-btn"
    >
      <FaWhatsapp size={20} />
      {disabled ? t('car.sold') : t('whatsapp.buy')}
    </button>
  );
};

export default WhatsAppButton;
