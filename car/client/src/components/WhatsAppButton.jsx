import { FaWhatsapp } from 'react-icons/fa';

const WHATSAPP_NUMBER = '212707852423';

const WhatsAppButton = ({
  carName,
  price,
  disabled = false,
  className = '',
  floating = false,
}) => {
  const handleClick = () => {
    if (disabled) return;

    const message = encodeURIComponent(carName && price
      ? `Hello, I am interested in this car: ${carName}, Price: ${new Intl.NumberFormat('fr-MA').format(price)} DH`
      : 'Bonjour, je souhaite obtenir des informations sur vos voitures disponibles.'
    );

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
  };

  if (floating) {
    return (
      <button
        type="button"
        className={`whatsapp-floating ${className}`}
        onClick={handleClick}
        aria-label="Contacter sur WhatsApp"
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
      {disabled ? 'Vendu' : 'Acheter via WhatsApp'}
    </button>
  );
};

export default WhatsAppButton;
