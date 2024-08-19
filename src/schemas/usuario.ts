
import z from 'zod';

export const putSchema = z.object({
    username: z.string({
        invalid_type_error: 'El nombre de usuario debe ser un string',
        required_error: 'El nombre de usuario es requerido',
    }).regex(/^[a-zA-Z0-9_-]{3,30}$/, 'El nombre de usuario debe tener entre 3 y 30 caracteres y solo puede contener letras, números, guiones bajos y guiones medios'),
    password: z.string({
        invalid_type_error: 'La contraseña debe ser un string',
        required_error: 'La contraseña es requerida',
    }).regex(/^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/, 'La contraseña debe tener al menos 8 caracteres, una letra mayúscula y un número'),
    nombres: z.string({
        invalid_type_error: 'El nombre debe ser un string',
        required_error: 'El nombre es requerido',
    }).min(3).regex(/^[A-Za-z ]+$/, 'El nombre debe contener solo letras'),
    apellidos: z.string({
        invalid_type_error: 'El apellido debe ser un string',
        required_error: 'El apellido es requerido',
    }).min(3).regex(/^[A-Za-z ]+$/, 'El apellido debe contener solo letras'),
    mail: z.string({
        invalid_type_error: 'El mail debe ser un string',
        required_error: 'El mail es requerido',
    }).email('El mail debe tener un formato válido'),
    nroTelefono: z.string({
        invalid_type_error: 'El número de teléfono debe ser un string',
        required_error: 'El número de teléfono es requerido',
    }).min(7),
});

export const patchSchema = z.object({
    username: z.string({
        invalid_type_error: 'El nombre de usuario debe ser un string'
    }).regex(/^[a-zA-Z0-9_-]{3,30}$/, 'El nombre de usuario debe tener entre 3 y 30 caracteres y solo puede contener letras, números, guiones bajos y guiones medios').optional(),
    password: z.string({
        invalid_type_error: 'La contraseña debe ser un string'
    }).regex(/^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/, 'La contraseña debe tener al menos 8 caracteres, una letra mayúscula y un número').optional(),
    nombres: z.string({
        invalid_type_error: 'El nombre debe ser un string'
    }).min(3).regex(/^[A-Za-z ]+$/, 'El nombre debe contener solo letras').optional(),
    apellidos: z.string({
        invalid_type_error: 'El apellido debe ser un string'
    }).min(3).regex(/^[A-Za-z ]+$/, 'El apellido debe contener solo letras').optional(),
    mail: z.string({
        invalid_type_error: 'El mail debe ser un string'
    }).email('El mail debe tener un formato válido').optional(),
    nroTelefono: z.string({
        invalid_type_error: 'El número de teléfono debe ser un string'
    }).min(7).optional(),
});