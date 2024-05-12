import crypto from 'node:crypto';
type direccionX =  'E' | 'W';
type direccionY = 'S' | 'N' 
type CoordenadasGeograficas = `${number}°${number}'${number}"${direccionY}-${number}°${number}'${number}"${direccionX}`

export class Lugar{
    constructor(
        public id = crypto.randomUUID(),
        public nombre: string,
        public ubicacion: CoordenadasGeograficas,
        public codigoPostal: string,
        public provincia: string,
        public pais: string,
    ){}
}