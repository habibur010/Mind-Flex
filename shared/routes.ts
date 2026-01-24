import { z } from 'zod';
import { 
  insertTaskSchema, 
  tasks, 
  moodLogs, 
  insertMoodLogSchema, 
  assessments, 
  insertAssessmentSchema, 
  healthData, 
  insertHealthDataSchema,
  badges,
  userBadges
} from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  tasks: {
    list: {
      method: 'GET' as const,
      path: '/api/tasks',
      responses: {
        200: z.array(z.custom<typeof tasks.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/tasks',
      input: insertTaskSchema,
      responses: {
        201: z.custom<typeof tasks.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/tasks/:id',
      input: insertTaskSchema.partial(),
      responses: {
        200: z.custom<typeof tasks.$inferSelect>(),
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/tasks/:id',
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    },
  },
  mood: {
    list: {
      method: 'GET' as const,
      path: '/api/mood',
      responses: {
        200: z.array(z.custom<typeof moodLogs.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/mood',
      input: insertMoodLogSchema,
      responses: {
        201: z.custom<typeof moodLogs.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
  assessments: {
    list: {
      method: 'GET' as const,
      path: '/api/assessments',
      responses: {
        200: z.array(z.custom<typeof assessments.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/assessments',
      input: insertAssessmentSchema,
      responses: {
        201: z.custom<typeof assessments.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
  health: {
    list: {
      method: 'GET' as const,
      path: '/api/health',
      responses: {
        200: z.array(z.custom<typeof healthData.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/health',
      input: insertHealthDataSchema,
      responses: {
        201: z.custom<typeof healthData.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
  user: {
    stats: {
      method: 'GET' as const,
      path: '/api/user/stats',
      responses: {
        200: z.object({
          points: z.number(),
          streak: z.number(),
          tasksCompleted: z.number(),
        }),
      },
    },
    badges: {
      method: 'GET' as const,
      path: '/api/user/badges',
      responses: {
        200: z.array(z.custom<typeof badges.$inferSelect>()),
      },
    },
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
