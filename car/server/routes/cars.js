const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  getCars,
  getCar,
  createCar,
  updateCar,
  deleteCar,
  updateCarStatus,
  incrementCarView,
  incrementCarLike,
  incrementWhatsappClick
} = require('../controllers/carController');

const uploadImages = upload.array('images', 10);

const runUpload = (req, res, next) => {
  uploadImages(req, res, (error) => {
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    return next();
  });
};

router.get('/', getCars);
router.get('/:id', getCar);
router.patch('/:id/view', incrementCarView);
router.patch('/:id/like', incrementCarLike);
router.patch('/:id/whatsapp-click', incrementWhatsappClick);
router.post('/', protect, runUpload, createCar);
router.put('/:id', protect, runUpload, updateCar);
router.delete('/:id', protect, deleteCar);
router.patch('/:id/status', protect, updateCarStatus);

module.exports = router;
