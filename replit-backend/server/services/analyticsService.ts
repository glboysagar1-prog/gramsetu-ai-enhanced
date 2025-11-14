import { storage } from '../storage';
import type { Analytics } from '@shared/schema';

export class AnalyticsService {
  async getAnalytics(userId: string): Promise<Analytics> {
    try {
      const [
        totalFiles,
        totalStorage,
        filesThisMonth,
        storageThisMonth,
        recentFiles,
        fileTypeDistribution,
        uploadTrend,
      ] = await Promise.all([
        storage.getFileCount(userId),
        storage.getTotalStorage(userId),
        storage.getFilesThisMonth(userId),
        storage.getStorageThisMonth(userId),
        storage.getRecentUploads(userId, 5),
        storage.getFileTypeDistribution(userId),
        storage.getUploadTrend(userId, 7),
      ]);

      const recentUploads = recentFiles.map(file => ({
        filename: file.filename,
        uploadedAt: file.uploadedAt.toISOString(),
        fileSize: file.fileSize,
      }));

      return {
        totalFiles,
        totalStorage,
        filesThisMonth,
        storageThisMonth,
        recentUploads,
        fileTypeDistribution,
        uploadTrend,
      };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch analytics');
    }
  }

  async getDummyAnalytics(): Promise<Analytics> {
    return {
      totalFiles: 42,
      totalStorage: 157286400,
      filesThisMonth: 12,
      storageThisMonth: 31457280,
      recentUploads: [
        {
          filename: 'project_report.pdf',
          uploadedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          fileSize: 2457600,
        },
        {
          filename: 'presentation.pptx',
          uploadedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          fileSize: 5242880,
        },
        {
          filename: 'image_design.png',
          uploadedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          fileSize: 1048576,
        },
        {
          filename: 'video_tutorial.mp4',
          uploadedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          fileSize: 15728640,
        },
        {
          filename: 'data_export.csv',
          uploadedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          fileSize: 524288,
        },
      ],
      fileTypeDistribution: [
        { type: 'PDF', count: 15 },
        { type: 'Images', count: 18 },
        { type: 'Videos', count: 5 },
        { type: 'Documents', count: 8 },
        { type: 'Spreadsheets', count: 6 },
        { type: 'Others', count: 3 },
      ],
      uploadTrend: [
        { date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], count: 3 },
        { date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], count: 5 },
        { date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], count: 2 },
        { date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], count: 4 },
        { date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], count: 6 },
        { date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], count: 7 },
        { date: new Date().toISOString().split('T')[0], count: 8 },
      ],
    };
  }
}

export const analyticsService = new AnalyticsService();
