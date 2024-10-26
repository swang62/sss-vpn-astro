CREATE TABLE `product` (
	`createdAt` integer NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`name` text,
	`priceId` text NOT NULL,
	`productId` text NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
DROP INDEX IF EXISTS "account_userId_unique";--> statement-breakpoint
DROP INDEX IF EXISTS "profile_userId_unique";--> statement-breakpoint
DROP INDEX IF EXISTS "user_email_unique";--> statement-breakpoint
ALTER TABLE `profile` ALTER COLUMN "stripeCustomerId" TO "stripeCustomerId" text NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `account_userId_unique` ON `account` (`userId`);--> statement-breakpoint
CREATE UNIQUE INDEX `profile_userId_unique` ON `profile` (`userId`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);