import { Product, CreateProductInput, UpdateProductInput, ProductFilterOptions, PaginationOptions, PaginatedResponse } from '../types';
import { ProductEntity } from '../models/ProductEntity';
import { Op } from 'sequelize';

export const createProduct = async (input: CreateProductInput): Promise<Product> => {
  const product = await ProductEntity.create({
    storeId: input.storeId,
    name: input.name,
    category: input.category,
    price: input.price,
    quantity: input.quantity,
    createAt: new Date(),
    updatedAt: new Date()
  });

  return {
    id: product.id,
    storeId: product.storeId,
    name: product.name,
    category: product.category,
    price: parseFloat(product.price.toString()),
    quantity: product.quantity,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString()
  };
};

export const findAllProducts = async (
  filters?: ProductFilterOptions,
  pagination?: PaginationOptions
): Promise<PaginatedResponse<Product> | Product[]> => {
  // Build where clause
  const where: any = {};

  if (filters) {
    if (filters.category) {
      where.category = { [Op.iLike]: `${filters.category}%` };
    }
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      where.price = {};
      if (filters.minPrice !== undefined) where.price[Op.gte] = filters.minPrice;
      if (filters.maxPrice !== undefined) where.price[Op.lte] = filters.maxPrice;
    }
    if (filters.minStock !== undefined || filters.maxStock !== undefined) {
      where.quantity = {};
      if (filters.minStock !== undefined) where.quantity[Op.gte] = filters.minStock;
      if (filters.maxStock !== undefined) where.quantity[Op.lte] = filters.maxStock;
    }
    if (filters.storeId) {
      where.storeId = filters.storeId;
    }
  }

  if (pagination) {
    const offset = (pagination.page - 1) * pagination.limit;

    const { count, rows } = await ProductEntity.findAndCountAll({
      where,
      limit: pagination.limit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    return {
      data: rows.map(product => ({
        id: product.id,
        storeId: product.storeId,
        name: product.name,
        category: product.category,
        price: parseFloat(product.price.toString()),
        quantity: product.quantity,
        createdAt: product.createdAt.toISOString(),
        updatedAt: product.updatedAt.toISOString()
      })),
      page: pagination.page,
      limit: pagination.limit,
      total: count,
      totalPages: Math.ceil(count / pagination.limit)
    };
  }

  // No pagination
  const products = await ProductEntity.findAll({
    where,
    order: [['createdAt', 'DESC']]
  });

  return products.map(product => ({
    id: product.id,
    storeId: product.storeId,
    name: product.name,
    category: product.category,
    price: parseFloat(product.price.toString()),
    quantity: product.quantity,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString()
  }));
};

export const findProductById = async (id: string): Promise<Product | undefined> => {
  const product = await ProductEntity.findByPk(id);

  if (!product) {
    return undefined;
  }

  return {
    id: product.id,
    storeId: product.storeId,
    name: product.name,
    category: product.category,
    price: parseFloat(product.price.toString()),
    quantity: product.quantity,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString()
  };
};

export const findProductsByStoreId = async (storeId: string): Promise<Product[]> => {
  const products = await ProductEntity.findAll({
    where: { storeId },
    order: [['createdAt', 'DESC']]
  });

  return products.map(product => ({
    id: product.id,
    storeId: product.storeId,
    name: product.name,
    category: product.category,
    price: parseFloat(product.price.toString()),
    quantity: product.quantity,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString()
  }));
};

export const updateProduct = async (id: string, input: UpdateProductInput): Promise<Product | null> => {
  const product = await ProductEntity.findByPk(id);

  if (!product) {
    return null;
  }

  if (input.storeId !== undefined) product.storeId = input.storeId;
  if (input.name !== undefined) product.name = input.name;
  if (input.category !== undefined) product.category = input.category;
  if (input.price !== undefined) product.price = input.price;
  if (input.quantity !== undefined) product.quantity = input.quantity;

  await product.save();

  return {
    id: product.id,
    storeId: product.storeId,
    name: product.name,
    category: product.category,
    price: parseFloat(product.price.toString()),
    quantity: product.quantity,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString()
  };
};

export const deleteProduct = async (id: string): Promise<boolean> => {
  const product = await ProductEntity.findByPk(id);

  if (!product) {
    return false;
  }

  await product.destroy();
  return true;
};
