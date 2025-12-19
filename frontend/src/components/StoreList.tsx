import { useState, useEffect } from 'react';
import { storeApi } from '../api/client';
import { Store } from '../types';
import StoreForm from './StoreForm';

function StoreList() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingStore, setEditingStore] = useState<Store | null>(null);

  const fetchStores = async () => {
    try {
      setLoading(true);
      const data = await storeApi.getAll();
      setStores(data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch stores');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this store?')) return;

    try {
      await storeApi.delete(id);
      fetchStores();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to delete store');
    }
  };

  const handleEdit = (store: Store) => {
    setEditingStore(store);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingStore(null);
    fetchStores();
  };

  if (loading) return <div className="loading">Loading stores...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="store-list">
      <div className="list-header">
        <h2>Stores</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          Add Store
        </button>
      </div>

      {showForm && (
        <StoreForm
          store={editingStore}
          onClose={handleFormClose}
        />
      )}

      {stores.length === 0 ? (
        <p className="empty-message">No stores found. Create one to get started!</p>
      ) : (
        <div className="card-grid">
          {stores.map(store => (
            <div key={store.id} className="card">
              <h3>{store.name}</h3>
              <p className="location">{store.location}</p>
              <p className="date">Created: {new Date(store.createdAt).toLocaleDateString()}</p>
              <div className="card-actions">
                <button className="btn btn-secondary" onClick={() => handleEdit(store)}>
                  Edit
                </button>
                <button className="btn btn-danger" onClick={() => handleDelete(store.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default StoreList;
