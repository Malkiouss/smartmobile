import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  FaCalendarWeek,
  FaCar,
  FaChartLine,
  FaCheckCircle,
  FaEye,
  FaHeart,
  FaWhatsapp,
} from 'react-icons/fa';
import { FiArrowLeft } from 'react-icons/fi';
import api from '../../services/api';
import { fadeUp, staggerContainer, viewportOnce } from '../../utils/animations';
import './AnalyticsDashboard.css';

const COLORS = ['#1a6dff', '#10b981', '#f59e0b', '#e53e3e'];
const fallbackImage = 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=120&q=60';

const emptyAnalytics = {
  totalCars: 0,
  availableCars: 0,
  soldCars: 0,
  uploadedThisWeek: 0,
  uploadedThisMonth: 0,
  soldThisWeek: 0,
  soldThisMonth: 0,
  totalViews: 0,
  totalLikes: 0,
  totalWhatsappClicks: 0,
  estimatedSoldValue: 0,
  averageSoldPrice: 0,
  topViewedCars: [],
  topLikedCars: [],
  topContactedCars: [],
  recentSoldCars: [],
  recentUploadedCars: [],
  carsTable: [],
  chartData: {
    viewsPerCar: [],
    statusPie: [],
    whatsappPerCar: [],
    uploadsOverTime: [],
  },
};

const AnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState(emptyAnalytics);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('autosmart_token');
      const res = await api.get('/api/admin/analytics', {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      console.log('Analytics response:', res.data);
      setAnalytics({ ...emptyAnalytics, ...res.data, chartData: { ...emptyAnalytics.chartData, ...(res.data.chartData || {}) } });
    } catch (error) {
      console.error('Analytics API error:', error);
      console.error('Status:', error.response?.status);
      console.error('Data:', error.response?.data);
      console.error('URL:', error.config?.url);
      console.error('Has admin token:', Boolean(localStorage.getItem('autosmart_token')));

      setError(
        error.response?.data?.message ||
        error.response?.data?.error ||
        `Request failed with status ${error.response?.status || 'unknown'}`
      );
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (value) => new Intl.NumberFormat('fr-MA').format(value || 0);
  const formatCurrency = (value) => `${formatNumber(value)} DH`;
  const formatDate = (value) => value ? new Intl.DateTimeFormat('fr-MA').format(new Date(value)) : '-';

  const statCards = [
    { label: 'Total Cars', value: analytics.totalCars, icon: <FaCar /> },
    { label: 'Available', value: analytics.availableCars, icon: <FaCheckCircle />, tone: 'success' },
    { label: 'Sold', value: analytics.soldCars, icon: <FaCar />, tone: 'danger' },
    { label: 'Uploaded This Week', value: analytics.uploadedThisWeek, icon: <FaCalendarWeek /> },
    { label: 'Sold This Month', value: analytics.soldThisMonth, icon: <FaChartLine />, tone: 'success' },
    { label: 'Total Views', value: analytics.totalViews, icon: <FaEye /> },
    { label: 'Total Likes', value: analytics.totalLikes, icon: <FaHeart />, tone: 'danger' },
    { label: 'WhatsApp Clicks', value: analytics.totalWhatsappClicks, icon: <FaWhatsapp />, tone: 'whatsapp' },
  ];

  const topSections = [
    { title: 'Most Viewed Cars', cars: analytics.topViewedCars, metric: 'views' },
    { title: 'Most Liked Cars', cars: analytics.topLikedCars, metric: 'likes' },
    { title: 'Most Contacted Cars', cars: analytics.topContactedCars, metric: 'whatsappClicks' },
    { title: 'Recently Sold Cars', cars: analytics.recentSoldCars, metric: 'price', currency: true },
  ];

  return (
    <div className="analytics-page" id="analytics-dashboard">
      <div className="container">
        <motion.div className="analytics-header" variants={fadeUp} initial="hidden" animate="visible">
          <div>
            <h1 className="analytics-title">Analytics Dashboard</h1>
            <p className="analytics-subtitle">Track car performance, sales, views, likes, and WhatsApp contacts.</p>
          </div>
          <Link to="/admin" className="btn btn-outline">
            <FiArrowLeft /> Back to Admin Dashboard
          </Link>
        </motion.div>

        {error && <div className="login-error">{error}</div>}

        {loading ? (
          <div className="spinner" />
        ) : (
          <>
            <motion.div className="analytics-stats" variants={staggerContainer} initial="hidden" animate="visible">
              {statCards.map((card) => (
                <motion.article className="analytics-stat-card" key={card.label} variants={fadeUp} whileHover={{ y: -5, scale: 1.01 }}>
                  <div className={`analytics-stat-icon ${card.tone || ''}`}>{card.icon}</div>
                  <div>
                    <span className="analytics-stat-value">{formatNumber(card.value)}</span>
                    <span className="analytics-stat-label">{card.label}</span>
                  </div>
                </motion.article>
              ))}
            </motion.div>

            <motion.div className="analytics-sales-grid" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewportOnce}>
              <motion.div className="analytics-summary-card" variants={fadeUp}>
                <span className="analytics-summary-label">Cars Sold This Week</span>
                <strong>{formatNumber(analytics.soldThisWeek)}</strong>
              </motion.div>
              <motion.div className="analytics-summary-card" variants={fadeUp}>
                <span className="analytics-summary-label">Cars Uploaded This Month</span>
                <strong>{formatNumber(analytics.uploadedThisMonth)}</strong>
              </motion.div>
              <motion.div className="analytics-summary-card" variants={fadeUp}>
                <span className="analytics-summary-label">Estimated Sold Value</span>
                <strong>{formatCurrency(analytics.estimatedSoldValue)}</strong>
              </motion.div>
              <motion.div className="analytics-summary-card" variants={fadeUp}>
                <span className="analytics-summary-label">Average Sold Price</span>
                <strong>{formatCurrency(analytics.averageSoldPrice)}</strong>
              </motion.div>
            </motion.div>

            <motion.div className="analytics-charts" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewportOnce}>
              <motion.article className="analytics-chart-card" variants={fadeUp}>
                <h2>Views per car</h2>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={analytics.chartData.viewsPerCar}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="views" fill="#1a6dff" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </motion.article>

              <motion.article className="analytics-chart-card" variants={fadeUp}>
                <h2>Available vs Sold</h2>
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie data={analytics.chartData.statusPie} dataKey="value" nameKey="name" outerRadius={92} label>
                      {analytics.chartData.statusPie.map((entry, index) => (
                        <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </motion.article>

              <motion.article className="analytics-chart-card" variants={fadeUp}>
                <h2>WhatsApp clicks per car</h2>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={analytics.chartData.whatsappPerCar}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="clicks" fill="#10b981" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </motion.article>

              <motion.article className="analytics-chart-card" variants={fadeUp}>
                <h2>Uploads over time</h2>
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={analytics.chartData.uploadsOverTime}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="week" tick={{ fontSize: 11 }} />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Line type="monotone" dataKey="uploads" stroke="#1a6dff" strokeWidth={3} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </motion.article>
            </motion.div>

            <motion.div className="analytics-top-grid" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewportOnce}>
              {topSections.map((section) => (
                <motion.article className="analytics-top-card" key={section.title} variants={fadeUp}>
                  <h2>{section.title}</h2>
                  {section.cars.length > 0 ? section.cars.map((car) => (
                    <div className="analytics-top-row" key={car.id}>
                      <img src={car.image || fallbackImage} alt={car.name} />
                      <span>{car.name}</span>
                      <strong>{section.currency ? formatCurrency(car[section.metric]) : formatNumber(car[section.metric])}</strong>
                    </div>
                  )) : <p className="analytics-empty">No data yet.</p>}
                </motion.article>
              ))}
            </motion.div>

            <motion.div className="analytics-table-card" variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewportOnce}>
              <div className="analytics-table-header">
                <h2>Full car analytics</h2>
                <span>{analytics.carsTable.length} cars</span>
              </div>
              <div className="analytics-table-wrapper">
                <table className="analytics-table">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Car</th>
                      <th>Status</th>
                      <th>Price</th>
                      <th>Views</th>
                      <th>Likes</th>
                      <th>WhatsApp</th>
                      <th>Conversion</th>
                      <th>Uploaded</th>
                      <th>Sold date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.carsTable.map((car) => (
                      <tr key={car.id}>
                        <td><img className="analytics-car-thumb" src={car.image || fallbackImage} alt={car.name} /></td>
                        <td className="analytics-car-name">{car.name}</td>
                        <td><span className={`badge ${car.status === 'sold' ? 'badge-sold' : 'badge-available'}`}>{car.status === 'sold' ? 'Vendu' : 'Disponible'}</span></td>
                        <td>{formatCurrency(car.price)}</td>
                        <td>{formatNumber(car.views)}</td>
                        <td>{formatNumber(car.likes)}</td>
                        <td>{formatNumber(car.whatsappClicks)}</td>
                        <td>{car.conversionRate || 0}%</td>
                        <td>{formatDate(car.createdAt)}</td>
                        <td>{formatDate(car.soldAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
