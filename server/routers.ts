import { getSessionCookieOptions } from "./_core/cookies";
import { COOKIE_NAME } from "../shared/const";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { supportSubmissions, users, activityLogs, notifications } from "../drizzle/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  support: router({
    // Create a new support submission
    createSubmission: publicProcedure
      .input(z.object({
        category: z.string(),
        subCategory: z.string(),
        appealType: z.string().optional(),
        userOrGroup: z.string().optional(),
        email: z.string().optional(),
        robloxUsername: z.string().optional(),
        banReason: z.string().optional(),
        appealReason: z.string().optional(),
        message: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        await db.insert(supportSubmissions).values(input);
        
        // Get the newly created submission
        const newSubmissions = await db.select().from(supportSubmissions).orderBy(desc(supportSubmissions.createdAt)).limit(1);
        const submissionId = newSubmissions[0]?.id;
        
        // Notify all admins about new submission
        const allAdmins = await db.select().from(users).where(eq(users.role, 'admin'));
        for (const admin of allAdmins) {
          await db.insert(notifications).values({
            adminId: admin.id,
            type: 'new_submission',
            title: 'New Support Submission',
            message: `New ${input.category} submission received`,
            relatedSubmissionId: submissionId,
          });
        }
        
        return { success: true };
      }),

    // Get all submissions (admin only)
    getAllSubmissions: protectedProcedure
      .query(async () => {
        return await db.select().from(supportSubmissions).orderBy(supportSubmissions.createdAt);
      }),

    // Update submission status (admin only)
    updateStatus: protectedProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["pending", "accepted", "denied"]),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
        }
        await db.update(supportSubmissions)
          .set({ status: input.status })
          .where(eq(supportSubmissions.id, input.id));
        
        await db.insert(activityLogs).values({
          adminId: ctx.user.id,
          adminName: ctx.user.name || 'Unknown',
          action: `submission_${input.status}`,
          description: `Marked submission as ${input.status}`,
          targetType: 'submission',
          targetId: input.id,
        });
        
        return { success: true };
      }),
  }),

  users: router({
    // Get all users (admin only)
    getAllUsers: protectedProcedure
      .query(async ({ ctx }) => {
        if (ctx.user?.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
        }
        return await db.select().from(users).orderBy(users.createdAt);
      }),

    // Update user role (admin only)
    updateUserRole: protectedProcedure
      .input(z.object({
        userId: z.number(),
        role: z.enum(["admin", "user"]),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
        }
        const targetUser = await db.select().from(users).where(eq(users.id, input.userId));
        await db.update(users)
          .set({ role: input.role })
          .where(eq(users.id, input.userId));
        
        await db.insert(activityLogs).values({
          adminId: ctx.user.id,
          adminName: ctx.user.name || 'Unknown',
          action: 'user_role_changed',
          description: `Changed user role to ${input.role}`,
          targetType: 'user',
          targetId: input.userId,
          targetName: targetUser[0]?.name,
        });
        
        return { success: true };
      }),
  }),

  logs: router({
    // Log an admin action
    logAction: protectedProcedure
      .input(z.object({
        action: z.string(),
        description: z.string().optional(),
        targetType: z.string().optional(),
        targetId: z.number().optional(),
        targetName: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
        }
        await db.insert(activityLogs).values({
          adminId: ctx.user.id,
          adminName: ctx.user.name || 'Unknown',
          action: input.action,
          description: input.description,
          targetType: input.targetType,
          targetId: input.targetId,
          targetName: input.targetName,
        });
        return { success: true };
      }),

    // Get all activity logs (admin only)
    getAllLogs: protectedProcedure
      .query(async ({ ctx }) => {
        if (ctx.user?.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
        }
        return await db.select().from(activityLogs).orderBy(desc(activityLogs.createdAt)).limit(100);
      }),

    // Get logs for a specific action
    getLogsByAction: protectedProcedure
      .input(z.object({ action: z.string() }))
      .query(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
        }
        return await db.select().from(activityLogs)
          .where(eq(activityLogs.action, input.action))
          .orderBy(desc(activityLogs.createdAt))
          .limit(50);
      }),
  }),

  notifications: router({
    // Get all unread notifications for current admin
    getUnreadNotifications: protectedProcedure
      .query(async ({ ctx }) => {
        if (ctx.user?.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
        }
        return await db.select().from(notifications)
          .where(eq(notifications.adminId, ctx.user.id))
          .orderBy(desc(notifications.createdAt));
      }),

    // Get unread count
    getUnreadCount: protectedProcedure
      .query(async ({ ctx }) => {
        if (ctx.user?.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
        }
        const result = await db.select().from(notifications)
          .where(eq(notifications.adminId, ctx.user.id));
        return result.filter(n => !n.isRead).length;
      }),

    // Mark notification as read
    markAsRead: protectedProcedure
      .input(z.object({ notificationId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
        }
        await db.update(notifications)
          .set({ isRead: 1 })
          .where(eq(notifications.id, input.notificationId));
        return { success: true };
      }),

    // Mark all as read
    markAllAsRead: protectedProcedure
      .mutation(async ({ ctx }) => {
        if (ctx.user?.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
        }
        await db.update(notifications)
          .set({ isRead: 1 })
          .where(eq(notifications.adminId, ctx.user.id));
        return { success: true };
      }),
  }),

  roblox: router({
    getGroupStats: publicProcedure
      .input(z.object({ groupId: z.number() }))
      .query(async ({ input }) => {
        try {
          const response = await fetch(`https://groups.roblox.com/v1/groups/${input.groupId}`);
          if (!response.ok) {
            throw new Error('Failed to fetch group data');
          }
          const data = await response.json();
          return {
            memberCount: data.memberCount || 0,
            name: data.name || '',
          };
        } catch (error) {
          console.error('Error fetching Roblox group data:', error);
          return {
            memberCount: 0,
            name: '',
          };
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
