import request from 'supertest';
import express, { Request, Response, NextFunction } from 'express';
import {
  errorHandler,
  AppError,
  NotFoundError,
  ValidationError,
  BadRequestError,
  InternalServerError,
  asyncHandler
} from '../src/middleware/errorHandler';

// Create a test app to test error handling
const createTestApp = () => {
  const app = express();
  app.use(express.json());

  // Test routes for different error types
  app.get('/test/not-found', asyncHandler(async (req: Request, res: Response) => {
    throw new NotFoundError('Resource not found');
  }));

  app.get('/test/validation', asyncHandler(async (req: Request, res: Response) => {
    throw new ValidationError('Validation failed');
  }));

  app.get('/test/bad-request', asyncHandler(async (req: Request, res: Response) => {
    throw new BadRequestError('Bad request');
  }));

  app.get('/test/internal-server', asyncHandler(async (req: Request, res: Response) => {
    throw new InternalServerError('Internal server error');
  }));

  app.get('/test/generic-error', asyncHandler(async (req: Request, res: Response) => {
    throw new Error('Generic error');
  }));

  app.get('/test/async-error', asyncHandler(async (req: Request, res: Response) => {
    await Promise.reject(new Error('Async error'));
  }));

  app.get('/test/custom-status', asyncHandler(async (req: Request, res: Response) => {
    throw new AppError('Custom error', 418);
  }));

  // Add error handler
  app.use(errorHandler);

  return app;
};

describe('Error Handler Middleware', () => {
  let testApp: express.Application;

  beforeEach(() => {
    testApp = createTestApp();
  });

  describe('Custom Error Classes', () => {
    it('should handle NotFoundError with 404 status', async () => {
      const response = await request(testApp)
        .get('/test/not-found')
        .expect(404);

      expect(response.body.error).toBe('Resource not found');
      expect(response.body.statusCode).toBe(404);
    });

    it('should handle ValidationError with 400 status', async () => {
      const response = await request(testApp)
        .get('/test/validation')
        .expect(400);

      expect(response.body.error).toBe('Validation failed');
      expect(response.body.statusCode).toBe(400);
    });

    it('should handle BadRequestError with 400 status', async () => {
      const response = await request(testApp)
        .get('/test/bad-request')
        .expect(400);

      expect(response.body.error).toBe('Bad request');
      expect(response.body.statusCode).toBe(400);
    });

    it('should handle InternalServerError with 500 status', async () => {
      const response = await request(testApp)
        .get('/test/internal-server')
        .expect(500);

      expect(response.body.error).toBe('Internal server error');
      expect(response.body.statusCode).toBe(500);
    });

    it('should handle custom AppError with custom status code', async () => {
      const response = await request(testApp)
        .get('/test/custom-status')
        .expect(418);

      expect(response.body.error).toBe('Custom error');
      expect(response.body.statusCode).toBe(418);
    });
  });

  describe('Generic Error Handling', () => {
    it('should handle generic Error with 500 status', async () => {
      const response = await request(testApp)
        .get('/test/generic-error')
        .expect(500);

      expect(response.body.error).toBe('Internal server error');
      expect(response.body.statusCode).toBe(500);
    });

    it('should handle async errors', async () => {
      const response = await request(testApp)
        .get('/test/async-error')
        .expect(500);

      expect(response.body.error).toBe('Internal server error');
      expect(response.body.statusCode).toBe(500);
    });
  });

  describe('Error Response Format', () => {
    it('should include stack trace in non-production mode', async () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      const response = await request(testApp)
        .get('/test/not-found')
        .expect(404);

      expect(response.body).toHaveProperty('stack');
      expect(response.body).toHaveProperty('details');

      process.env.NODE_ENV = originalEnv;
    });

    it('should not include stack trace in production mode', async () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      const response = await request(testApp)
        .get('/test/not-found')
        .expect(404);

      expect(response.body).not.toHaveProperty('stack');
      expect(response.body).not.toHaveProperty('details');

      process.env.NODE_ENV = originalEnv;
    });

    it('should always include error and statusCode', async () => {
      const response = await request(testApp)
        .get('/test/validation')
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('statusCode');
      expect(typeof response.body.error).toBe('string');
      expect(typeof response.body.statusCode).toBe('number');
    });
  });

  describe('AsyncHandler Wrapper', () => {
    it('should catch thrown errors in async handlers', async () => {
      await request(testApp)
        .get('/test/not-found')
        .expect(404);
    });

    it('should catch rejected promises in async handlers', async () => {
      await request(testApp)
        .get('/test/async-error')
        .expect(500);
    });
  });
});

describe('AppError Class', () => {
  it('should create error with message and status code', () => {
    const error = new AppError('Test error', 422);

    expect(error.message).toBe('Test error');
    expect(error.statusCode).toBe(422);
    expect(error.isOperational).toBe(true);
  });

  it('should have proper prototype chain', () => {
    const error = new AppError('Test error', 500);

    expect(error instanceof AppError).toBe(true);
    expect(error instanceof Error).toBe(true);
  });

  it('should capture stack trace', () => {
    const error = new AppError('Test error', 500);

    expect(error.stack).toBeDefined();
    expect(typeof error.stack).toBe('string');
  });
});

describe('Specific Error Classes', () => {
  it('NotFoundError should default to 404', () => {
    const error = new NotFoundError();
    expect(error.statusCode).toBe(404);
    expect(error.message).toBe('Resource not found');
  });

  it('NotFoundError should accept custom message', () => {
    const error = new NotFoundError('User not found');
    expect(error.statusCode).toBe(404);
    expect(error.message).toBe('User not found');
  });

  it('ValidationError should default to 400', () => {
    const error = new ValidationError();
    expect(error.statusCode).toBe(400);
    expect(error.message).toBe('Validation failed');
  });

  it('BadRequestError should default to 400', () => {
    const error = new BadRequestError();
    expect(error.statusCode).toBe(400);
    expect(error.message).toBe('Bad request');
  });

  it('InternalServerError should default to 500', () => {
    const error = new InternalServerError();
    expect(error.statusCode).toBe(500);
    expect(error.message).toBe('Internal server error');
  });
});
