import z from 'zod';



export const itinerarySchema = z.object({
    title: z.string({
        invalid_type_error: 'Title must be a string',
        required_error: 'Title is required'
    }).min(3,'Title must have at least 3 characters').max(20,'Title can have a maximum of 20 characters'),
    description: z.string({
        invalid_type_error: 'Description must be a string',
        required_error: 'Description is required'
    }).min(10,'Description must have at least 10 characters').max(100,'Description can have a maximum of 100 characters').optional(),
    // duration: z.number({
    //     required_error: 'La duración es requerida'
    // }).min(1,'El itinerario debe durar como minimo 1 día').max(30, 'El itinerario no puede durar más de 30 días'),
    place: z.string({
        invalid_type_error: 'Place must be a string',
        required_error: 'Place is required'
    }),
    dayStart: z.preprocess((arg) => {
        if (typeof arg === "string" || arg instanceof String) {
          return new Date(arg as string);
        }
        return arg;
      }, z.date({
        invalid_type_error: 'Start day must be a valid date',
        required_error: 'Start day is required',
      })),
      dayEnd: z.preprocess((arg) => {
        if (typeof arg === "string" || arg instanceof String) {
          return new Date(arg as string);
        }
        return arg;
      }, z.date({
        invalid_type_error: 'End day must be a valid date',
        required_error: 'End day is required',
      })),
}).refine((data) => data.dayEnd > data.dayStart, {
    message: 'End day must be after start day',
    path: ['dayEnd'],
  }).refine((data) => {
    const diffTime = Math.abs(data.dayEnd.getTime() - data.dayStart.getTime());
    const diffDays = diffTime / (1000 * 60 * 60 * 24); 
    return diffDays >= 2;
  }, {
    message: 'Itinerary must last at least 2 days',
    path: ['dayEnd'],
  }).refine((data) => {
    const diffTime = Math.abs(data.dayEnd.getTime() - data.dayStart.getTime());
    const diffDays = diffTime / (1000 * 60 * 60 * 24); 
    return diffDays <= 31;
  }, {
    message: 'Itinerary must not last more than 31 days',
    path: ['dayEnd'],
  });

export const itineraryAISchema = z.object({
  place: z.string({
    invalid_type_error: 'Place must be a string',
    required_error: 'Place is required'
}),
title: z.string({
    invalid_type_error: 'Title must be a string',
    required_error: 'Title is required'
}),
participantsAge: z.array(z.number()).optional(),
preferences: z.array(z.string()).optional(),
    dayStart: z.preprocess((arg) => {
        if (typeof arg === "string" || arg instanceof String) {
          return new Date(arg as string);
        }
        return arg;
      }, z.date({
        invalid_type_error: 'Start day must be a valid date',
        required_error: 'Start day is required',
      })),
      dayEnd: z.preprocess((arg) => {
        if (typeof arg === "string" || arg instanceof String) {
          return new Date(arg as string);
        }
        return arg;
      }, z.date({
        invalid_type_error: 'End day must be a valid date',
        required_error: 'End day is required',
      })),
}).refine((data) => data.dayEnd > data.dayStart, {
    message: 'End day must be after start day',
    path: ['dayEnd'],
  }).refine((data) => {
    const diffTime = Math.abs(data.dayEnd.getTime() - data.dayStart.getTime());
    const diffDays = diffTime / (1000 * 60 * 60 * 24); 
    return diffDays >= 2;
  }, {
    message: 'Itinerary must last at least 2 days',
    path: ['dayEnd'],
  }).refine((data) => {
    const diffTime = Math.abs(data.dayEnd.getTime() - data.dayStart.getTime());
    const diffDays = diffTime / (1000 * 60 * 60 * 24); 
    return diffDays <= 31;
  }, {
    message: 'Itinerary must not last more than 31 days',
    path: ['dayEnd'],
  });



export const patchItinerarySchema = z.object({
    title: z.string({
        invalid_type_error: 'Title must be a string',
    }).min(3,'Title must have at least 3 characters').max(20,'Title can have a maximum of 20 characters').optional(),
    description: z.string({
        invalid_type_error: 'Description must be a string',
    }).min(10,'Description must have at least 10 characters').max(100,'Description can have a maximum of 100 characters').optional(),
    // duration: z.number({
    //     invalid_type_error: 'La duración debe ser un número'
    // }).min(1,'El itinerario debe durar como minimo 1 dia`').max(30, 'El itinerario no puede durar más de 30 días').optional(),
    // place: z.string({
    //     invalid_type_error: 'Place must be a string',
    // }).optional(),
    dayStart: z
    .preprocess((arg) => {
      if (typeof arg === 'string' || arg instanceof String) {
        return new Date(arg as string);
      }
      return arg;
    }, z.date().optional())
    .optional(),
  dayEnd: z
    .preprocess((arg) => {
      if (typeof arg === 'string' || arg instanceof String) {
        return new Date(arg as string);
      }
      return arg;
    }, z.date().optional())
    .optional(),
})
  .refine(
    (data) => {
      if (data.dayStart && data.dayEnd) {
        return data.dayEnd > data.dayStart;
      }
      return true; 
    },
    {
      message: 'End day must be after start day',
      path: ['dayEnd'],
    }
  )
  .refine(
    (data) => {
      if (data.dayStart && data.dayEnd) {
        const diffTime = Math.abs(data.dayEnd.getTime() - data.dayStart.getTime());
        const diffDays = diffTime / (1000 * 60 * 60 * 24);
        return diffDays >= 2;
      }
      return true; 
    },
    {
      message: 'Itinerary must last at least 2 days',
      path: ['dayEnd'],
    }
  )
  .refine(
    (data) => {
      if (data.dayStart && data.dayEnd) {
        const diffTime = Math.abs(data.dayEnd.getTime() - data.dayStart.getTime());
        const diffDays = diffTime / (1000 * 60 * 60 * 24);
        return diffDays <= 31;
      }
      return true; 
    },
    {
      message: 'Itinerary must not last more than 31 days',
      path: ['dayEnd'],
    }
  );
