import { Link } from 'react-router-dom';
import { FiMapPin, FiPhone, FiMail } from 'react-icons/fi';
import { FaFacebookF, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import './Footer.css';

const WHATSAPP_NUMBER = '212707852423';

const socialLinks = [
  { label: 'Facebook', href: '#', icon: <FaFacebookF /> },
  { label: 'Instagram', href: '#', icon: <FaInstagram /> },
  { label: 'WhatsApp', href: `https://wa.me/${WHATSAPP_NUMBER}`, icon: <FaWhatsapp /> },
];

const Footer = () => {
  return (
    <footer className="footer" id="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <span className="logo-auto">Auto</span>
              <span className="logo-smart">Smart</span>
              <span className="logo-maroc">MAROC</span>
            </Link>
            <p className="footer-desc">
              Nous vendons des voitures soigneusement sélectionnées au Maroc, avec des annonces claires,
              un accompagnement réactif et des prix transparents.
            </p>
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
          </div>

          <div className="footer-col">
            <h4 className="footer-col-title">Navigation</h4>
            <ul className="footer-col-links">
              <li><Link to="/">Accueil</Link></li>
              <li><Link to="/voitures">Voitures</Link></li>
              <li><Link to="/vendre">Vendre ma voiture</Link></li>
              <li><Link to="/a-propos">À propos</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-col-title">Marques populaires</h4>
            <ul className="footer-col-links">
              <li><Link to="/voitures?brand=BMW">BMW</Link></li>
              <li><Link to="/voitures?brand=Mercedes-Benz">Mercedes-Benz</Link></li>
              <li><Link to="/voitures?brand=Audi">Audi</Link></li>
              <li><Link to="/voitures?brand=Porsche">Porsche</Link></li>
              <li><Link to="/voitures?brand=Volkswagen">Golf</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-col-title">Contact</h4>
            <ul className="footer-col-links footer-contact">
              <li><FiMapPin /> Fes Meknes, Maroc</li>
              <li><FiPhone />  +212 707-852423</li>
              <li><FiMail /> contact@autosmart.ma</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} AutoSmart Maroc. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
