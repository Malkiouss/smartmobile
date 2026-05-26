import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiGlobe, FiUser, FiMenu, FiX } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { languages, useLanguage } from '../context/LanguageContext';
import logo from '../assets/logo.png';
import './Navbar.css';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const { isAdmin, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();

  const navLinks = [
    { to: '/', label: t('nav.home') },
    { to: '/voitures', label: t('nav.cars') },
    { to: '/vendre', label: t('nav.sell') },
    { to: '/a-propos', label: t('nav.about') },
    { to: '/contact', label: t('nav.contact') },
  ];

  const isActive = (path) => location.pathname === path;

  const chooseLanguage = (code) => {
    setLanguage(code);
    setLanguageOpen(false);
  };

  const LanguageSwitcher = ({ mobile = false }) => (
    <div className={`language-switcher ${mobile ? 'language-switcher--mobile' : ''}`}>
      <button
        type="button"
        className="navbar-icon-btn language-switcher-btn"
        title={t('nav.language')}
        aria-label={t('nav.language')}
        aria-expanded={languageOpen}
        onClick={() => setLanguageOpen((open) => !open)}
      >
        <FiGlobe />
        <span className="language-current">{language.toUpperCase()}</span>
      </button>
      {languageOpen && (
        <div className="language-menu">
          {languages.map((item) => (
            <button
              type="button"
              key={item.code}
              className={`language-option ${language === item.code ? 'active' : ''}`}
              onClick={() => chooseLanguage(item.code)}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <nav className="navbar" id="main-navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-logo" id="navbar-logo">
          <img src={logo} alt="AutoSmart Maroc" className="navbar-logo-img" />
        </Link>

        <ul
          className={`navbar-links ${mobileOpen ? 'open' : ''}`}
          id="navbar-mobile-menu"
          aria-hidden={!mobileOpen}
        >
          {navLinks.map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                className={`navbar-link ${isActive(link.to) ? 'active' : ''}`}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            </li>
          ))}
          {isAdmin && (
            <li>
              <Link
                to="/admin"
                className={`navbar-link ${isActive('/admin') ? 'active' : ''}`}
                onClick={() => setMobileOpen(false)}
              >
                {t('nav.dashboard')}
              </Link>
            </li>
          )}
          <li className="navbar-mobile-actions">
            <LanguageSwitcher mobile />
            {isAdmin ? (
              <button className="btn btn-outline btn-sm" onClick={() => { logout(); setMobileOpen(false); }}>
                {t('nav.logout')}
              </button>
            ) : (
              <Link to="/login" className="btn btn-primary btn-sm" onClick={() => setMobileOpen(false)}>
                {t('nav.postAd')}
              </Link>
            )}
          </li>
        </ul>

        <div className="navbar-actions">
          <LanguageSwitcher />
          {isAdmin ? (
            <div className="navbar-user-menu">
              <Link to="/admin" className="navbar-icon-btn" id="admin-dashboard-link" title={t('nav.dashboard')}>
                <FiUser />
              </Link>
              <button className="btn btn-outline btn-sm" onClick={logout}>
                {t('nav.logout')}
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="navbar-icon-btn" id="login-link" title={t('nav.login')}>
                <FiUser />
              </Link>
              <Link to="/vendre" className="btn btn-primary btn-sm navbar-cta" id="navbar-cta">
                {t('nav.postAd')}
              </Link>
            </>
          )}
        </div>

        <button
          className="navbar-hamburger"
          onClick={() => { setMobileOpen(!mobileOpen); setLanguageOpen(false); }}
          id="navbar-hamburger"
          aria-label={t('nav.toggleMenu')}
        >
          {mobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {mobileOpen && (
        <div
          className="navbar-overlay"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}
    </nav>
  );
};

export default Navbar;
