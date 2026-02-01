import { eq, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, pregacoes, podcasts, ebooks, agenda, galeria, emails_capturados, InsertPregacao, InsertPodcast, InsertEbook, InsertEvento, InsertFoto, Pregacao, Podcast, Ebook, Evento, Foto } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Funções para Pregações
export async function getPregacoes() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(pregacoes).where(eq(pregacoes.visivel, 1)).orderBy(desc(pregacoes.data_publicacao));
}

export async function getPregacaoById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(pregacoes).where(eq(pregacoes.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Funções para Podcasts
export async function getPodcasts() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(podcasts).where(eq(podcasts.visivel, 1)).orderBy(desc(podcasts.data_publicacao));
}

// Funções para Ebooks
export async function getEbooks() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(ebooks).where(eq(ebooks.visivel, 1)).orderBy(desc(ebooks.createdAt));
}

export async function getEbookById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(ebooks).where(eq(ebooks.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Funções para Agenda
export async function getEventos() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(agenda).where(eq(agenda.visivel, 1)).orderBy(agenda.data_evento);
}

// Funções para Galeria
export async function getFotos() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(galeria).where(eq(galeria.visivel, 1)).orderBy(desc(galeria.createdAt));
}

// Funções para Emails Capturados
export async function saveEmailCapturado(email: string, nome: string, ebookId?: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.insert(emails_capturados).values({
    email,
    nome,
    ebook_id: ebookId,
  });
  
  return result;
}

export async function getEmailsCapturados() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(emails_capturados).orderBy(desc(emails_capturados.data_captura));
}

// Funções para Admin CRUD
export async function createPregacao(data: InsertPregacao) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.insert(pregacoes).values(data);
  return result;
}

export async function updatePregacao(id: number, data: Partial<InsertPregacao>) {
  const db = await getDb();
  if (!db) return undefined;
  return await db.update(pregacoes).set(data).where(eq(pregacoes.id, id));
}

export async function deletePregacao(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  return await db.delete(pregacoes).where(eq(pregacoes.id, id));
}

export async function createPodcast(data: InsertPodcast) {
  const db = await getDb();
  if (!db) return undefined;
  return await db.insert(podcasts).values(data);
}

export async function updatePodcast(id: number, data: Partial<InsertPodcast>) {
  const db = await getDb();
  if (!db) return undefined;
  return await db.update(podcasts).set(data).where(eq(podcasts.id, id));
}

export async function deletePodcast(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  return await db.delete(podcasts).where(eq(podcasts.id, id));
}

export async function createEbook(data: InsertEbook) {
  const db = await getDb();
  if (!db) return undefined;
  return await db.insert(ebooks).values(data);
}

export async function updateEbook(id: number, data: Partial<InsertEbook>) {
  const db = await getDb();
  if (!db) return undefined;
  return await db.update(ebooks).set(data).where(eq(ebooks.id, id));
}

export async function deleteEbook(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  return await db.delete(ebooks).where(eq(ebooks.id, id));
}

export async function createEvento(data: InsertEvento) {
  const db = await getDb();
  if (!db) return undefined;
  return await db.insert(agenda).values(data);
}

export async function updateEvento(id: number, data: Partial<InsertEvento>) {
  const db = await getDb();
  if (!db) return undefined;
  return await db.update(agenda).set(data).where(eq(agenda.id, id));
}

export async function deleteEvento(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  return await db.delete(agenda).where(eq(agenda.id, id));
}

export async function createFoto(data: InsertFoto) {
  const db = await getDb();
  if (!db) return undefined;
  return await db.insert(galeria).values(data);
}

export async function updateFoto(id: number, data: Partial<InsertFoto>) {
  const db = await getDb();
  if (!db) return undefined;
  return await db.update(galeria).set(data).where(eq(galeria.id, id));
}

export async function deleteFoto(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  return await db.delete(galeria).where(eq(galeria.id, id));
}
