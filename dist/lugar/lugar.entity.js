import crypto from 'node:crypto';
export class Lugar {
    constructor(nombre, ubicacion, codigoPostal, provincia, pais, id = crypto.randomUUID()) {
        this.nombre = nombre;
        this.ubicacion = ubicacion;
        this.codigoPostal = codigoPostal;
        this.provincia = provincia;
        this.pais = pais;
        this.id = id;
    }
}
//# sourceMappingURL=lugar.entity.js.map