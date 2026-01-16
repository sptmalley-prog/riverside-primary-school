# Project TODO

- [x] Remove emojis from Discord webhook in Careers application form
- [x] Add SEN program to Programs section
- [x] Add Pastoral Support area to Programs section
- [x] Create Support page with simplified navigation (logo + "Support" text only)
- [x] Implement ban appeal form with all required fields
- [x] Add Feedback category with Compliments, Complaints, Suggestions subcategories
- [x] Add Report category with Report a person and Report a group subcategories
- [x] Add message box at bottom of all support forms
- [x] Connect support forms to Discord webhook
- [x] Create database schema for support submissions
- [x] Update Support page to save submissions to database
- [x] Create Admin Dashboard page to view all support submissions
- [x] Add accept/deny functionality with visual indicators (green for accepted, red strikethrough for denied)
- [x] Add tRPC procedures for managing support submissions

## Discord OAuth Integration
- [x] Add Discord OAuth credentials to environment variables
- [x] Create Discord OAuth authentication routes
- [x] Update user schema to store Discord user data
- [x] Implement Discord login button on frontend
- [x] Force login requirement on all pages
- [x] Add admin panel link for admin users
- [x] Fix session token format for Discord OAuth
- [x] Update redirect URI for published domain
- [x] Test Discord OAuth flow

## User Profile
- [x] Create user profile dropdown component with avatar and username
- [x] Add logout button to dropdown
- [x] Add dropdown to navigation in top right corner

## User Management
- [x] Add tRPC procedures to get all users and update user roles
- [x] Add user management section to Admin Dashboard
- [x] Test role promotion functionality

## Activity Logs & Notifications
- [x] Create database schema for activity logs
- [x] Add tRPC procedures for logging admin actions
- [x] Create Activity Logs page in admin dashboard
- [x] Add notification system for support submissions
- [x] Display real-time notifications to admins
- [x] Test activity logging and notifications
