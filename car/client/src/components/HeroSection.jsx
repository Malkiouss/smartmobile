import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
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
        <div className="hero-text">
          <h1 className="hero-title">
            {t('hero.title')}
            <span className="hero-title-accent">{t('hero.titleAccent')}</span>
          </h1>
          <p className="hero-subtitle">{t('hero.subtitle')}</p>
          <div className="hero-actions">
            <Link to="/voitures" className="btn btn-primary btn-lg" id="hero-btn-cars">
              {t('hero.viewCars')}
            </Link>
            <Link to="/vendre" className="btn btn-white btn-lg" id="hero-btn-sell">
              {t('hero.sellCar')}
            </Link>
          </div>
        </div>

        <div className="hero-image-wrap">
          <div className="hero-image-blend" aria-hidden="true" />
          <div className="hero-image">
            <img
              src="https://images.unsplash.com/photo-1555215695-3004980ad54e?w=900&q=80"
              alt="BMW M5 Competition"
              className="hero-car-img"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
