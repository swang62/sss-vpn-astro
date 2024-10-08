CREATE TABLE `profile` (
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`role` text DEFAULT 'guest' NOT NULL,
	`subscription_type` text,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL,
	`user_id` text,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text
);
