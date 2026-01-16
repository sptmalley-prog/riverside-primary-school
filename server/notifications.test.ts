import { describe, it, expect, beforeEach, vi } from 'vitest';
import { db } from './db';
import { notifications, users, supportSubmissions } from '../drizzle/schema';
import { eq } from 'drizzle-orm';

describe('Notification System', () => {
  beforeEach(async () => {
    // Clean up test data
    await db.delete(notifications);
    await db.delete(supportSubmissions);
    await db.delete(users);
  });

  it('should create a notification when a new support submission is created', async () => {
    // Create an admin user
    const adminResult = await db.insert(users).values({
      openId: 'test-admin-1',
      name: 'Test Admin',
      email: 'admin@test.com',
      role: 'admin',
      loginMethod: 'discord',
    });

    // Create a support submission
    const submissionResult = await db.insert(supportSubmissions).values({
      category: 'Ban Appeal',
      subCategory: 'Discord',
      email: 'user@test.com',
      robloxUsername: 'testuser',
      banReason: 'Spam',
      appealReason: 'I was not spamming',
    });

    // Get the newly created submission
    const newSubmissions = await db.select().from(supportSubmissions);
    const submissionId = newSubmissions[0]?.id;

    // Create a notification for the admin
    await db.insert(notifications).values({
      adminId: 1,
      type: 'new_submission',
      title: 'New Support Submission',
      message: 'New Ban Appeal submission received',
      relatedSubmissionId: submissionId,
    });

    // Verify notification was created
    const createdNotifications = await db.select().from(notifications);
    expect(createdNotifications).toHaveLength(1);
    expect(createdNotifications[0].type).toBe('new_submission');
    expect(createdNotifications[0].title).toBe('New Support Submission');
  });

  it('should retrieve unread notifications for an admin', async () => {
    // Create test notifications
    await db.insert(notifications).values([
      {
        adminId: 1,
        type: 'new_submission',
        title: 'New Submission 1',
        message: 'Test message 1',
        isRead: 0,
      },
      {
        adminId: 1,
        type: 'new_submission',
        title: 'New Submission 2',
        message: 'Test message 2',
        isRead: 1,
      },
      {
        adminId: 2,
        type: 'new_submission',
        title: 'New Submission 3',
        message: 'Test message 3',
        isRead: 0,
      },
    ]);

    // Get unread notifications for admin 1
    const adminNotifications = await db.select().from(notifications)
      .where(eq(notifications.adminId, 1));
    
    const unreadCount = adminNotifications.filter(n => !n.isRead).length;
    expect(unreadCount).toBe(1);
    expect(adminNotifications).toHaveLength(2);
  });

  it('should mark a notification as read', async () => {
    // Create a notification
    await db.insert(notifications).values({
      adminId: 1,
      type: 'new_submission',
      title: 'Test Notification',
      message: 'Test message',
      isRead: 0,
    });

    // Get the notification
    const notifs = await db.select().from(notifications);
    const notificationId = notifs[0].id;

    // Mark as read
    await db.update(notifications)
      .set({ isRead: 1 })
      .where(eq(notifications.id, notificationId));

    // Verify it's marked as read
    const updated = await db.select().from(notifications)
      .where(eq(notifications.id, notificationId));
    
    expect(updated[0].isRead).toBe(1);
  });

  it('should mark all notifications as read for an admin', async () => {
    // Create multiple notifications for admin 1
    await db.insert(notifications).values([
      {
        adminId: 1,
        type: 'new_submission',
        title: 'Notification 1',
        message: 'Message 1',
        isRead: 0,
      },
      {
        adminId: 1,
        type: 'submission_status_change',
        title: 'Notification 2',
        message: 'Message 2',
        isRead: 0,
      },
      {
        adminId: 2,
        type: 'new_submission',
        title: 'Notification 3',
        message: 'Message 3',
        isRead: 0,
      },
    ]);

    // Mark all as read for admin 1
    await db.update(notifications)
      .set({ isRead: 1 })
      .where(eq(notifications.adminId, 1));

    // Verify admin 1's notifications are marked as read
    const admin1Notifs = await db.select().from(notifications)
      .where(eq(notifications.adminId, 1));
    
    const unreadAdmin1 = admin1Notifs.filter(n => !n.isRead);
    expect(unreadAdmin1).toHaveLength(0);

    // Verify admin 2's notifications are still unread
    const admin2Notifs = await db.select().from(notifications)
      .where(eq(notifications.adminId, 2));
    
    const unreadAdmin2 = admin2Notifs.filter(n => !n.isRead);
    expect(unreadAdmin2).toHaveLength(1);
  });

  it('should support different notification types', async () => {
    const types = ['new_submission', 'submission_status_change', 'user_action', 'system'];

    for (const type of types) {
      await db.insert(notifications).values({
        adminId: 1,
        type: type as any,
        title: `Test ${type}`,
        message: `Message for ${type}`,
        isRead: 0,
      });
    }

    const allNotifs = await db.select().from(notifications);
    expect(allNotifs).toHaveLength(4);

    // Verify each type exists
    for (const type of types) {
      const notif = allNotifs.find(n => n.type === type);
      expect(notif).toBeDefined();
      expect(notif?.title).toBe(`Test ${type}`);
    }
  });

  it('should store related submission ID in notification', async () => {
    // Create a submission
    const submissionResult = await db.insert(supportSubmissions).values({
      category: 'Feedback',
      subCategory: 'Complaint',
      message: 'Test complaint',
    });

    // Get the submission ID
    const submissions = await db.select().from(supportSubmissions);
    const submissionId = submissions[0].id;

    // Create notification with related submission
    await db.insert(notifications).values({
      adminId: 1,
      type: 'new_submission',
      title: 'New Complaint',
      message: 'New complaint received',
      relatedSubmissionId: submissionId,
    });

    // Verify the relationship
    const notifs = await db.select().from(notifications);
    expect(notifs[0].relatedSubmissionId).toBe(submissionId);
  });
});
