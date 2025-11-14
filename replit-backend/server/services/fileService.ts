import { storage } from '../storage';
import type { InsertFile } from '@shared/schema';

export class FileService {
  async createSignedUploadUrl(userId: string, filename: string, fileType: string) {
    const filePath = `${userId}/${Date.now()}_${filename}`;

    return {
      signedUrl: `/api/files/placeholder-upload`,
      token: 'placeholder-token',
      path: filePath,
      filePath,
    };
  }

  async saveFileMetadata(fileData: InsertFile & { userId: string; signedUrl: string; storagePath: string }) {
    try {
      const file = await storage.createFile(fileData);
      return file;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to save file metadata');
    }
  }

  async getUserFiles(userId: string) {
    try {
      const files = await storage.getFilesByUserId(userId);
      return files;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch user files');
    }
  }

  async deleteFile(fileId: string, userId: string) {
    try {
      const file = await storage.getFileById(fileId);

      if (!file) {
        throw new Error('File not found');
      }

      if (file.userId !== userId) {
        throw new Error('Unauthorized');
      }

      await storage.deleteFile(fileId, userId);

      return true;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to delete file');
    }
  }

  async createDownloadUrl(filePath: string, expiresIn: number = 3600) {
    return `/api/files/placeholder-download/${encodeURIComponent(filePath)}`;
  }
}

export const fileService = new FileService();
