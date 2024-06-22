import crypto from 'node:crypto';
export class Itinerario {
    constructor(titulo, descripcion, cantDias, actividades, transporte, id = crypto.randomUUID()) {
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.cantDias = cantDias;
        this.actividades = actividades;
        this.transporte = transporte;
        this.id = id;
    }
}
//# sourceMappingURL=itinerario.entity.js.map