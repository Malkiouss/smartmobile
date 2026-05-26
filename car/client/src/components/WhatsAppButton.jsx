import { FaWhatsapp } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';

const WHATSAPP_NUMBER = '212707852423';

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
      <button
        type="button"
        className={`whatsapp-floating ${className}`}
        onClick={handleClick}
        aria-label={t('whatsapp.contact')}
      >
        <FaWhatsapp size={28} />
      </button>
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
