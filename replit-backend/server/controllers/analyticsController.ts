import type { Response } from 'express';
import type { AuthRequest } from '../middleware/auth';
import { analyticsService } from '../services/analyticsService';

export class AnalyticsController {
  async getAnalytics(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const useDummy = req.query.dummy === 'true';

      let analytics;
      if (useDummy) {
        analytics = await analyticsService.getDummyAnalytics();
      } else {
        analytics = await analyticsService.getAnalytics(req.user.id);
      }

      res.json({
        message: 'Analytics retrieved successfully',
        data: analytics,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to fetch analytics' });
    }
  }
}

export const analyticsController = new AnalyticsController();
