CREATE TABLE `pokemon` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `votes` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`voted_for_id` integer NOT NULL,
	`voted_against_id` integer NOT NULL,
	FOREIGN KEY (`voted_for_id`) REFERENCES `pokemon`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`voted_against_id`) REFERENCES `pokemon`(`id`) ON UPDATE no action ON DELETE no action
);
