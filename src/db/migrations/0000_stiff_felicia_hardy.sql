CREATE TABLE `account` (
	`accessToken` text,
	`accountId` text NOT NULL,
	`expiresAt` integer,
	`id` text PRIMARY KEY NOT NULL,
	`idToken` text,
	`password` text,
	`providerId` text NOT NULL,
	`refreshToken` text,
	`userId` text NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `account_userId_unique` ON `account` (`userId`);--> statement-breakpoint
CREATE TABLE `product` (
	`createdAt` integer NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`name` text,
	`priceId` text NOT NULL,
	`productId` text NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `profile` (
	`createdAt` integer NOT NULL,
	`hiddifyId` text NOT NULL,
	`purchasedRouter` integer DEFAULT false,
	`stripeCustomerId` text NOT NULL,
	`subscriptionEndAt` integer,
	`subscriptionId` text,
	`subscriptionItemId` text,
	`subscriptionStartAt` integer,
	`subscriptionType` text DEFAULT 'none' NOT NULL,
	`updatedAt` integer NOT NULL,
	`userId` text NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `profile_userId_unique` ON `profile` (`userId`);--> statement-breakpoint
CREATE TABLE `session` (
	`expiresAt` integer NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`impersonatedBy` text,
	`ipAddress` text,
	`userAgent` text,
	`userId` text NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `user` (
	`banExpires` integer,
	`banned` integer,
	`banReason` text,
	`createdAt` integer NOT NULL,
	`email` text NOT NULL,
	`emailVerified` integer DEFAULT false NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`image` text,
	`name` text NOT NULL,
	`role` text,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE TABLE `verification` (
	`expiresAt` integer NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`identifier` text NOT NULL,
	`value` text NOT NULL
);
