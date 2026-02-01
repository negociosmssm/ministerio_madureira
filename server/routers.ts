import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import {
  getPregacoes,
  getPodcasts,
  getEbooks,
  getEventos,
  getFotos,
  getEmailsCapturados,
  saveEmailCapturado,
  createPregacao,
  updatePregacao,
  deletePregacao,
  createPodcast,
  updatePodcast,
  deletePodcast,
  createEbook,
  updateEbook,
  deleteEbook,
  createEvento,
  updateEvento,
  deleteEvento,
  createFoto,
  updateFoto,
  deleteFoto,
} from "./db";

// Procedimentos para o frontend público
export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Procedimentos públicos para conteúdo
  content: router({
    // Pregações
    getPregacoes: publicProcedure.query(async () => {
      return await getPregacoes();
    }),

    // Podcasts
    getPodcasts: publicProcedure.query(async () => {
      return await getPodcasts();
    }),

    // Ebooks
    getEbooks: publicProcedure.query(async () => {
      return await getEbooks();
    }),

    // Agenda de Eventos
    getEventos: publicProcedure.query(async () => {
      return await getEventos();
    }),

    // Galeria de Fotos
    getFotos: publicProcedure.query(async () => {
      return await getFotos();
    }),

    // Capturar email para download de ebook
    captureEmail: publicProcedure
      .input(
        z.object({
          email: z.string().email(),
          nome: z.string().min(1),
          ebookId: z.number().optional(),
        })
      )
      .mutation(async ({ input }) => {
        try {
          await saveEmailCapturado(input.email, input.nome, input.ebookId);
          return { success: true };
        } catch (error) {
          console.error("Erro ao capturar email:", error);
          return { success: false, error: "Erro ao salvar email" };
        }
      }),
  }),

  // Procedimentos protegidos para admin
  admin: router({
    // Pregações
    createPregacao: protectedProcedure
      .input(
        z.object({
          titulo: z.string().min(1),
          descricao: z.string().optional(),
          url_video: z.string().url(),
          data_publicacao: z.date().optional(),
          visivel: z.number().default(1),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Acesso negado");
        }
        return await createPregacao(input);
      }),

    updatePregacao: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          titulo: z.string().optional(),
          descricao: z.string().optional(),
          url_video: z.string().url().optional(),
          visivel: z.number().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Acesso negado");
        }
        const { id, ...data } = input;
        return await updatePregacao(id, data);
      }),

    deletePregacao: protectedProcedure
      .input(z.number())
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Acesso negado");
        }
        return await deletePregacao(input);
      }),

    // Podcasts
    createPodcast: protectedProcedure
      .input(
        z.object({
          titulo_episodio: z.string().min(1),
          descricao: z.string().optional(),
          url_embed: z.string().url(),
          data_publicacao: z.date().optional(),
          visivel: z.number().default(1),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Acesso negado");
        }
        return await createPodcast(input);
      }),

    updatePodcast: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          titulo_episodio: z.string().optional(),
          descricao: z.string().optional(),
          url_embed: z.string().url().optional(),
          visivel: z.number().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Acesso negado");
        }
        const { id, ...data } = input;
        return await updatePodcast(id, data);
      }),

    deletePodcast: protectedProcedure
      .input(z.number())
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Acesso negado");
        }
        return await deletePodcast(input);
      }),

    // Ebooks
    createEbook: protectedProcedure
      .input(
        z.object({
          titulo: z.string().min(1),
          sinopse: z.string().optional(),
          url_capa: z.string().url(),
          gratuito: z.number().default(1),
          url_arquivo: z.string().url().optional(),
          visivel: z.number().default(1),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Acesso negado");
        }
        return await createEbook(input);
      }),

    updateEbook: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          titulo: z.string().optional(),
          sinopse: z.string().optional(),
          url_capa: z.string().url().optional(),
          gratuito: z.number().optional(),
          url_arquivo: z.string().url().optional(),
          visivel: z.number().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Acesso negado");
        }
        const { id, ...data } = input;
        return await updateEbook(id, data);
      }),

    deleteEbook: protectedProcedure
      .input(z.number())
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Acesso negado");
        }
        return await deleteEbook(input);
      }),

    // Eventos
    createEvento: protectedProcedure
      .input(
        z.object({
          nome_evento: z.string().min(1),
          data_evento: z.date(),
          local: z.string().min(1),
          status: z.string().default("Próximo"),
          visivel: z.number().default(1),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Acesso negado");
        }
        return await createEvento(input);
      }),

    updateEvento: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          nome_evento: z.string().optional(),
          data_evento: z.date().optional(),
          local: z.string().optional(),
          status: z.string().optional(),
          visivel: z.number().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Acesso negado");
        }
        const { id, ...data } = input;
        return await updateEvento(id, data);
      }),

    deleteEvento: protectedProcedure
      .input(z.number())
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Acesso negado");
        }
        return await deleteEvento(input);
      }),

    // Fotos
    createFoto: protectedProcedure
      .input(
        z.object({
          descricao_foto: z.string().optional(),
          url_foto: z.string().url(),
          visivel: z.number().default(1),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Acesso negado");
        }
        return await createFoto(input);
      }),

    updateFoto: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          descricao_foto: z.string().optional(),
          url_foto: z.string().url().optional(),
          visivel: z.number().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Acesso negado");
        }
        const { id, ...data } = input;
        return await updateFoto(id, data);
      }),

    deleteFoto: protectedProcedure
      .input(z.number())
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Acesso negado");
        }
        return await deleteFoto(input);
      }),

    // Emails Capturados
    getEmails: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new Error("Acesso negado");
      }
      return await getEmailsCapturados();
    }),
  }),
});

export type AppRouter = typeof appRouter;
