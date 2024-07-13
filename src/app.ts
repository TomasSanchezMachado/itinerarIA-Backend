import 'reflect-metadata';
import express from 'express';
import { lugarRouter } from './lugar/lugar.routes.js';
import { itinerarioRouter } from './itinerario/itinerario.routes.js';
import { actividadRouter } from './actividad/actividad.routes.js';
import { orm } from './shared/db/orm.js';
import { RequestContext } from '@mikro-orm/mongodb';
import { servicioExternoRouter } from './servicioExterno/servicioExterno.routes.js';
import { usuarioRouter } from './usuario/usuario.routes.js';
import { participanteRouter } from './participante/participante.routes.js';



const app = express();
app.use(express.json());

app.use((req, res, next) => {
  RequestContext.create(orm.em, next);
});

app.use('/api/lugares', lugarRouter);
app.use('/api/itinerarios', itinerarioRouter);
app.use('/api/serviciosExternos', servicioExternoRouter);
app.use('/api/actividades', actividadRouter);
app.use('/api/usuarios', usuarioRouter);
app.use('/api/participantes',participanteRouter)



app.use((_, res) => {
  res.status(404).send({ message: 'Resource not found' });
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000/');
});
