export interface Store {
  id: string;
  name: string;
  location: string;
  createdAt: string;
}

export interface Product {
  id: string;
  storeId: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface Database {
  stores: Store[];
  products: Product[];
}

export interface CreateStoreInput {
  name: string;
  location: string;
}

export interface UpdateStoreInput {
  name?: string;
  location?: string;
}

export interface CreateProductInput {
  storeId: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
}

export interface UpdateProductInput {
  storeId?: string;
  name?: string;
  category?: string;
  price?: number;
  quantity?: number;
}

export interface ProductFilterOptions {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minStock?: number;
  maxStock?: number;
  storeId?: string;
}

export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiError {
  error: string;
  details?: ValidationError[];
}

export interface OverallStats {
  totalStores: number;
  totalProducts: number;
  totalStockUnits: number;
  totalInventoryValue: number;
}

export interface StoreStats {
  storeId: string;
  storeName: string;
  storeLocation: string;
  productCount: number;
  totalValue: number;
  totalStock: number;
  avgPrice: number;
}

export interface CategoryStats {
  category: string;
  productCount: number;
  totalValue: number;
  totalStock: number;
}

export interface DashboardData {
  overall: OverallStats;
  storeStats: StoreStats[];
  categoryStats: CategoryStats[];
}
