# Inventory Management System

A full-stack inventory management system built with TypeScript, Node.js, Express, React, and Docker.

(there is an issue with focus loss on search inputs, but I hope it's not a big deal, did not get time to fix it)

## Run Instructions

**With Docker (Recommended):**
```bash
docker-compose up --build
```
- Frontend: http://localhost
- Backend API: http://localhost:3001/api

**Local Development:**
```bash
# Backend
cd backend && npm install && npm run dev

# Frontend (in separate terminal)
cd frontend && npm install && npm run dev
```

**Run Tests:**
```bash
cd backend && npm test
```

## API Sketch

```
GET    /api/dashboard                 - Get dashboard statistics
POST   /api/stores                    - Create store
GET    /api/stores/:id                - Get store by ID
PUT    /api/stores/:id                - Update store
DELETE /api/stores/:id                - Delete store (if no products)
GET    /api/stores/:storeId/products  - Get products by store
POST   /api/products                  - Create product
GET    /api/products?category=X&minPrice=Y&page=1&limit=10  - List/filter products
PUT    /api/products/:id              - Update product
DELETE /api/products/:id              - Delete product
```

## Decisions & Trade-offs

**Architecture:**
- **PostgreSQL with Sequelize ORM** - Provides ACID guarantees, relational data integrity, and production-ready persistence. Sequelize-TypeScript offers type safety and model decorators. Trade-off: requires database setup vs. simpler file-based storage.
- **Monolithic structure** with separate frontend/backend - Clear separation of concerns, easy to dockerize, but could be split into microservices for larger scale.

**Data Model:**
- **One-to-many relationship** (Store → Products) enforced at application level - Products require a valid store, stores can't be deleted if they have products. Trade-off: data integrity vs. flexibility.
- **UUID-based IDs** - Prevents enumeration attacks and easier distributed systems support vs. slightly larger storage footprint.

**API Design:**
- **RESTful with query params for filtering** - Standard, widely understood, but complex filters can get verbose. Alternative: GraphQL would allow more flexible queries but adds complexity.
- **Pagination required on products** - Prevents large payloads, but requires clients to handle pagination logic.

**Technology Choices:**
- **TypeScript throughout** - Type safety catches errors early, better IDE support, but adds build step and slight learning curve.
- **Express over newer frameworks** - Battle-tested, simple, large ecosystem, but less modern than Fastify/Hono.
- **Docker Compose** - Easy local development and deployment, but Kubernetes would be needed for production orchestration.

**Frontend:**
- **React with hooks** - Component-based, widely adopted, but could be lighter with Preact or vanilla JS.
- **Axios for HTTP** - Familiar API, interceptor support, but fetch API is now sufficient for most use cases.

## If I Had More Time
- **Authentication & authorization** - Add JWT-based auth, role-based access control (admin/viewer), and per-store permissions with session management
- **Enhanced filtering & search** - Full-text search with PostgreSQL FTS, sorting options, multiple category filtering, and saved filter presets
- **Caching layer** - Implement Redis for frequently accessed data (product catalogs, store lists) to reduce database load and improve response times
- **Model normalization** - enhance current data mode to many-to-many relationships
- **Deployment** - Add Kubernetes deployment files and Helm chart
