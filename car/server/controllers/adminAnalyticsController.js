const Car = require('../models/Car');

const soldStatuses = ['sold', 'vendu'];
const availableStatuses = ['available', 'disponible'];
const fallbackImage = '';

const startOfWeek = (date) => {
  const start = new Date(date);
  const day = start.getDay();
  const diff = start.getDate() - day + (day === 0 ? -6 : 1);
  start.setDate(diff);
  start.setHours(0, 0, 0, 0);
  return start;
};

const startOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1);

const formatWeekLabel = (date) => {
  const year = date.getFullYear();
  const firstDay = new Date(year, 0, 1);
  const pastDays = Math.floor((date - firstDay) / 86400000);
  const week = Math.ceil((pastDays + firstDay.getDay() + 1) / 7);
  return `${year}-W${String(week).padStart(2, '0')}`;
};

const toNumber = (value) => Number(value || 0);
const getCarTitle = (car) => car.title || car.name || car.model || car.nom || car.marque || 'Unknown car';
const getCarBrand = (car) => car.brand || car.marque || '';
const getCarPrice = (car) => toNumber(car.price || car.prix);
const getCarStatus = (car) => car.status || car.disponibilite || 'available';
const getCarImage = (car) => {
  const images = Array.isArray(car.images) ? car.images : (Array.isArray(car.photos) ? car.photos : []);
  const firstImage = images[0];

  if (firstImage && typeof firstImage === 'object') {
    return firstImage.url || firstImage.secure_url || fallbackImage;
  }

  return firstImage || car.image || car.photo || fallbackImage;
};

const getAdminAnalytics = async (req, res) => {
  try {
    const now = new Date();
    const weekStart = startOfWeek(now);
    const monthStart = startOfMonth(now);
    const cars = await Car.find({}).sort({ createdAt: -1 }).lean();

    const isSold = (car) => soldStatuses.includes(getCarStatus(car));
    const isAvailable = (car) => availableStatuses.includes(getCarStatus(car));
    const soldCarsList = cars.filter(isSold);

    const uploadedThisWeek = cars.filter((car) => car.createdAt && new Date(car.createdAt) >= weekStart).length;
    const uploadedThisMonth = cars.filter((car) => car.createdAt && new Date(car.createdAt) >= monthStart).length;
    const soldThisWeek = soldCarsList.filter((car) => car.soldAt && new Date(car.soldAt) >= weekStart).length;
    const soldThisMonth = soldCarsList.filter((car) => car.soldAt && new Date(car.soldAt) >= monthStart).length;
    const totalViews = cars.reduce((sum, car) => sum + toNumber(car.views), 0);
    const totalLikes = cars.reduce((sum, car) => sum + toNumber(car.likes), 0);
    const totalWhatsappClicks = cars.reduce((sum, car) => sum + toNumber(car.whatsappClicks), 0);
    const estimatedSoldValue = soldCarsList.reduce((sum, car) => sum + getCarPrice(car), 0);

    const mapCar = (car) => {
      const views = toNumber(car.views);
      const whatsappClicks = toNumber(car.whatsappClicks);

      return {
        id: car._id,
        _id: car._id,
        name: getCarTitle(car),
        title: getCarTitle(car),
        brand: getCarBrand(car),
        image: getCarImage(car),
        status: isSold(car) ? 'sold' : 'available',
        price: getCarPrice(car),
        views,
        likes: toNumber(car.likes),
        whatsappClicks,
        createdAt: car.createdAt,
        soldAt: car.soldAt,
        conversionRate: views > 0 ? Number(((whatsappClicks / views) * 100).toFixed(1)) : 0
      };
    };

    const carsTable = cars.map(mapCar);
    const byViews = [...carsTable].sort((a, b) => b.views - a.views);
    const byLikes = [...carsTable].sort((a, b) => b.likes - a.likes);
    const byContacts = [...carsTable].sort((a, b) => b.whatsappClicks - a.whatsappClicks);
    const recentSoldCars = carsTable
      .filter((car) => car.status === 'sold')
      .sort((a, b) => new Date(b.soldAt || 0) - new Date(a.soldAt || 0))
      .slice(0, 5);

    const uploadsByWeek = cars.reduce((weeks, car) => {
      const createdAt = car.createdAt ? new Date(car.createdAt) : null;
      if (!createdAt) return weeks;

      const label = formatWeekLabel(createdAt);
      weeks[label] = (weeks[label] || 0) + 1;
      return weeks;
    }, {});

    const chartData = {
      viewsPerCar: byViews.slice(0, 8).map((car) => ({ name: car.name, views: car.views })),
      statusPie: [
        { name: 'Available', value: cars.filter(isAvailable).length },
        { name: 'Sold', value: soldCarsList.length }
      ],
      statusData: [
        { name: 'Disponible', value: cars.filter(isAvailable).length },
        { name: 'Vendu', value: soldCarsList.length }
      ],
      whatsappPerCar: byContacts.slice(0, 8).map((car) => ({ name: car.name, clicks: car.whatsappClicks })),
      whatsappClicksPerCar: byContacts.slice(0, 8).map((car) => ({ name: car.name, clicks: car.whatsappClicks })),
      uploadsOverTime: Object.entries(uploadsByWeek)
        .sort(([a], [b]) => a.localeCompare(b))
        .slice(-8)
        .map(([week, uploads]) => ({ week, uploads }))
    };

    return res.json({
      totalCars: cars.length,
      availableCars: cars.filter(isAvailable).length,
      soldCars: soldCarsList.length,
      uploadedThisWeek,
      uploadedThisMonth,
      soldThisWeek,
      soldThisMonth,
      totalViews,
      totalLikes,
      totalWhatsappClicks,
      estimatedSoldValue,
      averageSoldPrice: soldCarsList.length > 0 ? Math.round(estimatedSoldValue / soldCarsList.length) : 0,
      topViewedCars: byViews.slice(0, 5),
      topLikedCars: byLikes.slice(0, 5),
      topContactedCars: byContacts.slice(0, 5),
      recentSoldCars,
      recentUploadedCars: carsTable.slice(0, 5),
      carsTable,
      chartData
    });
  } catch (error) {
    console.error('Analytics error:', error);
    return res.status(500).json({
      message: 'Failed to load analytics',
      error: error.message
    });
  }
};

module.exports = {
  getAdminAnalytics
};
