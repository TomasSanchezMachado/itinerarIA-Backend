import crypto from 'node:crypto';
export class Lugar {
    constructor(id = crypto.randomUUID(), nombre, ubicacion, codigoPostal, provincia, pais) {
        this.id = id;
        this.nombre = nombre;
        this.ubicacion = ubicacion;
        this.codigoPostal = codigoPostal;
        this.provincia = provincia;
        this.pais = pais;
    }
}
//# sourceMappingURL=lugar.entity.js.map