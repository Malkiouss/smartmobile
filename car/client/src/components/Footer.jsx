import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMapPin, FiPhone, FiMail } from 'react-icons/fi';
import { FaFacebookF, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';
import { fadeUp, staggerContainer, viewportOnce } from '../utils/animations';
import logo from '../assets/logo.png';
import './Footer.css';

const WHATSAPP_NUMBER = '212707852423';

const socialLinks = [
  { label: 'Facebook', href: 'https://www.facebook.com/share/1FbVLk3yJx/?mibextid=wwXIfr', icon: <FaFacebookF /> },
  { label: 'Instagram', href: 'https://www.instagram.com/autosmart.maroc?igsh=enQ2MmJnM2N6OHkx&utm_source=qr', icon: <FaInstagram /> },
  { label: 'WhatsApp', href: `https://wa.me/${WHATSAPP_NUMBER}`, icon: <FaWhatsapp /> },
];

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="footer" id="site-footer">
      <div className="container">
        <motion.div className="footer-grid" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewportOnce}>
          <motion.div className="footer-brand" variants={fadeUp}>
            <Link to="/" className="footer-logo">
              <img src={logo} alt="AutoSmart Maroc" className="footer-logo-img" />
            </Link>
            <p className="footer-desc">{t('footer.desc')}</p>
            <div className="footer-socials">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="footer-social"
                  aria-label={social.label}
                  target={social.href.startsWith('http') ? '_blank' : undefined}
                  rel={social.href.startsWith('http') ? 'noreferrer' : undefined}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </motion.div>

          <motion.div className="footer-col" variants={fadeUp}>
            <h4 className="footer-col-title">{t('footer.navigation')}</h4>
            <ul className="footer-col-links">
              <li><Link to="/">{t('nav.home')}</Link></li>
              <li><Link to="/voitures">{t('nav.cars')}</Link></li>
              <li><Link to="/vendre">{t('nav.sell')}</Link></li>
              <li><Link to="/a-propos">{t('nav.about')}</Link></li>
              <li><Link to="/contact">{t('nav.contact')}</Link></li>
            </ul>
          </motion.div>

          <motion.div className="footer-col" variants={fadeUp}>
            <h4 className="footer-col-title">{t('footer.popularBrands')}</h4>
            <ul className="footer-col-links">
              <li><Link to="/voitures?brand=BMW">BMW</Link></li>
              <li><Link to="/voitures?brand=Mercedes-Benz">Mercedes-Benz</Link></li>
              <li><Link to="/voitures?brand=Audi">Audi</Link></li>
              <li><Link to="/voitures?brand=Porsche">Porsche</Link></li>
              <li><Link to="/voitures?brand=Volkswagen">Volkswagen</Link></li>
            </ul>
          </motion.div>

          <motion.div className="footer-col" variants={fadeUp}>
            <h4 className="footer-col-title">{t('footer.contact')}</h4>
            <ul className="footer-col-links footer-contact">
              <li><FiMapPin /> {t('contact.addressValue')}</li>
              <li><FiPhone /> +212 707-852423</li>
              <li><FiMail /> amamoucharaf27@gmail.com</li>
            </ul>
          </motion.div>
        </motion.div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} AutoSmart Maroc. {t('footer.rights')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
