import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  avatar: text("avatar"),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Support submissions table
export const supportSubmissions = mysqlTable("supportSubmissions", {
  id: int("id").autoincrement().primaryKey(),
  category: varchar("category", { length: 100 }).notNull(),
  subCategory: varchar("subCategory", { length: 100 }).notNull(),
  // Ban appeal specific fields
  appealType: varchar("appealType", { length: 100 }),
  userOrGroup: varchar("userOrGroup", { length: 100 }),
  email: varchar("email", { length: 320 }),
  robloxUsername: varchar("robloxUsername", { length: 100 }),
  banReason: text("banReason"),
  appealReason: text("appealReason"),
  // General message field
  message: text("message"),
  // Status tracking
  status: mysqlEnum("status", ["pending", "accepted", "denied"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SupportSubmission = typeof supportSubmissions.$inferSelect;
export type InsertSupportSubmission = typeof supportSubmissions.$inferInsert;

// Activity logs table for tracking admin actions
export const activityLogs = mysqlTable("activityLogs", {
  id: int("id").autoincrement().primaryKey(),
  adminId: int("adminId").notNull(),
  adminName: varchar("adminName", { length: 100 }).notNull(),
  action: varchar("action", { length: 200 }).notNull(),
  description: text("description"),
  targetType: varchar("targetType", { length: 100 }),
  targetId: int("targetId"),
  targetName: varchar("targetName", { length: 100 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ActivityLog = typeof activityLogs.$inferSelect;
export type InsertActivityLog = typeof activityLogs.$inferInsert;
// Notifications table for admin alerts
export const notifications = mysqlTable("notifications", {
  id: int("id").autoincrement().primaryKey(),
  adminId: int("adminId").notNull(),
  type: mysqlEnum("type", ["new_submission", "submission_status_change", "user_action", "system"]).notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  message: text("message"),
  relatedSubmissionId: int("relatedSubmissionId"),
  relatedUserId: int("relatedUserId"),
  isRead: int("isRead").default(0).notNull(), // 0 = false, 1 = true
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;
