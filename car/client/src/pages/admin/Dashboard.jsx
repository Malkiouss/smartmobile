import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiToggleLeft, FiToggleRight, FiPackage, FiBarChart2 } from 'react-icons/fi';
import api from '../../services/api';
import { getCarImages } from '../../services/images';
import { unwrapArray, unwrapData } from '../../services/response';
import { useLanguage } from '../../context/LanguageContext';
import { fadeUp, staggerContainer, viewportOnce } from '../../utils/animations';
import './Dashboard.css';

const Dashboard = () => {
  const { language, t } = useLanguage();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const res = await api.get('/cars');
      setCars(unwrapArray(res.data));
    } catch (err) {
      console.error('Error fetching cars:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(t('admin.confirmDelete').replace('{{name}}', name))) return;
    try {
      await api.delete(`/cars/${id}`);
      setCars(cars.filter(car => car._id !== id));
    } catch (err) {
      alert(t('admin.deleteError'));
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      const res = await api.patch(`/cars/${id}/status`);
      setCars(cars.map(car => car._id === id ? unwrapData(res.data) : car));
    } catch (err) {
      alert(t('admin.statusError'));
    }
  };

  const formatPrice = (price) => new Intl.NumberFormat(language === 'ar' ? 'ar-MA' : 'fr-MA').format(price);

  return (
    <div className="dashboard" id="admin-dashboard">
      <div className="container">
        <motion.div className="dashboard-header" variants={fadeUp} initial="hidden" animate="visible">
          <div>
            <h1 className="dashboard-title">{t('admin.title')}</h1>
            <p className="dashboard-subtitle">{t('admin.subtitle')}</p>
          </div>
          <div className="dashboard-header-actions">
            <Link to="/admin/analytics" className="btn btn-outline" id="analytics-dashboard-btn">
              <FiBarChart2 /> {t('analytics.title')}
            </Link>
            <Link to="/admin/add" className="btn btn-primary" id="add-car-btn">
              <FiPlus /> {t('admin.addCar')}
            </Link>
          </div>
        </motion.div>

        <motion.div className="dashboard-stats" variants={staggerContainer} initial="hidden" animate="visible">
          <motion.div className="dashboard-stat-card" variants={fadeUp} whileHover={{ y: -5 }}>
            <FiPackage className="dashboard-stat-icon" />
            <div>
              <span className="dashboard-stat-value">{cars.length}</span>
              <span className="dashboard-stat-label">{t('admin.totalCars')}</span>
            </div>
          </motion.div>
          <motion.div className="dashboard-stat-card" variants={fadeUp} whileHover={{ y: -5 }}>
            <FiToggleRight className="dashboard-stat-icon success" />
            <div>
              <span className="dashboard-stat-value">{cars.filter(c => c.status === 'available').length}</span>
              <span className="dashboard-stat-label">{t('admin.availableCars')}</span>
            </div>
          </motion.div>
          <motion.div className="dashboard-stat-card" variants={fadeUp} whileHover={{ y: -5 }}>
            <FiToggleLeft className="dashboard-stat-icon danger" />
            <div>
              <span className="dashboard-stat-value">{cars.filter(c => c.status === 'sold').length}</span>
              <span className="dashboard-stat-label">{t('admin.soldCars')}</span>
            </div>
          </motion.div>
        </motion.div>

        {loading ? (
          <div className="spinner" />
        ) : (
          <motion.div className="dashboard-table-wrapper" variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewportOnce}>
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>{t('admin.image')}</th>
                  <th>{t('admin.name')}</th>
                  <th>{t('admin.brand')}</th>
                  <th>{t('admin.year')}</th>
                  <th>{t('admin.price')}</th>
                  <th>{t('admin.qty')}</th>
                  <th>{t('admin.status')}</th>
                  <th>{t('admin.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {cars.map((car) => (
                  <tr key={car._id}>
                    <td>
                      <img
                        src={getCarImages(car, 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=100&q=60')[0]}
                        alt={car.name}
                        className="dashboard-car-thumb"
                      />
                    </td>
                    <td className="dashboard-car-name">{car.name}</td>
                    <td>{car.brand}</td>
                    <td>{car.year}</td>
                    <td className="dashboard-car-price">{formatPrice(car.price)}</td>
                    <td>{car.quantity}</td>
                    <td>
                      <span className={`badge ${car.status === 'sold' ? 'badge-sold' : 'badge-available'}`}>
                        {car.status === 'sold' ? t('car.sold') : t('car.availableShort')}
                      </span>
                    </td>
                    <td>
                      <div className="dashboard-actions">
                        <button
                          className="dashboard-action-btn toggle"
                          onClick={() => handleToggleStatus(car._id)}
                          title={car.status === 'available' ? t('admin.markSold') : t('admin.markAvailable')}
                        >
                          {car.status === 'available' ? <FiToggleRight /> : <FiToggleLeft />}
                        </button>
                        <Link
                          to={`/admin/edit/${car._id}`}
                          className="dashboard-action-btn edit"
                          title={t('admin.edit')}
                        >
                          <FiEdit2 />
                        </Link>
                        <button
                          className="dashboard-action-btn delete"
                          onClick={() => handleDelete(car._id, car.name)}
                          title={t('admin.delete')}
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {cars.length === 0 && (
                  <tr>
                    <td colSpan="8" className="dashboard-empty">
                      {t('admin.noCars')} <Link to="/admin/add">{t('admin.addFirst')}</Link>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
