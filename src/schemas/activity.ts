import z from 'zod';

export const activitySchema = z.object({
    name: z.string({
        invalid_type_error: 'El nombre debe ser un string',
        required_error: 'El nombre es requerido'
    }).min(3,'El nombre debe tener como minimo 3 caracteres').max(20),
    description: z.string({
        invalid_type_error: 'La descripción debe ser un string',
        required_error: 'La descripción es requerida'
    }).min(10,'La descripcion debe tener como minimo 10 caracteres').max(100),
    outdoor: z.boolean({
        required_error: 'Debe especificar si la actividad es al aire libre o no'
    }),
    transport: z.boolean({
        required_error: 'Debe especificar si la actividad requiere transporte o no'
    }).optional(),
    schedule: z.string({
        invalid_type_error: 'El horario debe ser un string',
        required_error: 'El horario es requerido'
    }),
    itinerary: z.string({
        invalid_type_error: 'El itinerario debe ser un string',
        required_error: 'El itinerario es requerido'
    }),
});
export const patchActivitySchema = z.object({
    name: z.string({
        invalid_type_error: 'El nombre debe ser un string'
    }).min(3,'El nombre debe tener como minimo 3 caracteres').max(20).optional(),
    description: z.string({
        invalid_type_error: 'La descripción debe ser un string'
    }).min(10,'La descripcion debe tener como minimo 10 caracteres').max(100).optional(),
    outdoor: z.boolean({
        invalid_type_error: 'Debe especificar si la actividad es al aire libre o no'
    }).optional(),
    transport: z.boolean({
        invalid_type_error: 'Debe especificar si la actividad requiere transporte o no'
    }).optional(),
    schedule: z.string({
        invalid_type_error: 'El horario debe ser un string'
    }).optional(),
    itinerary: z.string({
        invalid_type_error: 'El itinerario debe ser un string'
    }).optional(),

});