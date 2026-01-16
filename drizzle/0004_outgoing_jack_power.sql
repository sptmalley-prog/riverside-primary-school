CREATE TABLE `notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`adminId` int NOT NULL,
	`type` enum('new_submission','submission_status_change','user_action','system') NOT NULL,
	`title` varchar(200) NOT NULL,
	`message` text,
	`relatedSubmissionId` int,
	`relatedUserId` int,
	`isRead` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
