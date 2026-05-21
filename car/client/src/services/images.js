const fallbackCarImage = 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&q=80';

export const getImageUrl = (image) => {
  if (!image) {
    return '';
  }

  if (typeof image === 'string') {
    return image.startsWith('http') ? image : '';
  }

  return image.url || '';
};

export const getCarImages = (car, fallback = fallbackCarImage) => {
  const images = Array.isArray(car?.images)
    ? car.images.map(getImageUrl).filter(Boolean)
    : [];

  if (images.length > 0) {
    return images;
  }

  const legacyImage = getImageUrl(car?.image);
  if (legacyImage) {
    return [legacyImage];
  }

  return fallback ? [fallback] : [];
};

export { fallbackCarImage };
