import { Repository } from "../shared/repository.js";
import { Lugar } from "./lugar.entity.js";

const lugares = [
    new Lugar('Casa de Juan', {latitud: 40.4167, longitud: -3.70325}, '28001', 'Madrid', 'España'),
    
]

export class LugarRepository implements Repository<Lugar>{
  public async findAll(): Promise<Lugar[]>{
    return lugares;
    } 
    public async findOne(item: {id: string}): Promise<Lugar | undefined>{
        return lugares.find(lugar => lugar.id === item.id);
    }
    public async add(item: Lugar): Promise<Lugar | undefined>{
        lugares.push(item);
        return item;
    }
    public async update(item: Lugar): Promise<Lugar | undefined>{
        const index = lugares.findIndex(lugar => lugar.id === item.id);
        if(index === -1) return undefined;
        lugares[index] = {...lugares[index], ...item}
        return item;
    }
    public async delete(item: {id: string}): Promise<Lugar | undefined>{
        const lugarIdx = lugares.findIndex(lugar => lugar.id === item.id);
        if (lugarIdx !== -1) {
            return lugares.splice(lugarIdx, 1)[0];
        }
    }
    



}