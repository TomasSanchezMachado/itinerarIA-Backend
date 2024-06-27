import crypto from 'node:crypto';
import { Itinerario } from '../itinerario/itinerario.entity.js'
//import {Opinion} from '../opinion/opinion.entity.js'

type tipoTransporte = {

}
export class Usuario {
    constructor(
        public nombreDeUsuario: string, //Hay que crear un tipo para el nombre de usuario
        public nombres: string,
        public apellidos: string,
        public fechaNacimiento: Date,
        public mail: string,
        public nroTelefono: number,
        public itinerarios: Array<Itinerario>,
        //public opiniones: Array<Opinion>,
        public readonly id = crypto.randomUUID()
    ) { }
}