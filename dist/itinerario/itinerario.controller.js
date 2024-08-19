import { Itinerario } from "./itinerario.entity.js";
import { orm } from "../shared/db/orm.js";
import { itinerarioSchema } from "../schemas/itinerario.js";
const em = orm.em;
export function sanitizeItinerarioInput(req, res, next) {
    req.body.sanitizedInput = {
        titulo: req.body.titulo,
        descripcion: req.body.descripcion,
        cantDias: req.body.cantDias,
        actividades: req.body.actividades,
        participantes: req.body.participantes,
        usuario: req.body.usuario
    };
    Object.keys(req.body.sanitizedInput).forEach((key) => {
        if (req.body.sanitizedInput[key] === undefined) {
            delete req.body.sanitizedInput[key];
        }
    });
    next();
}
export async function findAll(req, res) {
    try {
        const itinerarios = await em.find(Itinerario, {}, { populate: ['actividades', 'participantes', 'usuario'] });
        if (itinerarios.length === 0) {
            return res.status(200).json({ message: "No se encontraron itinerarios" });
        }
        res.header('Access-Control-Allow-Origin', '*');
        res.status(200).json({ data: itinerarios });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
export async function findOne(req, res) {
    try {
        const id = req.params.id;
        //const objectId = new ObjectId(id);
        const itinerario = await em.findOneOrFail(Itinerario, { id });
        return res.status(200).json({ data: itinerario });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
export async function add(req, res) {
    try {
        //Valido el body
        const result = itinerarioSchema.safeParse(req.body.sanitizedInput);
        if (!result.success) {
            return res.status(400).json({ message: "Datos invalidos", error: result.error.format() });
        }
        //Valido que el usuario ingresado exista
        const usuario = await em.findOne('Usuario', { id: req.body.sanitizedInput.usuario });
        if (!usuario) {
            return res.status(400).json({ message: "El usuario ingresado no existe" });
        }
        const itinerario = em.create(Itinerario, req.body.sanitizedInput);
        await em.flush();
        return res.status(201).json({ message: "Itinerario creado con exito", data: itinerario });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
export async function update(req, res) {
    try {
        const id = req.params.id;
        //Valido los datos
        const result = itinerarioSchema.safeParse(req.body.sanitizedInput);
        if (!result.success) {
            return res.status(400).json({ message: "Datos invalidos", error: result.error.format() });
        }
        //Valido que, en caso de quererse cambiar el usuario,exista
        if (req.body.sanitizedInput.usuario) {
            const usuario = await em.findOne('Usuario', { id: req.body.sanitizedInput.usuario });
            if (!usuario) {
                return res.status(400).json({ message: "El usuario ingresado no existe" });
            }
        }
        const itinerario = em.getReference(Itinerario, id);
        em.assign(itinerario, req.body.sanitizedInput);
        await em.flush();
        return res.status(200).json({ message: "Itinerario actualizado con exito", data: itinerario });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
export async function remove(req, res) {
    try {
        const id = req.params.id;
        const itinerario = em.getReference(Itinerario, id);
        await em.removeAndFlush(itinerario);
        res.status(200).send({ message: 'Itinerario borrado', data: itinerario });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
//# sourceMappingURL=itinerario.controller.js.map