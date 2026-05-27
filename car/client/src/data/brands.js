export const popularBrands = [
  { name: 'Volkswagen', logo: 'https://cdn.simpleicons.org/volkswagen/1f2433' },
  { name: 'Renault', logo: 'https://cdn.simpleicons.org/renault/1f2433' },
  { name: 'Dacia', logo: 'https://cdn.simpleicons.org/dacia/1f2433' },
  { name: 'Peugeot', logo: 'https://cdn.simpleicons.org/peugeot/1f2433' },
  { name: 'Citroën', logo: 'https://cdn.simpleicons.org/citroen/1f2433' },
  { name: 'Toyota', logo: 'https://cdn.simpleicons.org/toyota/1f2433' },
  { name: 'Hyundai', logo: 'https://cdn.simpleicons.org/hyundai/1f2433' },
  { name: 'Kia', logo: 'https://cdn.simpleicons.org/kia/1f2433' },
  { name: 'Mercedes-Benz', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Mercedes-Benz_Star_%281969-1986%2C_2025-%29.svg/1280px-Mercedes-Benz_Star_%281969-1986%2C_2025-%29.svg.png' },
  { name: 'BMW', logo: 'https://cdn.simpleicons.org/bmw/1f2433' },
  { name: 'Audi', logo: 'https://cdn.simpleicons.org/audi/1f2433' },
  { name: 'Ford', logo: 'https://cdn.simpleicons.org/ford/1f2433' },
  { name: 'Nissan', logo: 'https://cdn.simpleicons.org/nissan/1f2433' },
  { name: 'Opel', logo: 'https://cdn.simpleicons.org/opel/1f2433' },
  { name: 'Fiat', logo: 'https://cdn.simpleicons.org/fiat/1f2433' },
  { name: 'Land Rover', logo: 'https://media.cdn-jaguarlandrover.com/lr_logo_big.png' },
];

export const isPopularBrand = (brandName) =>
  popularBrands.some((brand) => brand.name.toLowerCase() === String(brandName || '').toLowerCase());

export const getPopularBrandName = (brandName) =>
  popularBrands.find((brand) => brand.name.toLowerCase() === String(brandName || '').toLowerCase())?.name || '';
