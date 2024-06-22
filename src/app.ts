import express,{NextFunction,Request,Response} from 'express';
import { Lugar } from './lugar/lugar.entity.js';
import { LugarRepository } from './lugar/lugar.repository.js';
import { lugarRouter } from './lugar/lugar.routes.js';
import { itinerarioRouter } from './itinerario/itinerario.routes.js';
import { actividadRouter } from './actividad/actividad.routes.js';



const app = express();

app.use(express.json());


app.use('/api/lugares', lugarRouter);
app.use('/api/itinerarios',itinerarioRouter);
app.use('/api/actividades',actividadRouter)

app.use((_, res) => {
  res.status(404).send({ message: 'Resource not found' });
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000/');
});
    