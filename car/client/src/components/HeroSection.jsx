import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { fadeUp, staggerContainer } from '../utils/animations';
import './HeroSection.css';

const HeroSection = () => {
  const { t } = useLanguage();

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
          className="hero-text"
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
            <img
              src="https://images.unsplash.com/photo-1555215695-3004980ad54e?w=900&q=80"
              alt="BMW M5 Competition"
              className="hero-car-img"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
