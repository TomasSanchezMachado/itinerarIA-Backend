import { z } from 'zod';

export const postSchema = z.object({
  name: z.string({
    invalid_type_error: 'Name must be a string',
    required_error: 'Name is required',
  }).regex(/^[a-zA-Z0-9\s]{3,50}$/, { message: 'Invalid name format (between 3 and 50 characters. Alphanumeric only)' }),

  latitude: z.number({
    invalid_type_error: 'Latitude must be a number',
    required_error: 'Latitude is required',
  }),

  longitude: z.number({
    invalid_type_error: 'Longitude must be a number',
    required_error: 'Longitude is required',
  }),

  zipCode: z.string({
    invalid_type_error: 'Postal code must be a string',
    required_error: 'Postal code is required',
  }).regex(/^[A-Za-z0-9-]{4,10}$/, { message: 'Invalid zip code format (between 4 and 10 characters. Alphanumeric and "-" only)' }),

  province: z.string({
    invalid_type_error: 'Province must be a string',
    required_error: 'Province is required',
  }).regex(/^[a-zA-Z\s]{3,50}$/, { message: 'Invalid province format (between 3 and 50 characters. Letters only)' }),

  country: z.string({
    invalid_type_error: 'Country must be a string',
    required_error: 'Country is required',
  }).regex(/^[a-zA-Z\s]{3,50}$/, { message: 'Invalid country format (between 3 and 50 characters. Letters only)' }),
});


export const putSchema = z.object({
  name: z.string({
    invalid_type_error: 'Name must be a string',
    required_error: 'Name is required',
  }).regex(/^[a-zA-Z0-9\s]{3,50}$/, { message: 'Invalid name format (between 3 and 50 characters. Alphanumeric only)' }),

  latitude: z.number({
    invalid_type_error: 'Latitude must be a number',
    required_error: 'Latitude is required',
  }),

  longitude: z.number({
    invalid_type_error: 'Longitude must be a number',
    required_error: 'Longitude is required',
  }),
  

  zipCode: z.string({
    invalid_type_error: 'Postal code must be a string',
    required_error: 'Postal code is required',
  }).regex(/^[A-Za-z0-9-]{4,10}$/, { message: 'Invalid zip code format (between 4 and 10 characters. Alphanumeric and "-" only)' }),

  province: z.string({
    invalid_type_error: 'Province must be a string',
    required_error: 'Province is required',
  }).regex(/^[a-zA-Z\s]{3,50}$/, {message: 'Invalid province format (between 3 and 50 characters. Letters only)'}),

  country: z.string({
    invalid_type_error: 'Country must be a string',
    required_error: 'Country is required',
  }).regex(/^[a-zA-Z\s]{3,50}$/,{message: 'Invalid country format (between 3 and 50 characters. Letters only)'}),
});

export const patchSchema = z.object({
  name: z.string({
    invalid_type_error: 'Name must be a string',
  }).regex(/^[a-zA-Z0-9\s]{3,50}$/, { message: 'Invalid name format (between 3 and 50 characters. Alphanumeric only)' }).optional(),

  latitude: z.number({
    invalid_type_error: 'Latitude must be a number',
  }).optional(),

  longitude: z.number({
    invalid_type_error: 'Longitude must be a number',
  }).optional(),
  

  zipCode: z.string({
    invalid_type_error: 'Postal code must be a string',
  }).regex(/^[A-Za-z0-9-]{4,10}$/, { message: 'Invalid zip code format (between 4 and 10 characters. Alphanumeric and "-" only)' }).optional(),

  province: z.string({
    invalid_type_error: 'Province must be a string',
  }).regex(/^[a-zA-Z\s]{3,50}$/,{message: 'Invalid province format (between 3 and 50 characters. Letters only)'}).optional(),

  country: z.string({
    invalid_type_error: 'Country must be a string',
  }).regex(/^[a-zA-Z\s]{3,50}$/,{message: 'Invalid country format (between 3 and 50 characters. Letters only)'}).optional(),
});
