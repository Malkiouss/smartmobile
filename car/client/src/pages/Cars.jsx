import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';
import CarCard from '../components/CarCard';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';
import { unwrapArray } from '../services/response';
import './Cars.css';

const brands = ['BMW', 'Mercedes-Benz', 'Audi', 'Porsche', 'Land Rover', 'Volkswagen', 'Toyota', 'Honda'];
const years = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i);

const Cars = () => {
  const [searchParams] = useSearchParams();
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
    fetchCars();
  }, []);

  useEffect(() => {
    const brand = searchParams.get('brand');
    if (brand) {
      setFilters(prev => ({ ...prev, brand }));
      fetchCars({ brand });
    }
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
      setCars(unwrapArray(res.data));
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
    fetchCars();
  };

  const clearFilters = () => {
    setFilters({ brand: '', model: '', maxPrice: '', minYear: '' });
    fetchCars({ brand: '', model: '', maxPrice: '', minYear: '' });
  };

  const hasActiveFilters = Object.values(filters).some(v => v !== '');
  const countLabel = cars.length === 1 ? t('cars.countOne') : t('cars.countMany').replace('{{count}}', cars.length);

  return (
    <div className="cars-page" id="cars-page">
      <div className="cars-hero">
        <div className="container">
          <h1 className="cars-hero-title">{t('cars.title')}</h1>
          <p className="cars-hero-subtitle">{t('cars.subtitle')}</p>
        </div>
      </div>

      <div className="container cars-layout">
        <button className="cars-filter-toggle" onClick={() => setShowFilters(!showFilters)}>
          <FiFilter /> {t('cars.filters')} {hasActiveFilters && <span className="filter-dot" />}
        </button>

        <aside className={`cars-sidebar ${showFilters ? 'open' : ''}`}>
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
        </aside>

        <main className="cars-main">
          <div className="cars-top-bar">
            <p className="cars-count">{loading ? '...' : countLabel}</p>
          </div>

          {loading ? (
            <div className="spinner" />
          ) : (
            <div className="cars-grid">
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
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Cars;
