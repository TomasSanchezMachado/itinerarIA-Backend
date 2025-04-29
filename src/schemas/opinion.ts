import z from 'zod'

export const opinionSchema = z.object({
    rating: z.number({
        invalid_type_error: 'Rating must be a number',
        required_error: 'Rating is required',}
    ).min(1).max(5, {message: 'Rating must be a number between 1 and 5'}), 
    comment: z.string({
        invalid_type_error: 'Comment must be a string',
        required_error: 'Comment is required',}
    ).min(1).max(100, {message: 'Comment must be between 1 and 100 characters'}),

    })

export const patchOpinionSchema = z.object({
    rating: z.number({
        invalid_type_error: 'Rating must be a number',
        required_error: 'Rating is required',}
    ).min(1).max(5, {message: 'Rating must be a number between 1 and 5'}).optional(), 
    comment: z.string({
        invalid_type_error: 'Comment must be a string',
        required_error: 'Comment is required',}
    ).min(1).max(100, {message: 'Comment must be between 1 and 100 characters'}).optional(),

    })