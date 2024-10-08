CREATE TABLE `profile` (
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`role` text DEFAULT 'user' NOT NULL,
	`subscription` integer DEFAULT false NOT NULL,
	`subscription_type` text,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL,
	`user_id` text,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text
);
