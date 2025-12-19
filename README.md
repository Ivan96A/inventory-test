# Inventory Management System

A full-stack inventory management system built with TypeScript, Node.js, Express, React, and Docker.

## Features

- **Store Management**: Create, read, update, and delete stores
- **Product Management**: Manage products with detailed information
- **Advanced Filtering**: Filter products by category, price range, and stock level
- **Pagination**: Browse products with pagination support
- **Store-Product Relationship**: Associate products with specific stores
- **Responsive UI**: Clean and modern web interface
- **Automated Tests**: Comprehensive unit tests for backend API
- **Docker Support**: Easy deployment with Docker Compose

## Tech Stack

### Backend
- Node.js + TypeScript
- Express.js
- JSON file storage
- Jest + Supertest for testing

### Frontend
- React 18 + TypeScript
- Vite
- Axios for API calls
- CSS3 for styling

### DevOps
- Docker
- Docker Compose
- Nginx (for serving frontend)

## Project Structure

```
inventory-test/
├── backend/
│   ├── src/
│   │   ├── server.ts          # Express server
│   │   ├── types/             # TypeScript interfaces
│   │   ├── models/            # Business logic (Store, Product)
│   │   ├── routes/            # API routes
│   │   └── utils/             # Storage and validation utilities
│   ├── tests/                 # Unit tests
│   ├── data/                  # JSON database file
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── App.tsx            # Main app component
│   │   ├── components/        # React components
│   │   ├── api/               # API client
│   │   └── types/             # TypeScript interfaces
│   ├── nginx.conf             # Nginx configuration
│   └── Dockerfile
└── docker-compose.yml         # Multi-container orchestration
```

## Getting Started

### Prerequisites

- Docker and Docker Compose installed
- OR Node.js 18+ and npm (for local development)

### Running with Docker (Recommended)

1. Clone the repository
2. Navigate to the project directory
3. Build and start the services:

```bash
docker-compose up --build
```

4. Access the application:
   - Frontend: http://localhost
   - Backend API: http://localhost:3001/api

5. To stop the services:

```bash
docker-compose down
```

### Running Locally (Development)

#### Backend

```bash
cd backend
npm install
npm run dev          # Start development server
npm test            # Run tests
npm run build       # Build for production
```

#### Frontend

```bash
cd frontend
npm install
npm run dev         # Start development server
npm run build       # Build for production
```

## API Documentation

### Base URL
```
http://localhost:3001/api
```

### Stores

#### Get All Stores
```
GET /stores
```

#### Get Store by ID
```
GET /stores/:id
```

#### Create Store
```
POST /stores
Content-Type: application/json

{
  "name": "Store Name",
  "location": "Store Location"
}
```

#### Update Store
```
PUT /stores/:id
Content-Type: application/json

{
  "name": "Updated Name",
  "location": "Updated Location"
}
```

#### Delete Store
```
DELETE /stores/:id
```

Note: Cannot delete a store with existing products.

#### Get Products by Store
```
GET /stores/:storeId/products
```

### Products

#### Get All Products (with Filtering & Pagination)
```
GET /products?category=Electronics&minPrice=10&maxPrice=100&page=1&limit=10
```

Query Parameters:
- `category` - Filter by category (exact match)
- `minPrice` - Minimum price
- `maxPrice` - Maximum price
- `minStock` - Minimum stock quantity
- `maxStock` - Maximum stock quantity
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

#### Get Product by ID
```
GET /products/:id
```

#### Create Product
```
POST /products
Content-Type: application/json

{
  "storeId": "store-uuid",
  "name": "Product Name",
  "category": "Category",
  "price": 99.99,
  "quantity": 10
}
```

#### Update Product
```
PUT /products/:id
Content-Type: application/json

{
  "name": "Updated Name",
  "price": 149.99,
  "quantity": 5
}
```

#### Delete Product
```
DELETE /products/:id
```

## Testing

Run backend tests:

```bash
cd backend
npm test              # Run all tests
npm run test:watch    # Run tests in watch mode
```

Test coverage includes:
- Store CRUD operations
- Product CRUD operations
- Filtering and pagination
- Validation
- Error handling

## Data Persistence

Data is stored in `backend/data/db.json` and persists across container restarts through Docker volume mounting.

## Example curl Commands

### Create a Store
```bash
curl -X POST http://localhost:3001/api/stores \
  -H "Content-Type: application/json" \
  -d '{"name":"Tech Store","location":"San Francisco"}'
```

### Create a Product
```bash
curl -X POST http://localhost:3001/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "storeId":"store-id-here",
    "name":"Laptop",
    "category":"Electronics",
    "price":999.99,
    "quantity":5
  }'
```

### Get Products with Filters
```bash
curl "http://localhost:3001/api/products?category=Electronics&minPrice=500&page=1&limit=10"
```

## Development

### Backend Development
- TypeScript files are in `backend/src/`
- Hot reload with `npm run dev`
- Tests are in `backend/tests/`

### Frontend Development
- React components are in `frontend/src/components/`
- API client is in `frontend/src/api/client.ts`
- Hot reload with Vite

## Troubleshooting

### Port Already in Use
If port 80 or 3001 is already in use, modify the port mappings in `docker-compose.yml`:

```yaml
services:
  backend:
    ports:
      - "3002:3001"  # Change 3001 to 3002
  frontend:
    ports:
      - "8080:80"     # Change 80 to 8080
```

### Data Not Persisting
Ensure the `backend/data` directory has write permissions:

```bash
chmod -R 755 backend/data
```

## License

MIT
