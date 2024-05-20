import { LugarRepository } from "./lugar.repository.js";
import { Lugar } from "./lugar.entity.js";
const repository = new LugarRepository();
export function sanitizeLugarInput(req, res, next) {
    req.body.sanitizedInput = {
        nombre: req.body.nombre,
        ubicacion: req.body.ubicacion,
        codigoPostal: req.body.codigoPostal,
        provincia: req.body.provincia,
        pais: req.body.pais
    };
    //more checks here
    Object.keys(req.body.sanitizedInput).forEach((key) => {
        if (req.body.sanitizedInput[key] === undefined) {
            delete req.body.sanitizedInput[key];
        }
    });
    next();
}
export async function findAll(req, res) {
    const lugares = await repository.findAll();
    if (!lugares) {
        return res.status(404).send({ data: 'Lugares not found' });
    }
    res.status(200).json({ data: lugares });
}
export async function findOne(req, res) {
    const lugar = await repository.findOne({ id: req.params.id });
    if (!lugar) {
        return res.status(404).send({ message: "Lugar no encontrado" });
    }
    res.json({ data: lugar });
}
export async function add(req, res) {
    const input = req.body.sanitizedInput;
    const lugarInput = new Lugar(input.nombre, input.ubicacion, input.codigoPostal, input.provincia, input.pais);
    const lugar = await repository.add(lugarInput);
    return res
        .status(201)
        .send({ message: "Lugar cargado correctamente", data: lugar });
}
export async function update(req, res) {
    req.body.sanitizedInput.id = req.params.id;
    const lugar = await repository.update(req.body.sanitizedInput);
    if (!lugar) {
        return res.status(404).send({ message: "Lugar no encontrado" });
    }
    res.status(200).send({
        message: "Lugar actualizado correctamente",
        data: lugar,
    });
}
export async function remove(req, res) {
    const lugar = await repository.delete({ id: req.params.id });
    if (!lugar) {
        return res.status(404).send({ message: "Lugar no encontrado" });
    }
    return res.status(200).json({ message: "Lugar eliminado correctamente", data: lugar });
}
//# sourceMappingURL=lugar.controller.js.map