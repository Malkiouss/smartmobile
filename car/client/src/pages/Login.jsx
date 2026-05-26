import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiLock, FiMail } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { fadeUp } from '../utils/animations';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || t('login.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page" id="login-page">
      <motion.div className="login-card" variants={fadeUp} initial="hidden" animate="visible">
        <div className="login-header">
          <div className="login-logo">
            <span className="logo-auto">Auto</span>
            <span className="logo-smart">Smart</span>
          </div>
          <h1 className="login-title">{t('login.title')}</h1>
          <p className="login-subtitle">{t('login.subtitle')}</p>
        </div>

        {error && <div className="login-error">{error}</div>}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">{t('contact.email')}</label>
            <div className="login-input-wrapper">
              <FiMail className="login-input-icon" />
              <input
                type="email"
                className="form-input login-input"
                placeholder="admin@autosmart.ma"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">{t('login.password')}</label>
            <div className="login-input-wrapper">
              <FiLock className="login-input-icon" />
              <input
                type="password"
                className="form-input login-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            style={{ width: '100%' }}
            disabled={loading}
          >
            {loading ? t('login.loading') : t('login.submit')}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
