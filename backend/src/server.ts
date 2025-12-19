import 'reflect-metadata';
import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { connectDatabase } from './db/config';
import storesRouter from './routes/stores';
import productsRouter from './routes/products';
import dashboardRouter from './routes/dashboard';
import * as ProductModel from './repositories/Product';
import { errorHandler, NotFoundError, asyncHandler } from './middleware/errorHandler';

const app: Application = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/dashboard', dashboardRouter);
app.use('/api/stores', storesRouter);
app.use('/api/products', productsRouter);

// Additional route: GET /api/stores/:storeId/products
app.get('/api/stores/:storeId/products', asyncHandler(async (req: Request, res: Response) => {
  const products = await ProductModel.findProductsByStoreId(req.params.storeId);
  res.json(products);
}));

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

// 404 handler - must be before error handler
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundError('Route not found'));
});

// Centralized error handling middleware - must be last
app.use(errorHandler);

// Start server with database connection
const startServer = async () => {
  try {
    await connectDatabase();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
