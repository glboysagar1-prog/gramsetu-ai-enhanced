import { sql, relations } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Files table
export const files = pgTable("files", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  filename: text("filename").notNull(),
  fileType: text("file_type").notNull(),
  fileSize: integer("file_size").notNull(), // in bytes
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
  signedUrl: text("signed_url"), // pre-signed URL for file access
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  files: many(files),
}));

export const filesRelations = relations(files, ({ one }) => ({
  user: one(users, {
    fields: [files.userId],
    references: [users.id],
  }),
}));

// Insert schemas with validation
export const insertUserSchema = createInsertSchema(users, {
  username: z.string().min(3, "Username must be at least 3 characters").max(50),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
}).omit({
  id: true,
  createdAt: true,
});

export const loginUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const insertFileSchema = createInsertSchema(files, {
  filename: z.string().min(1, "Filename is required"),
  fileType: z.string().min(1, "File type is required"),
  fileSize: z.number().positive("File size must be positive"),
}).omit({
  id: true,
  uploadedAt: true,
  userId: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type LoginUser = z.infer<typeof loginUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertFile = z.infer<typeof insertFileSchema>;
export type File = typeof files.$inferSelect;

// Analytics type (for structured response)
export type Analytics = {
  totalFiles: number;
  totalStorage: number; // in bytes
  filesThisMonth: number;
  storageThisMonth: number;
  recentUploads: Array<{
    filename: string;
    uploadedAt: string;
    fileSize: number;
  }>;
  fileTypeDistribution: Array<{
    type: string;
    count: number;
  }>;
  uploadTrend: Array<{
    date: string;
    count: number;
  }>;
};
