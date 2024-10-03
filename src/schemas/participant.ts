import z from 'zod';
import { Participant } from '../participant/participant.entity.js';

export const participantSchema = z.object({
    nombres: z.string({
        invalid_type_error: 'Name must be a string',
        required_error: 'Name is required',
    }).min(3, 'Name must be at least 3 characters').max(15, 'Name can have a maximum of 25 characters.').regex(/^[A-Za-z ]+$/, 'Name must contain only letters'),
    age: z.number({
        invalid_type_error: 'Age must be a number',
    }).min(1, 'age must be between 1 and 3 digits').max(3, 'age must be between 1 and 3 digits'),
    disability: z.boolean({
        invalid_type_error: 'Disability must be a boolean',
    })
});

export function validateParticipant(object: Participant) {
    return participantSchema.safeParse(object);
}

export function validatePartialParticipant(object: Partial<Participant>) {
    return participantSchema.partial().safeParse(object);
}