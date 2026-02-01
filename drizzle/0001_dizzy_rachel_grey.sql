CREATE TABLE `agenda` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nome_evento` varchar(255) NOT NULL,
	`data_evento` timestamp NOT NULL,
	`local` varchar(255) NOT NULL,
	`status` varchar(50) NOT NULL DEFAULT 'Próximo',
	`visivel` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `agenda_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ebooks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`titulo` varchar(255) NOT NULL,
	`sinopse` text,
	`url_capa` varchar(500) NOT NULL,
	`gratuito` int NOT NULL DEFAULT 1,
	`url_arquivo` varchar(500),
	`visivel` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `ebooks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `emails_capturados` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`nome` varchar(255) NOT NULL,
	`ebook_id` int,
	`data_captura` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `emails_capturados_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `galeria` (
	`id` int AUTO_INCREMENT NOT NULL,
	`descricao_foto` varchar(255),
	`url_foto` varchar(500) NOT NULL,
	`visivel` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `galeria_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `podcasts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`titulo_episodio` varchar(255) NOT NULL,
	`descricao` text,
	`url_embed` varchar(500) NOT NULL,
	`data_publicacao` timestamp NOT NULL DEFAULT (now()),
	`visivel` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `podcasts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pregacoes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`titulo` varchar(255) NOT NULL,
	`descricao` text,
	`url_video` varchar(500) NOT NULL,
	`data_publicacao` timestamp NOT NULL DEFAULT (now()),
	`visivel` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `pregacoes_id` PRIMARY KEY(`id`)
);
