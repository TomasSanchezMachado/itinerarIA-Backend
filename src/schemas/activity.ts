import z from 'zod';

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
    schedule: z.string({
        invalid_type_error: 'Schedule must be a string',
        required_error: 'The schedule is required'
    }),
    itinerary: z.string({
        invalid_type_error: 'Itinerary must be a string',
        required_error: 'Itinerary is required'
    }),
});
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
    schedule: z.string({
        invalid_type_error: 'Schedule must be a string'
    }).optional(),
    itinerary: z.string({
        invalid_type_error: 'Itinerary must be a string'
    }).optional(),

});