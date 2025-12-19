import { useState, useEffect } from 'react';
import { productApi, storeApi } from '../api/client';
import { Product, Store, ProductFilters } from '../types';
import ProductForm from './ProductForm';

function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Filters
  const [filters, setFilters] = useState<ProductFilters>({
    page: 1,
    limit: 10
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  const fetchStores = async () => {
    try {
      const data = await storeApi.getAll();
      setStores(data);
    } catch (err) {
      console.error('Failed to fetch stores', err);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productApi.getAll(filters);

      if ('data' in data) {
        // Paginated response
        setProducts(data.data);
        setPagination({
          page: data.page,
          limit: data.limit,
          total: data.total,
          totalPages: data.totalPages
        });
      } else {
        // Regular array response
        setProducts(data);
      }
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await productApi.delete(id);
      fetchProducts();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to delete product');
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingProduct(null);
    fetchProducts();
  };

  const handleFilterChange = (key: keyof ProductFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === '' ? undefined : value,
      page: 1 // Reset to first page on filter change
    }));
  };

  const getStoreName = (storeId: string): string => {
    return stores.find(s => s.id === storeId)?.name || 'Unknown Store';
  };

  if (loading && products.length === 0) return <div className="loading">Loading products...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="product-list">
      <div className="list-header">
        <h2>Products</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          Add Product
        </button>
      </div>

      {showForm && (
        <ProductForm
          product={editingProduct}
          stores={stores}
          onClose={handleFormClose}
        />
      )}

      <div className="filters">
        <div className="filter-group">
          <label>Category</label>
          <input
            type="text"
            placeholder="Filter by category"
            value={filters.category || ''}
            onChange={e => handleFilterChange('category', e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label>Store</label>
          <select
            value={filters.storeId || ''}
            onChange={e => handleFilterChange('storeId', e.target.value)}
          >
            <option value="">All Stores</option>
            {stores.map(store => (
              <option key={store.id} value={store.id}>
                {store.name}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Min Price</label>
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice || ''}
            onChange={e => handleFilterChange('minPrice', e.target.value ? parseFloat(e.target.value) : '')}
          />
        </div>

        <div className="filter-group">
          <label>Max Price</label>
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice || ''}
            onChange={e => handleFilterChange('maxPrice', e.target.value ? parseFloat(e.target.value) : '')}
          />
        </div>

        <div className="filter-group">
          <label>Min Stock</label>
          <input
            type="number"
            placeholder="Min"
            value={filters.minStock || ''}
            onChange={e => handleFilterChange('minStock', e.target.value ? parseInt(e.target.value) : '')}
          />
        </div>

        <div className="filter-group">
          <label>Max Stock</label>
          <input
            type="number"
            placeholder="Max"
            value={filters.maxStock || ''}
            onChange={e => handleFilterChange('maxStock', e.target.value ? parseInt(e.target.value) : '')}
          />
        </div>

        <button
          className="btn btn-secondary"
          onClick={() => setFilters({ page: 1, limit: 10 })}
        >
          Clear Filters
        </button>
      </div>

      {products.length === 0 ? (
        <p className="empty-message">No products found.</p>
      ) : (
        <>
          <table className="product-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Store</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{getStoreName(product.storeId)}</td>
                  <td>{product.category}</td>
                  <td>${product.price.toFixed(2)}</td>
                  <td>{product.quantity}</td>
                  <td>
                    <button className="btn btn-sm btn-secondary" onClick={() => handleEdit(product)}>
                      Edit
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(product.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {pagination.totalPages > 1 && (
            <div className="pagination">
              <button
                className="btn btn-secondary"
                disabled={pagination.page === 1}
                onClick={() => setFilters(prev => ({ ...prev, page: Math.max(1, prev.page! - 1) }))}
              >
                Previous
              </button>
              <span>
                Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
              </span>
              <button
                className="btn btn-secondary"
                disabled={pagination.page === pagination.totalPages}
                onClick={() => setFilters(prev => ({ ...prev, page: (prev.page || 1) + 1 }))}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ProductList;
