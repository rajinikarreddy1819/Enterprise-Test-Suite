import { z } from "zod";
import { insertApplicationSchema, insertPrescriptionSchema, doctors, applications, prescriptions, qrScanLogs } from "./schema";

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
  unauthorized: z.object({
    message: z.string(),
  }),
};

export const api = {
  auth: {
    login: {
      method: "POST" as const,
      path: "/api/auth/login" as const,
      input: z.object({
        username: z.string(),
        password: z.string(),
      }),
      responses: {
        200: z.object({
          id: z.number(),
          username: z.string(),
          fullName: z.string(),
          userType: z.string(),
        }),
        401: errorSchemas.unauthorized,
      },
    },
    me: {
      method: "GET" as const,
      path: "/api/auth/me" as const,
      responses: {
        200: z.object({
          id: z.number(),
          username: z.string(),
          fullName: z.string(),
          userType: z.string(),
          doctorId: z.number().optional(),
        }),
        401: errorSchemas.unauthorized,
      }
    },
    logout: {
      method: "POST" as const,
      path: "/api/auth/logout" as const,
      responses: {
        200: z.object({ message: z.string() })
      }
    }
  },
  public: {
    search: {
      method: "GET" as const,
      path: "/api/public/search" as const,
      responses: {
        200: z.array(z.custom<typeof doctors.$inferSelect & { fullName?: string }>()),
      }
    },
    doctorDetails: {
      method: "GET" as const,
      path: "/api/public/doctor/:license" as const,
      responses: {
        200: z.custom<typeof doctors.$inferSelect & { fullName?: string }>(),
        404: errorSchemas.notFound,
      }
    },
    logScan: {
      method: "POST" as const,
      path: "/api/public/scan" as const,
      input: z.object({
        licenseNumber: z.string(),
        deviceType: z.string().optional(),
        scannerLocation: z.string().optional(),
      }),
      responses: {
        200: z.object({ success: z.boolean() })
      }
    }
  },
  applications: {
    apply: {
      method: "POST" as const,
      path: "/api/applications/apply" as const,
      input: insertApplicationSchema,
      responses: {
        201: z.custom<typeof applications.$inferSelect>(),
      }
    },
    track: {
      method: "GET" as const,
      path: "/api/applications/track/:applicationId" as const,
      responses: {
        200: z.custom<typeof applications.$inferSelect>(),
        404: errorSchemas.notFound,
      }
    },
    list: {
      method: "GET" as const,
      path: "/api/applications" as const,
      responses: {
        200: z.array(z.custom<typeof applications.$inferSelect>()),
        401: errorSchemas.unauthorized,
      }
    },
    updateStatus: {
      method: "POST" as const,
      path: "/api/applications/:id/status" as const,
      input: z.object({
        status: z.string(),
        reviewNotes: z.string().optional(),
        assignedOfficer: z.string().optional(),
      }),
      responses: {
        200: z.custom<typeof applications.$inferSelect>(),
        401: errorSchemas.unauthorized,
      }
    }
  },
  doctors: {
    list: {
      method: "GET" as const,
      path: "/api/doctors" as const,
      responses: {
        200: z.array(z.custom<typeof doctors.$inferSelect & { fullName?: string }>()),
        401: errorSchemas.unauthorized,
      }
    },
    updateStatus: {
      method: "POST" as const,
      path: "/api/doctors/:id/status" as const,
      input: z.object({
        verificationStatus: z.string(),
      }),
      responses: {
        200: z.custom<typeof doctors.$inferSelect>(),
        401: errorSchemas.unauthorized,
      }
    },
    prescriptions: {
      method: "POST" as const,
      path: "/api/doctors/prescriptions" as const,
      input: insertPrescriptionSchema,
      responses: {
        201: z.custom<typeof prescriptions.$inferSelect>(),
        401: errorSchemas.unauthorized,
      }
    },
    prescriptionsList: {
      method: "GET" as const,
      path: "/api/doctors/prescriptions" as const,
      responses: {
        200: z.array(z.custom<typeof prescriptions.$inferSelect>()),
        401: errorSchemas.unauthorized,
      }
    }
  },
  admin: {
    scans: {
      method: "GET" as const,
      path: "/api/admin/scans" as const,
      responses: {
        200: z.array(z.custom<typeof qrScanLogs.$inferSelect>()),
        401: errorSchemas.unauthorized,
      }
    }
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
