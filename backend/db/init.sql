-- Initialize the inventory database schema

-- Create stores table
CREATE TABLE IF NOT EXISTS stores (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY,
    store_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL CHECK (price > 0),
    quantity INTEGER NOT NULL CHECK (quantity >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE RESTRICT
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_products_store_id ON products(store_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_products_quantity ON products(quantity);

-- Insert sample data
INSERT INTO stores (id, name, location, created_at) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', 'Tech Central', 'San Francisco, CA', '2024-01-15T10:00:00.000Z'),
    ('550e8400-e29b-41d4-a716-446655440002', 'Downtown Electronics', 'New York, NY', '2024-02-01T14:30:00.000Z'),
    ('550e8400-e29b-41d4-a716-446655440003', 'Gadget World', 'Austin, TX', '2024-03-10T09:15:00.000Z')
ON CONFLICT (id) DO NOTHING;

INSERT INTO products (id, store_id, name, category, price, quantity, created_at, updated_at) VALUES
    ('650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Laptop Pro 15', 'Electronics', 1299.99, 15, '2024-01-20T10:00:00.000Z', '2024-01-20T10:00:00.000Z'),
    ('650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'Wireless Mouse', 'Accessories', 29.99, 50, '2024-01-20T10:05:00.000Z', '2024-01-20T10:05:00.000Z'),
    ('650e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', 'USB-C Cable', 'Accessories', 12.99, 100, '2024-01-20T10:10:00.000Z', '2024-01-20T10:10:00.000Z'),
    ('650e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002', 'Smartphone X12', 'Electronics', 899.99, 25, '2024-02-05T11:00:00.000Z', '2024-02-05T11:00:00.000Z'),
    ('650e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440002', 'Bluetooth Headphones', 'Audio', 149.99, 30, '2024-02-05T11:15:00.000Z', '2024-02-05T11:15:00.000Z'),
    ('650e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440002', 'Tablet 10-inch', 'Electronics', 399.99, 18, '2024-02-05T11:30:00.000Z', '2024-02-05T11:30:00.000Z'),
    ('650e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440003', 'Smart Watch', 'Wearables', 249.99, 12, '2024-03-12T09:00:00.000Z', '2024-03-12T09:00:00.000Z'),
    ('650e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440003', 'Portable Speaker', 'Audio', 79.99, 40, '2024-03-12T09:15:00.000Z', '2024-03-12T09:15:00.000Z'),
    ('650e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440003', 'Gaming Keyboard', 'Accessories', 119.99, 22, '2024-03-12T09:30:00.000Z', '2024-03-12T09:30:00.000Z'),
    ('650e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440003', 'External Hard Drive 1TB', 'Storage', 64.99, 35, '2024-03-12T09:45:00.000Z', '2024-03-12T09:45:00.000Z')
ON CONFLICT (id) DO NOTHING;
