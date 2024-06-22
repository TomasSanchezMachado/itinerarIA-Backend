import crypto from 'node:crypto';
export class Actividad {
    constructor(nombre, descripcion, aireLibre, 
    //public opniones : Array<Opinion>,
    //public etiquetas : Array<Etiqueta>,
    id = crypto.randomUUID()) {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.aireLibre = aireLibre;
        this.id = id;
    }
}
//# sourceMappingURL=actividad.entity.js.map