import { Router, Request, Response } from 'express';
import * as StoreModel from '../repositories/Store';
import { validateCreateStore, validateUpdateStore } from '../utils/validation';
import { asyncHandler, NotFoundError, ValidationError, BadRequestError } from '../middleware/errorHandler';

const router = Router();

// GET /api/stores - List all stores
router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const stores = await StoreModel.findAllStores();
  res.json(stores);
}));

// GET /api/stores/:id - Get store by ID
router.get('/:id', asyncHandler(async (req: Request, res: Response) => {
  const store = await StoreModel.findStoreById(req.params.id);
  if (!store) {
    throw new NotFoundError('Store not found');
  }
  res.json(store);
}));

// POST /api/stores - Create new store
router.post('/', asyncHandler(async (req: Request, res: Response) => {
  const validationErrors = validateCreateStore(req.body);
  if (validationErrors.length > 0) {
    throw new ValidationError('Validation failed');
  }

  const newStore = await StoreModel.createStore(req.body);
  res.status(201).json(newStore);
}));

// PUT /api/stores/:id - Update store
router.put('/:id', asyncHandler(async (req: Request, res: Response) => {
  const validationErrors = validateUpdateStore(req.body);
  if (validationErrors.length > 0) {
    throw new ValidationError('Validation failed');
  }

  const updatedStore = await StoreModel.updateStore(req.params.id, req.body);
  if (!updatedStore) {
    throw new NotFoundError('Store not found');
  }
  res.json(updatedStore);
}));

// DELETE /api/stores/:id - Delete store
router.delete('/:id', asyncHandler(async (req: Request, res: Response) => {
  const deleted = await StoreModel.deleteStore(req.params.id);
  if (!deleted) {
    throw new NotFoundError('Store not found');
  }
  res.status(204).send();
}));

export default router;
