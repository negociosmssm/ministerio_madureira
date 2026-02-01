import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Tabela de Pregações
export const pregacoes = mysqlTable("pregacoes", {
  id: int("id").autoincrement().primaryKey(),
  titulo: varchar("titulo", { length: 255 }).notNull(),
  descricao: text("descricao"),
  url_video: varchar("url_video", { length: 500 }).notNull(),
  data_publicacao: timestamp("data_publicacao").defaultNow().notNull(),
  visivel: int("visivel").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Pregacao = typeof pregacoes.$inferSelect;
export type InsertPregacao = typeof pregacoes.$inferInsert;

// Tabela de Podcasts
export const podcasts = mysqlTable("podcasts", {
  id: int("id").autoincrement().primaryKey(),
  titulo_episodio: varchar("titulo_episodio", { length: 255 }).notNull(),
  descricao: text("descricao"),
  url_embed: varchar("url_embed", { length: 500 }).notNull(),
  data_publicacao: timestamp("data_publicacao").defaultNow().notNull(),
  visivel: int("visivel").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Podcast = typeof podcasts.$inferSelect;
export type InsertPodcast = typeof podcasts.$inferInsert;

// Tabela de Ebooks
export const ebooks = mysqlTable("ebooks", {
  id: int("id").autoincrement().primaryKey(),
  titulo: varchar("titulo", { length: 255 }).notNull(),
  sinopse: text("sinopse"),
  url_capa: varchar("url_capa", { length: 500 }).notNull(),
  gratuito: int("gratuito").default(1).notNull(),
  url_arquivo: varchar("url_arquivo", { length: 500 }),
  visivel: int("visivel").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Ebook = typeof ebooks.$inferSelect;
export type InsertEbook = typeof ebooks.$inferInsert;

// Tabela de Agenda de Eventos
export const agenda = mysqlTable("agenda", {
  id: int("id").autoincrement().primaryKey(),
  nome_evento: varchar("nome_evento", { length: 255 }).notNull(),
  data_evento: timestamp("data_evento").notNull(),
  local: varchar("local", { length: 255 }).notNull(),
  status: varchar("status", { length: 50 }).default("Próximo").notNull(),
  visivel: int("visivel").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Evento = typeof agenda.$inferSelect;
export type InsertEvento = typeof agenda.$inferInsert;

// Tabela de Galeria de Fotos
export const galeria = mysqlTable("galeria", {
  id: int("id").autoincrement().primaryKey(),
  descricao_foto: varchar("descricao_foto", { length: 255 }),
  url_foto: varchar("url_foto", { length: 500 }).notNull(),
  visivel: int("visivel").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Foto = typeof galeria.$inferSelect;
export type InsertFoto = typeof galeria.$inferInsert;

// Tabela de Emails Capturados
export const emails_capturados = mysqlTable("emails_capturados", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull(),
  nome: varchar("nome", { length: 255 }).notNull(),
  ebook_id: int("ebook_id"),
  data_captura: timestamp("data_captura").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type EmailCapturado = typeof emails_capturados.$inferSelect;
export type InsertEmailCapturado = typeof emails_capturados.$inferInsert;