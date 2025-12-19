import { Router, Request, Response } from 'express';
import * as DashboardModel from '../repositories/Dashboard';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// GET /api/dashboard - Get dashboard statistics
router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const dashboardData = await DashboardModel.getDashboardStats();
  res.json(dashboardData);
}));

export default router;
