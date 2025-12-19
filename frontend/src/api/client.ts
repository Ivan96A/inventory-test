import axios from 'axios';
import type {
  Store,
  Product,
  CreateStoreInput,
  UpdateStoreInput,
  CreateProductInput,
  UpdateProductInput,
  ProductFilters,
  PaginatedResponse,
  DashboardData
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Store API
export const storeApi = {
  getAll: async (): Promise<Store[]> => {
    const response = await apiClient.get<Store[]>('/stores');
    return response.data;
  },

  getById: async (id: string): Promise<Store> => {
    const response = await apiClient.get<Store>(`/stores/${id}`);
    return response.data;
  },

  create: async (data: CreateStoreInput): Promise<Store> => {
    const response = await apiClient.post<Store>('/stores', data);
    return response.data;
  },

  update: async (id: string, data: UpdateStoreInput): Promise<Store> => {
    const response = await apiClient.put<Store>(`/stores/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/stores/${id}`);
  },

  getProducts: async (storeId: string): Promise<Product[]> => {
    const response = await apiClient.get<Product[]>(`/stores/${storeId}/products`);
    return response.data;
  }
};

// Product API
export const productApi = {
  getAll: async (filters?: ProductFilters): Promise<Product[] | PaginatedResponse<Product>> => {
    const params = new URLSearchParams();

    if (filters) {
      if (filters.category) params.append('category', filters.category);
      if (filters.storeId) params.append('storeId', filters.storeId);
      if (filters.minPrice !== undefined) params.append('minPrice', filters.minPrice.toString());
      if (filters.maxPrice !== undefined) params.append('maxPrice', filters.maxPrice.toString());
      if (filters.minStock !== undefined) params.append('minStock', filters.minStock.toString());
      if (filters.maxStock !== undefined) params.append('maxStock', filters.maxStock.toString());
      if (filters.page !== undefined) params.append('page', filters.page.toString());
      if (filters.limit !== undefined) params.append('limit', filters.limit.toString());
    }

    const response = await apiClient.get<Product[] | PaginatedResponse<Product>>(
      `/products${params.toString() ? `?${params.toString()}` : ''}`
    );
    return response.data;
  },

  getById: async (id: string): Promise<Product> => {
    const response = await apiClient.get<Product>(`/products/${id}`);
    return response.data;
  },

  create: async (data: CreateProductInput): Promise<Product> => {
    const response = await apiClient.post<Product>('/products', data);
    return response.data;
  },

  update: async (id: string, data: UpdateProductInput): Promise<Product> => {
    const response = await apiClient.put<Product>(`/products/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/products/${id}`);
  }
};

// Dashboard API
export const dashboardApi = {
  getStats: async (): Promise<DashboardData> => {
    const response = await apiClient.get<DashboardData>('/dashboard');
    return response.data;
  }
};
