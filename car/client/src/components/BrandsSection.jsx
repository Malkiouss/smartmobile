import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { popularBrands } from '../data/brands';
import { fadeUp, staggerContainer, viewportOnce } from '../utils/animations';
import './BrandsSection.css';

const brandCopy = {
  fr: {
    title: 'Rechercher par marque',
    subtitle: 'Découvrez les marques les plus demandées au Maroc',
  },
  en: {
    title: 'Search cars by brand',
    subtitle: 'Discover the most requested brands in Morocco',
  },
  ar: {
    title: 'ابحث حسب الماركة',
    subtitle: 'اكتشف أكثر الماركات طلبا في المغرب',
  },
};

const BrandsSection = () => {
  const { language } = useLanguage();
  const copy = brandCopy[language] || brandCopy.fr;

  return (
    <section className="brands-section" id="brands-section">
      <div className="brands-container">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewportOnce}>
          <h2 className="brands-title">{copy.title}</h2>
          <p className="brands-subtitle">{copy.subtitle}</p>
        </motion.div>

        <motion.div className="brands-grid" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewportOnce}>
          {popularBrands.map((brand) => (
            <motion.div key={brand.name} variants={fadeUp}>
              <Link className="brand-card" to={`/voitures?brand=${encodeURIComponent(brand.name)}`} aria-label={brand.name}>
                <img src={brand.logo} alt={brand.name} className="brand-logo" />
                <span className="brand-name">{brand.name}</span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default BrandsSection;
