import { Repository } from "../shared/repository.js";
import { Lugar } from "./lugar.entity.js";

const lugares = [
    new Lugar('b20d4893-831e-44e5-9733-0eb17646d4ed', 'Casa de Juan', '10°10\'10"S-10°10\'10\"W', '12345', 'Sevilla', 'España'),
    
]

export class LugarRepository implements Repository<Lugar>{
  public async findAll(): Promise<Lugar[]>{
    return await lugares;
    } 
    public async findOne(item: {id: string}): Promise<Lugar | undefined>{
        return await lugares.find(lugar => lugar.id === item.id);
    }
    public async add(item: Lugar): Promise<Lugar | undefined>{
        lugares.push(item);
        return item;
    }
    public async update(item: Lugar): Promise<Lugar | undefined>{
        const index = lugares.findIndex(lugar => lugar.id === item.id);
        if(index === -1) return undefined;
        lugares[index] = item;
        return item;
    }
    public async delete(item: {id: string}): Promise<Lugar>{
        const index = lugares.findIndex(lugar => lugar.id === item.id);
        if(index === -1) throw new Error('No se ha encontrado el lugar');
        const lugar = lugares[index];
        lugares.splice(index, 1);
        return lugar;
    }
    



}