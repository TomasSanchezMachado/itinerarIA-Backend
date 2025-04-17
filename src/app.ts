import "reflect-metadata";
import express, { Router } from "express";
import { placeRouter } from "./place/place.routes.js";
import { itineraryRouter } from "./itinerary/itinerary.routes.js";
import { actividadRouter } from "./activity/activity.routes.js";
import { orm, syncSchema } from "./shared/db/orm.js";
import { RequestContext } from "@mikro-orm/core";
import { externalServiceRouter } from "./externalService/externalService.routes.js";
import { userRouter } from "./user/user.routes.js";
import { opinionRouter } from "./opinion/opinion.routes.js";
import { authRouter } from "./user/auth/auth.routes.js";
import cookieParser from "cookie-parser";
import { corsMiddleware } from "./shared/middlewares/corsMiddleware.js";
import { participantRouter } from "./participant/participant.routes.js";
import { preferenceRouter } from "./preference/preference.routes.js";
import { authenticateJWT } from "./shared/middlewares/jwtMiddleware.js";
import { publicExternalServiceRouter } from "./externalService/externalService.routes.public.js";
import { isAdmin } from "./shared/middlewares/adminMiddleware.js";
import { testingRouter } from "./test/testing.routes.js";

const app = express();

app.use(corsMiddleware());
app.use(express.json());
app.use(cookieParser());
app.disable("x-powered-by");

app.use((req, res, next) => {
  RequestContext.create(orm.em, next);
});

// Public routes
const publicRouter = Router();
publicRouter.use("/api/auth", authRouter);
publicRouter.use("/api/publicity", publicExternalServiceRouter);
publicRouter.use("/api/users", userRouter);

// Protected routes
const protectedRouter = Router();
protectedRouter.use(authenticateJWT);
protectedRouter.use("/api/itineraries", itineraryRouter);
protectedRouter.use("/api/activities", actividadRouter);
protectedRouter.use("/api/opiniones", opinionRouter);
protectedRouter.use("/api/participants", participantRouter);
protectedRouter.use("/api/places", placeRouter);

// Admin protected routes
const protectedAdminRouter = Router();
protectedAdminRouter.use(authenticateJWT);
protectedAdminRouter.use(isAdmin);
protectedAdminRouter.use("/api/preferences", preferenceRouter);
protectedAdminRouter.use("/api/externalServices", externalServiceRouter);

// Testing router
if (process.env.NODE_ENV === "test") {
  app.use("/api/testing", testingRouter);
  app.use("/api/places", placeRouter);
  app.use("/api/preferences", preferenceRouter);
}

// Register routers
app.use(publicRouter);
app.use(protectedRouter);
app.use(protectedAdminRouter);

// 404 handler
app.use((_, res) => {
  res.status(404).send({ message: "Resource not found" });
});

// Sync database schema
// await syncSchema();
const PORT = process.env.PORT || 3000;

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/`);
});

export default app;
