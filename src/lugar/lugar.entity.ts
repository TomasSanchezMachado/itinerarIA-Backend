import crypto from 'node:crypto';
type Latitud = number;
type Longitud = number;
type CoordenadasGeograficas = {
    latitud: Latitud,
    longitud: Longitud
}

export class Lugar{
    constructor(
        public nombre: string,
        public ubicacion: CoordenadasGeograficas,
        public codigoPostal: string,
        public provincia: string,
        public pais: string,
        public id = crypto.randomUUID()
    ){}
}