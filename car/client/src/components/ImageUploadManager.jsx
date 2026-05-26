import { useEffect, useRef, useState } from 'react';
import { FiArrowDown, FiArrowUp, FiTrash2, FiUpload } from 'react-icons/fi';
import { useLanguage } from '../context/LanguageContext';

const makeImageItem = (file) => ({
  id: `${file.name}-${file.lastModified}-${file.size}-${crypto.randomUUID?.() || Math.random()}`,
  file,
  preview: URL.createObjectURL(file),
});

const reorder = (items, fromIndex, toIndex) => {
  const next = [...items];
  const [moved] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, moved);
  return next;
};

const ImageUploadManager = ({
  inputId,
  imageFiles,
  setImageFiles,
  uploadText,
}) => {
  const { t } = useLanguage();
  const [items, setItems] = useState([]);
  const dragIndex = useRef(null);
  const itemsRef = useRef([]);

  useEffect(() => {
    itemsRef.current = items;
    setImageFiles(items.map((item) => item.file));
  }, [items, setImageFiles]);

  useEffect(() => () => {
    itemsRef.current.forEach((item) => URL.revokeObjectURL(item.preview));
  }, []);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    items.forEach((item) => URL.revokeObjectURL(item.preview));
    setItems(files.map(makeImageItem));
    e.target.value = '';
  };

  const removeImage = (id) => {
    setItems((current) => {
      const item = current.find((entry) => entry.id === id);
      if (item) URL.revokeObjectURL(item.preview);
      return current.filter((entry) => entry.id !== id);
    });
  };

  const moveImage = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= items.length) return;
    setItems((current) => reorder(current, fromIndex, toIndex));
  };

  const handleDrop = (toIndex) => {
    if (dragIndex.current === null || dragIndex.current === toIndex) return;
    setItems((current) => reorder(current, dragIndex.current, toIndex));
    dragIndex.current = null;
  };

  return (
    <>
      <div className="add-car-upload">
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
          className="add-car-file-input"
          id={inputId}
        />
        <label htmlFor={inputId} className="add-car-upload-label">
          <FiUpload size={24} />
          <span>{uploadText}</span>
          <span className="add-car-upload-hint">{t('upload.hint')}</span>
        </label>
      </div>

      {imageFiles.length > 0 && (
        <>
          <p className="add-car-order-hint">{t('upload.dragHint')}</p>
          <div className="add-car-previews add-car-previews--sortable">
            {items.map((item, idx) => (
              <div
                key={item.id}
                className="add-car-preview-card"
                draggable
                onDragStart={() => { dragIndex.current = idx; }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(idx)}
              >
                <div className="add-car-preview-image-wrap">
                  <img
                    src={item.preview}
                    alt={t('upload.previewAlt').replace('{{number}}', idx + 1)}
                    className="add-car-preview-img"
                  />
                  {idx === 0 && <span className="add-car-main-badge">{t('upload.mainImage')}</span>}
                  <button
                    type="button"
                    className="add-car-remove-btn"
                    onClick={() => removeImage(item.id)}
                    aria-label={t('upload.remove')}
                    title={t('upload.remove')}
                  >
                    <FiTrash2 />
                  </button>
                </div>
                <div className="add-car-preview-actions">
                  <button
                    type="button"
                    onClick={() => moveImage(idx, idx - 1)}
                    disabled={idx === 0}
                    aria-label={t('upload.moveUp')}
                    title={t('upload.moveUp')}
                  >
                    <FiArrowUp />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveImage(idx, idx + 1)}
                    disabled={idx === items.length - 1}
                    aria-label={t('upload.moveDown')}
                    title={t('upload.moveDown')}
                  >
                    <FiArrowDown />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default ImageUploadManager;
