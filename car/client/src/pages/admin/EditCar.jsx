import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft } from 'react-icons/fi';
import ImageUploadManager from '../../components/ImageUploadManager';
import { useLanguage } from '../../context/LanguageContext';
import { getPopularBrandName, isPopularBrand, popularBrands } from '../../data/brands';
import api from '../../services/api';
import { getCarImages } from '../../services/images';
import { unwrapData } from '../../services/response';
import { fadeUp, staggerContainer } from '../../utils/animations';
import './AddCar.css';

const EditCar = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [imageFiles, setImageFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [customBrand, setCustomBrand] = useState('');
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

  useEffect(() => { fetchCar(); }, [id]);

  const fetchCar = async () => {
    try {
      const res = await api.get(`/cars/${id}`);
      const car = unwrapData(res.data);
      const existingBrand = car.brand || car.marque || '';
      const hasPopularBrand = isPopularBrand(existingBrand);
      const normalizedPopularBrand = getPopularBrandName(existingBrand);
      setForm({
        name: car.name || '',
        brand: hasPopularBrand ? normalizedPopularBrand : 'Other',
        model: car.model || '',
        year: car.year || '',
        mileage: car.mileage || '',
        price: car.price || '',
        description: car.description || '',
        shortDescription: car.shortDescription || '',
        quantity: car.quantity || 1,
        status: car.status || 'available'
      });
      setCustomBrand(hasPopularBrand ? '' : existingBrand);
      setExistingImages(getCarImages(car, ''));
    } catch (err) {
      setError(t('admin.notFound'));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (name === 'brand' && value !== 'Other') {
      setCustomBrand('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const finalBrand = form.brand === 'Other' ? customBrand.trim() : form.brand;
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, k === 'brand' ? finalBrand : v));
      formData.append('keepImages', imageFiles.length > 0 ? 'false' : 'true');
      imageFiles.forEach(f => formData.append('images', f));
      await api.put(`/cars/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || t('admin.updateError'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="spinner" style={{ marginTop: '120px' }} />;

  return (
    <div className="add-car-page" id="edit-car-page">
      <div className="container">
        <motion.div variants={fadeUp} initial="hidden" animate="visible">
          <Link to="/admin" className="car-details-back"><FiArrowLeft /> {t('admin.backDashboard')}</Link>
        </motion.div>
        <motion.div className="add-car-card" variants={fadeUp} initial="hidden" animate="visible">
          <h1 className="add-car-title">{t('admin.editCar')}</h1>
          {error && <div className="login-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <motion.div className="add-car-grid" variants={staggerContainer} initial="hidden" animate="visible">
              <div className="form-group">
                <label className="form-label">{t('admin.name')} *</label>
                <input type="text" name="name" value={form.name} onChange={handleChange} className="form-input" required />
              </div>
              <div className="form-group">
                <label className="form-label">{t('admin.brand')} *</label>
                <select name="brand" value={form.brand} onChange={handleChange} className="form-select" required>
                  <option value="">{t('search.allBrands')}</option>
                  {popularBrands.map((brand) => (
                    <option key={brand.name} value={brand.name}>{brand.name}</option>
                  ))}
                  <option value="Other">Other</option>
                </select>
              </div>
              {form.brand === 'Other' && (
                <div className="form-group">
                  <label className="form-label">Enter brand name *</label>
                  <input
                    type="text"
                    value={customBrand}
                    onChange={(e) => setCustomBrand(e.target.value)}
                    className="form-input"
                    required
                  />
                </div>
              )}
              <div className="form-group">
                <label className="form-label">{t('admin.model')} *</label>
                <input type="text" name="model" value={form.model} onChange={handleChange} className="form-input" required />
              </div>
              <div className="form-group">
                <label className="form-label">{t('admin.year')} *</label>
                <input type="number" name="year" value={form.year} onChange={handleChange} className="form-input" required />
              </div>
              <div className="form-group">
                <label className="form-label">{t('admin.mileage')}</label>
                <input type="number" name="mileage" value={form.mileage} onChange={handleChange} className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">{t('admin.price')} *</label>
                <input type="number" name="price" value={form.price} onChange={handleChange} className="form-input" required />
              </div>
              <div className="form-group">
                <label className="form-label">{t('admin.quantity')}</label>
                <input type="number" name="quantity" value={form.quantity} onChange={handleChange} className="form-input" />
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
              <input type="text" name="shortDescription" value={form.shortDescription} onChange={handleChange} className="form-input" />
            </div>
            <div className="form-group">
              <label className="form-label">{t('admin.description')}</label>
              <textarea name="description" value={form.description} onChange={handleChange} className="form-textarea" rows="5"></textarea>
            </div>
            <div className="form-group">
              <label className="form-label">{t('admin.currentImages')}</label>
              {existingImages.length > 0 ? (
                <div className="add-car-previews">
                  {existingImages.map((src, i) => (
                    <img
                      key={src || i}
                      src={src}
                      alt={t('upload.currentAlt').replace('{{number}}', i + 1)}
                      className="add-car-preview-img"
                    />
                  ))}
                </div>
              ) : <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{t('admin.noImage')}</p>}
            </div>
            <div className="form-group">
              <label className="form-label">{t('admin.newImages')}</label>
              <ImageUploadManager
                inputId="edit-car-images"
                imageFiles={imageFiles}
                setImageFiles={setImageFiles}
                uploadText={t('upload.clickReplace')}
              />
            </div>
            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={saving}>
              {saving ? t('admin.updating') : t('admin.update')}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default EditCar;
