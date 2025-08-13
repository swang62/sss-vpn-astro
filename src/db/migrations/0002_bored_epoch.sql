PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_profile` (
	`createdAt` integer NOT NULL,
	`hiddifyId` text PRIMARY KEY NOT NULL,
	`hiddifyServerId` text DEFAULT '1' NOT NULL,
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
INSERT INTO `__new_profile`("createdAt", "hiddifyId", "hiddifyServerId", "purchasedRouter", "stripeCustomerId", "subscriptionEndAt", "subscriptionId", "subscriptionItemId", "subscriptionStartAt", "subscriptionType", "updatedAt", "userId") SELECT "createdAt", "hiddifyId", "hiddifyServerId", "purchasedRouter", "stripeCustomerId", "subscriptionEndAt", "subscriptionId", "subscriptionItemId", "subscriptionStartAt", "subscriptionType", "updatedAt", "userId" FROM `profile`;--> statement-breakpoint
DROP TABLE `profile`;--> statement-breakpoint
ALTER TABLE `__new_profile` RENAME TO `profile`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `profile_userId_unique` ON `profile` (`userId`);