import 'reflect-metadata';
import express from 'express';
import { lugarRouter } from './lugar/lugar.routes.js';
import { itineraryRouter } from './itinerary/itinerary.routes.js';
import { actividadRouter } from './actividad/actividad.routes.js';
import { orm } from './shared/db/orm.js';
import { RequestContext } from '@mikro-orm/core';
import { servicioExternoRouter } from './servicioExterno/servicioExterno.routes.js';
import { usuarioRouter } from './usuario/usuario.routes.js';
import { opinionRouter } from './opinion/opinion.routes.js';
import { authRouter } from "./usuario/auth/auth.routes.js";
import cookieParser from 'cookie-parser';
import { corsMiddleware } from './shared/middlewares/corsMiddleware.js';
import { participantRouter } from './participant/participant.routes.js';
const app = express();
app.use(corsMiddleware());
app.use(express.json());
app.use(cookieParser());
app.disable('x-powered-by');
app.use((req, res, next) => {
    RequestContext.create(orm.em, next);
});
app.use('/api/lugares', lugarRouter);
app.use('/api/itinerarios', itineraryRouter);
app.use('/api/externalServices', servicioExternoRouter);
app.use('/api/actividades', actividadRouter);
app.use('/api/usuarios', usuarioRouter);
app.use('/api/opiniones', opinionRouter);
app.use('/api/auth', authRouter);
app.use('/api/participants', participantRouter);
app.use((_, res) => {
    res.status(404).send({ message: 'Resource not found' });
});
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000/');
});
//# sourceMappingURL=app.js.map