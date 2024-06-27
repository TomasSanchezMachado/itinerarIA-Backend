import { Usuario } from "./usuario.entity.js";
import { Itinerario } from "../itinerario/itinerario.entity.js";
const fechaNacimientoStr = '2004-04-24';
const fechaNacimiento = new Date(fechaNacimientoStr);
const itinerariosDelUsuario = [new Itinerario()];
const usuarios = [
    new Usuario('usuario 1', 'nicolas roberto', 'escobar', fechaNacimiento, 'nicoescobar666@gmail.com', 3416481402, itinerariosDelUsuario)
];
export class usuarioRepository {
    async findAll() {
        return await usuarios;
    }
    async findOne(item) {
        return await usuarios.find(usuario => usuario.id === item.id);
    }
    async add(item) {
        usuarios.push(item);
        return item;
    }
    async update(item) {
        const index = usuarios.findIndex(usuario => usuario.id === item.id);
        if (index === -1)
            return undefined;
        usuarios[index] = { ...usuarios[index], ...item };
        return item;
    }
    async delete(item) {
        const usuarioIdx = usuarios.findIndex(usuario => usuario.id === item.id);
        if (usuarioIdx !== -1) {
            return await usuarios.splice(usuarioIdx, 1)[0];
        }
    }
}
//# sourceMappingURL=usuario.repository.js.map