import { Repository } from "../shared/repository.js";
import { Usuario } from "./usuario.entity.js";
import { Itinerario } from "../itinerario/itinerario.entity.js"

const fechaNacimientoStr = '2004-04-24';
const fechaNacimiento = new Date(fechaNacimientoStr)

const itinerariosDelUsuario = [new Itinerario()]

const usuarios = [
    new Usuario('usuario 1', 'nicolas roberto', 'escobar', fechaNacimiento, 'nicoescobar666@gmail.com', 3416481402, itinerariosDelUsuario,)
]

export class usuarioRepository implements Repository<Usuario> {
    public async findAll(): Promise<Usuario[]> {
        return await usuarios;
    }
    public async findOne(item: { id: string }): Promise<Usuario | undefined> {
        return await usuarios.find(usuario => usuario.id === item.id);
    }
    public async add(item: Usuario): Promise<Usuario | undefined> {
        usuarios.push(item);
        return item;
    }
    public async update(item: Usuario): Promise<Usuario | undefined> {
        const index = usuarios.findIndex(usuario => usuario.id === item.id);
        if (index === -1) return undefined;
        usuarios[index] = { ...usuarios[index], ...item }
        return item;
    }
    public async delete(item: { id: string }): Promise<Usuario | undefined> {
        const usuarioIdx = usuarios.findIndex(usuario => usuario.id === item.id);
        if (usuarioIdx !== -1) {
            return await usuarios.splice(usuarioIdx, 1)[0];
        }
    }




}