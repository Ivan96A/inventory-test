import { ProductEntity } from '../models/ProductEntity';
import { StoreEntity } from '../models/StoreEntity';
import { sequelize } from '../db/config';
import { QueryTypes } from 'sequelize';

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

export const getDashboardStats = async (): Promise<DashboardData> => {
  // Overall statistics
  const totalStores = await StoreEntity.count();
  const totalProducts = await ProductEntity.count();

  const inventoryAggregates = await ProductEntity.findAll({
    attributes: [
      [sequelize.fn('SUM', sequelize.col('quantity')), 'totalStock'],
      [sequelize.fn('SUM', sequelize.literal('price * quantity')), 'totalValue']
    ],
    raw: true
  });

    const overall: OverallStats = {
    totalStores,
    totalProducts,
        // @ts-ignore
    totalStockUnits: parseInt(inventoryAggregates[0]['totalStock'] || '0'),
        // @ts-ignore
    totalInventoryValue: parseFloat(inventoryAggregates[0]['totalValue'] || '0')
  };

  // Store-wise statistics
  const storeStatsRaw = await sequelize.query(`
    SELECT
      s.id as "storeId",
      s.name as "storeName",
      s.location as "storeLocation",
      COUNT(p.id)::int as "productCount",
      COALESCE(SUM(p.price * p.quantity), 0)::float as "totalValue",
      COALESCE(SUM(p.quantity), 0)::int as "totalStock",
      COALESCE(AVG(p.price), 0)::float as "avgPrice"
    FROM stores s
    LEFT JOIN products p ON s.id = p.store_id
    GROUP BY s.id, s.name, s.location
    ORDER BY "totalValue" DESC
  `, { type: QueryTypes.SELECT });

  const storeStats: StoreStats[] = storeStatsRaw as StoreStats[];

  // Category-wise statistics
  const categoryStatsRaw = await sequelize.query(`
    SELECT
      category,
      COUNT(id)::int as "productCount",
      SUM(price * quantity)::float as "totalValue",
      SUM(quantity)::int as "totalStock"
    FROM products
    GROUP BY category
    ORDER BY "totalValue" DESC
  `, { type: QueryTypes.SELECT });

  const categoryStats: CategoryStats[] = categoryStatsRaw as CategoryStats[];

  return {
    overall,
    storeStats,
    categoryStats
  };
};
