import express,{NextFunction,Request,Response} from 'express';
import { Lugar } from './lugar/lugar.entity.js';
import { LugarRepository } from './lugar/lugar.repository.js';
import { lugarRouter } from './lugar/lugar.routes.js';



const app = express();

app.use(express.json());


app.use('/api/lugares', lugarRouter);

app.use((_, res) => {
  res.status(404).send({ message: 'Resource not found' });
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000/');
});
    