import z from "zod";

export const putSchema = z.object({
  username: z
    .string({
      invalid_type_error: "Username must be a string",
      required_error: "Username is required",
    })
    .regex(
      /^[a-zA-Z0-9_-]{3,30}$/,
      "Username must be between 3 and 30 characters and can only contain letters, numbers, underscores, and hyphens"
    ),
  password: z
    .string({
      invalid_type_error: "Password must be a string",
    })
    .regex(
      /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must have at least 8 characters, one uppercase letter, and one number"
    ),
  names: z
    .string({
      invalid_type_error: "Name must be a string",
      required_error: "Name is required",
    })
    .min(3, "Name must be at least 3 characters long")
    .max(15, "Name can be a maximum of 25 characters long")
    .regex(/^[A-Za-z ]+$/, "Name must contain only letters"),
  lastName: z
    .string({
      invalid_type_error: "Last name must be a string",
      required_error: "Last name is required",
    })
    .min(3, "Last name must be at least 3 characters long")
    .max(25, "Last name can be a maximum of 25 characters long")
    .regex(/^[A-Za-z ]+$/, "Last name must contain only letters"),
  mail: z
    .string({
      invalid_type_error: "Email must be a string",
      required_error: "Email is required",
    })
    .email("Email must be a valid format"),
  phoneNumber: z
    .string({
      invalid_type_error: "Phone number must be a string",
      required_error: "Phone number is required",
    })
    .min(7, "Phone number must be at least 7 digits")
    .max(14, "Phone number can be a maximum of 14 digits")
    .regex(/[0-9]/),
  itineraries: z
    .array(
      z.object({
        id: z.string(),
      })
    )
    .optional(),
});

export const patchSchema = z.object({
  username: z
    .string({
      invalid_type_error: "Username must be a string",
    })
    .min(3, "Username must be at least 3 characters long")
    .max(15, "Username can be a maximum of 15 characters long")
    .regex(
      /^[a-zA-Z0-9_-]{3,30}$/,
      "Username must be between 3 and 30 characters and can only contain letters, numbers, underscores, and hyphens"
    )
    .optional(),
  names: z
    .string({
      invalid_type_error: "Name must be a string",
    })
    .min(3, "Name must be at least 3 characters long")
    .max(15, "Name can be a maximum of 25 characters long")
    .regex(/^[A-Za-z ]+$/, "Name must contain only letters")
    .optional(),
  lastName: z
    .string({
      invalid_type_error: "Last name must be a string",
    })
    .min(3, "Last name must be at least 3 characters long")
    .max(25, "Last name can be a maximum of 25 characters long")
    .regex(/^[A-Za-z ]+$/, "Last name must contain only letters")
    .optional(),
  mail: z
    .string({
      invalid_type_error: "Email must be a string",
    })
    .email("Email must be a valid format")
    .optional(),
  phoneNumber: z
    .string({
      invalid_type_error: "Phone number must be a string",
    })
    .min(7, "Phone number must be at least 7 digits")
    .max(14, "Phone number can be a maximum of 14 digits")
    .regex(/[0-9]/),
  itineraries: z
    .array(
      z.object({
        id: z.string(),
      })
    )
    .optional(),
});
