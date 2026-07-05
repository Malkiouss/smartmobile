import { BUSINESS, SITE_NAME, SITE_URL, carDescription, carImage, routeUrl } from './site';

export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: BUSINESS.name,
  url: BUSINESS.url,
  logo: BUSINESS.logo,
  sameAs: BUSINESS.sameAs,
  contactPoint: [{
    '@type': 'ContactPoint',
    telephone: BUSINESS.telephone,
    contactType: 'customer service',
    areaServed: 'MA',
    availableLanguage: ['French', 'Arabic', 'English'],
  }],
};

export const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'AutoDealer',
  '@id': `${SITE_URL}/#localbusiness`,
  name: BUSINESS.name,
  url: BUSINESS.url,
  logo: BUSINESS.logo,
  image: [BUSINESS.image, BUSINESS.logo],
  telephone: BUSINESS.telephone,
  email: BUSINESS.email,
  address: {
    '@type': 'PostalAddress',
    ...BUSINESS.address,
  },
  openingHours: BUSINESS.openingHours,
  sameAs: BUSINESS.sameAs,
  areaServed: [
    { '@type': 'City', name: 'Ain Taoujdate' },
    { '@type': 'Country', name: 'Morocco' },
  ],
  priceRange: '$$',
};

export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: SITE_URL,
  potentialAction: {
    '@type': 'SearchAction',
    target: `${SITE_URL}/voitures?model={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
};

export const breadcrumbSchema = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: routeUrl(item.path),
  })),
});

export const vehicleSchema = (car, path) => ({
  '@context': 'https://schema.org',
  '@type': 'Vehicle',
  name: car.name,
  url: routeUrl(path),
  image: [carImage(car)],
  description: carDescription(car),
  brand: {
    '@type': 'Brand',
    name: car.brand,
  },
  model: car.model,
  vehicleModelDate: car.year ? String(car.year) : undefined,
  mileageFromOdometer: car.mileage ? {
    '@type': 'QuantitativeValue',
    value: car.mileage,
    unitCode: 'KMT',
  } : undefined,
  offers: {
    '@type': 'Offer',
    price: car.price,
    priceCurrency: 'MAD',
    availability: car.status === 'sold' || car.status === 'vendu'
      ? 'https://schema.org/SoldOut'
      : 'https://schema.org/InStock',
    url: routeUrl(path),
    seller: {
      '@type': 'AutoDealer',
      name: BUSINESS.name,
      url: BUSINESS.url,
    },
  },
});

export const productSchema = (car, path) => ({
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: car.name,
  image: [carImage(car)],
  description: carDescription(car),
  brand: {
    '@type': 'Brand',
    name: car.brand,
  },
  sku: car._id,
  offers: {
    '@type': 'Offer',
    url: routeUrl(path),
    priceCurrency: 'MAD',
    price: car.price,
    availability: car.status === 'sold' || car.status === 'vendu'
      ? 'https://schema.org/SoldOut'
      : 'https://schema.org/InStock',
    itemCondition: 'https://schema.org/UsedCondition',
  },
});
