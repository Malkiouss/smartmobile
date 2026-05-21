const Car = require('../models/Car');
const cloudinary = require('../config/cloudinary');
const uploadToCloudinary = require('../utils/uploadToCloudinary');

const uploadFilesToCloudinary = async (files = []) => {
  const uploadedImages = [];

  for (const file of files) {
    const result = await uploadToCloudinary(file.buffer, 'smartmobile/cars');

    uploadedImages.push({
      url: result.secure_url,
      public_id: result.public_id
    });
  }

  return uploadedImages;
};

const getPublicIds = (images = []) => images
  .map((image) => image && typeof image === 'object' ? image.public_id : null)
  .filter(Boolean);

const deleteCloudinaryImages = async (images = []) => {
  const publicIds = getPublicIds(images);

  if (publicIds.length === 0) {
    return;
  }

  await Promise.allSettled(publicIds.map((publicId) => cloudinary.uploader.destroy(publicId)));
};

const getCars = async (req, res) => {
  try {
    const { brand, model, maxPrice, minYear, status } = req.query;
    const filter = {};

    if (brand) filter.brand = new RegExp(brand, 'i');
    if (model) filter.model = new RegExp(model, 'i');
    if (maxPrice) filter.price = { $lte: Number(maxPrice) };
    if (minYear) filter.year = { $gte: Number(minYear) };
    if (status) filter.status = status;

    const cars = await Car.find(filter).sort({ createdAt: -1 });
    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    return res.json(car);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const createCar = async (req, res) => {
  try {
    const { name, brand, model, year, mileage, price, description, shortDescription, quantity, status } = req.body;
    const images = await uploadFilesToCloudinary(req.files);

    const car = await Car.create({
      name,
      brand,
      model,
      year: Number(year),
      mileage: Number(mileage) || 0,
      price: Number(price),
      description,
      shortDescription,
      images,
      quantity: Number(quantity) || 1,
      status: status || 'available'
    });

    return res.status(201).json(car);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const updateCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    const { name, brand, model, year, mileage, price, description, shortDescription, quantity, status, keepImages } = req.body;

    car.name = name || car.name;
    car.brand = brand || car.brand;
    car.model = model || car.model;
    car.year = year ? Number(year) : car.year;
    car.mileage = mileage !== undefined ? Number(mileage) : car.mileage;
    car.price = price ? Number(price) : car.price;
    car.description = description !== undefined ? description : car.description;
    car.shortDescription = shortDescription !== undefined ? shortDescription : car.shortDescription;
    car.quantity = quantity !== undefined ? Number(quantity) : car.quantity;
    car.status = status || car.status;

    if (req.files && req.files.length > 0) {
      const newImages = await uploadFilesToCloudinary(req.files);

      if (keepImages === 'true') {
        car.images = [...(car.images || []), ...newImages];
      } else {
        await deleteCloudinaryImages(car.images);
        car.images = newImages;
      }
    }

    const updatedCar = await car.save();
    return res.json(updatedCar);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const deleteCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    await deleteCloudinaryImages(car.images);
    await Car.findByIdAndDelete(req.params.id);
    return res.json({ message: 'Car removed' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateCarStatus = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    car.status = req.body.status || (car.status === 'available' ? 'sold' : 'available');
    const updatedCar = await car.save();
    return res.json(updatedCar);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getCars,
  getCar,
  createCar,
  updateCar,
  deleteCar,
  updateCarStatus
};
