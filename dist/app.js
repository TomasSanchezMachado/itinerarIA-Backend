import 'reflect-metadata';
import express from 'express';
import { placeRouter } from './place/place.routes.js';
import { itineraryRouter } from './itinerary/itinerary.routes.js';
import { actividadRouter } from './activity/activity.routes.js';
import { orm, syncSchema } from './shared/db/orm.js';
import { RequestContext } from '@mikro-orm/core';
import { externalServiceRouter } from './externalService/externalService.routes.js';
import { userRouter } from './user/user.routes.js';
import { opinionRouter } from './opinion/opinion.routes.js';
import { authRouter } from "./user/auth/auth.routes.js";
import cookieParser from 'cookie-parser';
import { corsMiddleware } from './shared/middlewares/corsMiddleware.js';
import { participantRouter } from './participant/participant.routes.js';
import { preferenceRouter } from './preference/preference.routes.js';
import { authenticateJWT } from './shared/middlewares/jwtMiddleware.js';
const app = express();
app.use(corsMiddleware());
app.use(express.json());
app.use(cookieParser());
app.use;
app.disable('x-powered-by');
app.use((req, res, next) => {
    RequestContext.create(orm.em, next);
});
app.use('/api/auth', authRouter);
app.use('/api/places', authenticateJWT, placeRouter);
app.use('/api/itinerarios', authenticateJWT, itineraryRouter);
app.use('/api/externalServices', authenticateJWT, externalServiceRouter);
app.use('/api/activities', authenticateJWT, actividadRouter);
app.use('/api/users', userRouter);
app.use('/api/opiniones', authenticateJWT, opinionRouter);
app.use('/api/participants', authenticateJWT, participantRouter);
app.use('/api/preferences', authenticateJWT, preferenceRouter);
app.use((_, res) => {
    res.status(404).send({ message: 'Resource not found' });
});
await syncSchema();
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000/');
});
//# sourceMappingURL=app.js.map