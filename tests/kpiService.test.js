/**
 * Test suite for KPI Service
 */

const KPIService = require('../services/kpi/kpiService');

// Mock database
const mockDb = {
  query: jest.fn().mockResolvedValue({ rows: [] })
};

describe('KPIService', () => {
  let kpiService;

  beforeEach(() => {
    kpiService = new KPIService(mockDb);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('calculateCRR', () => {
    it('should calculate CRR correctly', async () => {
      // Mock database response
      mockDb.query.mockResolvedValueOnce({
        rows: [{
          resolved_within_sla: 85,
          total_assigned: 100
        }]
      });

      const result = await kpiService.calculateCRR('officer123', '2023-01-01');
      
      expect(result).toBe(85);
      expect(mockDb.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT'),
        ['officer123', '2023-01-01']
      );
    });
  });

  describe('calculateART', () => {
    it('should calculate ART correctly', async () => {
      // Mock database response with resolution times
      mockDb.query.mockResolvedValueOnce({
        rows: [
          { resolution_time_seconds: 3600 }, // 1 hour
          { resolution_time_seconds: 7200 }, // 2 hours
          { resolution_time_seconds: 10800 } // 3 hours
        ]
      });

      const result = await kpiService.calculateART('officer123', '2023-01-01');
      
      // Average of 1, 2, 3 hours = 2 hours = 7200 seconds
      expect(result).toBe(7200);
    });
  });
});
