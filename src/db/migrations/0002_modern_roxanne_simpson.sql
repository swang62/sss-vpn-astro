ALTER TABLE `account` RENAME COLUMN "expiresAt" TO "accessTokenExpiresAt";--> statement-breakpoint
ALTER TABLE `account` ADD `createdAt` integer;--> statement-breakpoint
ALTER TABLE `account` ADD `refreshTokenExpiresAt` integer;--> statement-breakpoint
ALTER TABLE `account` ADD `scope` text;--> statement-breakpoint
ALTER TABLE `account` ADD `updatedAt` integer;--> statement-breakpoint
ALTER TABLE `profile` ADD `lastKnownIpAddress` text;
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_profile` (
	`createdAt` integer NOT NULL,
	`hiddifyId` text PRIMARY KEY NOT NULL,
	`hiddifyServerId` text DEFAULT '1' NOT NULL,
	`lastKnownIpAddress` text,
	`purchasedRouter` integer DEFAULT false NOT NULL,
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
INSERT INTO `__new_profile`("createdAt", "hiddifyId", "hiddifyServerId", "lastKnownIpAddress", "purchasedRouter", "stripeCustomerId", "subscriptionEndAt", "subscriptionId", "subscriptionItemId", "subscriptionStartAt", "subscriptionType", "updatedAt", "userId") SELECT "createdAt", "hiddifyId", "hiddifyServerId", "lastKnownIpAddress", "purchasedRouter", "stripeCustomerId", "subscriptionEndAt", "subscriptionId", "subscriptionItemId", "subscriptionStartAt", "subscriptionType", "updatedAt", "userId" FROM `profile`;--> statement-breakpoint
DROP TABLE `profile`;--> statement-breakpoint
ALTER TABLE `__new_profile` RENAME TO `profile`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `profile_userId_unique` ON `profile` (`userId`);--> statement-breakpoint
DROP INDEX IF EXISTS "account_userId_unique";--> statement-breakpoint
DROP INDEX IF EXISTS "profile_userId_unique";--> statement-breakpoint
DROP INDEX IF EXISTS "user_email_unique";--> statement-breakpoint
ALTER TABLE `session` ALTER COLUMN "expiresAt" TO "expiresAt" integer;--> statement-breakpoint
CREATE UNIQUE INDEX `account_userId_unique` ON `account` (`userId`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
ALTER TABLE `session` ADD `createdAt` integer;--> statement-breakpoint
ALTER TABLE `session` ADD `token` text;--> statement-breakpoint
ALTER TABLE `session` ADD `updatedAt` integer;--> statement-breakpoint
ALTER TABLE `verification` ADD `createdAt` integer;--> statement-breakpoint
ALTER TABLE `verification` ADD `updatedAt` integer;
