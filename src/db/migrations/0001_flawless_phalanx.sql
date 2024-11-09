DROP INDEX IF EXISTS "account_userId_unique";--> statement-breakpoint
DROP INDEX IF EXISTS "profile_userId_unique";--> statement-breakpoint
DROP INDEX IF EXISTS "user_email_unique";--> statement-breakpoint
ALTER TABLE `profile` ALTER COLUMN "purchasedRouter" TO "purchasedRouter" integer NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `account_userId_unique` ON `account` (`userId`);--> statement-breakpoint
CREATE UNIQUE INDEX `profile_userId_unique` ON `profile` (`userId`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
ALTER TABLE `profile` ADD `hiddifyServerId` text DEFAULT '1' NOT NULL;