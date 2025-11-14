import type { Response } from 'express';
import type { AuthRequest } from '../middleware/auth';
import { fileService } from '../services/fileService';
import { insertFileSchema } from '@shared/schema';
import { z } from 'zod';

export class FileController {
  async uploadFile(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const validatedData = insertFileSchema.parse(req.body);

      const { signedUrl, token, path, filePath } = await fileService.createSignedUploadUrl(
        req.user.id,
        validatedData.filename,
        validatedData.fileType
      );

      const file = await fileService.saveFileMetadata({
        ...validatedData,
        userId: req.user.id,
        signedUrl: filePath,
        storagePath: filePath,
      });

      res.status(201).json({
        message: 'Upload URL generated successfully',
        uploadUrl: signedUrl,
        token,
        path,
        file: {
          id: file.id,
          filename: file.filename,
          fileType: file.fileType,
          fileSize: file.fileSize,
          uploadedAt: file.uploadedAt,
        },
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Validation error',
          details: error.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message,
          })),
        });
      }

      res.status(500).json({ error: error.message || 'File upload failed' });
    }
  }

  async getFiles(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const files = await fileService.getUserFiles(req.user.id);

      res.json({
        message: 'Files retrieved successfully',
        files: files.map(file => ({
          id: file.id,
          filename: file.filename,
          fileType: file.fileType,
          fileSize: file.fileSize,
          uploadedAt: file.uploadedAt,
        })),
        count: files.length,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to fetch files' });
    }
  }

  async deleteFile(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ error: 'File ID is required' });
      }

      await fileService.deleteFile(id, req.user.id);

      res.json({
        message: 'File deleted successfully',
      });
    } catch (error: any) {
      const message = error.message || 'Failed to delete file';

      if (message.includes('not found')) {
        return res.status(404).json({ error: message });
      }

      if (message.includes('Unauthorized')) {
        return res.status(403).json({ error: message });
      }

      res.status(500).json({ error: message });
    }
  }
}

export const fileController = new FileController();
