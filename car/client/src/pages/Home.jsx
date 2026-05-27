import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiShield,
  FiDollarSign,
  FiHeadphones,
  FiUsers,
  FiStar,
  FiPhone,
  FiArrowRight,
} from 'react-icons/fi';
import { FaFacebookF, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import HeroSection from '../components/HeroSection';
import SearchBar from '../components/SearchBar';
import BrandsSection from '../components/BrandsSection';
import CarCard from '../components/CarCard';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';
import { unwrapArray } from '../services/response';
import { fadeUp, staggerContainer, viewportOnce } from '../utils/animations';
import './Home.css';

const WHATSAPP_NUMBER = '212707852423';
const PHONE_DISPLAY = '+212 707-852423';

const socialLinks = [
  { label: 'Facebook', href: 'https://www.facebook.com/share/1FbVLk3yJx/?mibextid=wwXIfr', icon: <FaFacebookF /> },
  { label: 'Instagram', href: 'https://www.instagram.com/autosmart.maroc?igsh=enQ2MmJnM2N6OHkx&utm_source=qr', icon: <FaInstagram /> },
  { label: 'WhatsApp', href: `https://wa.me/${WHATSAPP_NUMBER}`, icon: <FaWhatsapp /> },
];

const Home = () => {
  const { t } = useLanguage();
  const [popularCars, setPopularCars] = useState([]);
  const [loading, setLoading] = useState(true);

  const whyChooseUs = [
    { icon: <FiShield />, title: t('why.verified.title'), description: t('why.verified.desc') },
    { icon: <FiDollarSign />, title: t('why.price.title'), description: t('why.price.desc') },
    { icon: <FiHeadphones />, title: t('why.support.title'), description: t('why.support.desc') },
    { icon: <FiUsers />, title: t('why.sellers.title'), description: t('why.sellers.desc') },
  ];

  const testimonials = [
    { name: 'Youssef El Amrani', location: 'Casablanca', rating: 5, text: t('home.testimonial.1'), avatar: 'YA' },
    { name: 'Sara Benali', location: 'Rabat', rating: 5, text: t('home.testimonial.2'), avatar: 'SB' },
    { name: 'Karim Idrissi', location: 'Marrakech', rating: 5, text: t('home.testimonial.3'), avatar: 'KI' },
  ];

  useEffect(() => {
    fetchPopularCars();
  }, []);

  const fetchPopularCars = async () => {
    try {
      const res = await api.get('/cars');
      setPopularCars(unwrapArray(res.data).slice(0, 4));
    } catch (err) {
      console.error('Error fetching cars:', err);
    } finally {
      setLoading(false);
    }
  };

  const openWhatsApp = () => {
    const message = encodeURIComponent(t('home.whatsappMessage'));
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
  };

  return (
    <div className="home-page" id="home-page">
      <HeroSection />
      <SearchBar />
      <BrandsSection />

      <section className="section popular-section home-section-alt" id="popular-cars">
        <div className="container">
          <motion.div
            className="popular-header"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            <div>
              <h2 className="section-title">{t('home.popularTitle')}</h2>
              <p className="section-subtitle">{t('home.popularSubtitle')}</p>
            </div>
            <Link to="/voitures" className="popular-view-all">
              {t('home.viewAll')}
            </Link>
          </motion.div>

          {loading ? (
            <div className="spinner" />
          ) : (
            <motion.div
              className="popular-grid"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
            >
              {popularCars.map((car) => (
                <CarCard key={car._id} car={car} />
              ))}
              {popularCars.length === 0 && (
                <p className="popular-empty">{t('home.emptyCars')}</p>
              )}
            </motion.div>
          )}
        </div>
      </section>

      <section className="section home-why" id="why-choose-us">
        <div className="container">
          <motion.div className="home-section-header" variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewportOnce}>
            <h2 className="section-title">{t('home.whyTitle')}</h2>
            <p className="section-subtitle">{t('home.whySubtitle')}</p>
          </motion.div>
          <motion.div className="home-why-grid" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewportOnce}>
            {whyChooseUs.map((item) => (
              <motion.article className="home-why-card" key={item.title} variants={fadeUp} whileHover={{ y: -6, scale: 1.01 }}>
                <div className="home-why-icon">{item.icon}</div>
                <h3 className="home-why-title">{item.title}</h3>
                <p className="home-why-desc">{item.description}</p>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="section home-about" id="home-about">
        <div className="container home-about-grid">
          <motion.div className="home-about-text" variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewportOnce}>
            <span className="home-about-label">{t('home.aboutLabel')}</span>
            <h2 className="section-title">{t('home.aboutTitle')}</h2>
            <p className="home-about-lead">{t('home.aboutLead')}</p>
            <p className="home-about-body">{t('home.aboutBody')}</p>
            <div className="home-about-actions">
              <Link to="/a-propos" className="btn btn-primary">
                {t('home.learnMore')}
                <FiArrowRight />
              </Link>
              <div className="home-about-socials" aria-label={t('home.socialLabel')}>
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    className="home-about-social"
                    aria-label={social.label}
                    target={social.href.startsWith('http') ? '_blank' : undefined}
                    rel={social.href.startsWith('http') ? 'noreferrer' : undefined}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
          <motion.div className="home-about-stats" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewportOnce}>
            <motion.div className="home-about-stat-card" variants={fadeUp} whileHover={{ y: -3 }}>
              <span className="home-about-stat-value">+500</span>
              <span className="home-about-stat-label">{t('home.listedCars')}</span>
            </motion.div>
            <motion.div className="home-about-stat-card" variants={fadeUp} whileHover={{ y: -3 }}>
              <span className="home-about-stat-value">98%</span>
              <span className="home-about-stat-label">{t('home.satisfiedClients')}</span>
            </motion.div>
            <motion.div className="home-about-stat-card home-about-stat-card--accent" variants={fadeUp} whileHover={{ y: -3 }}>
              <span className="home-about-stat-value">24/7</span>
              <span className="home-about-stat-label">{t('home.availableSupport')}</span>
            </motion.div>
            <motion.div className="home-about-image" variants={fadeUp}>
              <img
                src="https://res.cloudinary.com/dylxqjhjj/image/upload/v1779586361/caaaaaaaar_otsgcv.jpg"
                alt={t('home.showroomAlt')}
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="home-sell-cta" id="sell-cta">
        <div className="home-sell-cta-bg" aria-hidden="true" />
        <div className="container home-sell-cta-inner">
          <motion.div className="home-sell-cta-content" variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewportOnce}>
            <h2 className="home-sell-cta-title">{t('home.sellTitle')}</h2>
            <p className="home-sell-cta-desc">{t('home.sellDesc')}</p>
            <Link to="/vendre" className="btn btn-white btn-lg">
              {t('home.publishAd')}
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="section home-testimonials" id="testimonials">
        <div className="container">
          <motion.div className="home-section-header" variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewportOnce}>
            <h2 className="section-title">{t('home.testimonialsTitle')}</h2>
            <p className="section-subtitle">{t('home.testimonialsSubtitle')}</p>
          </motion.div>
          <motion.div className="home-testimonials-grid" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewportOnce}>
            {testimonials.map((review) => (
              <motion.article className="home-testimonial-card" key={review.name} variants={fadeUp} whileHover={{ y: -4 }}>
                <div className="home-testimonial-stars">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <FiStar key={i} className="home-testimonial-star" />
                  ))}
                </div>
                <p className="home-testimonial-text">&ldquo;{review.text}&rdquo;</p>
                <div className="home-testimonial-author">
                  <div className="home-testimonial-avatar">{review.avatar}</div>
                  <div>
                    <span className="home-testimonial-name">{review.name}</span>
                    <span className="home-testimonial-location">{review.location}</span>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="section home-contact-cta" id="contact-cta">
        <motion.div className="container home-contact-cta-inner" variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewportOnce}>
          <div className="home-contact-cta-text">
            <h2 className="home-contact-cta-title">{t('home.contactTitle')}</h2>
            <p className="home-contact-cta-desc">{t('home.contactDesc')}</p>
            <div className="home-contact-cta-phone">
              <FiPhone />
              <span>{PHONE_DISPLAY}</span>
            </div>
          </div>
          <div className="home-contact-cta-actions">
            <button type="button" className="btn btn-whatsapp btn-lg" onClick={openWhatsApp}>
              <FaWhatsapp size={22} />
              {t('home.whatsapp')}
            </button>
            <Link to="/contact" className="btn btn-outline btn-lg home-contact-link">
              {t('home.contactPage')}
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
