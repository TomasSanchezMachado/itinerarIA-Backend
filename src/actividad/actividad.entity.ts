import crypto from 'node:crypto';

type tipoTransporte = {

}
type Etiqueta = {

}
export class Actividad{
    constructor(
        public nombre : string,
        public descripcion : string,
        public aireLibre : boolean,
      //public opniones : Array<Opinion>,
      //public etiquetas : Array<Etiqueta>,
        public id = crypto.randomUUID()
    ){}
}