import { Usuario } from "./usuario.entity.js";
import { orm } from '../shared/db/orm.js';
import { ObjectId } from "@mikro-orm/mongodb";
import bcrypt from 'bcrypt';
import { z } from 'zod';
const em = orm.em;
export function sanitizeUsuarioInput(req, res, next) {
    req.body.sanitizedInput = {
        nombreDeUsuario: req.body.nombreDeUsuario,
        password: req.body.password,
        nombres: req.body.nombres,
        apellidos: req.body.apellidos,
        fechaNacimiento: req.body.fechaNacimiento,
        mail: req.body.mail,
        nroTelefono: req.body.nroTelefono,
        itinerarios: req.body.itinerarios,
        opiniones: req.body.opiniones
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
        const usuarios = await em.find(Usuario, {}, { populate: ['itinerarios.actividades'] });
        res.header('Access-Control-Allow-Origin', '*');
        res.status(200).json({ message: "Usuarios encontrados exitosamente:", data: usuarios });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
export async function findOne(req, res) {
    try {
        const id = req.params.id;
        const objectId = new ObjectId(id);
        const usuario = await em.findOneOrFail(Usuario, { _id: objectId }, { populate: ['itinerarios.actividades'] });
        return res
            .status(200)
            .json({ message: "Usuario encontrado exitosamente", data: usuario });
    }
    catch (error) {
        return res.status(500).send({ message: error.message });
    }
}
export async function add(req, res) {
    try {
        //Validacion de que los datos sean válidos
        const nombreUsuarioRegex = /^[a-zA-Z0-9_-]{3,30}$/;
        const contraseñaRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
        const mailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        const nombreRegex = /^[A-Za-z ]+$/; //Se usa + porque no se indica una longitud máxima
        const apellidoRegex = /^[A-Za-z ]+$/;
        const nombreUsuarioSchema = z.string().regex(nombreUsuarioRegex, { message: "El nombre de usuario debe tener entre 3 y 30 caracteres y solo puede contener letras, números, guiones bajos y guiones medios" });
        const contraseñaSchema = z.string().regex(contraseñaRegex, { message: "La contraseña debe tener al menos 8 caracteres, una letra mayúscula y un número" });
        const mailSchema = z.string().regex(mailRegex, { message: "El email debe tener un formato válido" });
        const nombresSchema = z.string().regex(nombreRegex, { message: "El nombre debe contener solo letras" });
        const apellidoSchema = z.string().regex(apellidoRegex, { message: "El apellido debe contener solo letras" });
        let resultNombreUsuario = nombreUsuarioSchema.safeParse(req.body.nombreDeUsuario);
        let resultContraseña = contraseñaSchema.safeParse(req.body.password);
        let resultMail = mailSchema.safeParse(req.body.mail);
        let resultNombres = nombresSchema.safeParse(req.body.nombres);
        let resultApellido = apellidoSchema.safeParse(req.body.apellidos);
        if (!resultNombreUsuario.success) {
            return res.status(400).json({
                message: "Nombre de usuario inválido", error: resultNombreUsuario.error.format()
            });
        }
        if (!resultContraseña.success) {
            return res.status(400).json({
                message: "Contraseña inválida", error: resultContraseña.error.format()
            });
        }
        if (!resultMail.success) {
            return res.status(400).json({
                message: "El mail es invalido", error: resultMail.error.format()
            });
        }
        if (!resultNombres.success) {
            return res.status(400).json({
                message: "El nombre es inválido", error: resultNombres.error.format()
            });
        }
        if (!resultApellido.success) {
            return res.status(400).json({
                message: "El apellido es inválido",
                error: resultApellido.error.format()
            });
        }
        //Validacion de que no exista un usuario con el mismo nombre de usuario
        const usuarioExistente = await em.findOne(Usuario, { nombreDeUsuario: req.body.nombreDeUsuario });
        if (usuarioExistente) {
            return res.status(400).json({ message: "Ya existe un usuario con ese nombre de usuario" });
        }
        // hash de la contraseña
        req.body.sanitizedInput.password = bcrypt.hashSync(req.body.sanitizedInput.password, 10);
        console.log(req.body.sanitizedInput.password);
        const usuario = em.create(Usuario, req.body.sanitizedInput);
        await em.flush();
        res.status(201).json({ message: "usuario creado correctamente", data: usuario });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
export async function update(req, res) {
    try {
        const id = req.params.id;
        const objectId = new ObjectId(id);
        const usuario = em.findOneOrFail(Usuario, objectId);
        em.assign(usuario, req.body);
        await em.flush();
        res
            .status(200)
            .json({ message: "usuario actualizado correctamente", data: usuario });
    }
    catch (error) {
        return res.status(500).send({ message: error.message });
    }
}
export async function remove(req, res) {
    try {
        const id = req.params.id;
        const objectId = new ObjectId(id);
        const usuario = em.getReference(Usuario, objectId);
        await em.removeAndFlush(usuario);
        res
            .status(200)
            .send({ message: "usuario eliminado correctamente" });
    }
    catch (error) {
        return res.status(500).send({ message: error.message });
    }
}
//# sourceMappingURL=usuario.controller.js.map