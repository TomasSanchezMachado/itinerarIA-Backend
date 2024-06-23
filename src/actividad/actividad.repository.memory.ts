// import { Repository } from "../shared/repository.js";
// import { Actividad } from "./actividad.entity.js";

// const actividades = [
//     new Actividad(
//         'Monumento a la Bandera','Paseo por el monumento a la bandera en la ciudad de Rosario',true
//     ),
    
// ]

// export class ActividadRepository implements Repository<Actividad>{
//   public async findAll(): Promise<Actividad[]>{
//     return actividades;
//     } 
//     public async findOne(item: {id: string}): Promise<Actividad | undefined>{
//         return actividades.find(actividad => actividad.id === item.id);
//     }
//     public async add(item: Actividad): Promise<Actividad | undefined>{
//         actividades.push(item);
//         return item;
//     }
//     public async update(item: Actividad): Promise<Actividad | undefined>{
//         const index = actividades.findIndex(Actividad => Actividad.id === item.id);
//         if(index === -1) return undefined;
//         actividades[index] = {...actividades[index], ...item}
//         return item;
//     }
//     public async delete(item: {id: string}): Promise<Actividad | undefined>{
//         const actividadIdx = actividades.findIndex(actividad => actividad.id === item.id);
//         if (actividadIdx !== -1) {
//             return actividades.splice(actividadIdx, 1)[0];
//         }
//     }
    



// }