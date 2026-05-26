import { FiShield, FiStar, FiUsers, FiAward } from 'react-icons/fi';
import { useLanguage } from '../context/LanguageContext';
import './About.css';

const About = () => {
  const { t } = useLanguage();

  return (
    <div className="about-page" id="about-page">
      <div className="about-hero">
        <div className="container">
          <h1 className="about-hero-title">{t('about.title')}</h1>
          <p className="about-hero-subtitle">{t('about.subtitle')}</p>
        </div>
      </div>

      <div className="container about-content">
        <div className="about-story">
          <div className="about-story-text">
            <h2>{t('about.storyTitle')}</h2>
            <p>{t('about.story1')}</p>
            <p>{t('about.story2')}</p>
          </div>
          <div className="about-story-image">
            <img
              src="https://res.cloudinary.com/dylxqjhjj/image/upload/v1779586361/caaaaaaaar_otsgcv.jpg"
              alt={t('about.imageAlt')}
            />
          </div>
        </div>

        <div className="about-values">
          <h2 className="about-values-title">{t('about.valuesTitle')}</h2>
          <div className="about-values-grid">
            <div className="about-value-card">
              <div className="about-value-icon"><FiShield /></div>
              <h3>{t('about.trust.title')}</h3>
              <p>{t('about.trust.desc')}</p>
            </div>
            <div className="about-value-card">
              <div className="about-value-icon"><FiStar /></div>
              <h3>{t('about.excellence.title')}</h3>
              <p>{t('about.excellence.desc')}</p>
            </div>
            <div className="about-value-card">
              <div className="about-value-icon"><FiUsers /></div>
              <h3>{t('about.service.title')}</h3>
              <p>{t('about.service.desc')}</p>
            </div>
            <div className="about-value-card">
              <div className="about-value-icon"><FiAward /></div>
              <h3>{t('about.transparency.title')}</h3>
              <p>{t('about.transparency.desc')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
