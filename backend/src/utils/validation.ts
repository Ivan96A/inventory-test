import { CreateStoreInput, UpdateStoreInput, CreateProductInput, UpdateProductInput, ValidationError } from '../types';

export const validateCreateStore = (input: any): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!input.name || typeof input.name !== 'string' || input.name.trim() === '') {
    errors.push({ field: 'name', message: 'Name is required and must be a non-empty string' });
  }

  if (!input.location || typeof input.location !== 'string' || input.location.trim() === '') {
    errors.push({ field: 'location', message: 'Location is required and must be a non-empty string' });
  }

  return errors;
};

export const validateUpdateStore = (input: any): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (input.name !== undefined) {
    if (typeof input.name !== 'string' || input.name.trim() === '') {
      errors.push({ field: 'name', message: 'Name must be a non-empty string' });
    }
  }

  if (input.location !== undefined) {
    if (typeof input.location !== 'string' || input.location.trim() === '') {
      errors.push({ field: 'location', message: 'Location must be a non-empty string' });
    }
  }

  return errors;
};

export const validateCreateProduct = (input: any): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!input.storeId || typeof input.storeId !== 'string' || input.storeId.trim() === '') {
    errors.push({ field: 'storeId', message: 'Store ID is required and must be a non-empty string' });
  }

  if (!input.name || typeof input.name !== 'string' || input.name.trim() === '') {
    errors.push({ field: 'name', message: 'Name is required and must be a non-empty string' });
  }

  if (!input.category || typeof input.category !== 'string' || input.category.trim() === '') {
    errors.push({ field: 'category', message: 'Category is required and must be a non-empty string' });
  }

  if (input.price === undefined || typeof input.price !== 'number' || input.price <= 0) {
    errors.push({ field: 'price', message: 'Price is required and must be a positive number' });
  }

  if (input.quantity === undefined || typeof input.quantity !== 'number' || input.quantity < 0) {
    errors.push({ field: 'quantity', message: 'Quantity is required and must be a non-negative number' });
  }

  return errors;
};

export const validateUpdateProduct = (input: any): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (input.storeId !== undefined) {
    if (typeof input.storeId !== 'string' || input.storeId.trim() === '') {
      errors.push({ field: 'storeId', message: 'Store ID must be a non-empty string' });
    }
  }

  if (input.name !== undefined) {
    if (typeof input.name !== 'string' || input.name.trim() === '') {
      errors.push({ field: 'name', message: 'Name must be a non-empty string' });
    }
  }

  if (input.category !== undefined) {
    if (typeof input.category !== 'string' || input.category.trim() === '') {
      errors.push({ field: 'category', message: 'Category must be a non-empty string' });
    }
  }

  if (input.price !== undefined) {
    if (typeof input.price !== 'number' || input.price <= 0) {
      errors.push({ field: 'price', message: 'Price must be a positive number' });
    }
  }

  if (input.quantity !== undefined) {
    if (typeof input.quantity !== 'number' || input.quantity < 0) {
      errors.push({ field: 'quantity', message: 'Quantity must be a non-negative number' });
    }
  }

  return errors;
};
