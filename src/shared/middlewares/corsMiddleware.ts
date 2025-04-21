import cors, { CorsOptions } from "cors";

export const ACCEPTED_ORIGINS = [
  "http://localhost:5174",
  "http://localhost:5173",
  "https://itinerar-ia-frontend.vercel.app",
];

interface CorsMiddlewareOptions {
  acceptedOrigins?: string[];
}

export const corsMiddleware = ({
  acceptedOrigins = ACCEPTED_ORIGINS,
}: CorsMiddlewareOptions = {}) => {
  const options: CorsOptions = {
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (acceptedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    maxAge: 86400, // 24 hours
  };

  return cors(options);
};
