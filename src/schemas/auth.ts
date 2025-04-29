import { isAdmin } from "shared/middlewares/adminMiddleware.js";
import { z } from "zod";

export const registerSchema = z.object({
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
      required_error: "Password is required",
    })
    .regex(
      /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must be at least 8 characters long and contain at least one uppercase letter and one number"
    ),
  names: z
    .string({
      invalid_type_error: "First name must be a string",
      required_error: "First name is required",
    })
    .min(3)
    .regex(/^[A-Za-z ]+$/, "First name must contain only letters"),
  lastName: z
    .string({
      invalid_type_error: "Last name must be a string",
      required_error: "Last name is required",
    })
    .min(3)
    .regex(/^[A-Za-z ]+$/, "Last name must contain only letters"),
  mail: z
    .string({
      invalid_type_error: "Email must be a string",
      required_error: "Email is required",
    })
    .email("Email must be in a valid format"),
  phoneNumber: z
    .string({
      invalid_type_error: "Phone number must be a string",
      required_error: "Phone number is required",
    })
    .min(7),
});

export const loginSchema = z.object({
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
      required_error: "Password is required",
    })
    .regex(
      /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must be at least 8 characters long and contain at least one uppercase letter and one number"
    ),
});
