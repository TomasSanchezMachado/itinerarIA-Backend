import { z } from 'zod';

const scheduleRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
const scheduleSchema = z.string().regex(scheduleRegex, 'Invalid schedule format');

const websiteRegex = /^www\.[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/ || "";
const websiteSchema = z.string().regex(websiteRegex, 'Invalid website format');

const telRegex = /^\d{10}$/ || "";
const telSchema = z.string().regex(telRegex, 'Invalid phone number format');

export const postSchema = z.object({
  serviceType: z.string({
    invalid_type_error: 'The service type must be a string',
    required_error: 'The service type is required',
  }).min(3, 'The service type must have at least 3 characters'),
  name: z.string({
    invalid_type_error: 'The name must be a string',
    required_error: 'The name is required',
  }).min(3, 'The name must have at least 3 characters'),
  description: z.string({
    invalid_type_error: 'The description must be a string',
    required_error: 'The description is required',
  }).min(3, 'The description must have at least 3 characters'),
  adress: z.string({
    invalid_type_error: 'The address must be a string',
    required_error: 'The address is required',
  }).min(3, 'The address must have at least 3 characters'),
  schedule: z.string({
    invalid_type_error: 'The schedule must be a string',
    required_error: 'The schedule is required',
  }),
  website: websiteSchema.optional(),
  phoneNumber: telSchema.optional(),
  lugar: z.string({
    invalid_type_error: 'The place must be a string',
    required_error: 'The place is required',
  }),
});

export const putSchema = z.object({
  serviceType: z.string({
    invalid_type_error: 'The service type must be a string',
    required_error: 'The service type is required',
  }).min(3, 'The service type must have at least 3 characters'),
  name: z.string({
    invalid_type_error: 'The name must be a string',
    required_error: 'The name is required',
  }).min(3, 'The name must have at least 3 characters'),
  description: z.string({
    invalid_type_error: 'The description must be a string',
    required_error: 'The description is required',
  }).min(3, 'The description must have at least 3 characters'),
  adress: z.string({
    invalid_type_error: 'The address must be a string',
    required_error: 'The address is required',
  }).min(3, 'The address must have at least 3 characters'),
  schedule: z.string({
    invalid_type_error: 'The schedule must be a string',
    required_error: 'The schedule is required',
  }),
  website: websiteSchema.optional(),
  phoneNumber: telSchema.optional(),
  lugar: z.string({
    invalid_type_error: 'The place must be a string',
    required_error: 'The place is required',
  }),
});

export const patchSchema = z.object({
  serviceType: z.string({
    invalid_type_error: 'The service type must be a string',
  }).min(3, 'The service type must have at least 3 characters').optional(),
  name: z.string({
    invalid_type_error: 'The name must be a string',
  }).min(3, 'The name must have at least 3 characters').optional(),
  description: z.string({
    invalid_type_error: 'The description must be a string',
  }).min(3, 'The description must have at least 3 characters').optional(),
  adress: z.string({
    invalid_type_error: 'The address must be a string',
  }).min(3, 'The address must have at least 3 characters').optional(),
  schedule: z.string({
    invalid_type_error: 'The schedule must be a string',
  }).optional(),
  website: websiteSchema.optional(),
  phoneNumber: telSchema.optional(),
  lugar: z.string({
    invalid_type_error: 'The place must be a string',
  }).optional(),
});