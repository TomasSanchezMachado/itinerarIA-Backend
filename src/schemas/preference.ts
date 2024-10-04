import z from 'zod';
import { Preference } from '../preference/preference.entity';

export const preferenceSchema = z.object({
    name: z.string({
        invalid_type_error: 'Name must be a string',
        required_error: 'Name is required',
    }).min(3, 'Name must be at least 3 characters').max(15, 'Name can have a maximum of 25 characters.').regex(/^[A-Za-z ]+$/, 'Name must contain only letters'),
    description: z.string({
        invalid_type_error: 'Description must be a string',
        required_error: 'Description is required',
    }).min(3, 'Description must be at least 3 characters').max(50, 'Description can have a maximum of 50 characters.'),
});

export function validatePreference(object: Preference) {
    return preferenceSchema.safeParse(object);
}

export function validatePartialPreference(object: Partial<Preference>) {
    return preferenceSchema.partial().safeParse(object);
}