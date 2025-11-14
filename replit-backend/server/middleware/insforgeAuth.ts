import { Request, Response, NextFunction } from 'express';
import { insforgeAuthService } from '../services/insforgeAuthService';

/**
 * Authentication middleware to verify JWT token
 */
export const insforgeAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    const userData = await insforgeAuthService.verifyToken(token);
    
    // Attach user data to request
    (req as any).user = userData.user;
    
    next();
  } catch (error: any) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

/**
 * Role-based access control middleware
 * @param roles - Array of roles that are allowed to access the route
 */
export const insforgeRequireRole = (roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const token = authHeader.substring(7); // Remove 'Bearer ' prefix
      
      const hasAccess = await insforgeAuthService.hasAnyRole(token, roles);
      
      if (!hasAccess) {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }
      
      // Attach user data to request
      const userData = await insforgeAuthService.verifyToken(token);
      (req as any).user = userData.user;
      
      next();
    } catch (error: any) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
  };
};

/**
 * Specific role middleware functions
 */
export const requireCitizen = insforgeRequireRole(['citizen']);
export const requireFieldWorker = insforgeRequireRole(['field-worker', 'district-officer', 'state-officer', 'national-admin']);
export const requireDistrictOfficer = insforgeRequireRole(['district-officer', 'state-officer', 'national-admin']);
export const requireStateOfficer = insforgeRequireRole(['state-officer', 'national-admin']);
export const requireNationalAdmin = insforgeRequireRole(['national-admin']);