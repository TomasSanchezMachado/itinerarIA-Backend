import { Lugar } from "./lugar.entity.js";
const lugares = [
    new Lugar('b20d4893-831e-44e5-9733-0eb17646d4ed', 'Casa de Juan', '10°10\'10"S-10°10\'10\"W', '12345', 'Sevilla', 'España'),
];
export class LugarRepository {
    async findAll() {
        return await lugares;
    }
    async findOne(item) {
        return await lugares.find(lugar => lugar.id === item.id);
    }
    async add(item) {
        lugares.push(item);
        return item;
    }
    async update(item) {
        const index = lugares.findIndex(lugar => lugar.id === item.id);
        if (index === -1)
            return undefined;
        lugares[index] = item;
        return item;
    }
    async delete(item) {
        const index = lugares.findIndex(lugar => lugar.id === item.id);
        if (index === -1)
            throw new Error('No se ha encontrado el lugar');
        const lugar = lugares[index];
        lugares.splice(index, 1);
        return lugar;
    }
}
//# sourceMappingURL=lugar.repository.js.map