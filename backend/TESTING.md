# Testing Guide

## Quick Start

### 1. Setup Test Database

First, create the test database:

```bash
npm run test:setup
```

This will create the `inventory_test_db` database and grant necessary privileges.

### 2. Run Tests

```bash
npm test
```

That's it! The tests will:
- Connect to the test database
- Create all necessary tables
- Run all test suites
- Clean up after completion

## Important Notes

### Separate Test Database

✅ **Tests use a completely separate database** (`inventory_test_db`)
✅ **Your production data is never touched**
✅ **Test database is automatically cleaned up after tests**

### Test Isolation

Each test file:
- Creates its own Express app instance
- Uses the test database configuration
- Clears data before each test
- Is completely isolated from other tests

## Running Specific Tests

### Run specific test file
```bash
npm test dashboard.test.ts
```

### Run tests in watch mode
```bash
npm run test:watch
```

### Run with verbose output
```bash
npm test -- --verbose
```

### Skip coverage report
```bash
npm test -- --coverage=false
```

## Test Files

- `dashboard.test.ts` - Dashboard API aggregate queries (8 tests)
- `errorHandler.test.ts` - Error handling middleware (15 tests)
- `productFiltering.test.ts` - Product filtering by store (12 tests)

**Total: 35 test cases**

## Troubleshooting

### "Cannot connect to database"

Make sure PostgreSQL is running and the test database exists:
```bash
# Check if PostgreSQL is running
pg_isready

# Create test database manually if needed
psql -U inventory_user -d postgres -c "CREATE DATABASE inventory_test_db;"
```

### "Permission denied"

Grant privileges to your database user:
```bash
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE inventory_test_db TO inventory_user;"
```

### Tests timeout

Increase timeout in `tests/setup.ts` (default is 30 seconds):
```typescript
jest.setTimeout(60000); // 60 seconds
```

### Docker Setup

If using Docker, ensure the PostgreSQL container is running:
```bash
docker-compose up -d postgres
```

Then create the test database:
```bash
docker exec -it inventory-postgres psql -U inventory_user -d postgres -c "CREATE DATABASE inventory_test_db;"
```

## Environment Variables

You can customize test database settings:

```bash
export TEST_DB_NAME=inventory_test_db
export TEST_DB_HOST=localhost
export TEST_DB_PORT=5432
export TEST_DB_USER=inventory_user
export TEST_DB_PASSWORD=inventory_pass
```

Or create a `.env.test` file in the backend directory.

## CI/CD Integration

For continuous integration:

```yaml
# .github/workflows/test.yml
- name: Setup PostgreSQL
  uses: harmon758/postgresql-action@v1
  with:
    postgresql version: '15'
    postgresql db: inventory_test_db
    postgresql user: inventory_user
    postgresql password: inventory_pass

- name: Run tests
  run: |
    npm install
    npm test
  env:
    TEST_DB_HOST: localhost
    TEST_DB_PORT: 5432
```

## Coverage Reports

Coverage reports are generated in the `coverage/` directory:
- `coverage/lcov-report/index.html` - HTML coverage report
- `coverage/coverage-summary.json` - JSON summary

Open the HTML report:
```bash
open coverage/lcov-report/index.html
```

## Writing New Tests

See `tests/README.md` for detailed documentation on writing new tests.

Quick example:
```typescript
import request from 'supertest';
import express from 'express';
import { testSequelize } from '../src/db/testConfig';

describe('My Feature Tests', () => {
  let app: express.Application;

  beforeAll(async () => {
    await testSequelize.sync({ force: true });
    app = createTestApp();
  });

  beforeEach(async () => {
    // Clear test data
  });

  it('should do something', async () => {
    const response = await request(app)
      .get('/api/endpoint')
      .expect(200);

    expect(response.body).toBeDefined();
  });
});
```
