import logo from '../assets/logo.png';
import { fallbackCarImage, getCarImages } from '../services/images';

export const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://autosmartmaroc.com').replace(/\/$/, '');
export const SITE_NAME = 'AutoSmart Maroc';
export const DEFAULT_LOCALE = 'fr_MA';
export const THEME_COLOR = '#0f172a';
export const LOGO_URL = new URL(logo, SITE_URL).href;
export const DEFAULT_IMAGE = 'https://res.cloudinary.com/dylxqjhjj/image/upload/v1779586361/caaaaaaaar_otsgcv.jpg';

export const BUSINESS = {
  name: SITE_NAME,
  url: SITE_URL,
  logo: LOGO_URL,
  image: DEFAULT_IMAGE,
  telephone: '+212631094805',
  whatsapp: '+212707852423',
  email: 'amamoucharaf27@gmail.com',
  address: {
    streetAddress: 'Fes Meknes Ain Taoujdate',
    addressLocality: 'Ain Taoujdate',
    addressRegion: 'Fes-Meknes',
    addressCountry: 'MA',
  },
  openingHours: ['Mo-Sa 09:00-19:00', 'Su 10:00-16:00'],
  sameAs: [
    'https://www.instagram.com/autosmart.maroc/',
    'https://www.facebook.com/share/1FbVLk3yJx/?mibextid=wwXIfr',
    'https://wa.me/212707852423',
  ],
};

export const pageMetadata = {
  home: {
    path: '/',
    title: 'AutoSmart Maroc | Voitures de luxe et occasion a Ain Taoujdate',
    description: 'AutoSmart Maroc aide a acheter et vendre des voitures d occasion et de luxe a Ain Taoujdate, Fes-Meknes et partout au Maroc.',
    keywords: 'AutoSmart Maroc, Ain Taoujdate, voitures occasion Maroc, voitures de luxe Maroc, concessionnaire automobile, BMW, Mercedes-Benz, Audi, Porsche, Volkswagen',
  },
  cars: {
    path: '/voitures',
    title: 'Voitures d occasion et de luxe au Maroc | AutoSmart Maroc',
    description: 'Explorez les voitures disponibles chez AutoSmart Maroc: BMW, Mercedes-Benz, Audi, Porsche, Volkswagen et autres vehicules selectionnes.',
    keywords: 'voitures occasion Maroc, voitures de luxe, BMW Maroc, Mercedes-Benz Maroc, Audi Maroc, Porsche Maroc, Volkswagen Maroc, car dealer Morocco',
  },
  sell: {
    path: '/vendre',
    title: 'Vendre ma voiture au Maroc | AutoSmart Maroc',
    description: 'Vendez votre voiture avec AutoSmart Maroc grace a une evaluation professionnelle, une visibilite locale et un contact rapide par WhatsApp.',
    keywords: 'vendre voiture Maroc, vendre voiture Ain Taoujdate, estimation voiture Maroc, concessionnaire automobile Maroc',
  },
  about: {
    path: '/a-propos',
    title: 'A propos d AutoSmart Maroc | Concessionnaire auto au Maroc',
    description: 'Decouvrez AutoSmart Maroc, specialiste des voitures d occasion et de luxe a Ain Taoujdate, Fes-Meknes et au Maroc.',
    keywords: 'AutoSmart Maroc, concessionnaire Ain Taoujdate, car dealership Morocco, voitures luxe Maroc',
  },
  contact: {
    path: '/contact',
    title: 'Contact AutoSmart Maroc | Ain Taoujdate, Maroc',
    description: 'Contactez AutoSmart Maroc a Ain Taoujdate pour acheter, vendre ou demander des informations sur nos voitures disponibles au Maroc.',
    keywords: 'contact AutoSmart Maroc, Ain Taoujdate, concessionnaire automobile, voitures occasion Maroc',
  },
  login: {
    path: '/login',
    title: 'Connexion admin | AutoSmart Maroc',
    description: 'Acces reserve a l administration AutoSmart Maroc.',
    keywords: 'AutoSmart Maroc admin',
    noindex: true,
  },
};

export const routeUrl = (path = '/') => `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;

export const normalizeText = (value = '') => String(value).replace(/\s+/g, ' ').trim();

export const carTitle = (car) => {
  if (!car) return pageMetadata.cars.title;
  return `${normalizeText(car.name)} ${car.year || ''} | Voiture d occasion au Maroc`;
};

export const carDescription = (car) => {
  if (!car) return pageMetadata.cars.description;
  const parts = [
    car.name,
    car.brand,
    car.model,
    car.year,
    car.mileage ? `${car.mileage} km` : '',
    car.price ? `${car.price} DH` : '',
  ].filter(Boolean);
  const base = normalizeText(car.shortDescription || car.description);
  return normalizeText(
    base || `${parts.join(' - ')} disponible chez AutoSmart Maroc, concessionnaire de voitures d occasion et de luxe a Ain Taoujdate, Maroc.`
  );
};

export const carImage = (car) => getCarImages(car, fallbackCarImage)[0] || DEFAULT_IMAGE;
