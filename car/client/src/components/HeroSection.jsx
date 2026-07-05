import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { fadeUp, staggerContainer } from '../utils/animations';
import './HeroSection.css';

const heroImages = [
  'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=900&q=80',
  'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=900&q=80',
  'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=900&q=80',
  'https://images.unsplash.com/photo-1542362567-b07e54358753?w=900&q=80',
];

const HeroSection = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const { language, t } = useLanguage();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="hero" id="hero-section">
      <div className="hero-bg">
        <div className="hero-bg-gradient" />
        <div className="hero-bg-glow hero-bg-glow--left" />
        <div className="hero-bg-glow hero-bg-glow--right" />
      </div>

      <div className="hero-blur-wave" aria-hidden="true" />
      <div className="hero-glass-panel" aria-hidden="true" />

      <div className="container hero-content">
        <motion.div
          className={`hero-text ${language === 'ar' ? 'rtl' : 'ltr'}`}
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 className="hero-title" variants={fadeUp}>
            {t('hero.title')}
            <span className="hero-title-accent">{t('hero.titleAccent')}</span>
          </motion.h1>
          <motion.p className="hero-subtitle" variants={fadeUp}>{t('hero.subtitle')}</motion.p>
          <motion.div className="hero-actions" variants={fadeUp}>
            <Link to="/voitures" className="btn btn-primary btn-lg" id="hero-btn-cars">
              {t('hero.viewCars')}
            </Link>
            <Link to="/vendre" className="btn btn-white btn-lg" id="hero-btn-sell">
              {t('hero.sellCar')}
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          className="hero-image-wrap"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: 'easeOut', delay: 0.12 }}
        >
          <div className="hero-image-blend" aria-hidden="true" />
          <div className="hero-image">
            <div className="hero-car-slider">
              {heroImages.map((image, index) => (
                <img
                  key={image}
                  src={image}
                  alt={`Voiture de luxe AutoSmart Maroc ${index + 1}`}
                  className={`hero-car-img ${index === currentImage ? 'active' : ''}`}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                  fetchPriority={index === 0 ? 'high' : 'auto'}
                  width="900"
                  height="600"
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
