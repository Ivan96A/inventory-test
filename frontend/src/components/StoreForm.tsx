import { useState, useEffect } from 'react';
import { storeApi } from '../api/client';
import { Store, CreateStoreInput } from '../types';

interface StoreFormProps {
  store: Store | null;
  onClose: () => void;
}

function StoreForm({ store, onClose }: StoreFormProps) {
  const [formData, setFormData] = useState<CreateStoreInput>({
    name: '',
    location: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (store) {
      setFormData({
        name: store.name,
        location: store.location
      });
    }
  }, [store]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (store) {
        await storeApi.update(store.id, formData);
      } else {
        await storeApi.create(formData);
      }
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save store');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h3>{store ? 'Edit Store' : 'Add Store'}</h3>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Store Name *</label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">Location *</label>
            <input
              type="text"
              id="location"
              value={formData.location}
              onChange={e => setFormData({ ...formData, location: e.target.value })}
              required
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default StoreForm;
