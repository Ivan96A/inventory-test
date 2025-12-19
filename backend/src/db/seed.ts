import 'reflect-metadata';
import { sequelize } from './config';
import { StoreEntity } from '../models/StoreEntity';
import { ProductEntity } from '../models/ProductEntity';

const seed = async () => {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();

    console.log('Syncing database schema...');
    await sequelize.sync({ force: true }); // Drops existing tables and recreates them

    console.log('Seeding stores...');
    const stores = await StoreEntity.bulkCreate([
      {
        id: '550e8400-e29b-41d4-a716-446655440001',
        name: 'Tech Central',
        location: 'San Francisco, CA',
        createdAt: new Date('2024-01-15T10:00:00.000Z')
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440002',
        name: 'Downtown Electronics',
        location: 'New York, NY',
        createdAt: new Date('2024-02-01T14:30:00.000Z')
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440003',
        name: 'Gadget World',
        location: 'Austin, TX',
        createdAt: new Date('2024-03-10T09:15:00.000Z')
      }
    ]);

    console.log(`Created ${stores.length} stores`);

    console.log('Seeding products...');
    const products = await ProductEntity.bulkCreate([
      {
        id: '650e8400-e29b-41d4-a716-446655440001',
        storeId: '550e8400-e29b-41d4-a716-446655440001',
        name: 'Laptop Pro 15',
        category: 'Electronics',
        price: 1299.99,
        quantity: 15,
        createdAt: new Date('2024-01-20T10:00:00.000Z'),
        updatedAt: new Date('2024-01-20T10:00:00.000Z')
      },
      {
        id: '650e8400-e29b-41d4-a716-446655440002',
        storeId: '550e8400-e29b-41d4-a716-446655440001',
        name: 'Wireless Mouse',
        category: 'Accessories',
        price: 29.99,
        quantity: 50,
        createdAt: new Date('2024-01-20T10:05:00.000Z'),
        updatedAt: new Date('2024-01-20T10:05:00.000Z')
      },
      {
        id: '650e8400-e29b-41d4-a716-446655440003',
        storeId: '550e8400-e29b-41d4-a716-446655440001',
        name: 'USB-C Cable',
        category: 'Accessories',
        price: 12.99,
        quantity: 100,
        createdAt: new Date('2024-01-20T10:10:00.000Z'),
        updatedAt: new Date('2024-01-20T10:10:00.000Z')
      },
      {
        id: '650e8400-e29b-41d4-a716-446655440004',
        storeId: '550e8400-e29b-41d4-a716-446655440002',
        name: 'Smartphone X12',
        category: 'Electronics',
        price: 899.99,
        quantity: 25,
        createdAt: new Date('2024-02-05T11:00:00.000Z'),
        updatedAt: new Date('2024-02-05T11:00:00.000Z')
      },
      {
        id: '650e8400-e29b-41d4-a716-446655440005',
        storeId: '550e8400-e29b-41d4-a716-446655440002',
        name: 'Bluetooth Headphones',
        category: 'Audio',
        price: 149.99,
        quantity: 30,
        createdAt: new Date('2024-02-05T11:15:00.000Z'),
        updatedAt: new Date('2024-02-05T11:15:00.000Z')
      },
      {
        id: '650e8400-e29b-41d4-a716-446655440006',
        storeId: '550e8400-e29b-41d4-a716-446655440002',
        name: 'Tablet 10-inch',
        category: 'Electronics',
        price: 399.99,
        quantity: 18,
        createdAt: new Date('2024-02-05T11:30:00.000Z'),
        updatedAt: new Date('2024-02-05T11:30:00.000Z')
      },
      {
        id: '650e8400-e29b-41d4-a716-446655440007',
        storeId: '550e8400-e29b-41d4-a716-446655440003',
        name: 'Smart Watch',
        category: 'Wearables',
        price: 249.99,
        quantity: 12,
        createdAt: new Date('2024-03-12T09:00:00.000Z'),
        updatedAt: new Date('2024-03-12T09:00:00.000Z')
      },
      {
        id: '650e8400-e29b-41d4-a716-446655440008',
        storeId: '550e8400-e29b-41d4-a716-446655440003',
        name: 'Portable Speaker',
        category: 'Audio',
        price: 79.99,
        quantity: 40,
        createdAt: new Date('2024-03-12T09:15:00.000Z'),
        updatedAt: new Date('2024-03-12T09:15:00.000Z')
      },
      {
        id: '650e8400-e29b-41d4-a716-446655440009',
        storeId: '550e8400-e29b-41d4-a716-446655440003',
        name: 'Gaming Keyboard',
        category: 'Accessories',
        price: 119.99,
        quantity: 22,
        createdAt: new Date('2024-03-12T09:30:00.000Z'),
        updatedAt: new Date('2024-03-12T09:30:00.000Z')
      },
      {
        id: '650e8400-e29b-41d4-a716-446655440010',
        storeId: '550e8400-e29b-41d4-a716-446655440003',
        name: 'External Hard Drive 1TB',
        category: 'Storage',
        price: 64.99,
        quantity: 35,
        createdAt: new Date('2024-03-12T09:45:00.000Z'),
        updatedAt: new Date('2024-03-12T09:45:00.000Z')
      }
    ]);

    console.log(`Created ${products.length} products`);
    console.log('Database seeding completed successfully!');

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seed();
