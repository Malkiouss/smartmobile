import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft } from 'react-icons/fi';
import ImageUploadManager from '../../components/ImageUploadManager';
import { useLanguage } from '../../context/LanguageContext';
import api from '../../services/api';
import { fadeUp, staggerContainer } from '../../utils/animations';
import './AddCar.css';

const AddCar = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imageFiles, setImageFiles] = useState([]);
  const [form, setForm] = useState({
    name: '',
    brand: '',
    model: '',
    year: '',
    mileage: '',
    price: '',
    description: '',
    shortDescription: '',
    quantity: '1',
    status: 'available'
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });
      imageFiles.forEach(file => {
        formData.append('images', file);
      });

      await api.post('/cars', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || t('admin.createError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-car-page" id="add-car-page">
      <div className="container">
        <motion.div variants={fadeUp} initial="hidden" animate="visible">
          <Link to="/admin" className="car-details-back">
            <FiArrowLeft /> {t('admin.backDashboard')}
          </Link>
        </motion.div>

        <motion.div className="add-car-card" variants={fadeUp} initial="hidden" animate="visible">
          <h1 className="add-car-title">{t('admin.addCar')}</h1>

          {error && <div className="login-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <motion.div className="add-car-grid" variants={staggerContainer} initial="hidden" animate="visible">
              <div className="form-group">
                <label className="form-label">{t('admin.fullName')} *</label>
                <input type="text" name="name" value={form.name} onChange={handleChange} className="form-input" placeholder={t('admin.placeholderName')} required />
              </div>
              <div className="form-group">
                <label className="form-label">{t('admin.brand')} *</label>
                <input type="text" name="brand" value={form.brand} onChange={handleChange} className="form-input" placeholder={t('admin.placeholderBrand')} required />
              </div>
              <div className="form-group">
                <label className="form-label">{t('admin.model')} *</label>
                <input type="text" name="model" value={form.model} onChange={handleChange} className="form-input" placeholder={t('admin.placeholderModel')} required />
              </div>
              <div className="form-group">
                <label className="form-label">{t('admin.year')} *</label>
                <input type="number" name="year" value={form.year} onChange={handleChange} className="form-input" placeholder={t('admin.placeholderYear')} required />
              </div>
              <div className="form-group">
                <label className="form-label">{t('admin.mileage')}</label>
                <input type="number" name="mileage" value={form.mileage} onChange={handleChange} className="form-input" placeholder={t('admin.placeholderMileage')} />
              </div>
              <div className="form-group">
                <label className="form-label">{t('admin.price')} *</label>
                <input type="number" name="price" value={form.price} onChange={handleChange} className="form-input" placeholder={t('admin.placeholderPrice')} required />
              </div>
              <div className="form-group">
                <label className="form-label">{t('admin.quantity')}</label>
                <input type="number" name="quantity" value={form.quantity} onChange={handleChange} className="form-input" placeholder={t('admin.placeholderQuantity')} />
              </div>
              <div className="form-group">
                <label className="form-label">{t('admin.status')}</label>
                <select name="status" value={form.status} onChange={handleChange} className="form-select">
                  <option value="available">{t('car.available')}</option>
                  <option value="sold">{t('car.sold')}</option>
                </select>
              </div>
            </motion.div>

            <div className="form-group">
              <label className="form-label">{t('admin.shortDescription')}</label>
              <input type="text" name="shortDescription" value={form.shortDescription} onChange={handleChange} className="form-input" placeholder={t('admin.placeholderShortDescription')} />
            </div>

            <div className="form-group">
              <label className="form-label">{t('admin.fullDescription')}</label>
              <textarea name="description" value={form.description} onChange={handleChange} className="form-textarea" placeholder={t('admin.placeholderDescription')} rows="5"></textarea>
            </div>

            <div className="form-group">
              <label className="form-label">{t('admin.images')}</label>
              <ImageUploadManager
                inputId="car-images-input"
                imageFiles={imageFiles}
                setImageFiles={setImageFiles}
                uploadText={t('upload.clickAdd')}
              />
            </div>

            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
              {loading ? t('admin.creating') : t('admin.create')}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AddCar;
