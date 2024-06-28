import { Lugar } from "./lugar.entity.js";
import { orm } from "../shared/db/orm.js";
const em = orm.em;
export function sanitizeLugarInput(req, res, next) {
    req.body.sanitizedInput = {
        nombre: req.body.nombre,
        ubicacion: req.body.ubicacion,
        codigoPostal: req.body.codigoPostal,
        provincia: req.body.provincia,
        pais: req.body.pais
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
        const lugares = await em.find(Lugar, {}, { populate: ['serviciosExternos'] });
        if (lugares.length === 0) {
            return res.status(200).json({ message: "No se encontraron lugares" });
        }
        res.status(200).json({ data: lugares });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
export async function findOne(req, res) {
    try {
        const id = req.params.id;
        const lugar = await em.findOneOrFail(Lugar, { id });
        return res.status(200).json({ data: lugar });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
export async function add(req, res) {
    try {
        const lugar = em.create(Lugar, req.body.sanitizedInput);
        await em.flush();
        return res.status(201).json({ message: "Lugar creado con exito", data: lugar });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
export async function update(req, res) {
    try {
        const id = req.params.id;
        const lugar = em.getReference(Lugar, id);
        em.assign(lugar, req.body.sanitizedInput);
        await em.flush();
        return res.status(200).json({ message: "Lugar actualizado con exito", data: lugar });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
export async function remove(req, res) {
    try {
        const id = req.params.id;
        const lugar = em.getReference(Lugar, id);
        await em.removeAndFlush(lugar);
        res.status(200).send({ message: 'Lugar borrado', data: lugar });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
//# sourceMappingURL=lugar.controller.js.map