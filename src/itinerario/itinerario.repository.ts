import { Repository } from "../shared/repository.js";
import { Itinerario } from "./itinerario.entity.js";

const itinerarios = [
    new Itinerario(),
    
]

export class ItinerarioRepository implements Repository<Itinerario>{
  public async findAll(): Promise<Itinerario[]>{
    return await itinerarios;
    } 
    public async findOne(item: {id: string}): Promise<Itinerario | undefined>{
        return await itinerarios.find(itinerario => itinerario.id === item.id);
    }
    public async add(item: Itinerario): Promise<Itinerario | undefined>{
        itinerarios.push(item);
        return item;
    }
    public async update(item: Itinerario): Promise<Itinerario | undefined>{
        const index = itinerarios.findIndex(Itinerario => Itinerario.id === item.id);
        if(index === -1) return undefined;
        itinerarios[index] = {...itinerarios[index], ...item}
        return item;
    }
    public async delete(item: {id: string}): Promise<Itinerario | undefined>{
        const itinerarioIdx = itinerarios.findIndex(itinerario => itinerario.id === item.id);
        if (itinerarioIdx !== -1) {
            return await itinerarios.splice(itinerarioIdx, 1)[0];
        }
    }
    



}