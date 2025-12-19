import { useState, useEffect } from 'react';
import { dashboardApi } from '../api/client';
import { DashboardData } from '../types';

function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const dashboardData = await dashboardApi.getStats();
      setData(dashboardData);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) return <div className="loading">Loading dashboard...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!data) return null;

  return (
    <div className="dashboard">
      <h2 className="dashboard-title">Dashboard Overview</h2>

      {/* Overall Statistics */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🏪</div>
          <div className="stat-content">
            <div className="stat-value">{data.overall.totalStores}</div>
            <div className="stat-label">Total Stores</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <div className="stat-value">{data.overall.totalProducts}</div>
            <div className="stat-label">Total Products</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <div className="stat-value">{data.overall.totalStockUnits.toLocaleString()}</div>
            <div className="stat-label">Stock Units</div>
          </div>
        </div>

        <div className="stat-card highlight">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <div className="stat-value">${data.overall.totalInventoryValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            <div className="stat-label">Total Inventory Value</div>
          </div>
        </div>
      </div>

      {/* Store Statistics */}
      <div className="dashboard-section">
        <h3>Store Performance</h3>
        <div className="table-container">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Store Name</th>
                <th>Location</th>
                <th>Products</th>
                <th>Stock Units</th>
                <th>Avg Price</th>
                <th>Total Value</th>
              </tr>
            </thead>
            <tbody>
              {data.storeStats.map(store => (
                <tr key={store.storeId}>
                  <td><strong>{store.storeName}</strong></td>
                  <td>{store.storeLocation}</td>
                  <td>{store.productCount}</td>
                  <td>{store.totalStock.toLocaleString()}</td>
                  <td>${store.avgPrice.toFixed(2)}</td>
                  <td><strong>${store.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Category Statistics */}
      <div className="dashboard-section">
        <h3>Category Breakdown</h3>
        <div className="table-container">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Products</th>
                <th>Stock Units</th>
                <th>Total Value</th>
              </tr>
            </thead>
            <tbody>
              {data.categoryStats.map(category => (
                <tr key={category.category}>
                  <td><strong>{category.category}</strong></td>
                  <td>{category.productCount}</td>
                  <td>{category.totalStock.toLocaleString()}</td>
                  <td><strong>${category.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
