const fallbackCarImage = 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&q=80';

const cloudinaryUploadSegment = '/image/upload/';

export const optimizeCloudinaryImage = (url, options = {}) => {
  if (!url || !url.includes('res.cloudinary.com') || !url.includes(cloudinaryUploadSegment)) {
    return url;
  }

  const transformations = [
    'f_auto',
    'q_auto',
    options.width ? `w_${options.width}` : null,
    options.height ? `h_${options.height}` : null,
    options.crop ? `c_${options.crop}` : 'c_limit',
  ].filter(Boolean).join(',');

  if (!transformations || url.includes('/f_auto') || url.includes('/q_auto')) {
    return url;
  }

  return url.replace(cloudinaryUploadSegment, `${cloudinaryUploadSegment}${transformations}/`);
};

export const getImageUrl = (image) => {
  if (!image) {
    return '';
  }

  if (typeof image === 'string') {
    return image.startsWith('http') ? optimizeCloudinaryImage(image) : '';
  }

  return optimizeCloudinaryImage(image.url || '');
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
