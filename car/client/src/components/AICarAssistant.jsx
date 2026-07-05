import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRobot } from 'react-icons/fa';
import { FiSearch, FiX } from 'react-icons/fi';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';
import { getCarImages } from '../services/images';
import { unwrapArray } from '../services/response';
import './AICarAssistant.css';

const WHATSAPP_NUMBER = '212707852423';
const OPENED_KEY = 'autosmart-ai-assistant-opened';

const copy = {
  fr: {
    aria: 'Assistant voiture IA',
    bubble: "Besoin d'aide ?",
    hello: 'Bonjour 👋',
    intro: 'Je peux vous aider à trouver une voiture.',
    hint: 'Écrivez simplement la marque ou le modèle que vous recherchez.',
    question: 'Quelle voiture recherchez-vous ?',
    placeholder: 'Rechercher une voiture...',
    search: 'Rechercher',
    suggestions: 'Suggestions',
    results: 'Résultats trouvés',
    found: (count, query) => `Nous avons trouvé ${count} ${count > 1 ? 'véhicules' : 'véhicule'} ${query}.`,
    noResult: "Désolé, cette voiture n'est pas disponible actuellement.",
    requestHelp: 'Vous pouvez nous demander de la trouver.',
    requestButton: 'Demander cette voiture',
    view: 'Voir le véhicule',
    year: 'Année',
    mileage: 'Kilométrage',
    fuel: 'Carburant',
    transmission: 'Transmission',
    notAvailable: 'Non disponible',
    loading: 'Chargement des voitures...',
    error: 'Impossible de charger les voitures pour le moment.',
    requestMessage: (query) => `Bonjour,\n\nJe recherche cette voiture :\n\n${query}\n\nPouvez-vous m'aider ?`,
  },
  en: {
    aria: 'AI car assistant',
    bubble: 'Need help?',
    hello: 'Hello 👋',
    intro: 'I can help you find a car.',
    hint: 'Simply type the brand or model you are looking for.',
    question: 'Which car are you looking for?',
    placeholder: 'Search for a car...',
    search: 'Search',
    suggestions: 'Suggestions',
    results: 'Matching cars',
    found: (count, query) => `We found ${count} ${count > 1 ? 'vehicles' : 'vehicle'} for ${query}.`,
    noResult: 'Sorry, this car is not available right now.',
    requestHelp: 'You can ask us to find it.',
    requestButton: 'Request this car',
    view: 'View vehicle',
    year: 'Year',
    mileage: 'Mileage',
    fuel: 'Fuel type',
    transmission: 'Transmission',
    notAvailable: 'Not available',
    loading: 'Loading cars...',
    error: 'Unable to load cars right now.',
    requestMessage: (query) => `Hello,\n\nI am looking for this car:\n\n${query}\n\nCan you help me?`,
  },
  ar: {
    aria: 'مساعد السيارات الذكي',
    bubble: 'هل تحتاج مساعدة؟',
    hello: 'مرحباً 👋',
    intro: 'يمكنني مساعدتك في العثور على سيارة.',
    hint: 'اكتب فقط العلامة أو الموديل الذي تبحث عنه.',
    question: 'ما السيارة التي تبحث عنها؟',
    placeholder: 'ابحث عن سيارة...',
    search: 'بحث',
    suggestions: 'اقتراحات',
    results: 'السيارات المطابقة',
    found: (count, query) => `وجدنا ${count} ${count > 1 ? 'سيارات' : 'سيارة'} لـ ${query}.`,
    noResult: 'عذراً، هذه السيارة غير متوفرة حالياً.',
    requestHelp: 'يمكنك أن تطلب منا العثور عليها.',
    requestButton: 'اطلب هذه السيارة',
    view: 'عرض السيارة',
    year: 'السنة',
    mileage: 'المسافة',
    fuel: 'نوع الوقود',
    transmission: 'ناقل الحركة',
    notAvailable: 'غير متوفر',
    loading: 'جاري تحميل السيارات...',
    error: 'تعذر تحميل السيارات حالياً.',
    requestMessage: (query) => `مرحباً،\n\nأبحث عن هذه السيارة:\n\n${query}\n\nهل يمكنكم مساعدتي؟`,
  },
};

const normalize = (value) => String(value || '').trim().toLowerCase();

const searchableText = (car) => [
  car.name,
  car.brand,
  car.marque,
  car.model,
  car.shortDescription,
  car.description,
].map(normalize).join(' ');

const getCarTitle = (car) => car.name || [car.brand, car.model].filter(Boolean).join(' ') || 'Voiture';

const AICarAssistant = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const text = copy[language] || copy.fr;
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [carsLoaded, setCarsLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [open, setOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.localStorage.getItem(OPENED_KEY) === 'true';
  });
  const [showBubble, setShowBubble] = useState(false);
  const [query, setQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [lastUserMessage, setLastUserMessage] = useState('');

  useEffect(() => {
    if (!open || carsLoaded) return undefined;

    let cancelled = false;

    const fetchCars = async () => {
      setLoading(true);
      setLoadError(false);
      try {
        const res = await api.get('/cars');
        if (!cancelled) {
          setCars(unwrapArray(res.data));
          setCarsLoaded(true);
        }
      } catch (error) {
        console.error('Error loading assistant cars:', error);
        if (!cancelled) {
          setLoadError(true);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchCars();

    return () => {
      cancelled = true;
    };
  }, [carsLoaded, open]);

  useEffect(() => {
    if (hasOpened || open) return undefined;

    const timer = window.setTimeout(() => setShowBubble(true), 3200);
    const hideTimer = window.setTimeout(() => setShowBubble(false), 10500);

    return () => {
      window.clearTimeout(timer);
      window.clearTimeout(hideTimer);
    };
  }, [hasOpened, open]);

  const suggestions = useMemo(() => {
    const term = normalize(query);
    if (term.length < 2) return [];

    const seen = new Set();

    return cars
      .filter((car) => searchableText(car).includes(term))
      .map(getCarTitle)
      .filter((title) => {
        const key = normalize(title);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .slice(0, 5);
  }, [cars, query]);

  const quickBrands = useMemo(() => {
    const seen = new Set();
    return cars
      .map((car) => car.brand || car.marque)
      .filter(Boolean)
      .filter((brand) => {
        const key = normalize(brand);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .slice(0, 6);
  }, [cars]);

  const results = useMemo(() => {
    const term = normalize(submittedQuery);
    if (!term) return [];
    return cars.filter((car) => searchableText(car).includes(term));
  }, [cars, submittedQuery]);

  const formatNumber = (value) => new Intl.NumberFormat(language === 'ar' ? 'ar-MA' : 'fr-MA').format(value || 0);

  const openAssistant = () => {
    setOpen(true);
    setShowBubble(false);
    if (!hasOpened) {
      setHasOpened(true);
      window.localStorage.setItem(OPENED_KEY, 'true');
    }
  };

  const toggleAssistant = () => {
    if (open) {
      setOpen(false);
      return;
    }
    openAssistant();
  };

  const runSearch = (value = query) => {
    const nextQuery = value.trim();
    if (!nextQuery) return;
    setQuery(nextQuery);
    setSubmittedQuery(nextQuery);
    setLastUserMessage(nextQuery);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    runSearch();
  };

  const requestCar = () => {
    const message = encodeURIComponent(text.requestMessage(submittedQuery || query));
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
  };

  const viewCar = (carId) => {
    setOpen(false);
    navigate(`/voitures/${carId}`);
  };

  return (
    <div className="ai-assistant-wrap">
      <AnimatePresence>
        {showBubble && !open && (
          <motion.div
            className="ai-assistant-bubble"
            initial={{ opacity: 0, y: 8, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.92 }}
            transition={{ duration: 0.24, ease: 'easeOut' }}
          >
            {text.bubble}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            className="ai-assistant-panel"
            initial={{ opacity: 0, y: 18, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="ai-assistant-header">
              <div>
                <span className="ai-assistant-kicker">{text.hello}</span>
                <h3>{text.question}</h3>
              </div>
              <button type="button" className="ai-assistant-close" onClick={() => setOpen(false)} aria-label="Close">
                <FiX />
              </button>
            </div>

            <div className="ai-assistant-body">
              <div className="ai-assistant-message">
                <p>{text.intro}</p>
                <p>{text.hint}</p>
              </div>

              {quickBrands.length > 0 && (
                <motion.div
                  className="ai-assistant-quick-chips"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.22, ease: 'easeOut' }}
                >
                  {quickBrands.map((brand) => (
                    <button type="button" key={brand} onClick={() => runSearch(brand)}>
                      {brand}
                    </button>
                  ))}
                </motion.div>
              )}

              <form className="ai-assistant-search" onSubmit={handleSubmit}>
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={text.placeholder}
                  aria-label={text.placeholder}
                />
                <button type="submit" aria-label={text.search}>
                  <FiSearch />
                </button>
              </form>

              <AnimatePresence>
                {suggestions.length > 0 && (
                  <motion.div
                    className="ai-assistant-suggestions"
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.18 }}
                  >
                    <span>{text.suggestions}</span>
                    {suggestions.map((suggestion) => (
                      <button type="button" key={suggestion} onClick={() => runSearch(suggestion)}>
                        {suggestion}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {loading && <p className="ai-assistant-status">{text.loading}</p>}
              {loadError && <p className="ai-assistant-status">{text.error}</p>}

              <AnimatePresence mode="popLayout">
                {submittedQuery && !loading && !loadError && (
                  <motion.div
                    className="ai-chat-row ai-chat-row-user"
                    initial={{ opacity: 0, x: 18 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 18 }}
                    transition={{ duration: 0.22, ease: 'easeOut' }}
                  >
                    <div className="ai-chat-bubble ai-chat-bubble-user">
                      {lastUserMessage}
                    </div>
                  </motion.div>
                )}

                {submittedQuery && !loading && !loadError && (
                  <motion.div
                    className="ai-chat-row ai-chat-row-bot"
                    initial={{ opacity: 0, x: -18 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -18 }}
                    transition={{ duration: 0.24, ease: 'easeOut', delay: 0.05 }}
                  >
                    <div className="ai-chat-bubble ai-chat-bubble-bot">
                      {results.length > 0 ? text.found(results.length, submittedQuery) : text.noResult}
                    </div>
                  </motion.div>
                )}

                {submittedQuery && !loading && !loadError && results.length > 0 && (
                  <motion.div
                    className="ai-assistant-results"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ staggerChildren: 0.06 }}
                  >
                    {results.map((car) => {
                      const image = getCarImages(car)[0];
                      const description = car.shortDescription || car.description || '';

                      return (
                        <motion.article
                          className="ai-assistant-result-card"
                          key={car._id}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.22, ease: 'easeOut' }}
                        >
                          <img src={image} alt={getCarTitle(car)} loading="lazy" decoding="async" width="96" height="72" />
                          <div className="ai-assistant-result-content">
                            <h5>{getCarTitle(car)}</h5>
                            <strong>{formatNumber(car.price)} DH</strong>
                            <div className="ai-assistant-specs">
                              <span>{text.year}: {car.year || text.notAvailable}</span>
                              <span>{text.mileage}: {car.mileage ? `${formatNumber(car.mileage)} km` : text.notAvailable}</span>
                              <span>{text.fuel}: {car.fuelType || car.fuel || text.notAvailable}</span>
                              <span>{text.transmission}: {car.transmission || text.notAvailable}</span>
                            </div>
                            {description && <p>{description}</p>}
                            <button type="button" onClick={() => viewCar(car._id)}>
                              {text.view}
                            </button>
                          </div>
                        </motion.article>
                      );
                    })}
                  </motion.div>
                )}

                {submittedQuery && !loading && !loadError && results.length === 0 && (
                  <motion.div
                    className="ai-assistant-empty"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.22, ease: 'easeOut' }}
                  >
                    <p>{text.requestHelp}</p>
                    <button type="button" onClick={requestCar}>
                      {text.requestButton}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        className="floating-social ai-assistant-button"
        onClick={toggleAssistant}
        aria-label={text.aria}
      >
        <FaRobot size={25} />
        {!hasOpened && <span className="ai-assistant-dot" />}
      </button>
    </div>
  );
};

export default AICarAssistant;
