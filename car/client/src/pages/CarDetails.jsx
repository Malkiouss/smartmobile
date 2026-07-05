import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCalendar, FiHeart, FiNavigation, FiTag, FiPackage, FiArrowLeft } from 'react-icons/fi';
import SEO from '../components/SEO';
import WhatsAppButton from '../components/WhatsAppButton';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';
import { getCarImages } from '../services/images';
import { unwrapData } from '../services/response';
import { breadcrumbSchema, productSchema, vehicleSchema } from '../seo/schema';
import { carDescription, carImage, carTitle } from '../seo/site';
import { fadeUp, fadeIn, staggerContainer, viewportOnce } from '../utils/animations';
import './CarDetails.css';

const CarDetails = () => {
  const { id } = useParams();
  const { language, t } = useLanguage();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    fetchCar();
  }, [id]);

  useEffect(() => {
    setLiked(Boolean(localStorage.getItem(`liked-car-${id}`)));
  }, [id]);

  const fetchCar = async () => {
    try {
      const res = await api.get(`/cars/${id}`);
      setCar(unwrapData(res.data));
      const viewedKey = `viewed-car-${id}`;
      if (!sessionStorage.getItem(viewedKey)) {
        try {
          await api.patch(`/cars/${id}/view`);
          sessionStorage.setItem(viewedKey, 'true');
        } catch (error) {
          console.error('Error tracking view:', error);
        }
      }
    } catch (err) {
      console.error('Error fetching car:', err);
    } finally {
      setLoading(false);
    }
  };

  const detailsPath = `/voitures/${id}`;

  if (loading) return (
    <>
      <SEO page="cars" path={detailsPath} />
      <div className="spinner" style={{ marginTop: '120px' }} />
    </>
  );
  if (!car) return (
    <div className="car-details-empty">
      <SEO
        title={`${t('details.notFound')} | AutoSmart Maroc`}
        description="Cette voiture n est pas disponible. Consultez les autres voitures d occasion et de luxe AutoSmart Maroc au Maroc."
        path={detailsPath}
        noindex
      />
      <h1>{t('details.notFound')}</h1>
      <Link to="/voitures" className="btn btn-primary">{t('details.backCars')}</Link>
    </div>
  );

  const isSold = car.status === 'sold';
  const formatNumber = (value) => new Intl.NumberFormat(language === 'ar' ? 'ar-MA' : 'fr-MA').format(value);
  const images = getCarImages(car);

  const handleLike = async () => {
    const likedKey = `liked-car-${id}`;

    if (localStorage.getItem(likedKey)) {
      setLiked(true);
      return;
    }

    setLiked(true);
    localStorage.setItem(likedKey, 'true');
    setCar((current) => current ? { ...current, likes: (current.likes || 0) + 1 } : current);

    try {
      const res = await api.patch(`/cars/${id}/like`);
      setCar((current) => current ? { ...current, likes: res.data.likes || current.likes || 0 } : current);
    } catch (error) {
      console.error('Error tracking like:', error);
    }
  };

  return (
    <div className="car-details" id="car-details-page">
      <SEO
        title={carTitle(car)}
        description={carDescription(car)}
        keywords={`${car.name}, ${car.brand}, ${car.model}, voiture occasion Maroc, voiture luxe Maroc, AutoSmart Maroc, Ain Taoujdate`}
        path={detailsPath}
        image={carImage(car)}
        type="product"
        schemas={[
          breadcrumbSchema([
            { name: 'Accueil', path: '/' },
            { name: 'Voitures', path: '/voitures' },
            { name: car.name, path: detailsPath },
          ]),
          vehicleSchema(car, detailsPath),
          productSchema(car, detailsPath),
        ]}
      />
      <div className="container">
        <motion.div variants={fadeUp} initial="hidden" animate="visible">
          <Link to="/voitures" className="car-details-back">
            <FiArrowLeft /> {t('details.backCars')}
          </Link>
        </motion.div>

        <div className="car-details-layout">
          <motion.div className="car-details-gallery" variants={fadeIn} initial="hidden" animate="visible">
            {isSold && <div className="car-details-sold-badge">{t('car.soldUpper')}</div>}
            <motion.div
              className="car-details-main-image"
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              <img src={images[selectedImage]} alt={`${car.name} chez AutoSmart Maroc`} decoding="async" fetchPriority="high" />
            </motion.div>
            {images.length > 1 && (
              <motion.div className="car-details-thumbnails" variants={staggerContainer} initial="hidden" animate="visible">
                {images.map((img, idx) => (
                  <motion.button
                    key={idx}
                    className={`car-details-thumb ${idx === selectedImage ? 'active' : ''}`}
                    onClick={() => setSelectedImage(idx)}
                    variants={fadeUp}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.98 }}
                    aria-label={`${car.name} image ${idx + 1}`}
                  >
                    <img src={img} alt={`${car.name} - ${idx + 1}`} loading="lazy" decoding="async" />
                  </motion.button>
                ))}
              </motion.div>
            )}
          </motion.div>

          <motion.div className="car-details-info" variants={staggerContainer} initial="hidden" animate="visible">
            <div className="car-details-header">
              <motion.h1 className="car-details-name" variants={fadeUp}>{car.name}</motion.h1>
              <span className={`badge ${isSold ? 'badge-sold' : 'badge-available'}`}>
                {isSold ? t('car.sold') : t('car.available')}
              </span>
            </div>

            <motion.div className="car-details-price" variants={fadeUp}>
              {formatNumber(car.price)} <span>DH</span>
            </motion.div>

            <motion.div className="car-details-specs" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewportOnce}>
              <motion.div className="spec-item" variants={fadeUp}>
                <FiCalendar className="spec-icon" />
                <div>
                  <span className="spec-label">{t('details.year')}</span>
                  <span className="spec-value">{car.year}</span>
                </div>
              </motion.div>
              <motion.div className="spec-item" variants={fadeUp}>
                <FiNavigation className="spec-icon" />
                <div>
                  <span className="spec-label">{t('details.mileage')}</span>
                  <span className="spec-value">{car.mileage ? `${formatNumber(car.mileage)} km` : t('car.notAvailable')}</span>
                </div>
              </motion.div>
              <motion.div className="spec-item" variants={fadeUp}>
                <FiTag className="spec-icon" />
                <div>
                  <span className="spec-label">{t('details.brand')}</span>
                  <span className="spec-value">{car.brand}</span>
                </div>
              </motion.div>
              <motion.div className="spec-item" variants={fadeUp}>
                <FiPackage className="spec-icon" />
                <div>
                  <span className="spec-label">{t('details.quantity')}</span>
                  <span className="spec-value">{car.quantity}</span>
                </div>
              </motion.div>
            </motion.div>

            <motion.div className="car-details-description" variants={fadeUp}>
              <h3>{t('details.description')}</h3>
              <p>{car.description || car.shortDescription || t('details.noDescription')}</p>
            </motion.div>

            <motion.div className="car-details-actions" variants={fadeUp}>
              <button
                type="button"
                className={`btn btn-outline btn-lg car-details-like ${liked ? 'liked' : ''}`}
                onClick={handleLike}
                disabled={liked}
                aria-label={t('car.favorite')}
              >
                <FiHeart />
                {liked ? `${car.likes || 0}` : `${car.likes || 0}`}
              </button>
              <WhatsAppButton
                carId={car._id}
                carName={car.name}
                price={car.price}
                disabled={isSold}
                className="btn-lg"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CarDetails;
