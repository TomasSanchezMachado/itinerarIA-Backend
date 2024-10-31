import z from 'zod'

export const opinionSchema = z.object({
    rating: z.number({
        invalid_type_error: 'La calificación debe ser un número',
        required_error: 'La calificación es requerida',}
    ).min(1).max(5, {message: 'La calificación debe ser un número entre 1 y 5'}), 
    comment: z.string({
        invalid_type_error: 'El comentario debe ser un string',
        required_error: 'El comentario es requerido',}
    ).min(1).max(100, {message: 'El comentario debe tener entre 1 y 100 caracteres'}),

    })

export const patchOpinionSchema = z.object({
    rating: z.number({
        invalid_type_error: 'La calificación debe ser un número',
        required_error: 'La calificación es requerida',}
    ).min(1).max(5, {message: 'La calificación debe ser un número entre 1 y 5'}).optional(), 
    comment: z.string({
        invalid_type_error: 'El comentario debe ser un string',
        required_error: 'El comentario es requerido',}
    ).min(1).max(100, {message: 'El comentario debe tener entre 1 y 100 caracteres'}).optional(),

    })