import { motion } from 'framer-motion';
import { FiMapPin, FiPhone, FiMail, FiClock } from 'react-icons/fi';
import { useLanguage } from '../context/LanguageContext';
import { fadeUp, staggerContainer, viewportOnce } from '../utils/animations';
import './Contact.css';

const WHATSAPP_URL = 'https://wa.me/212707852423';

const Contact = () => {
  const { t } = useLanguage();

  const handleSubmit = (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    const message = [
      'New Contact Request',
      '',
      'Name:',
      form.elements.name.value,
      '',
      'Email:',
      form.elements.email.value,
      '',
      'Phone:',
      form.elements.phone?.value || '',
      '',
      'Subject:',
      form.elements.subject.value,
      '',
      'Message:',
      form.elements.message.value,
    ].join('\n');

    window.location.href = `${WHATSAPP_URL}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="contact-page" id="contact-page">
      <motion.div className="contact-hero" variants={staggerContainer} initial="hidden" animate="visible">
        <div className="container">
          <motion.h1 className="contact-hero-title" variants={fadeUp}>{t('contact.title')}</motion.h1>
          <motion.p className="contact-hero-subtitle" variants={fadeUp}>{t('contact.subtitle')}</motion.p>
        </div>
      </motion.div>

      <div className="container contact-content">
        <motion.div className="contact-grid" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewportOnce}>
          <motion.div className="contact-form-card" variants={fadeUp}>
            <h2>{t('contact.formTitle')}</h2>
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="contact-form-row">
                <div className="form-group">
                  <label className="form-label">{t('contact.name')}</label>
                  <input type="text" name="name" className="form-input" placeholder={t('contact.namePlaceholder')} />
                </div>
                <div className="form-group">
                  <label className="form-label">{t('contact.email')}</label>
                  <input type="email" name="email" className="form-input" placeholder={t('contact.emailPlaceholder')} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">{t('contact.subject')}</label>
                <input type="text" name="subject" className="form-input" placeholder={t('contact.subjectPlaceholder')} />
              </div>
              <div className="form-group">
                <label className="form-label">{t('contact.message')}</label>
                <textarea name="message" className="form-textarea" placeholder={t('contact.messagePlaceholder')} rows="5"></textarea>
              </div>
              <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                {t('contact.send')}
              </button>
            </form>
          </motion.div>

          <motion.div className="contact-info" variants={staggerContainer}>
            <motion.div className="contact-info-card" variants={fadeUp} whileHover={{ y: -5, scale: 1.01 }}>
              <div className="contact-info-icon"><FiMapPin /></div>
              <div>
                <h3>{t('contact.address')}</h3>
                <p>{t('contact.addressValue')}</p>
              </div>
            </motion.div>
            <motion.div className="contact-info-card" variants={fadeUp} whileHover={{ y: -5, scale: 1.01 }}>
              <div className="contact-info-icon"><FiPhone /></div>
              <div>
                <h3>{t('contact.phone')}</h3>
                <p>+212 631-094805</p>
              </div>
            </motion.div>
            <motion.div className="contact-info-card" variants={fadeUp} whileHover={{ y: -5, scale: 1.01 }}>
              <div className="contact-info-icon"><FiMail /></div>
              <div>
                <h3>{t('contact.email')}</h3>
                <p>amamoucharaf27@gmail.com</p>
              </div>
            </motion.div>
            <motion.div className="contact-info-card" variants={fadeUp} whileHover={{ y: -5, scale: 1.01 }}>
              <div className="contact-info-icon"><FiClock /></div>
              <div>
                <h3>{t('contact.hours')}</h3>
                <p>{t('contact.weekdays')}</p>
                <p>{t('contact.sunday')}</p>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
