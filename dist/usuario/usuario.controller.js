import { usuarioRepository } from "./usuario.repository.js";
import { Usuario } from "./usuario.entity.js";
const repository = new usuarioRepository();
export function sanitizeUsuarioInput(req, res, next) {
    req.body.sanitizedInput = {
        nombreDeUsuario: req.body.nombreDeUsuario,
        nombres: req.body.nombres,
        apellidos: req.body.apellidos,
        fechaNacimiento: req.body.fechaNacimiento,
        mail: req.body.mail,
        nroTelefono: req.body.nroTelefono,
        itinerarios: req.body.itinerarios,
        //opiniones: req.body.opiniones
        id: req.body.id
    };
    Object.keys(req.body.sanitizedInput).forEach((key) => {
        if (req.body.sanitizedInput[key] === undefined) {
            delete req.body.sanitizedInput[key];
        }
    });
    next();
}
export async function findAll(req, res) {
    const usuarios = await repository.findAll();
    if (!usuarios) {
        return res.status(404).send({ data: 'No se encontraron usuarios' });
    }
    res.status(200).json({ data: usuarios });
}
export async function findOne(req, res) {
    const usuario = await repository.findOne({ id: req.params.id });
    if (!usuario) {
        return res.status(404).send({ message: "usuario no encontrado" });
    }
    res.json({ data: usuario });
}
export async function add(req, res) {
    const input = req.body.sanitizedInput;
    const usuarioInput = new Usuario(input.nombreDeUsuario, input.nombres, input.apellidos, input.fechaNacimiento, input.mail, input.nroTelefono, input.itinerarios, input.id);
    const usuario = await repository.add(usuarioInput);
    return res
        .status(201)
        .send({ message: "usuario cargado correctamente", data: usuario });
}
export async function update(req, res) {
    req.body.sanitizedInput.id = req.params.id;
    const result = (req.body.sanitizedInput);
    const usuario = await repository.update(req.body.sanitizedInput);
    if (!usuario) {
        return res.status(404).send({ message: "usuario no encontrado" });
    }
    res.status(200).send({
        message: "usuario actualizado correctamente",
        data: usuario,
    });
}
export async function remove(req, res) {
    const usuario = await repository.delete({ id: req.params.id });
    if (!usuario) {
        return res.status(404).send({ message: "usuario no encontrado" });
    }
    return res.status(200).json({ message: "usuario eliminado correctamente", data: usuario });
}
//# sourceMappingURL=usuario.controller.js.map