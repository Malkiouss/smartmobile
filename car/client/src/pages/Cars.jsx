import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';
import CarCard from '../components/CarCard';
import { useLanguage } from '../context/LanguageContext';
import { popularBrands } from '../data/brands';
import api from '../services/api';
import { unwrapArray } from '../services/response';
import { fadeUp, staggerContainer, viewportOnce } from '../utils/animations';
import './Cars.css';

const brands = popularBrands.map((brand) => brand.name);
const years = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i);

const Cars = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useLanguage();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    brand: searchParams.get('brand') || '',
    model: searchParams.get('model') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    minYear: searchParams.get('minYear') || ''
  });

  useEffect(() => {
    const brand = searchParams.get('brand');
    const nextFilters = {
      brand: brand || '',
      model: searchParams.get('model') || '',
      maxPrice: searchParams.get('maxPrice') || '',
      minYear: searchParams.get('minYear') || '',
    };
    setFilters(nextFilters);
    fetchCars(nextFilters);
  }, [searchParams]);

  const fetchCars = async (overrideFilters) => {
    setLoading(true);
    try {
      const params = {};
      const f = overrideFilters || filters;
      if (f.brand) params.brand = f.brand;
      if (f.model) params.model = f.model;
      if (f.maxPrice) params.maxPrice = f.maxPrice;
      if (f.minYear) params.minYear = f.minYear;
      const res = await api.get('/cars', { params });
      const nextCars = unwrapArray(res.data);
      const normalizedBrand = f.brand?.toLowerCase();
      setCars(normalizedBrand
        ? nextCars.filter((car) => String(car.brand || car.marque || '').toLowerCase() === normalizedBrand)
        : nextCars
      );
    } catch (err) {
      console.error('Error fetching cars:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleApplyFilters = (e) => {
    e.preventDefault();
    const nextParams = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value) nextParams[key] = value;
    });
    setSearchParams(nextParams);
  };

  const clearFilters = () => {
    setFilters({ brand: '', model: '', maxPrice: '', minYear: '' });
    setSearchParams({});
  };

  const hasActiveFilters = Object.values(filters).some(v => v !== '');
  const countLabel = cars.length === 1 ? t('cars.countOne') : t('cars.countMany').replace('{{count}}', cars.length);

  return (
    <div className="cars-page" id="cars-page">
      <motion.div
        className="cars-hero"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <div className="container">
          <motion.h1 className="cars-hero-title" variants={fadeUp}>{t('cars.title')}</motion.h1>
          <motion.p className="cars-hero-subtitle" variants={fadeUp}>{t('cars.subtitle')}</motion.p>
        </div>
      </motion.div>

      <div className="container cars-layout">
        <button className="cars-filter-toggle" onClick={() => setShowFilters(!showFilters)}>
          <FiFilter /> {t('cars.filters')} {hasActiveFilters && <span className="filter-dot" />}
        </button>

        <motion.aside
          className={`cars-sidebar ${showFilters ? 'open' : ''}`}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <div className="sidebar-header">
            <h3 className="sidebar-title"><FiFilter /> {t('cars.filters')}</h3>
            {hasActiveFilters && (
              <button className="sidebar-clear" onClick={clearFilters}>
                <FiX /> {t('cars.clear')}
              </button>
            )}
          </div>

          <form onSubmit={handleApplyFilters}>
            <div className="form-group">
              <label className="form-label">{t('search.brand')}</label>
              <select name="brand" value={filters.brand} onChange={handleFilterChange} className="form-select">
                <option value="">{t('search.allBrands')}</option>
                {brands.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">{t('search.model')}</label>
              <input
                type="text"
                name="model"
                value={filters.model}
                onChange={handleFilterChange}
                placeholder={t('cars.modelPlaceholder')}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">{t('cars.maxPriceDh')}</label>
              <input
                type="number"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                placeholder={t('cars.pricePlaceholder')}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">{t('search.minYearPlaceholder')}</label>
              <select name="minYear" value={filters.minYear} onChange={handleFilterChange} className="form-select">
                <option value="">{t('cars.allYears')}</option>
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              <FiSearch /> {t('search.submit')}
            </button>
          </form>
        </motion.aside>

        <main className="cars-main">
          <div className="cars-top-bar">
            <p className="cars-count">
              {loading ? '...' : filters.brand ? `Showing ${filters.brand} cars · ${countLabel}` : countLabel}
            </p>
            {filters.brand && (
              <button className="cars-clear-brand" type="button" onClick={clearFilters}>
                <FiX /> Show all cars
              </button>
            )}
          </div>

          {loading ? (
            <div className="spinner" />
          ) : (
            <motion.div
              className="cars-grid"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
            >
              {cars.map((car) => (
                <CarCard key={car._id} car={car} />
              ))}
              {cars.length === 0 && (
                <div className="cars-empty">
                  <p>{t('cars.empty')}</p>
                  <button className="btn btn-outline" onClick={clearFilters}>
                    {t('cars.clearFilters')}
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Cars;
