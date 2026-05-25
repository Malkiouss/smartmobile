import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
import StatsBar from '../components/StatsBar';
import CarCard from '../components/CarCard';
import api from '../services/api';
import { unwrapArray } from '../services/response';
import './Home.css';

const whyChooseUs = [
  {
    icon: <FiShield />,
    title: 'Voitures vérifiées',
    description: 'Chaque véhicule est contrôlé pour garantir qualité et transparence avant mise en ligne.',
  },
  {
    icon: <FiDollarSign />,
    title: 'Meilleurs prix',
    description: 'Des offres compétitives et des prix clairs pour trouver la voiture idéale au Maroc.',
  },
  {
    icon: <FiHeadphones />,
    title: 'Support 24/7',
    description: 'Notre équipe vous accompagne à chaque étape, de la recherche à l\'achat.',
  },
  {
    icon: <FiUsers />,
    title: 'Vendeurs de confiance',
    description: 'Un réseau de vendeurs professionnels et particuliers vérifiés sur toute la plateforme.',
  },
];

const testimonials = [
  {
    name: 'Youssef El Amrani',
    location: 'Casablanca',
    rating: 5,
    text: 'J\'ai trouvé ma BMW en quelques jours. Processus simple, équipe réactive et voiture conforme à l\'annonce.',
    avatar: 'YA',
  },
  {
    name: 'Sara Benali',
    location: 'Rabat',
    rating: 5,
    text: 'Excellente expérience d\'achat. Les photos et descriptions étaient exactes. Je recommande AutoSmart Maroc.',
    avatar: 'SB',
  },
  {
    name: 'Karim Idrissi',
    location: 'Marrakech',
    rating: 5,
    text: 'Vente rapide de ma voiture grâce à la plateforme. Beaucoup d\'acheteurs sérieux et contact WhatsApp très pratique.',
    avatar: 'KI',
  },
];

const WHATSAPP_NUMBER = '212707852423';
const PHONE_DISPLAY = '+212 707-852423';

const socialLinks = [
  { label: 'Facebook', href: '#', icon: <FaFacebookF /> },
  { label: 'Instagram', href: '#', icon: <FaInstagram /> },
  { label: 'WhatsApp', href: `https://wa.me/${WHATSAPP_NUMBER}`, icon: <FaWhatsapp /> },
];

const Home = () => {
  const [popularCars, setPopularCars] = useState([]);
  const [loading, setLoading] = useState(true);

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
    const message = encodeURIComponent(
      'Bonjour, je souhaite obtenir des informations sur vos voitures disponibles.'
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
  };

  return (
    <div className="home-page" id="home-page">
      <HeroSection />
      <SearchBar />
      <StatsBar />


        {/* Popular Cars */}
      <section className="section popular-section home-section-alt" id="popular-cars">
        <div className="container">
          <div className="popular-header">
            <div>
              <h2 className="section-title">VOITURES POPULAIRES</h2>
              <p className="section-subtitle">Les véhicules les plus demandés du moment</p>
            </div>
            <Link to="/voitures" className="popular-view-all">
              Voir toutes →
            </Link>
          </div>

          {loading ? (
            <div className="spinner" />
          ) : (
            <div className="popular-grid">
              {popularCars.map((car) => (
                <CarCard key={car._id} car={car} />
              ))}
              {popularCars.length === 0 && (
                <p className="popular-empty">Aucune voiture disponible pour le moment.</p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section home-why" id="why-choose-us">
        <div className="container">
          <div className="home-section-header">
            <h2 className="section-title">Pourquoi nous choisir</h2>
            <p className="section-subtitle">
              Une plateforme moderne et fiable pour acheter et vendre des voitures au Maroc
            </p>
          </div>
          <div className="home-why-grid">
            {whyChooseUs.map((item, idx) => (
              <article className="home-why-card fade-in" key={idx} style={{ animationDelay: `${idx * 0.08}s` }}>
                <div className="home-why-icon">{item.icon}</div>
                <h3 className="home-why-title">{item.title}</h3>
                <p className="home-why-desc">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

    

      {/* About Us */}
      <section className="section home-about" id="home-about">
        <div className="container home-about-grid">
          <div className="home-about-text">
            <span className="home-about-label">À propos</span>
            <h2 className="section-title">Votre partenaire auto au Maroc</h2>
            <p className="home-about-lead">
              Nous vendons des voitures sélectionnées avec soin pour aider chaque client à trouver un
              véhicule fiable, élégant et adapté à son budget.
            </p>
            <p className="home-about-body">
              AutoSmart Maroc propose des annonces claires, des prix transparents et un accompagnement
              réactif du premier contact jusqu&apos;à l&apos;achat. Suivez-nous aussi sur les réseaux sociaux
              pour découvrir nos nouvelles arrivées et nos meilleures offres.
            </p>
            <div className="home-about-actions">
              <Link to="/a-propos" className="btn btn-primary">
                En savoir plus
                <FiArrowRight />
              </Link>
              <div className="home-about-socials" aria-label="Réseaux sociaux AutoSmart Maroc">
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
          </div>
          <div className="home-about-stats">
            <div className="home-about-stat-card">
              <span className="home-about-stat-value">+500</span>
              <span className="home-about-stat-label">Voitures listées</span>
            </div>
            <div className="home-about-stat-card">
              <span className="home-about-stat-value">98%</span>
              <span className="home-about-stat-label">Clients satisfaits</span>
            </div>
            <div className="home-about-stat-card home-about-stat-card--accent">
              <span className="home-about-stat-value">24/7</span>
              <span className="home-about-stat-label">Support disponible</span>
            </div>
            <div className="home-about-image">
              <img
                src="https://res.cloudinary.com/dylxqjhjj/image/upload/v1779586361/caaaaaaaar_otsgcv.jpg"
                alt="Showroom automobile"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Sell Your Car */}
      <section className="home-sell-cta" id="sell-cta">
        <div className="home-sell-cta-bg" aria-hidden="true" />
        <div className="container home-sell-cta-inner">
          <div className="home-sell-cta-content">
            <h2 className="home-sell-cta-title">Vendez votre voiture rapidement</h2>
            <p className="home-sell-cta-desc">
              Vous souhaitez vendre votre voiture ? Publiez votre annonce en quelques minutes et touchez
              des milliers d&apos;acheteurs au Maroc.
            </p>
            <Link to="/vendre" className="btn btn-white btn-lg">
              Publier mon annonce
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section home-testimonials" id="testimonials">
        <div className="container">
          <div className="home-section-header">
            <h2 className="section-title">Ce que disent nos clients</h2>
            <p className="section-subtitle">Des avis authentiques de notre communauté</p>
          </div>
          <div className="home-testimonials-grid">
            {testimonials.map((review, idx) => (
              <article className="home-testimonial-card" key={idx}>
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
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* WhatsApp / Contact CTA */}
      <section className="section home-contact-cta" id="contact-cta">
        <div className="container home-contact-cta-inner">
          <div className="home-contact-cta-text">
            <h2 className="home-contact-cta-title">
              Besoin d&apos;aide pour trouver la voiture parfaite ?
            </h2>
            <p className="home-contact-cta-desc">
              Contactez-nous dès maintenant sur WhatsApp. Notre équipe vous répond rapidement.
            </p>
            <div className="home-contact-cta-phone">
              <FiPhone />
              <span>{PHONE_DISPLAY}</span>
            </div>
          </div>
          <div className="home-contact-cta-actions">
            <button type="button" className="btn btn-whatsapp btn-lg" onClick={openWhatsApp}>
              <FaWhatsapp size={22} />
              Discuter sur WhatsApp
            </button>
            <Link to="/contact" className="btn btn-outline btn-lg home-contact-link">
              Page contact
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
