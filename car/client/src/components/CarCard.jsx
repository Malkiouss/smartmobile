import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHeart, FiCalendar, FiNavigation } from 'react-icons/fi';
import { getCarImages } from '../services/images';
import api from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { fadeUp } from '../utils/animations';
import './CarCard.css';

const CarCard = ({ car }) => {
  const [liked, setLiked] = useState(false);
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const isSold = car.status === 'sold';

  const formatNumber = (value) => {
    return new Intl.NumberFormat(language === 'ar' ? 'ar-MA' : 'fr-MA').format(value);
  };

  const imageUrl = getCarImages(car, 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=400&q=80')[0];
  const detailsPath = `/voitures/${car._id}`;
  const likedKey = `liked-car-${car._id}`;

  useEffect(() => {
    setLiked(Boolean(localStorage.getItem(likedKey)));
  }, [likedKey]);

  const handleCardClick = () => {
    navigate(detailsPath);
  };

  const handleCardKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCardClick();
    }
  };

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (localStorage.getItem(likedKey)) {
      setLiked(true);
      return;
    }

    setLiked(true);
    localStorage.setItem(likedKey, 'true');

    try {
      await api.patch(`/cars/${car._id}/like`);
    } catch (error) {
      console.error('Error tracking like:', error);
    }
  };

  return (
    <motion.article
      className={`car-card ${isSold ? 'car-card--sold' : ''}`}
      id={`car-card-${car._id}`}
      role="button"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={handleCardKeyDown}
      variants={fadeUp}
      whileHover={{ y: isSold ? 0 : -4, scale: isSold ? 1 : 1.01 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      {isSold && (
        <div className="car-card-sold-badge">{t('car.soldUpper')}</div>
      )}

      <div className="car-card-image-wrapper">
        <img src={imageUrl} alt={car.name} className="car-card-image" loading="lazy" />
        <button
          className={`car-card-heart ${liked ? 'liked' : ''}`}
          onClick={handleLike}
          aria-label={t('car.favorite')}
        >
          <FiHeart />
        </button>
      </div>

      <div className="car-card-body">
        <h3 className="car-card-name">{car.name}</h3>
        
        {car.shortDescription && (
          <p className="car-card-desc">{car.shortDescription}</p>
        )}

        <div className="car-card-meta">
          <span className="car-card-meta-item">
            <FiCalendar />
            {car.year}
          </span>
          <span className="car-card-meta-item">
            <FiNavigation />
            {car.mileage ? `${formatNumber(car.mileage)} km` : t('car.notAvailable')}
          </span>
        </div>

        <div className="car-card-footer">
          <div className="car-card-price">
            {formatNumber(car.price)} <span className="car-card-currency">DH</span>
          </div>
          <Link
            to={detailsPath}
            className="btn btn-primary btn-sm car-card-btn"
            onClick={(e) => e.stopPropagation()}
          >
            {t('car.details')}
          </Link>
        </div>

        {car.quantity !== undefined && (
          <div className="car-card-qty">
            <span className={`badge ${isSold ? 'badge-sold' : 'badge-available'}`}>
              {isSold ? t('car.sold') : `${car.quantity} ${t('car.quantityAvailable')}`}
            </span>
          </div>
        )}
      </div>
    </motion.article>
  );
};

export default CarCard;
