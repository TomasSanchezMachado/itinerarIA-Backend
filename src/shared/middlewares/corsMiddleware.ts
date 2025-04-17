import cors, { CorsOptions } from "cors";

const ACCEPTED_ORIGINS = [
  "http://localhost:5174",
  "http://localhost:5173",
  "http://localhost:3000",
  "https://itineraria-backend-production.up.railway.app/",
  "https://itinerariafrontend.vercel.app/",
];

interface CorsMiddlewareOptions {
  acceptedOrigins?: string[];
}

export const corsMiddleware = ({
  acceptedOrigins = ACCEPTED_ORIGINS,
}: CorsMiddlewareOptions = {}) => {
  const options: CorsOptions = {
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void
    ) => {
      if (origin && acceptedOrigins.includes(origin)) {
        return callback(null, true);
      }

      if (!origin) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  };

  return cors(options);
};
