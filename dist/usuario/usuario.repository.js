import { Itinerario } from "./itinerario.entity.js";
const itinerarios = [
    new Itinerario('Itinerario 1', 'Itinerario hecho para 5 dias en Rosario...', 5, [{
            nombre: 'Monumento',
            descripcion: 'Paseo por monumento a la bandera',
            aireLibre: true,
            id: crypto.randomUUID()
        },
        {
            nombre: 'City Center',
            descripcion: 'Casino City Center',
            aireLibre: false,
            id: crypto.randomUUID()
        }], 'Auto'),
];
export class ItinerarioRepository {
    async findAll() {
        return await itinerarios;
    }
    async findOne(item) {
        return await itinerarios.find(itinerario => itinerario.id === item.id);
    }
    async add(item) {
        itinerarios.push(item);
        return item;
    }
    async update(item) {
        const index = itinerarios.findIndex(Itinerario => Itinerario.id === item.id);
        if (index === -1)
            return undefined;
        itinerarios[index] = { ...itinerarios[index], ...item };
        return item;
    }
    async delete(item) {
        const itinerarioIdx = itinerarios.findIndex(itinerario => itinerario.id === item.id);
        if (itinerarioIdx !== -1) {
            return await itinerarios.splice(itinerarioIdx, 1)[0];
        }
    }
}
//# sourceMappingURL=usuario.repository.js.map