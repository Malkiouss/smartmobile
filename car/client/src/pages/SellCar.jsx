import { motion } from 'framer-motion';
import { FiCamera, FiCheckCircle } from 'react-icons/fi';
import { useLanguage } from '../context/LanguageContext';
import { fadeUp, staggerContainer, viewportOnce } from '../utils/animations';
import './SellCar.css';

const SellCar = () => {
  const { t } = useLanguage();

  const benefits = [
    t('sell.freePost'),
    t('sell.visibility'),
    t('sell.professionalEvaluation'),
    t('sell.personalSupport'),
    t('sell.secureTransaction'),
    t('sell.fastSale'),
  ];

  return (
    <div className="sell-page" id="sell-page">
      <motion.div className="sell-hero" variants={staggerContainer} initial="hidden" animate="visible">
        <div className="container">
          <motion.h1 className="sell-hero-title" variants={fadeUp}>{t('sell.title')}</motion.h1>
          <motion.p className="sell-hero-subtitle" variants={fadeUp}>{t('sell.subtitle')}</motion.p>
        </div>
      </motion.div>

      <div className="container sell-content">
        <motion.div className="sell-steps" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewportOnce}>
          <motion.div className="sell-step" variants={fadeUp} whileHover={{ y: -5, scale: 1.01 }}>
            <div className="sell-step-number">1</div>
            <h3>{t('sell.step1.title')}</h3>
            <p>{t('sell.step1.desc')}</p>
          </motion.div>
          <motion.div className="sell-step" variants={fadeUp} whileHover={{ y: -5, scale: 1.01 }}>
            <div className="sell-step-number">2</div>
            <h3>{t('sell.step2.title')}</h3>
            <p>{t('sell.step2.desc')}</p>
          </motion.div>
          <motion.div className="sell-step" variants={fadeUp} whileHover={{ y: -5, scale: 1.01 }}>
            <div className="sell-step-number">3</div>
            <h3>{t('sell.step3.title')}</h3>
            <p>{t('sell.step3.desc')}</p>
          </motion.div>
        </motion.div>

        <motion.div className="sell-form-section" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewportOnce}>
          <motion.div className="sell-form-card" variants={fadeUp}>
            <h2 className="sell-form-title">
              <FiCamera /> {t('sell.formTitle')}
            </h2>
            <p className="sell-form-desc">{t('sell.formDesc')}</p>

            <form className="sell-form" onSubmit={(e) => e.preventDefault()}>
              <div className="sell-form-grid">
                <div className="form-group">
                  <label className="form-label">{t('sell.fullName')}</label>
                  <input type="text" className="form-input" placeholder={t('contact.namePlaceholder')} />
                </div>
                <div className="form-group">
                  <label className="form-label">{t('sell.phone')}</label>
                  <input type="tel" className="form-input" placeholder="+212 XXX XXX XXX" />
                </div>
                <div className="form-group">
                  <label className="form-label">{t('search.brand')}</label>
                  <input type="text" className="form-input" placeholder={t('admin.placeholderBrand')} />
                </div>
                <div className="form-group">
                  <label className="form-label">{t('search.model')}</label>
                  <input type="text" className="form-input" placeholder={t('admin.placeholderModel')} />
                </div>
                <div className="form-group">
                  <label className="form-label">{t('details.year')}</label>
                  <input type="number" className="form-input" placeholder={t('admin.placeholderYear')} />
                </div>
                <div className="form-group">
                  <label className="form-label">{t('sell.desiredPrice')}</label>
                  <input type="number" className="form-input" placeholder={t('sell.desiredPricePlaceholder')} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">{t('details.description')}</label>
                <textarea className="form-textarea" placeholder={t('sell.descriptionPlaceholder')} rows="4"></textarea>
              </div>
              <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                {t('sell.submit')}
              </button>
            </form>
          </motion.div>

          <motion.div className="sell-benefits" variants={fadeUp}>
            <h3>{t('sell.whyTitle')}</h3>
            <ul>
              {benefits.map((benefit) => (
                <li key={benefit}><FiCheckCircle className="benefit-icon" /> {benefit}</li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default SellCar;
