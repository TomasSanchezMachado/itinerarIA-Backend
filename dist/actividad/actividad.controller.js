import { ActividadRepository } from "./actividad.repository.js";
import { Actividad } from "./actividad.entity.js";
const repository = new ActividadRepository();
export function sanitizeActividadInput(req, res, next) {
    req.body.sanitizedInput = {
        nombre: req.body.nombre,
        descripcion: req.body.descripcion,
        aireLibre: req.body.aireLibre,
    };
    Object.keys(req.body.sanitizedInput).forEach((key) => {
        if (req.body.sanitizedInput[key] === undefined) {
            delete req.body.sanitizedInput[key];
        }
    });
    next();
}
export async function findAll(req, res) {
    const actividades = await repository.findAll();
    if (!actividades) {
        return res.status(404).send({ data: 'Actividad no encontrado' });
    }
    res.status(200).json({ data: actividades });
}
export async function findOne(req, res) {
    const actividad = await repository.findOne({ id: req.params.id });
    if (!actividad) {
        return res.status(404).send({ message: "Actividad no encontrada" });
    }
    res.json({ data: actividad });
}
export async function add(req, res) {
    const result = req.body.sanitizedInput;
    const input = result.data;
    const actividadInput = new Actividad(input.nombre, input.descripcion, input.aireLibre);
    const actividad = await repository.add(actividadInput);
    return res
        .status(201)
        .send({ message: "Actividad cargada correctamente", data: actividad });
}
export async function update(req, res) {
    req.body.sanitizedInput.id = req.params.id;
    const result = (req.body.sanitizedInput);
    const actividad = await repository.update(req.body.sanitizedInput);
    if (!actividad) {
        return res.status(404).send({ message: "Actividad no encontrada" });
    }
    res.status(200).send({
        message: "Actividad actualizada correctamente",
        data: actividad,
    });
}
export async function remove(req, res) {
    const actividad = await repository.delete({ id: req.params.id });
    if (!actividad) {
        return res.status(404).send({ message: "Actividad no encontrada" });
    }
    return res.status(200).json({ message: "Actividad eliminada correctamente", data: actividad });
}
//# sourceMappingURL=actividad.controller.js.map