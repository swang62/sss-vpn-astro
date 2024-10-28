ALTER TABLE `profile` RENAME COLUMN "subscription" TO "subscriptionType";--> statement-breakpoint
DROP INDEX IF EXISTS "account_userId_unique";--> statement-breakpoint
DROP INDEX IF EXISTS "profile_userId_unique";--> statement-breakpoint
DROP INDEX IF EXISTS "user_email_unique";--> statement-breakpoint
ALTER TABLE `profile` ALTER COLUMN "createdAt" TO "createdAt" integer NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `account_userId_unique` ON `account` (`userId`);--> statement-breakpoint
CREATE UNIQUE INDEX `profile_userId_unique` ON `profile` (`userId`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
ALTER TABLE `profile` ALTER COLUMN "subscriptionType" TO "subscriptionType" text NOT NULL DEFAULT 'none';--> statement-breakpoint
ALTER TABLE `profile` ALTER COLUMN "updatedAt" TO "updatedAt" integer NOT NULL;--> statement-breakpoint
ALTER TABLE `profile` ADD `stripeCustomerId` text;--> statement-breakpoint
ALTER TABLE `profile` ADD `subscriptionEndAt` integer;--> statement-breakpoint
ALTER TABLE `profile` ADD `subscriptionId` text;--> statement-breakpoint
ALTER TABLE `profile` ADD `subscriptionStartAt` integer;