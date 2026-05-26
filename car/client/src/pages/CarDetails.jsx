import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiCalendar, FiNavigation, FiTag, FiPackage, FiArrowLeft } from 'react-icons/fi';
import WhatsAppButton from '../components/WhatsAppButton';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';
import { getCarImages } from '../services/images';
import { unwrapData } from '../services/response';
import './CarDetails.css';

const CarDetails = () => {
  const { id } = useParams();
  const { language, t } = useLanguage();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    fetchCar();
  }, [id]);

  const fetchCar = async () => {
    try {
      const res = await api.get(`/cars/${id}`);
      setCar(unwrapData(res.data));
    } catch (err) {
      console.error('Error fetching car:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="spinner" style={{ marginTop: '120px' }} />;
  if (!car) return (
    <div className="car-details-empty">
      <h2>{t('details.notFound')}</h2>
      <Link to="/voitures" className="btn btn-primary">{t('details.backCars')}</Link>
    </div>
  );

  const isSold = car.status === 'sold';
  const formatNumber = (value) => new Intl.NumberFormat(language === 'ar' ? 'ar-MA' : 'fr-MA').format(value);
  const images = getCarImages(car);

  return (
    <div className="car-details" id="car-details-page">
      <div className="container">
        <Link to="/voitures" className="car-details-back">
          <FiArrowLeft /> {t('details.backCars')}
        </Link>

        <div className="car-details-layout">
          <div className="car-details-gallery">
            {isSold && <div className="car-details-sold-badge">{t('car.soldUpper')}</div>}
            <div className="car-details-main-image">
              <img src={images[selectedImage]} alt={car.name} />
            </div>
            {images.length > 1 && (
              <div className="car-details-thumbnails">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    className={`car-details-thumb ${idx === selectedImage ? 'active' : ''}`}
                    onClick={() => setSelectedImage(idx)}
                  >
                    <img src={img} alt={`${car.name} - ${idx + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="car-details-info">
            <div className="car-details-header">
              <h1 className="car-details-name">{car.name}</h1>
              <span className={`badge ${isSold ? 'badge-sold' : 'badge-available'}`}>
                {isSold ? t('car.sold') : t('car.available')}
              </span>
            </div>

            <div className="car-details-price">
              {formatNumber(car.price)} <span>DH</span>
            </div>

            <div className="car-details-specs">
              <div className="spec-item">
                <FiCalendar className="spec-icon" />
                <div>
                  <span className="spec-label">{t('details.year')}</span>
                  <span className="spec-value">{car.year}</span>
                </div>
              </div>
              <div className="spec-item">
                <FiNavigation className="spec-icon" />
                <div>
                  <span className="spec-label">{t('details.mileage')}</span>
                  <span className="spec-value">{car.mileage ? `${formatNumber(car.mileage)} km` : t('car.notAvailable')}</span>
                </div>
              </div>
              <div className="spec-item">
                <FiTag className="spec-icon" />
                <div>
                  <span className="spec-label">{t('details.brand')}</span>
                  <span className="spec-value">{car.brand}</span>
                </div>
              </div>
              <div className="spec-item">
                <FiPackage className="spec-icon" />
                <div>
                  <span className="spec-label">{t('details.quantity')}</span>
                  <span className="spec-value">{car.quantity}</span>
                </div>
              </div>
            </div>

            <div className="car-details-description">
              <h3>{t('details.description')}</h3>
              <p>{car.description || car.shortDescription || t('details.noDescription')}</p>
            </div>

            <div className="car-details-actions">
              <WhatsAppButton
                carName={car.name}
                price={car.price}
                disabled={isSold}
                className="btn-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetails;
