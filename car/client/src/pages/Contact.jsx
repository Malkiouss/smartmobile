import { FiMapPin, FiPhone, FiMail, FiClock } from 'react-icons/fi';
import { useLanguage } from '../context/LanguageContext';
import './Contact.css';

const Contact = () => {
  const { t } = useLanguage();

  return (
    <div className="contact-page" id="contact-page">
      <div className="contact-hero">
        <div className="container">
          <h1 className="contact-hero-title">{t('contact.title')}</h1>
          <p className="contact-hero-subtitle">{t('contact.subtitle')}</p>
        </div>
      </div>

      <div className="container contact-content">
        <div className="contact-grid">
          <div className="contact-form-card">
            <h2>{t('contact.formTitle')}</h2>
            <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
              <div className="contact-form-row">
                <div className="form-group">
                  <label className="form-label">{t('contact.name')}</label>
                  <input type="text" className="form-input" placeholder={t('contact.namePlaceholder')} />
                </div>
                <div className="form-group">
                  <label className="form-label">{t('contact.email')}</label>
                  <input type="email" className="form-input" placeholder={t('contact.emailPlaceholder')} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">{t('contact.subject')}</label>
                <input type="text" className="form-input" placeholder={t('contact.subjectPlaceholder')} />
              </div>
              <div className="form-group">
                <label className="form-label">{t('contact.message')}</label>
                <textarea className="form-textarea" placeholder={t('contact.messagePlaceholder')} rows="5"></textarea>
              </div>
              <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                {t('contact.send')}
              </button>
            </form>
          </div>

          <div className="contact-info">
            <div className="contact-info-card">
              <div className="contact-info-icon"><FiMapPin /></div>
              <div>
                <h3>{t('contact.address')}</h3>
                <p>{t('contact.addressValue')}</p>
              </div>
            </div>
            <div className="contact-info-card">
              <div className="contact-info-icon"><FiPhone /></div>
              <div>
                <h3>{t('contact.phone')}</h3>
                <p>+212 707-852423</p>
              </div>
            </div>
            <div className="contact-info-card">
              <div className="contact-info-icon"><FiMail /></div>
              <div>
                <h3>{t('contact.email')}</h3>
                <p>amamoucharaf27@gmail.com</p>
              </div>
            </div>
            <div className="contact-info-card">
              <div className="contact-info-icon"><FiClock /></div>
              <div>
                <h3>{t('contact.hours')}</h3>
                <p>{t('contact.weekdays')}</p>
                <p>{t('contact.sunday')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
