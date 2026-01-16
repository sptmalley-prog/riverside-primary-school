CREATE TABLE `supportSubmissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`category` varchar(100) NOT NULL,
	`subCategory` varchar(100) NOT NULL,
	`appealType` varchar(100),
	`userOrGroup` varchar(100),
	`email` varchar(320),
	`robloxUsername` varchar(100),
	`banReason` text,
	`appealReason` text,
	`message` text,
	`status` enum('pending','accepted','denied') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `supportSubmissions_id` PRIMARY KEY(`id`)
);
