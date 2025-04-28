import z from 'zod';

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;


export const activitySchema = z.object({
    name: z.string({
        invalid_type_error: 'Name must be a string',
        required_error: 'Name is required'
    }).min(3,'Name must have at least 3 characters').max(20,'Name can have a maximum of 20 characters'),
    description: z.string({
        invalid_type_error: 'Description must be a string',
        required_error: 'Description is required'
    }).min(3,'Description must have at least 3 characters').max(100),
    outdoor: z.boolean({
        required_error: 'You must specify if the activity is outdoor or not'
    }),
    transport: z.boolean({
        required_error: 'You must specify if the activity needs transport or not'
    }).optional(),
    scheduleStart: z.string({
        invalid_type_error: 'Schedule start must be a string',
        required_error: 'Schedule start is required'
    }).regex(timeRegex, 'Schedule start must be in the format HH:MM'),
    scheduleEnd: z.string({
        invalid_type_error: 'Schedule end must be a string',
        required_error: 'Schedule end is required'
    }).regex(/^\d{2}:\d{2}$/, 'Schedule end must be in the format HH:MM'),
    })
    .refine((data) => {
        const { scheduleStart, scheduleEnd } = data;
      
        // Función para convertir "HH:mm" a minutos desde las 00:00
        const timeToMinutes = (time: string) => {
          const [hours, minutes] = time.split(':').map(Number);
          return hours * 60 + minutes;
        };
      
        const startMinutes = timeToMinutes(scheduleStart);
        const endMinutes = timeToMinutes(scheduleEnd);
      
        // Verificar que el horario de inicio sea anterior al de fin
        return startMinutes < endMinutes;
      }, {
        message: 'The activity must start before it ends',
        path: ['scheduleEnd'], // Enfocar el error en el campo de fin
      })

export const patchActivitySchema = z.object({
    name: z.string({
        invalid_type_error: 'Name must be a string'
    }).min(3,'Name must have at least 3 characters').max(20,'Name can have a maximum of 20 characters').optional(),
    description: z.string({
        invalid_type_error: 'Description must be a string',
    }).min(3,'Description must have at least 3 characters').max(100).optional(),
    outdoor: z.boolean({
        invalid_type_error: 'You must specify if the activity is outdoor or not'
    }).optional(),
    transport: z.boolean({
        invalid_type_error: 'You must specify if the activity has transport or not'
    }).optional(),
    itinerary: z.string({
        invalid_type_error: 'Itinerary must be a string'
    }).optional(),
    scheduleStart: z.string({
        invalid_type_error: 'Schedule start must be a string',
        required_error: 'Schedule start is required'
    }).regex(timeRegex, 'Schedule start must be in the format HH:MM').optional(),
    scheduleEnd: z.string({
        invalid_type_error: 'Schedule end must be a string',
        required_error: 'Schedule end is required'
    }).regex(/^\d{2}:\d{2}$/, 'Schedule end must be in the format HH:MM').optional(),
    place: z.string({
        invalid_type_error: 'Place must be a string',
        required_error: 'Place is required'
    }).optional()})
    .refine((data) => {
        const { scheduleStart, scheduleEnd } = data;
        if (!scheduleStart || !scheduleEnd) return true;
        // Función para convertir "HH:mm" a minutos desde las 00:00
        const timeToMinutes = (time: string) => {
          const [hours, minutes] = time.split(':').map(Number);
          return hours * 60 + minutes;
        };
        
        const startMinutes = timeToMinutes(scheduleStart);
        const endMinutes = timeToMinutes(scheduleEnd);
      
        // Verificar que el horario de inicio sea anterior al de fin
        return startMinutes < endMinutes;
      }, {
        message: 'scheduleStart must be before scheduleEnd',
        path: ['scheduleEnd'], // Enfocar el error en el campo de fin
});