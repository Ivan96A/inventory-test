import { Store, CreateStoreInput, UpdateStoreInput } from '../types';
import { StoreEntity } from '../models/StoreEntity';
import { ProductEntity } from '../models/ProductEntity';

export const createStore = async (input: CreateStoreInput): Promise<Store> => {
  const store = await StoreEntity.create({
    name: input.name,
    location: input.location,
    createdAt: new Date()
  });

  return {
    id: store.id,
    name: store.name,
    location: store.location,
    createdAt: store.createdAt.toISOString()
  };
};

export const findAllStores = async (): Promise<Store[]> => {
  const stores = await StoreEntity.findAll({
    order: [['createdAt', 'DESC']]
  });

  return stores.map(store => ({
    id: store.id,
    name: store.name,
    location: store.location,
    createdAt: store.createdAt.toISOString()
  }));
};

export const findStoreById = async (id: string): Promise<Store | undefined> => {
  const store = await StoreEntity.findByPk(id);

  if (!store) {
    return undefined;
  }

  return {
    id: store.id,
    name: store.name,
    location: store.location,
    createdAt: store.createdAt.toISOString()
  };
};

export const updateStore = async (id: string, input: UpdateStoreInput): Promise<Store | null> => {
  const store = await StoreEntity.findByPk(id);

  if (!store) {
    return null;
  }

  if (input.name !== undefined) {
    store.name = input.name;
  }
  if (input.location !== undefined) {
    store.location = input.location;
  }

  await store.save();

  return {
    id: store.id,
    name: store.name,
    location: store.location,
    createdAt: store.createdAt.toISOString()
  };
};

export const deleteStore = async (id: string): Promise<boolean> => {
  const store = await StoreEntity.findByPk(id);

  if (!store) {
    return false;
  }

  // Check if store has products
  const productCount = await ProductEntity.count({ where: { storeId: id } });

  if (productCount > 0) {
    throw new Error('Cannot delete store with existing products');
  }

  await store.destroy();
  return true;
};
