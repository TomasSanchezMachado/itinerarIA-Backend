import cors, { CorsOptions } from "cors";

const ACCEPTED_ORIGINS = [
  "http://localhost:5174",
  "http://localhost:5173",
  "http://localhost:3000",
  "https://itineraria-backend.onrender.com",
  "itineraria-backend-production.up.railway.app",
];

interface CorsMiddlewareOptions {
  acceptedOrigins?: string[];
}

export const corsMiddleware = ({
  acceptedOrigins = ACCEPTED_ORIGINS,
}: CorsMiddlewareOptions = {}) => {
  const options: CorsOptions = {
    origin: (origin, callback) => {
      if (!origin || acceptedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // 👈 NECESARIO para cookies
  };

  return cors(options);
};
