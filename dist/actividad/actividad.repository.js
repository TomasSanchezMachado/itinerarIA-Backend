import { Actividad } from "./actividad.entity.js";
const actividades = [
    new Actividad('Monumento a la Bandera', 'Paseo por el monumento a la bandera en la ciudad de Rosario', true),
];
export class ActividadRepository {
    async findAll() {
        return actividades;
    }
    async findOne(item) {
        return actividades.find(actividad => actividad.id === item.id);
    }
    async add(item) {
        actividades.push(item);
        return item;
    }
    async update(item) {
        const index = actividades.findIndex(Actividad => Actividad.id === item.id);
        if (index === -1)
            return undefined;
        actividades[index] = { ...actividades[index], ...item };
        return item;
    }
    async delete(item) {
        const actividadIdx = actividades.findIndex(actividad => actividad.id === item.id);
        if (actividadIdx !== -1) {
            return actividades.splice(actividadIdx, 1)[0];
        }
    }
}
//# sourceMappingURL=actividad.repository.js.map