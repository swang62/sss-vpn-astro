PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_profile` (
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`role` text DEFAULT 'user' NOT NULL,
	`subscription_type` text,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL,
	`user_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_profile`("created_at", "role", "subscription_type", "updated_at", "user_id") SELECT "created_at", "role", "subscription_type", "updated_at", "user_id" FROM `profile`;--> statement-breakpoint
DROP TABLE `profile`;--> statement-breakpoint
ALTER TABLE `__new_profile` RENAME TO `profile`;--> statement-breakpoint
PRAGMA foreign_keys=ON;