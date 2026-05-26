import { FiTruck, FiShield, FiDollarSign, FiHeadphones } from 'react-icons/fi';
import { useLanguage } from '../context/LanguageContext';
import './StatsBar.css';

const StatsBar = () => {
  const { t } = useLanguage();
  const stats = [
    { icon: <FiTruck />, value: '+500', label: t('stats.available') },
    { icon: <FiShield />, value: t('stats.warranty'), label: t('stats.verified') },
    { icon: <FiDollarSign />, value: t('stats.bestPrices'), label: t('stats.competitive') },
    { icon: <FiHeadphones />, value: t('stats.support'), label: t('stats.listening') }
  ];

  return (
    <div className="stats-bar" id="stats-bar">
      <div className="container stats-grid">
        {stats.map((stat, idx) => (
          <div className="stat-item" key={idx}>
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-text">
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsBar;
