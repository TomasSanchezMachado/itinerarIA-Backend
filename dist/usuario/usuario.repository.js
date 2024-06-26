import { Usuario } from "./usuario.entity.js";
import { Itinerario } from "../itinerario/itinerario.entity.js";
const fechaNacimientoStr = '2004-04-24';
const fechaNacimiento = new Date(fechaNacimientoStr);
const itinerariosDelUsuario = [new Itinerario('Itinerario 1', 'Itinerario hecho para 5 dias en Rosario...', 5, [{
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
const usuarios = [
    new Usuario('usuario 1', 'nicolas roberto', 'escobar', fechaNacimiento, 'nicoescobar666@gmail.com', 3416481402, itinerariosDelUsuario, '1111')
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