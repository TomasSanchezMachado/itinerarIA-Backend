# Documentación Completa de la API de itinerarIA

## Descripción General

itinerarIA es una aplicación web que utiliza Inteligencia Artificial para crear itinerarios de viaje personalizados. Esta documentación describe en detalle la API backend que proporciona toda la funcionalidad para la aplicación. La API REST está construida con Node.js, Express, Zod y autenticación JWT. A continuación, se detalla el uso de la API incluyendo rutas, validaciones, y ejemplos.

## Base URL

## [itinerarIA](https://itineraria-backend.up.railway.app/)

## Autenticación

La API utiliza autenticación basada en JWT (JSON Web Tokens). La mayoría de los endpoints requieren que el usuario esté autenticado.

### Headers de autenticación

Para los endpoints protegidos, incluir el token JWT en el header de la solicitud:

- **Formato JWT:** `Authorization: Bearer <token>`
- **Rutas protegidas:**  
  Requieren token. Incluye todas las rutas de usuarios, itinerarios, actividades y las rutas protegidas de servicios externos.

---

## Validación de Datos

La API utiliza Zod para validar los datos de entrada. Esto asegura que todos los datos recibidos cumplan con el esquema esperado antes de ser procesados.

Ejemplo de validación para registro:

```ts
const registerSchema = z.object({
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
```

## Endpoints

---

### Autenticación

| Método | Ruta           | Descripción                      | Protegida |
| ------ | -------------- | -------------------------------- | --------- |
| POST   | /auth/register | Registro de usuario              | ❌        |
| POST   | /auth/login    | Inicio de sesión                 | ❌        |
| POST   | /auth/logout   | Cierre de sesión            | ✅        |
| POST   | /auth/profile  | Obtener perfil del usuario       | ✅        |
| POST   | /auth/verify   | Verificar token de autenticación | ✅        |

#### Registro de Usuario

POST /auth/register

Registra un nuevo usuario en el sistema.

Solicitud:

```ts
Content-Type:application/json
{
  "username": string,
    "password": string,
    "names": string,
    "lastName": string,
    "dateOfBirth": "2024-04-24",
    "mail": string,
    "phoneNumber": string,
    "isAdmin": bool
}
```

Validación:

- username:

  - "Username must be a string"
  - "Username is required"
  - "Username must be between 3 and 30 characters and can only contain letters, numbers, underscores, and hyphens"

- password:

  - "Password must be a string"
  - "Password is required"
  - "Password must be at least 8 characters long and contain at least one uppercase letter and one number"

- names:

  - "First name must be a string"
  - "First name is required"
  - "First name must contain only letters"

- lastName:

  - "Last name must be a string"
  - "Last name is required"
  - "Last name must contain only letters"

- mail:

  - "Email must be a string"
  - "Email is required"
  - "Email must be in a valid format"

- phoneNumber:

  - "Phone number must be a string"
  - "Phone number is required"

Respuesta:

```ts
Content-Type:application/json
{
  "message": "User logged successfully",
  "data": {
    "user": {...},
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."}
}
```

#### Inicio de Sesión

POST /auth/login

Inicia sesión de un usuario existente.

Solicitud:
```ts
jsonContent-Type: application/json
{
  "username": "string",
  "password": "string"
}
```

Validación:

- username:

  - "Username must be a string"
  - "Username is required"
  - "Username must be between 3 and 30 characters and can only contain letters, numbers, underscores, and hyphens"

- password:

  - "Password must be a string"
  - "Password is required"
  - "Password must be at least 8 characters long and contain at least one uppercase letter and one number"

Respuesta:
```ts
jsonContent-Type: application/json
{
  "message": "User logged successfully",
  "data": {
    "user": {...}
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

Errores:

400 Bad Request: "Incorrect username or password. Please try again."
500 Internal Server Error: "The user could not be logged in"

#### Cierre de sesión

POST /auth/logout

Cierra la sesión del usuario actualmente autenticado.

Solicitud:
No requiere cuerpo.

Respuesta:
```ts
jsonContent-Type: application/json
{
  "message": "User logged out"
}
```
Notas:

Este endpoint elimina la cookie del token de autenticación.

#### Obtener Perfil de Usuario

POST /auth/profile

Obtiene la información del perfil del usuario autenticado.

Solicitud:
No requiere cuerpo.

Headers:
Requiere token de autenticación en cookie.

Respuesta:
```ts
jsonContent-Type: application/json
{
  "message": "User profile found",
  "data": {
    "user": {...}
  }
}
```

Errores:

400 Bad Request: "User not found"
500 Internal Server Error: "The user profile could not be found"

#### Verificar Token

POST /auth/verify

Verifica si el token de autenticación es válido y devuelve la información del usuario.

Solicitud:
No requiere cuerpo.

Headers:
Requiere token de autenticación en cookie.

Respuesta:
```ts
jsonContent-Type: application/json
{
  "message": "User found",
  "data": {
    "user": {...}
  }
}
```



Errores:

401 Unauthorized: Si el token no es válido o el usuario no existe

### Usuarios

| Método | Ruta           | Descripción                      | Protegida |
| ------ | -------------- | -------------------------------- | --------- |
| GET    | /users         | Obtener todos los usuarios       | ❌        |
| GET    | /users/:id         | Obtener un usuario específico    | ❌        |
| POST   | /users         | Crear un nuevo usuario           | ❌        |
| PUT    | /users/        | Actualizar un usuario completo   | ❌        |
|PATCH   | /users/        | Actualizar campos específicos    | ❌        |
|DELETE  | /users/        | Eliminar un usuario              | ❌        |

#### Obtener todos los usuarios

GET /users

Recupera todos los usuarios registrados en el sistema.

Respuesta:
```ts
jsonContent-Type: application/json
{
  "message": "Users found successfully",
  "data": [
    {
      "_id": "string",
      "username": "string",
      "names": "string",
      "lastName": "string",
      "dateOfBirth": "2024-04-24",
      "mail": "string",
      "phoneNumber": "string",
      "isAdmin": boolean,
      "itineraries": [...],
      "participants": [...]
    }
  ]
}
```

Errores:

500 Internal Server Error: Error del servidor al buscar usuarios

#### Obtener un usuario específico

GET /user/:id

Recupera la información de un usuario específico según su ID.

Parámetros de ruta:
id: Identificador único del usuario

Respuesta:
```ts
jsonContent-Type: application/json
{
  "message": "User found successfully",
  "data": {
    "_id": "string",
    "username": "string",
    "names": "string",
    "lastName": "string",
    "dateOfBirth": "2024-04-24",
    "mail": "string",
    "phoneNumber": "string",
    "isAdmin": boolean,
    "itineraries": [...],
    "participants": [...]
  }
}
```

Errores:

500 Internal Server Error: Usuario no encontrado o error del servidor

#### Crear un nuevo usuario

POST /users

Registra un nuevo usuario en el sistema.

Solicitud:
```ts
jsonContent-Type: application/json
{
  "username": "string",
  "password": "string",
  "names": "string",
  "lastName": "string",
  "dateOfBirth": "2024-04-24",
  "mail": "string",
  "phoneNumber": "string"
}
```

Validación:

El middleware sanitizeUserInput realiza una limpieza de los datos, eliminando campos indefinidos.

Respuesta:
```ts
jsonContent-Type: application/json
{
  "message": "User logged successfully",
  "data": {
    "user": {
      "_id": "string",
      "username": "string",
      "names": "string",
      "lastName": "string",
      "dateOfBirth": "2024-04-24",
      "mail": "string",
      "phoneNumber": "string",
      "isAdmin": false
    }
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

Errores:

500 Internal Server Error: Error al crear el usuario

#### Actualizar un usuario (PUT)

PUT /users/

Actualiza todos los campos de un usuario existente.

Parámetros de ruta:
id: Identificador único del usuario

Solicitud:
```ts
jsonContent-Type: application/json
{
  "username": "string",
  "password": "string",
  "names": "string",
  "lastName": "string",
  "mail": "string",
  "phoneNumber": "string",
  "itineraries": [
    {
      "id": "string"
    }
  ],
  "isAdmin": boolean
}
```

Validación:

- username:

  - "Username must be a string"
  - "Username is required"
  - "Username must be between 3 and 30 characters and can only contain letters, numbers, underscores, and hyphens"

- password:

  - "Password must be a string"
  - "Password is required"
  - "Password must be at least 8 characters long and contain at least one uppercase letter and one number"

- names:

  - "First name must be a string"
  - "First name is required"
  - "First name must contain only letters"

- lastName:

  - "Last name must be a string"
  - "Last name is required"
  - "Last name must contain only letters"

- mail:

  - "Email must be a string"
  - "Email is required"
  - "Email must be in a valid format"

- phoneNumber:

  - "Phone number must be a string"
  - "Phone number is required"


Respuesta:
```ts
jsonContent-Type: application/json
{
  "message": "User updated successfully",
  "data": {
    "_id": "string",
    "username": "string",
    "names": "string",
    "lastName": "string",
    "mail": "string",
    "phoneNumber": "string",
    "isAdmin": boolean,
    "itineraries": [...]
  }
}
```

Errores:

400 Bad Request: "Username or email already exists"
500 Internal Server Error: Error al actualizar el usuario

#### Actualizar parcialmente un usuario (PATCH)

PATCH /users/

Actualiza campos específicos de un usuario existente.

Parámetros de ruta:
id: Identificador único del usuario

Solicitud:
```ts
jsonContent-Type: application/json
{
  "username": "string", // opcional
  "names": "string", // opcional
  "lastName": "string", // opcional
  "mail": "string", // opcional
  "phoneNumber": "string", // opcional
  "itineraries": [
    {
      "id": "string"
    }
  ], // opcional
  "isAdmin": boolean // opcional
}
```

Validación:

Cualquier campo que se incluya debe cumplir con las validaciones del schema del modelo
El middleware sanitizeUserInput realiza una limpieza de los datos, eliminando campos indefinidos.


Respuesta:
```ts
jsonContent-Type: application/json
{
  "message": "User updated successfully",
  "data": {
    "_id": "string",
    "username": "string",
    "names": "string",
    "lastName": "string",
    "mail": "string",
    "phoneNumber": "string",
    "isAdmin": boolean,
    "itineraries": [...]
  }
}
```

Errores:

400 Bad Request: "Username or email already exists"
500 Internal Server Error: Error al actualizar el usuario

#### Eliminar un usuario

DELETE /users/

Elimina un usuario del sistema.

Parámetros de ruta:
id: Identificador único del usuario

Respuesta:
```ts
jsonContent-Type: application/json
{
  "message": "User deleted successfully"
}
```

Errores:

500 Internal Server Error: Error al eliminar el usuario

### Preferencias

| Método | Ruta                | Descripción                          | Protegida |
| ------ | --------------      | --------------------------------     | --------- |
| GET    | /preferences        | Obtener todas las preferencias       | ✅ (Admin)|
| GET    | /preferences/:id    | Obtener una preferencia específica   | ✅ (Admin)|
| POST   | /preferences        | Crear una nueva preferencia          | ✅ (Admin)|
| PUT    | /preferences /      | Actualizar una preferencia completa  | ✅ (Admin)|
|PATCH   | /preferences/       | Actualizar campos específicos        | ✅ (Admin)|
|DELETE  | /preferences/       | Eliminar una preferencia             | ✅ (Admin)|

#### Obtener todas las preferencias

GET /preferences

Recupera todas las preferencias registradas en el sistema.

Respuesta:
```ts
jsonContent-Type: application/json
{
  "data": [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "participants": [...]
    }
  ]
}
```

Respuesta (sin preferencias):
```ts
jsonContent-Type: application/json
{
  "message": "Preferences not found"
}
```

Errores:

401 Unauthorized: "No authorization token provided" o "Invalid token"
403 Forbidden: "You are not authorized to access this resource"
500 Internal Server Error: Error del servidor al buscar preferencias

#### Obtener una preferencia específica

GET /preferences/:id

Recupera la información de una preferencia específica según su ID.

Parámetros de ruta:
id: Identificador único de la preferencia

Respuesta:
```ts
jsonContent-Type: application/json
{
  "data": {
    "id": "string",
    "name": "string",
    "description": "string",
    "participants": [...]
  }
}
```

Errores:

401 Unauthorized: "No authorization token provided" o "Invalid token"
403 Forbidden: "You are not authorized to access this resource"
500 Internal Server Error: Preferencia no encontrada o error del servidor

#### Crear una nueva preferencia

POST /preferences

Registra una nueva preferencia en el sistema.

Solicitud:
```ts
jsonContent-Type: application/json
{
  "name": "string",
  "description": "string",
  "itineraries": [...] // opcional
}
```

Validación:

El middleware sanitizePreferenceInput realiza una limpieza de los datos, eliminando campos indefinidos.

Respuesta:
```ts
jsonContent-Type: application/json
{
  "message": "Preference created successfully",
  "data": {
    "id": "string",
    "name": "string",
    "description": "string",
    "participants": []
  }
}
```

Errores:

401 Unauthorized: "No authorization token provided" o "Invalid token"
403 Forbidden: "You are not authorized to access this resource"
500 Internal Server Error: Error al crear la preferencia

#### Actualizar una preferencia (PUT)

PUT /preferences/

Actualiza todos los campos de una preferencia existente.

Parámetros de ruta:
id: Identificador único de la preferencia

Solicitud:
```ts
jsonContent-Type: application/json
{
  "name": "string",
  "description": "string",
  "itineraries": [...] // opcional
}
```

Validación:

El middleware sanitizePreferenceInput realiza una limpieza de los datos, eliminando campos indefinidos.

Respuesta:
```ts
jsonContent-Type: application/json
{
  "message": "Preference updated successfully",
  "data": {
    "id": "string",
    "name": "string",
    "description": "string",
    "participants": [...]
  }
}
```

Errores:

401 Unauthorized: "No authorization token provided" o "Invalid token"
403 Forbidden: "You are not authorized to access this resource"
500 Internal Server Error: Error al actualizar la preferencia

#### Actualizar parcialmente una preferencia (PATCH)

PATCH /preferences/

Actualiza campos específicos de una preferencia existente.

Parámetros de ruta:
id: Identificador único de la preferencia

Solicitud:
```ts
jsonContent-Type: application/json
{
  "name": "string", // opcional
  "description": "string", // opcional
  "itineraries": [...] // opcional
}
```

Validación:

Cualquier campo que se incluya debe cumplir con las validaciones del schema del modelo
El middleware sanitizePreferenceInput realiza una limpieza de los datos, eliminando campos indefinidos.

Respuesta:
```ts
jsonContent-Type: application/json
{
  "message": "Preference updated successfully",
  "data": {
    "id": "string",
    "name": "string",
    "description": "string",
    "participants": [...]
  }
}
```

Errores:

401 Unauthorized: "No authorization token provided" o "Invalid token"
403 Forbidden: "You are not authorized to access this resource"
500 Internal Server Error: Error al actualizar la preferencia

#### Eliminar una preferencia

DELETE /preferences/

Elimina una preferencia del sistema.

Parámetros de ruta:
id: Identificador único de la preferencia

Respuesta:
```ts
jsonContent-Type: application/json
{
  "message": "Preference deleted",
  "data": {
    "id": "string",
    "name": "string",
    "description": "string",
    "participants": []
  }
}
```

Respuesta (la preferencia tiene participantes asociados):
```ts
jsonContent-Type: application/json
{
  "message":'Cannot delete the preference because it has associated participants'
}
```

Errores:

400 Bad Request: "Cannot delete the preference because it has associated participants"
401 Unauthorized: "No authorization token provided" o "Invalid token"
403 Forbidden: "You are not authorized to access this resource"
500 Internal Server Error: Error al eliminar la preferencia

### Places

| Método | Ruta                | Descripción                          | Protegida |
| ------ | --------------      | --------------------------------     | --------- |
| GET    | /places             | Obtener todos los lugares            | ❌        |
| GET    | /places/:id         | Obtener un lugar específico          | ❌        |
| POST   | /places             | Crear un nuevo lugar                 | ❌        |
| PUT    | /places /           | Actualizar un lugar completo         | ❌        |
|PATCH   | /places/            | Actualizar campos específicos        | ❌        |
|DELETE  | /places/            | Eliminar un lugar                    | ❌        |

#### Obtener todos los lugares

GET /places

Recupera todos los lugares registrados en el sistema.

Respuesta:
```ts
jsonContent-Type: application/json
{
  "data": [
    {
      "id": "string",
      "name": "string",
      "latitude": number,
      "longitude": number,
      "zipCode": "string",
      "province": "string",
      "country": "string",
      "externalServices": [...],
      "activities": [...],
      "itineraries": [...]
    }
  ]
}
```

Respuesta (sin lugares):
```ts
jsonContent-Type: application/json
{
  "message": "No places found",
  "data": []
}
```

Errores:

500 Internal Server Error: Error del servidor al buscar lugares

#### Obtener un lugar específico

GET /places/:id 

Recupera la información de un lugar específico según su ID.

Parámetros de ruta:
id: Identificador único del lugar

Respuesta:
```ts
jsonContent-Type: application/json
{
  "data": {
    "id": "string",
    "name": "string",
    "latitude": number,
    "longitude": number,
    "zipCode": "string",
    "province": "string",
    "country": "string",
    "externalServices": [...],
    "activities": [...],
    "itineraries": [...]
  }
}
```

Errores:

500 Internal Server Error: Lugar no encontrado o error del servidor

#### Crear un nuevo lugar

POST /places

Registra un nuevo lugar en el sistema.

Solicitud:
```ts
jsonContent-Type: application/json
{
  "name": "string",
  "latitude": number,
  "longitude": number,
  "zipCode": "string",
  "province": "string",
  "country": "string"
}
```

Validación:

El middleware sanitizePlaceInput realiza una limpieza de los datos, eliminando campos indefinidos.
El middleware validateSchema(postSchema) valida el formato de los datos enviados.

Respuesta:
```ts
jsonContent-Type: application/json
{
  "message": "Place created successfully",
  "data": {
    "id": "string",
    "name": "string",
    "latitude": number,
    "longitude": number,
    "zipCode": "string",
    "province": "string",
    "country": "string",
    "externalServices": [],
    "activities": [],
    "itineraries": []
  }
}
```

Errores:

400 Bad Request: "There is already a place with the same coordinates"
400 Bad Request: "There is already a place with the same name, Province/State and Country"
500 Internal Server Error: Error al crear el lugar

#### Actualizar un lugar (PUT)

PUT /places/

Actualiza todos los campos de un lugar existente.

Parámetros de ruta:
id: Identificador único del lugar

Solicitud:
```ts
jsonContent-Type: application/json
{
  "name": "string",
  "latitude": number,
  "longitude": number,
  "zipCode": "string",
  "province": "string",
  "country": "string"
}
```

Validación:

El middleware sanitizePlaceInput realiza una limpieza de los datos, eliminando campos indefinidos.
El middleware validateSchema(putSchema) valida el formato de los datos enviados.

Respuesta:
```ts
jsonContent-Type: application/json
{
  "message": "Place updated successfully",
  "data": {
    "id": "string",
    "name": "string",
    "latitude": number,
    "longitude": number,
    "zipCode": "string",
    "province": "string",
    "country": "string",
    "externalServices": [...],
    "activities": [...],
    "itineraries": [...]
  }
}
```

Errores:

400 Bad Request: "There is already a place with the same coordinates!"
400 Bad Request: "There is already a place with the same name, Province/State and Country"
500 Internal Server Error: "Error updating place"

#### Actualizar parcialmente un lugar (PATCH)

PATCH /places/

Actualiza campos específicos de un lugar existente.

Parámetros de ruta:
id: Identificador único del lugar

Solicitud:
```ts
jsonContent-Type: application/json
{
  "name": "string", // opcional
  "latitude": number, // opcional
  "longitude": number, // opcional
  "zipCode": "string", // opcional
  "province": "string", // opcional
  "country": "string" // opcional
}
```

Validación:

Cualquier campo que se incluya debe cumplir con las validaciones del schema del modelo
El middleware sanitizePlaceInput realiza una limpieza de los datos, eliminando campos indefinidos.


Respuesta:
```ts
jsonContent-Type: application/json
{
  "message": "Place updated successfully",
  "data": {
    "id": "string",
    "name": "string",
    "latitude": number,
    "longitude": number,
    "zipCode": "string",
    "province": "string",
    "country": "string",
    "externalServices": [...],
    "activities": [...],
    "itineraries": [...]
  }
}
```

Errores:

400 Bad Request: "There is already a place with the same coordinates!"
400 Bad Request: "There is already a place with the same name, Province/State and Country"
500 Internal Server Error: "Error updating place"

#### Eliminar un lugar

DELETE /places/

Elimina un lugar del sistema.

Parámetros de ruta:
id: Identificador único del lugar

Respuesta:
```ts
jsonContent-Type: application/json
{
  "message": "Place deleted",
  "data": {
    "id": "string",
    "name": "string",
    "latitude": number,
    "longitude": number,
    "zipCode": "string",
    "province": "string",
    "country": "string",
    "externalServices": [],
    "activities": [],
    "itineraries": []
  }
}
```

Errores:

400 Bad Request: "Cannot delete the place because it has associated external services"
400 Bad Request: "Cannot delete the place because it has associated itineraries"
500 Internal Server Error: Error al eliminar el lugar

### Participants

| Método | Ruta                               | Descripción                                    | Protegida |
| ------ | --------------                     | --------------------------------               | --------- |
| GET    | /api/participants/:userId          | Obtener todos los participantes de un usuario  | ✅        |
| GET    | /api/participants/getone/:id       | Obtener un participante específico             | ✅        |
| POST   | /api/participants                  | Crear un nuevo participante                    | ✅        |
| POST   | /api/participants/favorite         | Añadir participante favorito                   | ✅        |
| PUT    | /api/participants/                 | Actualizar un participante completo            | ✅        |
|PATCH   | /api/participants/                 | Actualizar parcialmente un participante        | ✅        |
|DELETE  | /api/participants/                 | Eliminar un participante                       | ✅        | 

#### Obtener todos los participantes de un usuario

GET /api/participants/:userId

Obtiene todos los participantes asociados a un usuario específico.

Parámetros URL:
userId: ID del usuario cuyos participantes se desean obtener

Respuesta:
```ts
jsonContent-Type: application/json
{
  "message": "Participants retrieved successfully",
  "data": [
    {
      "id": "670bd0cc60eb88e665c9fb90",
      "name": "Participant 1",
      "age": 20,
      "disability": true,
      "preferences": [...],
      "user": "66fc4785f2b5cf4ef633816a"
    },
    {
      "id": "...",
      "name": "Participant 2",
      "age": 20,
      "disability": false,
      "preferences": [...],
      "user": "66fc4785f2b5cf4ef633816a"
    }
  ]
}
```

#### Obtener un participante específico

GET /api/participants/getone/:id

Obtiene información detallada de un participante específico.

Parámetros URL:
id: ID del participante a consultar

Respuesta:
```ts
jsonContent-Type: application/json
{
  "message": "Participant retrieved successfully",
  "data": {
    "id": "670bd0cc60eb88e665c9fb90",
    "name": "Facundo",
    "age": 24,
    "disability": false,
    "preferences": [
      {"id": "670bce8c16da0fb6e0947f33"},
      {"id": "670bce6416da0fb6e0947f31"}
    ],
    "user": "66fc4785f2b5cf4ef633816a"
  }
}
```

#### Crear un nuevo participante

POST /api/participants

Crea un nuevo participante en el sistema.

Solicitud:
```ts
jsonContent-Type: application/json
{
  "name": "Participant 2",
  "age": 20,
  "disability": false,
  "preferences": ["670bcc78732bbbc7b6926278"],
  "user": "66fc4785f2b5cf4ef633816a"
}
```

Validación:

- name:
  - 'Name must be a string'
  - 'Name is required'
  - 'Name must be at least 3 characters'
- age:
  - 'Age must be a number'
  - 'age must be between 1 and 3 digits'

- disability:
  - 'Disability must be a boolean'

Respuesta:
```ts
jsonContent-Type: application/json
{
  "message": "Participant created successfully",
  "data": {
    "id": "670bd0cc60eb88e665c9fb90",
    "name": "Participant 2",
    "age": 20,
    "disability": false,
    "preferences": ["670bcc78732bbbc7b6926278"],
    "user": "66fc4785f2b5cf4ef633816a"
  }
}
```

#### Añadir participante favorito

POST /api/participants/favorite

Añade un participante como favorito.

Solicitud:
```ts
jsonContent-Type: application/json
{
  "name": "Participant 1",
  "age": 20,
  "disability": true,
  "preferences": ["670bce6416da0fb6e0947f31"],
  "user": "66fc4785f2b5cf4ef633816a"
}
```

Validación:

El middleware sanitizeParticipantInput realiza una limpieza de los datos, eliminando campos indefinidos.

Respuesta:
```ts
jsonContent-Type: application/json
{
  "message": "Favorite participant added successfully",
  "data": {
    "id": "670bd0cc60eb88e665c9fb91",
    "name": "Participant 1",
    "age": 20,
    "disability": true,
    "preferences": ["670bce6416da0fb6e0947f31"],
    "user": "66fc4785f2b5cf4ef633816a",
    "favorite": true
  }
}
```

#### Actualizar un participante completo

PUT /api/participants/:id

Actualiza todos los datos de un participante existente.

Parámetros URL:
id: ID del participante a actualizar

Solicitud:
```ts
jsonContent-Type: application/json
{
  "name": "Facundo",
  "age": 24,
  "disability": false,
  "preferences": [
    {"id": "670bce8c16da0fb6e0947f33"},
    {"id": "670bce6416da0fb6e0947f31"}
  ]
}
```

Validación:

- name:
  - 'Name must be a string'
  - 'Name is required'
  - 'Name must be at least 3 characters'
- age:
  - 'Age must be a number'
  - 'age must be between 1 and 3 digits'

- disability:
  - 'Disability must be a boolean'

Respuesta:
```ts
jsonContent-Type: application/json
{
  "message": "Participant updated successfully",
  "data": {
    "id": "670bd0cc60eb88e665c9fb90",
    "name": "Facundo",
    "age": 24,
    "disability": false,
    "preferences": [
      {"id": "670bce8c16da0fb6e0947f33"},
      {"id": "670bce6416da0fb6e0947f31"}
    ],
    "user": "66fc4785f2b5cf4ef633816a"
  }
}
```

#### Actualizar parcialmente un participante

PATCH /api/participants/:id

Actualiza solo los campos específicos de un participante existente.

Parámetros URL:
id: ID del participante a actualizar parcialmente

Solicitud:
```ts
jsonContent-Type: application/json
{
  "name": "Nicolás Escobar"
}
```

Validación:

Cualquier campo que se incluya debe cumplir con las validaciones del schema del modelo
El middleware sanitizeParticipantInput realiza una limpieza de los datos, eliminando campos indefinidos.


Respuesta:
```ts
jsonContent-Type: application/json
{
  "message": "Participant updated successfully",
  "data": {
    "id": "66ff22aece8bda39a2e5be6c",
    "name": "Nicolás Escobar",
    "age": 20,
    "disability": false,
    "preferences": [...],
    "user": "66fc4785f2b5cf4ef633816a"
  }
}
```

#### Eliminar un participante

DELETE /api/participants/:id

Elimina un participante específico del sistema.

Parámetros URL:
id: ID del participante a eliminar

Respuesta:
```ts
jsonContent-Type: application/json
{
  "message": "Participant deleted successfully",
  "data": {
    "id": "66ff22aece8bda39a2e5be6c",
    "name": "Nicolás Escobar",
    "age": 20,
    "disability": false,
    "preferences": [...],
    "user": "66fc4785f2b5cf4ef633816a"
  }
}
```

Errores comunes:

400 Bad Request: "Invalid participant data"
404 Not Found: "Participant not found"
401 Unauthorized: "Authentication required"
500 Internal Server Error: "An error occurred while processing your request"

### Opinions

| Método | Ruta                               | Descripción                           | Protegida |
| ------ | --------------                     | --------------------------------      | --------- |
| GET    | /api/itineraries                    | Obtener todas las opiniones           | ✅        |
| GET    | /api/opiniones/                    | Obtener una opinión específica        | ✅        |
| GET    | /api/opiniones/activity/           | Obtener opiniones por actividad       | ✅        |
| POST   | /api/opiniones                     | Crear una nueva opinión               | ✅        |
| PUT    | /api/opiniones/                    | Actualizar una opinión completa       | ✅        |
|PATCH   | /api/opiniones/                    | Actualizar parcialmente una opinión   | ✅        |
|DELETE  | /api/opiniones/                    | Eliminar una opinión                  | ✅        | 

#### Obtener todas las opiniones

GET /api/opiniones

Obtiene todas las opiniones registradas en el sistema.

Respuesta:
```ts
jsonContent-Type: application/json
{
  "message": "Todos las opiniones encontradas",
  "data": [
 {
      "id": "670bd0cc60eb88e665c9fb90",
      "rating": 5,
      "comment": "Excelente lugar para pasar el día",
      "user": {...},
      "activity": {...}
    },
    {...}
  ]
}
```

Respuesta (no hay opiniones):
```ts
jsonContent-Type: application/json
{ message: "No se encontraron opiniones" }
```

Errores:

500 Internal Server Error: Error del servidor

#### Obtener una opinión específica

GET /api/opiniones/:id

Obtiene información detallada de una opinión específica.

Parámetros URL:
id: ID de la opinión a consultar

Respuesta:
```ts
jsonContent-Type: application/json
{
  "message": "Opinion encontrada: ",
  "data": {
    "id": "670bd0cc60eb88e665c9fb90",
    "rating": 5,
    "comment": "Excelente lugar para pasar el día",
    "user": {...},
    "activity": {...}
  }
}
```

Errores:

500 Internal Server Error: Error del servidor

#### Obtener opiniones por actividad

GET /api/opiniones/activity/:id

Obtiene todas las opiniones asociadas a una actividad específica.

Parámetros URL:
id: ID de la actividad cuyos opiniones se desean obtener

Respuesta:
```ts
jsonContent-Type: application/json
{
  "message": "Todos las opiniones encontradas",
  "data": [
    {
      "id": "670bd0cc60eb88e665c9fb90",
      "rating": 5,
      "comment": "Excelente lugar para pasar el día",
      "user": {...},
      "activity": {...}
    },
    {...}
  ]
}
```

Respuesta (no hay opiniones):
```ts
jsonContent-Type: application/json
{ message: "No se encontraron opiniones" }
```

Errores:

500 Internal Server Error: Error del servidor

#### Crear una nueva opinión

POST /api/opiniones

Crea una nueva opinión en el sistema.

Solicitud:
```ts
jsonContent-Type: application/json
{
  "rating": 5,
  "comment": "Excelente lugar para pasar el día",
  "activity": "67178bbf8fec993032a05aa9",
  "user": "669d9a3503f535edd5c7aabe"
}
```

Validación:

- rating:

  - "La calificación debe ser un número"
  - "La calificación es requerida"
  - "La calificación debe ser un número entre 1 y 5"


- comment:

  - "El comentario debe ser un string"
  - "El comentario es requerido"
  - "El comentario debe tener entre 1 y 100 caracteres"


activity.id: ID de la actividad que se está valorando
user.id: ID del usuario que crea la opinión

Respuesta:
```ts
jsonContent-Type: application/json
{
  "message": "Opinion creada",
  "data": {
    "id": "670bd0cc60eb88e665c9fb90",
    "rating": 5,
    "comment": "Excelente lugar para pasar el día",
    "activity": "67178bbf8fec993032a05aa9",
    "user": "669d9a3503f535edd5c7aabe"
  }
}
```

Errores:

404 Not Found: "Actividad no encontrada" o "Usuario no encontrado"
500 Internal Server Error: Error del servidor

#### Actualizar una opinión completa

PUT /api/opiniones/:id

Actualiza todos los datos de una opinión existente.

Parámetros URL:
id: ID de la opinión a actualizar

Solicitud:
```ts
jsonContent-Type: application/json
{
  "rating": 4,
  "comment": "Excelente lugar para pasar el día"
}
```

Validación:

Los campos deben cumplir con las validaciones del schema del modelo. Se deben incluir todos los campos.
El middleware sanitizeOpinionInput realiza una limpieza de los datos, eliminando campos indefinidos.

Respuesta:
```ts
jsonContent-Type: application/json
{
  "message": "Opinion actualizada",
  "data": {
    "id": "670bd0cc60eb88e665c9fb90",
    "rating": 4,
    "comment": "Excelente lugar para pasar el día",
    "activity": "67178bbf8fec993032a05aa9",
    "user": "669d9a3503f535edd5c7aabe"
  }
}
```

Errores:

500 Internal Server Error: Error del servidor

#### Actualizar parcialmente una opinión

PATCH /api/opiniones/:id

Actualiza solo los campos específicos de una opinión existente.

Parámetros URL:
id: ID de la opinión a actualizar parcialmente

Solicitud:
```ts
jsonContent-Type: application/json
{
  "rating": 3
}
```

Validación:

Cualquier campo que se incluya debe cumplir con las validaciones del schema del modelo
El middleware sanitizeOpinionInput realiza una limpieza de los datos, eliminando campos indefinidos.

Respuesta:
```ts
jsonContent-Type: application/json
{
  "message": "Opinion actualizada",
  "data": {
    "id": "670bd0cc60eb88e665c9fb90",
    "rating": 3,
    "comment": "Excelente lugar para pasar el día",
    "activity": "67178bbf8fec993032a05aa9",
    "user": "669d9a3503f535edd5c7aabe"
  }
}
```

Errores:

500 Internal Server Error: Error del servidor

#### Eliminar una opinión

DELETE /api/opiniones/:id

Elimina una opinión específica del sistema.

Parámetros URL:
id: ID de la opinión a eliminar

Respuesta:
```ts
jsonContent-Type: application/json
{
  "message": "Opinion eliminada"
}
```

Errores:

500 Internal Server Error: Error del servidor

### Itineraries

| Método | Ruta                             | Descripción                                  | Protegida |
| ------ | --------------                   | --------------------------------             | --------- |
| GET    | /api/itineraries                 | Obtener todos los itinerarios                | ✅        |
| GET    | /api/itineraries/user/:id        | Obtener itinerarios por usuario              | ✅        |
| GET    | /api/itineraries/                | Obtener un itinerario específico             | ✅        |
| POST   | /api/itineraries                 | Crear un nuevo itinerario                    | ✅        |
| POST   | /api/itineraries/ia              | Crear un itinerario con IA                   | ✅        |
| PUT    | /api/itineraries/                | Actualizar un itinerario completo            | ✅        |
|PATCH   | /api/itineraries/                | Actualizar parcialmente un itinerario        | ✅        |
|DELETE  | /api/itineraries/                | Eliminar un itinerario                       | ✅        | 

####  Obtener todos los itinerarios

GET /api/itineraries

Obtiene todos los itinerarios registrados en el sistema.

Respuesta:
```ts
jsonContent-Type: application/json
{
  "data": [
    {
      "id": "670bd0cc60eb88e665c9fb90",
      "title": "Itinerario 1111",
      "description": "Itinerario hecho para 7 dias en Disney...",
      "dayStart": "2024-10-30T00:00:00.000Z",
      "dayEnd": "2024-11-23T00:00:00.000Z",
      "activities": [...],
      "participants": [...],
      "user": {...},
      "place": {...}
    },
    {...}
  ]
}
```

Errores:

500 Internal Server Error: Error del servidor

#### Obtener itinerarios por usuario

GET /api/itineraries/user/:id

Obtiene todos los itinerarios asociados a un usuario específico.

Parámetros URL:
id: ID del usuario cuyos itinerarios se desean obtener

Respuesta:
```ts
jsonContent-Type: application/json
{
  "data": [
    {
      "id": "670bd0cc60eb88e665c9fb90",
      "title": "Itinerario 1111",
      "description": "Itinerario hecho para 7 dias en Disney...",
      "dayStart": "2024-10-30T00:00:00.000Z",
      "dayEnd": "2024-11-23T00:00:00.000Z",
      "place": {...}
    },
    {...}
  ]
}
```

Errores:

500 Internal Server Error: Error del servidor

#### Obtener un itinerario específico

GET /api/itineraries/:id

Obtiene información detallada de un itinerario específico.

Parámetros URL:
id: ID del itinerario a consultar

Respuesta:
```ts
jsonContent-Type: application/json
{
  "data": {
    "id": "670bd0cc60eb88e665c9fb90",
    "title": "Itinerario 1111",
    "description": "Itinerario hecho para 7 dias en Disney...",
    "dayStart": "2024-10-30T00:00:00.000Z",
    "dayEnd": "2024-11-23T00:00:00.000Z",
    "activities": [...],
    "participants": [...],
    "user": {...},
    "place": {...}
  }
}
```

Errores:

500 Internal Server Error: Error del servidor

#### Crear un nuevo itinerario

POST /api/itineraries

Crea un nuevo itinerario en el sistema.

Solicitud:
```ts
jsonContent-Type: application/json
{
  "title": "Itinerario 1111",
  "description": "Itinerario hecho para 7 dias en Disney...",
  "dayStart": "2024-10-30",
  "dayEnd": "2024-11-23",
  "user": "6722862eeed0a44e8abde61f",
  "place": "67157b64371c9028019e640c",
  "activities": ["66fd97cb2e28ca23b47f2058", "66fd97cb2e28ca23b47f2058"],
  "participants": []
}
```

Validación:

- title:

  - "Title must be a string"
  - "Title is required"
  - "Title must have at least 3 characters"
  - "Title can have a maximum of 20 characters"


- description:

  - "Description must be a string"
  - "Description must have at least 10 characters"
  - "Description can have a maximum of 100 characters"


- place:

  - "Place must be a string"
  - "Place is required"


- dayStart:

  - "Start day must be a valid date"
  - "Start day is required"


- dayEnd:

  - "End day must be a valid date"
  - "End day is required"
  - "End day must be after start day"
  - "Itinerary must last at least 2 days"
  - "Itinerary must not last more than 31 days"



Respuesta:
```ts
jsonContent-Type: application/json
{
  "message": "Itinerario creado con éxito",
  "data": {
    "id": "670bd0cc60eb88e665c9fb90",
    "title": "Itinerario 1111",
    "description": "Itinerario hecho para 7 dias en Disney...",
    "dayStart": "2024-10-30T00:00:00.000Z",
    "dayEnd": "2024-11-23T00:00:00.000Z",
    "activities": [...],
    "participants": [],
    "user": "6722862eeed0a44e8abde61f",
    "place": "67157b64371c9028019e640c"
  }
}
```

Errores:

400 Bad Request: "El user ingresado no existe"
500 Internal Server Error: Error del servidor

#### Crear un itinerario con IA

POST /api/itineraries/ia

Crea un nuevo itinerario utilizando inteligencia artificial basado en las preferencias y participantes.

Solicitud:
```ts
jsonContent-Type: application/json
{
  "title": "DISNEY",
  "description": "Itinerario hecho para 7 dias en Disney...",
  "dayStart": "2024-10-30",
  "dayEnd": "2024-11-23",
  "user": "6722862eeed0a44e8abde61f",
  "place": "67236e6e1706dd5a0709c4df",
  "participants": ["6724d5e367bf8ca176f0b7ca", "6724d5ee67bf8ca176f0b7cb"]
}
```

Validación:

Los campos deben cumplir con las validaciones del schema del modelo. Se deben incluir todos los campos.

Errores:

400 Bad Request: "El user ingresado no existe" o "El place ingresado no existe"
500 Internal Server Error: Error del servidor

#### Actualizar un itinerario completo

PUT /api/itineraries/:id

Actualiza todos los datos de un itinerario existente.

Parámetros URL:
id: ID del itinerario a actualizar

Solicitud:
```ts
jsonContent-Type: application/json
{
  "title": "Itinerario 2",
  "description": "Itinerario hecho para 7 dias en Disney...",
  "dayStart": "2024-10-30",
  "dayEnd": "2024-11-23",
  "place": {
    "id": "67157b64371c9028019e640c"
  },
  "participants": [...]
}
```

Validación:

Los campos deben cumplir con las validaciones del schema del modelo. Se deben incluir todos los campos.
El middleware sanitizeItineraryInput realiza una limpieza de los datos, eliminando campos indefinidos.

Respuesta:
```ts
jsonContent-Type: application/json
{
  "message": "Itinerario actualizado con exito",
  "data": {
    "id": "670bd0cc60eb88e665c9fb90",
    "title": "Itinerario 2",
    "description": "Itinerario hecho para 7 dias en Disney...",
    "dayStart": "2024-10-30T00:00:00.000Z",
    "dayEnd": "2024-11-23T00:00:00.000Z",
    "place": "67157b64371c9028019e640c",
    "participants": [...]
  }
}
```

Errores:

500 Internal Server Error: Error del servidor

#### Actualizar parcialmente un itinerario

PATCH /api/itineraries/:id

Actualiza solo los campos específicos de un itinerario existente.

Parámetros URL:
id: ID del itinerario a actualizar parcialmente

Solicitud:
```ts
jsonContent-Type: application/json
{
  "title": "Nuevo título"
}
```

Validación:

Cualquier campo que se incluya debe cumplir con las validaciones del schema del modelo
El middleware sanitizeItineraryInput realiza una limpieza de los datos, eliminando campos indefinidos.

Respuesta:
```ts
jsonContent-Type: application/json
{
  "message": "Itinerario actualizado con exito",
  "data": {
    "id": "670bd0cc60eb88e665c9fb90",
    "title": "Nuevo título",
    "description": "Itinerario hecho para 7 dias en Disney...",
    "dayStart": "2024-10-30T00:00:00.000Z",
    "dayEnd": "2024-11-23T00:00:00.000Z",
    "place": "67157b64371c9028019e640c",
    "participants": [...]
  }
}
```

Errores:

500 Internal Server Error: Error del servidor

#### Eliminar un itinerario

DELETE /api/itineraries/:id

Elimina un itinerario específico del sistema.

Parámetros URL:
id: ID del itinerario a eliminar

Respuesta:
```ts
jsonContent-Type: application/json
{
  "message": "Itinerario borrado",
  "data": {
    "id": "670bd0cc60eb88e665c9fb90",
    "title": "Itinerario 1111",
    "description": "Itinerario hecho para 7 dias en Disney...",
    "dayStart": "2024-10-30T00:00:00.000Z",
    "dayEnd": "2024-11-23T00:00:00.000Z"
  }
}
```

Errores:

500 Internal Server Error: Error del servidor

### External Services

| Método | Ruta                               | Descripción                           | Protegida |
| ------ | --------------                     | --------------------------------      | --------- |
| POST   | /api/publicity                    | Submit a publicity request               | ❌        |
| GET    | /api/publicity/places                   | Get all external services          | ❌       |
| GET    | /api/externalServices                   | Get all external services          | ✅        |
| GET    | /api/externalServices/                   | Get an external service by ID        | ✅        |
| GET    | /api/externalServices/findByPlace/          | Get external services by place ID      | ✅        |
| POST   | /api/externalServices                   | Create a new external service              | ✅        |
| POST   | /api/externalServices/acceptRequest/                    | Accept a publicity request               | ✅        |
| PUT    | /api/externalServices/                    | Update an external service       | ✅        |
|PATCH   | /api/externalServices/                    | Partially update external service   | ✅        |
|DELETE  | /api/externalServices/                  | Delete an external service               | ✅        |
