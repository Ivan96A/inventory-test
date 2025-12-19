import { Router, Request, Response } from 'express';
import * as ProductModel from '../repositories/Product';
import * as StoreModel from '../repositories/Store';
import { validateCreateProduct, validateUpdateProduct } from '../utils/validation';
import { ProductFilterOptions, PaginationOptions } from '../types';
import { asyncHandler, NotFoundError, ValidationError, BadRequestError } from '../middleware/errorHandler';

const router = Router();

// GET /api/products - List all products with filtering and pagination
router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const filters: ProductFilterOptions = {};
  const pagination: PaginationOptions | undefined = req.query.page || req.query.limit
    ? {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10
      }
    : undefined;

  if (req.query.category) filters.category = req.query.category as string;
  if (req.query.minPrice) filters.minPrice = parseFloat(req.query.minPrice as string);
  if (req.query.maxPrice) filters.maxPrice = parseFloat(req.query.maxPrice as string);
  if (req.query.minStock) filters.minStock = parseInt(req.query.minStock as string);
  if (req.query.maxStock) filters.maxStock = parseInt(req.query.maxStock as string);
  if (req.query.storeId) filters.storeId = req.query.storeId as string;

  const result = await ProductModel.findAllProducts(filters, pagination);
  res.json(result);
}));

// GET /api/products/:id - Get product by ID
router.get('/:id', asyncHandler(async (req: Request, res: Response) => {
  const product = await ProductModel.findProductById(req.params.id);
  if (!product) {
    throw new NotFoundError('Product not found');
  }
  res.json(product);
}));

// POST /api/products - Create new product
router.post('/', asyncHandler(async (req: Request, res: Response) => {
  const validationErrors = validateCreateProduct(req.body);
  if (validationErrors.length > 0) {
    throw new ValidationError('Validation failed');
  }

  // Check if store exists
  const store = await StoreModel.findStoreById(req.body.storeId);
  if (!store) {
    throw new BadRequestError('Store does not exist');
  }

  const newProduct = await ProductModel.createProduct(req.body);
  res.status(201).json(newProduct);
}));

// PUT /api/products/:id - Update product
router.put('/:id', asyncHandler(async (req: Request, res: Response) => {
  const validationErrors = validateUpdateProduct(req.body);
  if (validationErrors.length > 0) {
    throw new ValidationError('Validation failed');
  }

  // Check if store exists if storeId is being updated
  if (req.body.storeId) {
    const store = await StoreModel.findStoreById(req.body.storeId);
    if (!store) {
      throw new BadRequestError('Store does not exist');
    }
  }

  const updatedProduct = await ProductModel.updateProduct(req.params.id, req.body);
  if (!updatedProduct) {
    throw new NotFoundError('Product not found');
  }
  res.json(updatedProduct);
}));

// DELETE /api/products/:id - Delete product
router.delete('/:id', asyncHandler(async (req: Request, res: Response) => {
  const deleted = await ProductModel.deleteProduct(req.params.id);
  if (!deleted) {
    throw new NotFoundError('Product not found');
  }
  res.status(204).send();
}));

export default router;
