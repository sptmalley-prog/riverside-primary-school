CREATE TABLE `activityLogs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`adminId` int NOT NULL,
	`adminName` varchar(100) NOT NULL,
	`action` varchar(200) NOT NULL,
	`description` text,
	`targetType` varchar(100),
	`targetId` int,
	`targetName` varchar(100),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `activityLogs_id` PRIMARY KEY(`id`)
);
