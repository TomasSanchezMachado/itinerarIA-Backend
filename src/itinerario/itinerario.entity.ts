import crypto from 'node:crypto';
import { Actividad } from '../actividad/actividad.entity.js'

type tipoTransporte = {

}
export class Itinerario{
    constructor(
        public titulo : string,
        public descripcion : string,
        public cantDias : number,
        public actividades : Array<Actividad>,
        public transporte : tipoTransporte,
        public id = crypto.randomUUID()
    ){}
}