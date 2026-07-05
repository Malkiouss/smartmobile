import { motion } from 'framer-motion';
import { FiShield, FiStar, FiUsers, FiAward } from 'react-icons/fi';
import SEO from '../components/SEO';
import { useLanguage } from '../context/LanguageContext';
import { breadcrumbSchema } from '../seo/schema';
import { fadeUp, staggerContainer, viewportOnce } from '../utils/animations';
import './About.css';

const About = () => {
  const { t } = useLanguage();

  return (
    <div className="about-page" id="about-page">
      <SEO
        page="about"
        schemas={[
          breadcrumbSchema([
            { name: 'Accueil', path: '/' },
            { name: 'A propos', path: '/a-propos' },
          ]),
        ]}
      />
      <motion.div className="about-hero" variants={staggerContainer} initial="hidden" animate="visible">
        <div className="container">
          <motion.h1 className="about-hero-title" variants={fadeUp}>{t('about.title')}</motion.h1>
          <motion.p className="about-hero-subtitle" variants={fadeUp}>{t('about.subtitle')}</motion.p>
        </div>
      </motion.div>

      <div className="container about-content">
        <motion.div className="about-story" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewportOnce}>
          <motion.div className="about-story-text" variants={fadeUp}>
            <h2>{t('about.storyTitle')}</h2>
            <p>{t('about.story1')}</p>
            <p>{t('about.story2')}</p>
          </motion.div>
          <motion.div className="about-story-image" variants={fadeUp}>
            <img
              src="https://res.cloudinary.com/dylxqjhjj/image/upload/v1779586361/caaaaaaaar_otsgcv.jpg"
              alt={t('about.imageAlt')}
              loading="lazy"
              decoding="async"
            />
          </motion.div>
        </motion.div>

        <div className="about-values">
          <motion.h2 className="about-values-title" variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewportOnce}>{t('about.valuesTitle')}</motion.h2>
          <motion.div className="about-values-grid" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewportOnce}>
            <motion.div className="about-value-card" variants={fadeUp} whileHover={{ y: -5, scale: 1.01 }}>
              <div className="about-value-icon"><FiShield /></div>
              <h3>{t('about.trust.title')}</h3>
              <p>{t('about.trust.desc')}</p>
            </motion.div>
            <motion.div className="about-value-card" variants={fadeUp} whileHover={{ y: -5, scale: 1.01 }}>
              <div className="about-value-icon"><FiStar /></div>
              <h3>{t('about.excellence.title')}</h3>
              <p>{t('about.excellence.desc')}</p>
            </motion.div>
            <motion.div className="about-value-card" variants={fadeUp} whileHover={{ y: -5, scale: 1.01 }}>
              <div className="about-value-icon"><FiUsers /></div>
              <h3>{t('about.service.title')}</h3>
              <p>{t('about.service.desc')}</p>
            </motion.div>
            <motion.div className="about-value-card" variants={fadeUp} whileHover={{ y: -5, scale: 1.01 }}>
              <div className="about-value-icon"><FiAward /></div>
              <h3>{t('about.transparency.title')}</h3>
              <p>{t('about.transparency.desc')}</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default About;
