import 'reflect-metadata';
import express, { Router } from 'express';
import { placeRouter } from './place/place.routes.js';
import { itineraryRouter } from './itinerary/itinerary.routes.js';
import { actividadRouter } from './activity/activity.routes.js';
import { orm, syncSchema } from './shared/db/orm.js';
import { RequestContext } from '@mikro-orm/core';
import { externalServiceRouter } from './externalService/externalService.routes.js';
import { userRouter } from './user/user.routes.js';
import { opinionRouter } from './opinion/opinion.routes.js';
import { authRouter } from "./user/auth/auth.routes.js"
import cookieParser from 'cookie-parser';
import { corsMiddleware } from './shared/middlewares/corsMiddleware.js';
import { participantRouter } from './participant/participant.routes.js';
import { preferenceRouter } from './preference/preference.routes.js';
import { authenticateJWT } from './shared/middlewares/jwtMiddleware.js';
import { publicExternalServiceRouter } from './externalService/externalService.routes.public.js';




const app = express();

app.use(corsMiddleware());
app.use(express.json());
app.use(cookieParser());


app.use;


app.disable("x-powered-by");

app.use((req, res, next) => {
  RequestContext.create(orm.em, next);
});


//Public routes
const publicRouter = Router();

publicRouter.use('/api/auth', authRouter)
publicRouter.use('/api/publicity', publicExternalServiceRouter)
publicRouter.use('/api/users', userRouter)

//Protected routes
const protectedRouter = Router();

protectedRouter.use(authenticateJWT);

protectedRouter.use('/api/places', placeRouter);
protectedRouter.use('/api/itinerarios', itineraryRouter);
protectedRouter.use('/api/externalServices', externalServiceRouter);
protectedRouter.use('/api/activities', actividadRouter)
protectedRouter.use('/api/opiniones', opinionRouter);
protectedRouter.use('/api/participants', participantRouter);
protectedRouter.use('/api/preferences', preferenceRouter);

app.use(publicRouter);
app.use(protectedRouter);



app.use("/api/places", authenticateJWT, placeRouter);
app.use("/api/itineraries", itineraryRouter);
app.use("/api/externalServices", authenticateJWT, externalServiceRouter);
app.use("/api/activities", authenticateJWT, actividadRouter);
app.use("/api/users", userRouter);
app.use("/api/opiniones", authenticateJWT, opinionRouter);
app.use("/api/participants", authenticateJWT, participantRouter);
app.use("/api/preferences", authenticateJWT, preferenceRouter);

app.use((_, res) => {
  res.status(404).send({ message: "Resource not found" });
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000/");
});

export default app;
