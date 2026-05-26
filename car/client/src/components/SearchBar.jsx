import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSearch } from 'react-icons/fi';
import { useLanguage } from '../context/LanguageContext';
import { fadeUp, viewportOnce } from '../utils/animations';
import './SearchBar.css';

const brands = ['BMW', 'Mercedes-Benz', 'Audi', 'Porsche', 'Land Rover', 'Volkswagen', 'Toyota', 'Honda'];
const years = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i);

const SearchBar = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [filters, setFilters] = useState({
    brand: '',
    model: '',
    maxPrice: '',
    minYear: ''
  });

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    navigate(`/voitures?${params.toString()}`);
  };

  return (
    <div className="search-bar-wrapper" id="search-bar">
      <motion.form
        className="search-bar container"
        onSubmit={handleSearch}
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
      >
        <div className="search-field">
          <label className="search-label">{t('search.brand')}</label>
          <select name="brand" value={filters.brand} onChange={handleChange} className="search-select">
            <option value="">{t('search.allBrands')}</option>
            {brands.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>

        <div className="search-divider" />

        <div className="search-field">
          <label className="search-label">{t('search.model')}</label>
          <input
            type="text"
            name="model"
            value={filters.model}
            onChange={handleChange}
            placeholder={t('search.allModels')}
            className="search-input"
          />
        </div>

        <div className="search-divider" />

        <div className="search-field">
          <label className="search-label">{t('search.maxPrice')}</label>
          <input
            type="number"
            name="maxPrice"
            value={filters.maxPrice}
            onChange={handleChange}
            placeholder={t('search.maxPricePlaceholder')}
            className="search-input"
          />
        </div>

        <div className="search-divider" />

        <div className="search-field">
          <label className="search-label">{t('search.minYear')}</label>
          <select name="minYear" value={filters.minYear} onChange={handleChange} className="search-select">
            <option value="">{t('search.minYearPlaceholder')}</option>
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        <button type="submit" className="btn btn-primary search-btn" id="search-btn">
          <FiSearch size={18} />
          <span>{t('search.submit')}</span>
        </button>
      </motion.form>
    </div>
  );
};

export default SearchBar;
