# itinerarIA API Documentation

## Project Overview

itinerarIA is a RESTful API that facilitates the creation and management of travel itineraries. The application allows users to register, create personalized itineraries with AI, add participants, add activities, specify locations, advertise external services, and so on. The system includes user authentication, authorization mechanisms, and comprehensive data validation.

## Base URL

## [itinerarIA](https://itineraria-backend.up.railway.app/)

## Technology Stack

- Backend Framework: Node.js with Express
- Database: MongoDB with MikroORM as the ODM (Object Document Mapper)
- Authentication: JWT (JSON Web Tokens)
- Validation: Zod schema validation
- Testing: Vitest and Supertest
- Containerization: Docker and Docker Compose

## Getting Started

### System Requirements

- Node.js (v16+)
- MongoDB (local or Atlas)
- npm or yarn package manager

### Installation

#### Local Installation

1. Clone the repository:
```bash
git clone https://github.com/TomasSanchezMachado/itinerarIA-Backend.git
cd itinerarIA-Backend
```

2. Install dependencies:
```bash
npm install
```

3. Setup environment variables (create a .env file in the root directory):

JWT_SECRET=your_jwt_secret
MONGO_URI=your_mongodb_LOCAL_connection_string
GEMINI_API_KEY=your_gemini_api_key

NOTE: The variable MONGO_URI must contain the connection string to your LOCAL database.

4. Docker Installation

- Clone the repository and navigate to the project folder
- Configure environment variables for Docker:

  - MONGO_INITDB_ROOT_USERNAME=your_username
  - MONGO_INITDB_ROOT_PASSWORD=your_password

- Build and run with Docker Compose:
```bash
docker-compose up -d
```

#### Running the Application

##### Development Mode
```bash
npm run start:dev
```
The local server is setted up to run with the database related to the variable MONGO_URI

##### Production Mode
The server in production mode is running always. There's no need of running it from the bash.
It is already setted up to run with the cloud database.

##### Test Environment
Para ejecutar tests End to End
```bash
npm run test:e2e
```

Para ejecutar tests unitarios
```bash
npm run test:vitest
```

## Authentication

The API uses JSON Web Tokens (JWT) for authentication. Tokens are stored in HTTP-only cookies for secure client-side storage.

### Token Generation
Tokens are generated using the jsonwebtoken library with the following configuration:

- Expiration: 7 days
- Secret key: Stored in .env file
### Cookie Configuration
Cookies are configured with the following security settings:

- httpOnly: True in production (prevents JavaScript access)
- secure: True in production (sent only over HTTPS)
- sameSite: "none" in production, "lax" in development
- maxAge: 24 hours (1 day)

## Authorization
The API implements role-based access control using middleware functions.

### Middleware Functions
#### authenticateJWT

This middleware verifies the presence and validity of a JWT token in the request cookies:
```ts
function authenticateJWT(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: 'No authorization token provided' });
  }
  jwt.verify(token, secretKey, (err) => {
    if (err) {
      return res.status(403).json({ message: 'Failed to authenticate token' });
    }
    next();
  });
}
```

#### isAdmin
This middleware checks if the authenticated user has administrator privileges:

```ts
const isAdmin = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: 'No authorization token provided' });
  }
  jwt.verify(token, secretKey, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    const userId = decoded.id;
    const user = await em.findOne(User, { id: userId.toString() });
    if (user && user.isAdmin) {
      return next();
    }
    return res.status(403).json({ message: "You are not authorized to access this resource" });
  });
};
```

#### validateToken
This middleware validates tokens and attaches the payload to the request:
```ts
function validateToken(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Auth token is not supplied" });
  }
  try {
    const payload = jwt.verify(token, jwtSecret);
    req.body.payload = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}
```

## Database Schema
The application uses MikroORM with MongoDB to manage data. Below are the key entities and their relationships.

### Base Entity
All entities extend from a base entity providing common functionality:
```ts
abstract class BaseEntity {
  @PrimaryKey()
  _id?: ObjectId = new ObjectId();
  
  @SerializedPrimaryKey()
  id!: string;
}
```
### MongoDB Connection
The application connects to MongoDB using the following configuration:
```ts
const orm = await MikroORM.init({
  entities: ["./dist/**/*.entity.js"],
  entitiesTs: ["./src/**/*.entity.ts"],
  dbName: DB_NAME,
  type: "mongo",
  clientUrl: MONGO_ATLAS_URI,
  highlighter: new MongoHighlighter(),
  debug: false, // Set to false in production
});
```

## Middlewares
### CORS Middleware
The API implements CORS protection with the following configuration:
```ts
const ACCEPTED_ORIGINS = [
  "http://localhost:5174",
  "http://localhost:5173",
  "https://itinerar-ia-frontend.vercel.app",
];

const corsMiddleware = ({ acceptedOrigins = ACCEPTED_ORIGINS } = {}) => {
  const options: CorsOptions = {
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (acceptedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    maxAge: 86400, // 24 hours
  };
  return cors(options);
};
```

### Schema Validation Middleware
Input validation is performed using Zod schemas:
```ts
const validateSchema = (schema: any) => (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse(req.body.sanitizedInput);
    next();
  } catch (error) {
    return res.status(400).json({ 
      message: (error as any).errors.map((error: any) => error.message) 
    });
  }
}
```
## Error Handling
### Common HTTP Status Codes

- 200 OK: Request was successful
- 400 Bad Request: Invalid input data
- 401 Unauthorized: Missing or invalid authentication
- 403 Forbidden: Valid authentication but insufficient permissions
- 404 Not Found: Resource not found
- 500 Internal Server Error: Server-side error 

## Endpoints

### Authentication

| HTTP Method | Route          | Description                     | Protected |
| ------ | -------------- | -------------------------------- | --------- |
| POST   | /auth/register | Register a new user              | ❌        |
| POST   | /auth/login    | User login              | ❌        |
| POST   | /auth/logout   | User logout                | ✅        |
| POST   | /auth/profile  | Get user profile      | ✅        |
| POST   | /auth/verify   | Verify authentication token | ✅        |

#### Register User

HTTP Method & URL: POST /api/auth/register

Description: Registers a new user in the system.

Request Body:

```ts
Content-Type:application/json
{
  "username": "string",
  "password": "string",
  "names": "string",
  "lastName": "string",
  "dateOfBirth": "Date",
  "mail": "string",
  "phoneNumber": "string",
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

Response Codes:

- 200 OK: User successfully registered
- 400 Bad Request: Invalid input or user already exists
- 500 Internal Server Error: Registration failed

Response Body (Success - 200 OK):

```ts
Content-Type:application/json
{
  "message": "User logged successfully",
  "data": {
    "user": {
      "id": "string",
      "username": "string",
      "names": "string",
      "lastName": "string",
      "dateOfBirth": "Date",
      "mail": "string",
      "phoneNumber": "string",
      "isAdmin": false
    }
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

Error Responses:

400 Bad Request:
```json
{
  "message": ["User already exists"]
}
```
OR
```json
{
  "message": ["The email is already in use"]
}
```

500 Internal Server Error:

```json
{
  "message": "The user could not be registered",
  "data": {
    "message": "User already exists"
  }
}
```



#### User Login

HTTP Method & URL: POST /api/auth/login

Description: Authenticates a user and returns a session token.

Request Body:
```json
{
  "username": "string",
  "password": "string"
}
```

Validation Rules:

- username:

  - "Username must be a string"
  - "Username is required"
  - "Username must be between 3 and 30 characters and can only contain letters, numbers, underscores, and hyphens"

- password:

  - "Password must be a string"
  - "Password is required"
  - "Password must be at least 8 characters long and contain at least one uppercase letter and one number"

Response Codes:

200 OK: Login successful
400 Bad Request: Invalid credentials
500 Internal Server Error: Login process failed

Response Body (Success - 200 OK):
```json
{
  "message": "User logged successfully",
  "data": {
    "user": {
      "id": "string",
      "username": "string",
      "names": "string",
      "lastName": "string",
      "dateOfBirth": "2024-04-24",
      "mail": "string",
      "phoneNumber": "string",
      "isAdmin": false,
      "itineraries": [],
      "participants": []
    }
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```
Error Responses:

400 Bad Request:

```json
{
  "message": ["Incorrect username or password. Please try again."]
}
```

500 Internal Server Error:

```json
{
  "message": "The user could not be logged in",
  "data": "Error details"
}
```

Example Request:
```bash
curl -X POST https://api.itineraria.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "traveler2024",
    "password": "Travel2024"
  }
```

Notes: Upon successful login, a JWT token is set as an HTTP-only cookie.

#### User Logout

HTTP Method & URL: POST /api/auth/logout

Description: Logs out the currently authenticated user by invalidating their session.

Request Body: None required

Response Codes:

200 OK: Logout successful
401 Unauthorized: No valid authentication

Response Body (Success - 200 OK):
```json
{
  "message": "User logged out"
}
```

Error Responses:

500 Internal Server Error:

```json
{
   message: "Internal server error during logout"
}
```

Example Request:
```bash
curl -X POST https://api.itineraria.com/auth/logout \
  -H "Cookie: token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

Notes: This endpoint clears the authentication token cookie.

#### Get User Profile

HTTP Method & URL: POST /auth/profile

Description: Retrieves the profile information of the currently authenticated user.

Request Body: None required

Response Codes:

200 OK: Profile successfully retrieved
400 Bad Request: User not found
500 Internal Server Error: Profile retrieval failed

Response Body (Success - 200 OK):
```json
{
  "message": "User profile found",
  "data": {
    "user": {
      "id": "string",
      "username": "string",
      "names": "string",
      "lastName": "string",
      "dateOfBirth": "2024-04-24",
      "mail": "string",
      "phoneNumber": "string",
      "isAdmin": false
    }
  }
}
```

Error Responses:

400 Bad Request:

json{
  "message": "User not found"
}

500 Internal Server Error:

json{
  "message": "The user profile could not be found",
  "data": "Error details"
}

Example Request:
```bash
curl -X POST https://api.itineraria.com/auth/profile \
  -H "Cookie: token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### Verify Token

HTTP Method & URL: POST /api/auth/verify

Description: Verifies if the authentication token is valid and returns user information.

Request Body: None required

Response Codes:

200 OK: Token is valid
401 Unauthorized: Token is invalid or user not found

Response Body (Success - 200 OK):
```json
{
  "message": "User found",
  "data": {
    "user": {
      "id": "string",
      "username": "string",
      "names": "string",
      "lastName": "string",
      "dateOfBirth": "2024-04-24",
      "mail": "string",
      "phoneNumber": "string",
      "isAdmin": false,
      "itineraries": [],
      "participants": []
    }
  }
}
```

401 Unauthorized:
```json
{ message: "User not found", userFound: userFound }
```

Example Request:
```bash
curl -X POST https://api.itineraria.com/auth/verify \
  -H "Cookie: token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

Notes: This endpoint is typically used to check if a user's session is still valid and to retrieve current user data.

### Users

| HTTP Method | Route          | Description                     | Protected |
| ------ | -------------- | -------------------------------- | --------- |
| GET    | /api/users         | Get all users      | ❌        |
| GET    | /api/users/:id         | Get a specific user    | ❌        |
| POST   | /api/users         | Create a new user           | ❌        |
| PUT    | /api/users/        |Update an entire user   | ❌        |
|PATCH   | /api/users/        | Update specific user fields    | ❌        |
|DELETE  | /api/users/        | Delete a user             | ❌        |

#### Get All Users

HTTP Method & URL: GET /users

Description: Retrieves all users registered in the system.

Request Body: None

Response Codes:

200 OK: Users successfully retrieved
500 Internal Server Error: Server error while retrieving users

Response Body (Success - 200 OK):
```json
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

Error Responses:

500 Internal Server Error:

```json
{
  "message": "Server error while retrieving users"
}
```

Example Request:
```bash
curl -X GET https://api.itineraria.com/users
```

#### Get Specific User


GET /user/:id

HTTP Method & URL: GET /users/:id

Description: Retrieves information for a specific user based on their ID.

Request Parameters:

id (path parameter): Unique identifier of the user

Request Body: None

Response Codes:

200 OK: User successfully retrieved
500 Internal Server Error: User not found or server error

Response Body (Success - 200 OK):
```json
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

Error Responses:

500 Internal Server Error:

```json
{
  "message": "User not found or server error"
}
```

Example Request:
```bash
curl -X GET https://api.itineraria.com/users/60d21b4667d0d8992e610c85
```

#### Create User

HTTP Method & URL: POST /users

Description: Registers a new user in the system.

Request Body:
```json
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

Validation Notes:
The sanitizeUserInput middleware cleans the data by removing undefined fields.

Response Codes:

200 OK: User successfully created
500 Internal Server Error: Error creating user

Response Body (Success - 200 OK):
```json
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

Error Responses:

500 Internal Server Error:

```json
{
  "message": "Error creating user"
}
```

Example Request:
```bash
curl -X POST https://api.itineraria.com/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "traveler2024",
    "password": "Travel2024",
    "names": "John",
    "lastName": "Doe",
    "dateOfBirth": "1990-01-15",
    "mail": "john.doe@example.com",
    "phoneNumber": "1234567890"
  }'
```

#### Update User (Complete)

HTTP Method & URL: PUT /users/

Description: Updates all fields of an existing user.

Request Parameters:

id (path parameter): Unique identifier of the user

Request Body:
```json
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

Validation Rules:

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


Response Codes:

200 OK: User successfully updated
400 Bad Request: Username or email already exists
500 Internal Server Error: Error updating user

Response Body (Success - 200 OK):
```json
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

Error Responses:

400 Bad Request:

```json
{
  "message": "Username or email already exists"
}
```

500 Internal Server Error:

```json
{
  "message": "Error updating user"
}
```

Example Request:
```bash
curl -X PUT https://api.itineraria.com/users/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "traveler2024_updated",
    "password": "Travel2024New",
    "names": "John",
    "lastName": "Doe",
    "mail": "john.updated@example.com",
    "phoneNumber": "9876543210",
    "isAdmin": false
  }'
```

#### Update User (Partial)
HTTP Method & URL: PATCH /users/

Description: Updates specific fields of an existing user.

Request Parameters:

id (path parameter): Unique identifier of the user

Request Body:
```json{
  "username": "string", // optional
  "names": "string", // optional
  "lastName": "string", // optional
  "mail": "string", // optional
  "phoneNumber": "string", // optional
  "itineraries": [
    {
      "id": "string"
    }
  ], // optional
  "isAdmin": boolean // optional
}
```

Validation Notes:

Any included field must meet the validations of the model schema
The sanitizeUserInput middleware cleans the data by removing undefined fields

Response Codes:

200 OK: User successfully updated
400 Bad Request: Username or email already exists
500 Internal Server Error: Error updating user

Response Body (Success - 200 OK):
```json
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

Error Responses:

400 Bad Request:

```json
{
  "message": "Username or email already exists"
}
```

500 Internal Server Error:

```json
{
  "message": "Error updating user"
}
```

Example Request:
```bash
curl -X PATCH https://api.itineraria.com/users/ \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "9876543210",
    "mail": "john.updated@example.com"
  }'
```

#### Delete User

HTTP Method & URL: DELETE /users/

Description: Removes a user from the system.

Request Parameters:

id (path parameter): Unique identifier of the user

Request Body: None

Response Codes:

200 OK: User successfully deleted
500 Internal Server Error: Error deleting user

Response Body (Success - 200 OK):
```json{
  "message": "User deleted successfully"
}
```

Error Responses:

500 Internal Server Error:

```json
{
  "message": "Error deleting user"
}
```

Example Request:
```bash
curl -X DELETE https://api.itineraria.com/users/60d21b4667d0d8992e610c85
```

### Preferencias

| HTTP Method | Route               | Description                         | Protected |
| ------ | --------------      | --------------------------------     | --------- |
| GET    | /api/preferences        | Get all preferences       | ✅ (Admin)|
| GET    | /api/preferences/:id    |Get a specific preference  | ✅ (Admin)|
| POST   | /api/preferences        | Create a new preference          | ✅ (Admin)|
| PUT    | /api/preferences /      | Update a complete preference  | ✅ (Admin)|
|PATCH   | /api/preferences/       | Update specific preference fields       | ✅ (Admin)|
|DELETE  | /api/preferences/       | Delete a preference            | ✅ (Admin)|

#### Get All Preferences

HTTP Method & URL: GET /preferences

Description: Retrieves all preferences registered in the system.

Authentication Requirements:

Admin access required
Valid authentication token

Request Parameters: None

Request Body: None

Response Codes:

200 OK: Preferences successfully retrieved
401 Unauthorized: Authentication issues
403 Forbidden: Insufficient permissions
500 Internal Server Error: Server error while fetching preferences

Response Body (Success - 200 OK):
```json
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

Response Body (No preferences - 200 OK):
```json
{
  "message": "Preferences not found"
}
```

Error Responses:

401 Unauthorized:
```json
{
  "message": "No authorization token provided"
}
```
or
```json
{
  "message": "Invalid token"
}
```

403 Forbidden:
```json
{
  "message": "You are not authorized to access this resource"
}
```

500 Internal Server Error:
```json
{
  "message": "Error fetching preferences"
}
```

Example Request:
```bash
curl -X GET https://api.example.com/preferences \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Get Specific Preference

HTTP Method & URL: GET /preferences/

Description: Retrieves information for a specific preference by its ID.

Authentication Requirements:

Admin access required
Valid authentication token

Request Parameters:

id (path parameter): Unique identifier of the preference

Request Body: None

Response Codes:

200 OK: Preference successfully retrieved
401 Unauthorized: Authentication issues
403 Forbidden: Insufficient permissions
404 Not Found: Preference not found
500 Internal Server Error: Server error while fetching preference

Response Body (Success - 200 OK):
```json{
  "data": {
    "id": "string",
    "name": "string",
    "description": "string",
    "participants": [...]
  }
}
```

Error Responses:
401 Unauthorized:
```json
{
  "message": "No authorization token provided"
}
```
or
```json{
  "message": "Invalid token"
}
```

403 Forbidden:
```json{
  "message": "You are not authorized to access this resource"
}
```

404 Not Found:
```json
{
  "message": "Preference not found"
}
```

500 Internal Server Error:
```json
{
  "message": "Error fetching preference"
}
```

Example Request:
```bash
curl -X GET https://api.example.com/preferences/60d21b4667d0d8992e610c85 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Create Preference

HTTP Method & URL: POST /preferences

Description: Registers a new preference in the system.

Authentication Requirements:

Admin access required
Valid authentication token

Request Parameters: None

Request Body:
```json
{
  "name": "string",
  "description": "string",
  "itineraries": [...] // optional
}
```

Validation Notes:

The sanitizePreferenceInput middleware cleans the data by removing undefined fields

Response Codes:

201 Created: Preference successfully created
400 Bad Request: Invalid input data
401 Unauthorized: Authentication issues
403 Forbidden: Insufficient permissions
500 Internal Server Error: Server error while creating preference

Response Body (Success - 201 Created):
```json
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

Error Responses:
400 Bad Request:
```json
{
  "message": "Invalid input data"
}
```

401 Unauthorized:
```json
{
  "message": "No authorization token provided"
}
```
or
```json
{
  "message": "Invalid token"
}
```

403 Forbidden:
```json
{
  "message": "You are not authorized to access this resource"
}
```

500 Internal Server Error:
```json
{
  "message": "Error creating preference"
}
```

Example Request:
```bash
curl -X POST https://api.example.com/preferences \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Early Morning",
    "description": "Preference for early morning departures",
    "itineraries": []
  }'
```

#### Update Preference (Complete)

HTTP Method & URL: PUT /preferences/
Description: Updates all fields of an existing preference.
Authentication Requirements:

Admin access required
Valid authentication token

Request Parameters:

id (path parameter): Unique identifier of the preference

Request Body:
```
{
  "name": "string",
  "description": "string",
  "itineraries": [...] // optional
}
```

Validation Notes:

The sanitizePreferenceInput middleware cleans the data by removing undefined fields

Response Codes:

200 OK: Preference successfully updated
400 Bad Request: Invalid input data
401 Unauthorized: Authentication issues
403 Forbidden: Insufficient permissions
404 Not Found: Preference not found
500 Internal Server Error: Server error while updating preference

Response Body (Success - 200 OK):
```json
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

Error Responses:
400 Bad Request:
```json
{
  "message": "Invalid input data"
}
```

401 Unauthorized:
```json
{
  "message": "No authorization token provided"
}
```
or
```json
{
  "message": "Invalid token"
}
```

403 Forbidden:
```json{
  "message": "You are not authorized to access this resource"
}
```

404 Not Found:
```json
{
  "message": "Preference not found"
}
```

500 Internal Server Error:
```json{
  "message": "Error updating preference"
}
```

Example Request:
```bash
curl -X PUT https://api.example.com/preferences/60d21b4667d0d8992e610c85 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Evening Departure",
    "description": "Preference for evening departures"
  }'
```

#### Update Preference (Partial)
HTTP Method & URL: PATCH /preferences/
Description: Updates specific fields of an existing preference.
Authentication Requirements:

Admin access required
Valid authentication token

Request Parameters:

id (path parameter): Unique identifier of the preference

Request Body:
```json
{
  "name": "string", // optional
  "description": "string", // optional
  "itineraries": [...] // optional
}
```

Validation Notes:

Any included field must meet the validations of the model schema
The sanitizePreferenceInput middleware cleans the data by removing undefined fields

Response Codes:

200 OK: Preference successfully updated
400 Bad Request: Invalid input data
401 Unauthorized: Authentication issues
403 Forbidden: Insufficient permissions
404 Not Found: Preference not found
500 Internal Server Error: Server error while updating preference

Response Body (Success - 200 OK):
```json
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

Error Responses:
400 Bad Request:
```json
{
  "message": "Invalid input data"
}
```
401 Unauthorized:
```json
{
  "message": "No authorization token provided"
}
```
or
```json
{
  "message": "Invalid token"
}
```

403 Forbidden:
```json
{
  "message": "You are not authorized to access this resource"
}
```

404 Not Found:
```json
{
  "message": "Preference not found"
}
```

500 Internal Server Error:
```json
{
  "message": "Error updating preference"
}
```

Example Request:
```bash
curl -X PATCH https://api.example.com/preferences/60d21b4667d0d8992e610c85 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "description": "Updated preference for afternoon departures"
  }'
```

#### Delete Preference

HTTP Method & URL: DELETE /preferences/

Description: Removes a preference from the system.

Authentication Requirements:

Admin access required
Valid authentication token

Request Parameters:

id (path parameter): Unique identifier of the preference

Request Body: None

Response Codes:

200 OK: Preference successfully deleted
400 Bad Request: Cannot delete preference with associated participants
401 Unauthorized: Authentication issues
403 Forbidden: Insufficient permissions
404 Not Found: Preference not found
500 Internal Server Error: Server error while deleting preference

Response Body (Success - 200 OK):
```json
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

Error Responses:
400 Bad Request:
```json
{
  "message": "Cannot delete the preference because it has associated participants"
}
```

401 Unauthorized:
```json
{
  "message": "No authorization token provided"
}
```
or
```json
{
  "message": "Invalid token"
}
```

403 Forbidden:
```json
{
  "message": "You are not authorized to access this resource"
}
```

404 Not Found:
```json
{
  "message": "Preference not found"
}
```

500 Internal Server Error:
```json
{
  "message": "Error deleting preference"
}
```

Example Request:
```bash
curl -X DELETE https://api.example.com/preferences/60d21b4667d0d8992e610c85 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Places

| HTTP Method | Route               | Description                         | Protected |
| ------ | --------------      | --------------------------------     | --------- |
| GET    | /api/places             | Get all places            | ❌        |
| GET    | /api/places/:id         | Get a specific place         | ❌        |
| POST   | /api/places             | Create a new place               | ❌        |
| PUT    | /api/places /           | Update a place completely        | ❌        |
|PATCH   | /api/places/            | Update specific fields        | ❌        |
|DELETE  | /api/places/            | Delete a place                    | ❌        |

#### Get All Places

HTTP Method & URL: GET /api/places

Description
Retrieves all places registered in the system. 

Request Body: None

Response Codes:

200 OK: Places retrieved successfully
500 Internal Server Error: Server error while retrieving places

Response Body (Success - 200 OK)
```json
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

Response Body (No places found - 200 OK)
```json
{
  "message": "No places found",
  "data": []
}
```

Error Responses

500 Internal Server Error:
```json
{
  "message": "Error retrieving places"
}
```

Example Request:
```bash
curl -X GET https://api.example.com/places
```

#### Get Specific Place
HTTP Method & URL: GET /api/places/

Description
Retrieves information about a specific place based on its ID.

Authentication Requirements
None

Request Parameters

id (path parameter): Unique identifier of the place

Request Body: None

Response Codes

200 OK: Place retrieved successfully
404 Not Found: Place not found
500 Internal Server Error: Server error while retrieving the place

Response Body (Success - 200 OK)
```json
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

Error Responses
404 Not Found:
```json
{
  "message": "Place not found"
}
```

500 Internal Server Error:
```json
{
  "message": "Error retrieving place"
}
```

Example Request
```bash
curl -X GET https://api.example.com/places/60d21b4667d0d8992e610c85
```

#### Create New Place

HTTP Method & URL: POST /api/places

Description
Registers a new place in the system.

Request Parameters: None

Request Body
```json{
  "name": "string",
  "latitude": number,
  "longitude": number,
  "zipCode": "string",
  "province": "string",
  "country": "string"
}
```

Validation Notes

The sanitizePlaceInput middleware cleans the data by removing undefined fields
The validateSchema(postSchema) middleware validates the format of the submitted data

Response Codes

201 Created: Place successfully created
400 Bad Request: Validation error or duplicate place
500 Internal Server Error: Error creating place

Response Body (Success - 201 Created)
```json
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

Error Responses
400 Bad Request:
```json
{
  "message": "There is already a place with the same coordinates"
}
```
OR
```json
{
  "message": "There is already a place with the same name, Province/State and Country"
}
```

500 Internal Server Error:
```json
{
  "message": "Error creating place"
}
```

Example Request
```bash
curl -X POST https://api.example.com/places \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Central Park",
    "latitude": 40.7829,
    "longitude": -73.9654,
    "zipCode": "10022",
    "province": "New York",
    "country": "United States"
  }'
```

#### Update Place (Complete)
HTTP Method & URL: PUT /api/places/

Description: Updates all fields of an existing place.

Request Parameters

id (path parameter): Unique identifier of the place

Request Body
```json
{
  "name": "string",
  "latitude": number,
  "longitude": number,
  "zipCode": "string",
  "province": "string",
  "country": "string"
}
```

Validation Notes

The sanitizePlaceInput middleware cleans the data by removing undefined fields
The validateSchema(putSchema) middleware validates the format of the submitted data

Response Codes

200 OK: Place successfully updated
400 Bad Request: Validation error or duplicate place
404 Not Found: Place not found
500 Internal Server Error: Error updating place

Response Body (Success - 200 OK)
```json
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

Error Responses

400 Bad Request:
```json
{
  "message": "There is already a place with the same coordinates!"
}
```
OR
```json
{
  "message": "There is already a place with the same name, Province/State and Country"
}
```

404 Not Found:
```json
{
  "message": "Place not found"
}
```

500 Internal Server Error:
```json
{
  "message": "Error updating place"
}
```

Example Request
```bash
curl -X PUT https://api.example.com/places/60d21b4667d0d8992e610c85 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Park",
    "latitude": 40.7829,
    "longitude": -73.9654,
    "zipCode": "10022",
    "province": "New York",
    "country": "United States"
  }'
```

#### Update Place (Partial)
HTTP Method & URL: PATCH /api/places/

Description: Updates specific fields of an existing place.

Request Parameters

id (path parameter): Unique identifier of the place

Request Body
```json
{
  "name": "string", // optional
  "latitude": number, // optional
  "longitude": number, // optional
  "zipCode": "string", // optional
  "province": "string", // optional
  "country": "string" // optional
}
```

Validation Notes

Any included field must meet the validations of the model schema
The sanitizePlaceInput middleware cleans the data by removing undefined fields

Response Codes

200 OK: Place successfully updated
400 Bad Request: Validation error or duplicate place
404 Not Found: Place not found
500 Internal Server Error: Error updating place

Response Body (Success - 200 OK)
```json
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

Error Responses

400 Bad Request:
```json
{
  "message": "There is already a place with the same coordinates!"
}
```

OR

```json
{
  "message": "There is already a place with the same name, Province/State and Country"
}
```

404 Not Found:
```json
{
  "message": "Place not found"
}
```

500 Internal Server Error:
```json
{
  "message": "Error updating place"
}
```

Example Request
```bash
curl -X PATCH https://api.example.com/places/60d21b4667d0d8992e610c85 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Central Park Updated",
    "zipCode": "10023"
  }'
```

#### Delete Place
HTTP Method & URL: DELETE /api/places/

Description: Removes a place from the system.

Request Parameters

id (path parameter): Unique identifier of the place

Request Body: None

Response Codes

200 OK: Place successfully deleted
400 Bad Request: Cannot delete due to associated data
404 Not Found: Place not found
500 Internal Server Error: Error deleting place

Response Body (Success - 200 OK)
```json
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

Error Responses

400 Bad Request:
```json{
  "message": "Cannot delete the place because it has associated external services"
}
```
OR
```json
{
  "message": "Cannot delete the place because it has associated itineraries"
}
```

404 Not Found:
```json
{
  "message": "Place not found"
}
```

500 Internal Server Error:
```json
{
  "message": "Error deleting place"
}

Example Request
```bash
curl -X DELETE https://api.example.com/places/60d21b4667d0d8992e610c85
```

### Participants

| HTTP Method | Route                              | Description                                   | Protected |
| ------ | --------------                     | --------------------------------               | --------- |
| GET    | /api/participants/:userId          | Get all participants for a user  | ✅        |
| GET    | /api/participants/getone/          | Get a specific participant | ✅    | POST   | /api/participants                  | Get a specific participant                   | ✅        |
| POST   | /api/participants        | Create a new participant                
| POST   | /api/participants/favorite         | Add favorite participant                  | ✅        |
| PUT    | /api/participants/                 | Update a participant completely            | ✅        |
|PATCH   | /api/participants/                 | Update specific participant fields        | ✅        |
|DELETE  | /api/participants/                 | Delete a participant                       | ✅        | 

#### Get All Participants for a User
HTTP Method & URL: GET /api/participants/

Description
Retrieves all participants associated with a specific user.

Request Parameters

userId (path parameter): ID of the user whose participants are being requested

Request Body: None

Response Codes

200 OK: Participants retrieved successfully
401 Unauthorized: Authentication required
404 Not Found: User not found
500 Internal Server Error: Server error while retrieving participants

Response Body (Success - 200 OK)
```json
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

Error Responses

401 Unauthorized:
```json
{
  "message": "Authentication required"
}
```

404 Not Found:
```json
{
  "message": "User not found"
}
```

500 Internal Server Error:
```json
{
  "message": "An error occurred while processing your request"
}
```

Example Request
```bash
curl -X GET https://api.example.com/api/participants/66fc4785f2b5cf4ef633816a \
  -H "Authorization: Bearer {your_token}"
```

#### Get Specific Participant
HTTP Method & URL: GET /api/participants/getone/

Description
Retrieves detailed information about a specific participant.

Request Parameters

id (path parameter): ID of the participant to retrieve

Request Body: None

Response Codes

200 OK: Participant retrieved successfully
401 Unauthorized: Authentication required
404 Not Found: Participant not found
500 Internal Server Error: Server error while retrieving participant

Response Body (Success - 200 OK)
```json
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

Error Responses

401 Unauthorized:
```json
{
  "message": "Authentication required"
}
```

404 Not Found:
```json
{
  "message": "Participant not found"
}
```

500 Internal Server Error:
```json
{
  "message": "An error occurred while processing your request"
}
```

Example Request
```bash
curl -X GET https://api.example.com/api/participants/getone/670bd0cc60eb88e665c9fb90 \
  -H "Authorization: Bearer {your_token}"
```

#### Create New Participant
HTTP Method & URL: POST /api/participants

Description
Creates a new participant in the system.

Request Parameters: None

Request Body
```json
{
  "name": "Participant 2",
  "age": 20,
  "disability": false,
  "preferences": ["670bcc78732bbbc7b6926278"],
  "user": "66fc4785f2b5cf4ef633816a"
}
```

Validation Notes

- name:
  - 'Name must be a string'
  - 'Name is required'
  - 'Name must be at least 3 characters'
- age:
  - 'Age must be a number'
  - 'age must be between 1 and 3 digits'

- disability:
  - 'Disability must be a boolean'

Response Codes

201 Created: Participant successfully created
400 Bad Request: Invalid participant data
401 Unauthorized: Authentication required
500 Internal Server Error: Error creating participant

Response Body (Success - 201 Created)
```json
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

Error Responses

400 Bad Request:
```json
{
  "message": "Invalid participant data",
  "errors": [
    "Name must be at least 3 characters"
  ]
}
```

401 Unauthorized:
```json
{
  "message": "Authentication required"
}
```

500 Internal Server Error:
```json
{
  "message": "An error occurred while processing your request"
}
```

Example Request
```bash
curl -X POST https://api.example.com/api/participants \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {your_token}" \
  -d '{
    "name": "Participant 2",
    "age": 20,
    "disability": false,
    "preferences": ["670bcc78732bbbc7b6926278"],
    "user": "66fc4785f2b5cf4ef633816a"
  }'
```

#### Add Favorite Participant
HTTP Method & URL: POST /api/participants/favorite

Description
Adds a participant as a favorite.

Request Parameters: None

Request Body
```json
{
  "name": "Participant 1",
  "age": 20,
  "disability": true,
  "preferences": ["670bce6416da0fb6e0947f31"],
  "user": "66fc4785f2b5cf4ef633816a"
}
```

Validation Notes
The sanitizeParticipantInput middleware cleans the data by removing undefined fields.
Response Codes

201 Created: Favorite participant successfully added
400 Bad Request: Invalid participant data
401 Unauthorized: Authentication required
500 Internal Server Error: Error adding favorite participant

Response Body (Success - 201 Created)
```json
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

Error Responses
400 Bad Request:
```json
{
  "message": "Invalid participant data"
}
```

401 Unauthorized:
```json
{
  "message": "Authentication required"
}
```

500 Internal Server Error:
```json
{
  "message": "An error occurred while processing your request"
}

Example Request
```bash
curl -X POST https://api.example.com/api/participants/favorite \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {your_token}" \
  -d '{
    "name": "Participant 1",
    "age": 20,
    "disability": true,
    "preferences": ["670bce6416da0fb6e0947f31"],
    "user": "66fc4785f2b5cf4ef633816a"
  }'
```

#### Update Participant (Complete)
HTTP Method & URL: PUT /api/participants/

Description
Updates all the data of an existing participant.

Request Parameters

id (path parameter): ID of the participant to update

Request Body
```json
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
Validation Notes

- name:
  - 'Name must be a string'
  - 'Name is required'
  - 'Name must be at least 3 characters'
- age:
  - 'Age must be a number'
  - 'age must be between 1 and 3 digits'

- disability:
  - 'Disability must be a boolean'

Response Codes

200 OK: Participant successfully updated
400 Bad Request: Invalid participant data
401 Unauthorized: Authentication required
404 Not Found: Participant not found
500 Internal Server Error: Error updating participant

Response Body (Success - 200 OK)
```json
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

Error Responses

400 Bad Request:
```json
{
  "message": "Invalid participant data",
  "errors": [
    "Name must be at least 3 characters"
  ]
}
```

401 Unauthorized:
```json
{
  "message": "Authentication required"
}
```

404 Not Found:
```json
{
  "message": "Participant not found"
}
```

500 Internal Server Error:
```json
{
  "message": "An error occurred while processing your request"
}
```

Example Request
```bash
curl -X PUT https://api.example.com/api/participants/670bd0cc60eb88e665c9fb90 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {your_token}" \
  -d '{
    "name": "Facundo",
    "age": 24,
    "disability": false,
    "preferences": [
      {"id": "670bce8c16da0fb6e0947f33"},
      {"id": "670bce6416da0fb6e0947f31"}
    ]
  }'
```

#### Update Participant (Partial)
HTTP Method & URL: PATCH /api/participants/

Description
Updates only specific fields of an existing participant.

Request Parameters

id (path parameter): ID of the participant to partially update

Request Body
```json
{
  "name": "Nicolás Escobar" // optional field example
}
```

Validation Notes

Any included field must meet the validations of the model schema
The sanitizeParticipantInput middleware cleans the data by removing undefined fields

Response Codes

200 OK: Participant successfully updated
400 Bad Request: Invalid participant data
401 Unauthorized: Authentication required
404 Not Found: Participant not found
500 Internal Server Error: Error updating participant

Response Body (Success - 200 OK)
```json
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

Error Responses
400 Bad Request:
```json
{
  "message": "Invalid participant data"
}
```

401 Unauthorized:
```json
{
  "message": "Authentication required"
}
```

404 Not Found:
```json
{
  "message": "Participant not found"
}
```

500 Internal Server Error:
```json
{
  "message": "An error occurred while processing your request"
}
```

Example Request
```bash
curl -X PATCH https://api.example.com/api/participants/66ff22aece8bda39a2e5be6c \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {your_token}" \
  -d '{
    "name": "Nicolás Escobar"
  }'
```

#### Delete Participant
HTTP Method & URL: DELETE /api/participants/

Description
Removes a specific participant from the system.

Request Parameters

id (path parameter): ID of the participant to delete

Request Body: None

Response Codes

200 OK: Participant successfully deleted
401 Unauthorized: Authentication required
404 Not Found: Participant not found
500 Internal Server Error: Error deleting participant

Response Body (Success - 200 OK)
```json
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

Error Responses
401 Unauthorized:
```json
{
  "message": "Authentication required"
}
```

404 Not Found:
```json
{
  "message": "Participant not found"
}
```

500 Internal Server Error:
```json
{
  "message": "An error occurred while processing your request"
}
```

Example Request
```bash
curl -X DELETE https://api.example.com/api/participants/66ff22aece8bda39a2e5be6c \
  -H "Authorization: Bearer {your_token}"
```

### Opinions

| HTTP Method | Route                              | Description                          | Protected |
| ------ | --------------                     | --------------------------------      | --------- |
| GET    | /api/opinions                  | Get all opinions           | ✅        |
| GET    | /api/opinions/                    | Get a specific opinion       | ✅        |
| GET    | /api/opinions/activity/           | Get opinions by activity       | ✅        |
| POST   | /api/opinions                     | Create a new opinion              | ✅        |
| PUT    | /api/opinions/                    | Update an opinion completely      | ✅        |
|PATCH   | /api/opinions/                    | Update specific opinion fields  | ✅        |
|DELETE  | /api/opinions/                    | Delete an opinion                  | ✅        | 

#### Get All Opinions
HTTP Method & URL: GET /api/opiniones

Description
Retrieves all opinions registered in the system.

Request Parameters: None

Request Body: None

Response Codes

200 OK: Opinions retrieved successfully
401 Unauthorized: Authentication required
500 Internal Server Error: Server error while retrieving opinions

Response Body (Success - 200 OK)
```json
{
  "message": "All opinions found",
  "data": [
    {
      "id": "670bd0cc60eb88e665c9fb90",
      "rating": 5,
      "comment": "Excellent place to spend the day",
      "user": {...},
      "activity": {...}
    },
    {...}
  ]
}
```

Response Body (No opinions found - 200 OK)
```json
{
  "message": "No opinions found",
  "data": []
}
```

Error Responses
401 Unauthorized:
```json
{
  "message": "Authentication required"
}
```

500 Internal Server Error:
```json
{
  "message": "Server error"
}
```

Example Request
```bash
curl -X GET https://api.example.com/api/opiniones \
  -H "Authorization: Bearer {your_token}"
```

#### Get Specific Opinion
HTTP Method & URL: GET /api/opiniones/

Description
Retrieves detailed information about a specific opinion.

Request Parameters

id (path parameter): ID of the opinion to retrieve

Request Body: None

Response Codes

200 OK: Opinion retrieved successfully
401 Unauthorized: Authentication required
404 Not Found: Opinion not found
500 Internal Server Error: Server error while retrieving the opinion

Response Body (Success - 200 OK)
```json
{
  "message": "Opinion found",
  "data": {
    "id": "670bd0cc60eb88e665c9fb90",
    "rating": 5,
    "comment": "Excellent place to spend the day",
    "user": {...},
    "activity": {...}
  }
}
```

Error Responses
401 Unauthorized:
```json
{
  "message": "Authentication required"
}

404 Not Found:
```json
{
  "message": "Opinion not found"
}
```

500 Internal Server Error:
```json
{
  "message": "Server error"
}
```

Example Request
```bash
curl -X GET https://api.example.com/api/opiniones/670bd0cc60eb88e665c9fb90 \
  -H "Authorization: Bearer {your_token}"
```

#### Get Opinions by Activity
HTTP Method & URL: GET /api/opiniones/activity/

Description
Retrieves all opinions associated with a specific activity.

Request Parameters

id (path parameter): ID of the activity whose opinions are being requested

Request Body: None

Response Codes

200 OK: Opinions retrieved successfully
401 Unauthorized: Authentication required
404 Not Found: Activity not found
500 Internal Server Error: Server error while retrieving opinions

Response Body (Success - 200 OK)
```json
{
  "message": "All opinions found",
  "data": [
    {
      "id": "670bd0cc60eb88e665c9fb90",
      "rating": 5,
      "comment": "Excellent place to spend the day",
      "user": {...},
      "activity": {...}
    },
    {...}
  ]
}
```

Response Body (No opinions found - 200 OK)
```json
{
  "message": "No opinions found",
  "data": []
}
```

Error Responses
401 Unauthorized:
```json
{
  "message": "Authentication required"
}
```

404 Not Found:
```json
{
  "message": "Activity not found"
}
```

500 Internal Server Error:
```json
{
  "message": "Server error"
}
```

Example Request
```bash
curl -X GET https://api.example.com/api/opiniones/activity/67178bbf8fec993032a05aa9 \
  -H "Authorization: Bearer {your_token}"
```

#### Create New Opinion
HTTP Method & URL: POST /api/opiniones

Description
Creates a new opinion in the system.

Request Parameters: None

Request Body
```json
{
  "rating": 5,
  "comment": "Excellent place to spend the day",
  "activity": "67178bbf8fec993032a05aa9",
  "user": "669d9a3503f535edd5c7aabe"
}
```

Validation Notes

- rating:

  - Must be a number
  - Is required
  - Must be a number between 1 and 5


- comment:

  - Must be a string
  - Is required
  - Must be between 1 and 100 characters


- activity: ID of the activity being rated
- user: ID of the user creating the opinion


Response Codes

201 Created: Opinion successfully created
400 Bad Request: Invalid opinion data
401 Unauthorized: Authentication required
404 Not Found: Activity or user not found
500 Internal Server Error: Error creating opinion

Response Body (Success - 201 Created)
```json
{
  "message": "Opinion created",
  "data": {
    "id": "670bd0cc60eb88e665c9fb90",
    "rating": 5,
    "comment": "Excellent place to spend the day",
    "activity": "67178bbf8fec993032a05aa9",
    "user": "669d9a3503f535edd5c7aabe"
  }
}
```

Error Responses
400 Bad Request:
```json
{
  "message": "Invalid opinion data",
  "errors": [
    "Rating must be a number between 1 and 5"
  ]
}
```

401 Unauthorized:
```json
{
  "message": "Authentication required"
}
```

404 Not Found:
```json
{
  "message": "Activity not found"
}
```
OR
```json
{
  "message": "User not found"
}
```

500 Internal Server Error:
```json
{
  "message": "Server error"
}
```

Example Request
```bash
curl -X POST https://api.example.com/api/opiniones \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {your_token}" \
  -d '{
    "rating": 5,
    "comment": "Excellent place to spend the day",
    "activity": "67178bbf8fec993032a05aa9",
    "user": "669d9a3503f535edd5c7aabe"
  }'
```

#### Update Opinion (Complete)
HTTP Method & URL: PUT /api/opiniones/

Description
Updates all the data of an existing opinion.

Request Parameters

id (path parameter): ID of the opinion to update

Request Body
```json
{
  "rating": 4,
  "comment": "Excellent place to spend the day"
}
```

Validation Notes

All fields must comply with the validations of the model schema
All fields must be included in the request
The sanitizeOpinionInput middleware cleans the data by removing undefined fields

Response Codes

200 OK: Opinion successfully updated
400 Bad Request: Invalid opinion data
401 Unauthorized: Authentication required
404 Not Found: Opinion not found
500 Internal Server Error: Error updating opinion

Response Body (Success - 200 OK)
```json
{
  "message": "Opinion updated",
  "data": {
    "id": "670bd0cc60eb88e665c9fb90",
    "rating": 4,
    "comment": "Excellent place to spend the day",
    "activity": "67178bbf8fec993032a05aa9",
    "user": "669d9a3503f535edd5c7aabe"
  }
}
```

Error Responses
400 Bad Request:
```json
{
  "message": "Invalid opinion data"
}
```

401 Unauthorized:
```json
{
  "message": "Authentication required"
}
```

404 Not Found:
```json
{
  "message": "Opinion not found"
}
```

500 Internal Server Error:
```json
{
  "message": "Server error"
}
```

Example Request
```bash
curl -X PUT https://api.example.com/api/opiniones/670bd0cc60eb88e665c9fb90 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {your_token}" \
  -d '{
    "rating": 4,
    "comment": "Excellent place to spend the day"
  }'
```

#### Update Opinion (Partial)
HTTP Method & URL: PATCH /api/opiniones/

Description
Updates only specific fields of an existing opinion.

Request Parameters

id (path parameter): ID of the opinion to partially update

Request Body
json{
  "rating": 3
}
Validation Notes

Any included field must meet the validations of the model schema
The sanitizeOpinionInput middleware cleans the data by removing undefined fields

Response Codes

200 OK: Opinion successfully updated
400 Bad Request: Invalid opinion data
401 Unauthorized: Authentication required
404 Not Found: Opinion not found
500 Internal Server Error: Error updating opinion

Response Body (Success - 200 OK)
```json
{
  "message": "Opinion updated",
  "data": {
    "id": "670bd0cc60eb88e665c9fb90",
    "rating": 3,
    "comment": "Excellent place to spend the day",
    "activity": "67178bbf8fec993032a05aa9",
    "user": "669d9a3503f535edd5c7aabe"
  }
}
```

Error Responses
400 Bad Request:
```json
{
  "message": "Invalid opinion data"
}
```
401 Unauthorized:
```json
{
  "message": "Authentication required"
}
```

404 Not Found:
```json
{
  "message": "Opinion not found"
}
```

500 Internal Server Error:
```json
{
  "message": "Server error"
}
```

Example Request
```bash
curl -X PATCH https://api.example.com/api/opiniones/670bd0cc60eb88e665c9fb90 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {your_token}" \
  -d '{
    "rating": 3
  }'
```

#### Delete Opinion
HTTP Method & URL: DELETE /api/opiniones/

Description
Removes a specific opinion from the system.

Request Parameters

id (path parameter): ID of the opinion to delete

Request Body: None

Response Codes

200 OK: Opinion successfully deleted
401 Unauthorized: Authentication required
404 Not Found: Opinion not found
500 Internal Server Error: Error deleting opinion

Response Body (Success - 200 OK)
```json
{
  "message": "Opinion deleted"
}
```

Error Responses
401 Unauthorized:
```json
{
  "message": "Authentication required"
}
```
404 Not Found:
```json
{
  "message": "Opinion not found"
}
```

500 Internal Server Error:
```json
{
  "message": "Server error"
}
```

Example Request
```bash
curl -X DELETE https://api.example.com/api/opiniones/670bd0cc60eb88e665c9fb90 \
  -H "Authorization: Bearer {your_token}"
```

### Itineraries

| HTTP Method | Route                            | Description                                 | Protected |
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

#### Data Models
ExternalService
```ts
{
  id: string;                // Unique identifier
  serviceType: string;       // Type of service
  name: string;              // Service name (unique)
  description: string;       // Service description
  adress: string;            // Service address
  schedule: string;          // Service schedule (optional)
  website: string;           // Service website (optional)
  phoneNumber: string;       // Service phone number (optional)
  place: string | Place;     // Reference to a Place
  status: string;            // PENDING, ACTIVE, or CANCELED
  createdAt: Date;           // Creation timestamp
  updatedAt: Date;           // Last update timestamp
}
```
- Status Values
  - PENDING: Default status for new publicity requests
  - ACTIVE: Status after admin approval or direct creation
  - CANCELED: Service has been canceled

| HTTP Method | Route                              | Description                          | Protected |
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

#### Submit Publicity Request

POST /api/publicity

Creates a new publicity request in pending status.

Request:
```ts
jsonContent-Type: application/json
{
  "serviceType": "string",
  "name": "string",
  "description": "string",
  "adress": "string",
  "schedule": "string",
  "website": "string",
  "phoneNumber": "string",
  "place": "string (ID)"
}
```

Validation:

- serviceType:

  - "The service type must be a string"
  - "The service type is required"
  - "The service type must have at least 3 characters"


- name:

  - "The name must be a string"
  - "The name is required"
  - "The name must have at least 3 characters"


- description:

  - "The description must be a string"
  - "The description is required"
  - "The description must have at least 3 characters"


- adress:

  - "The address must be a string"
  - "The address is required"
  - "The address must have at least 3 characters"


- schedule:

  - "The schedule must be a string"
  - "The schedule is required"
  - "The schedule must have at least 3 characters"


- website (optional):

  - "Invalid website format" (must match format: www.example.com)


- phoneNumber (optional):

  - "Invalid phone number format" (must be 10 digits)


- place: The place must be registered

Response:
```ts
jsonStatus: 201 Created
Content-Type: application/json

{
  "message": "The request has been sent",
  "data": {
    "id": "string",
    "serviceType": "string",
    "name": "string",
    "description": "string",
    "adress": "string",
    "schedule": "string",
    "website": "string",
    "phoneNumber": "string",
    "place": "string (ID)",
    "status": "PENDING",
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  }
}
```

Errors:

404 Not Found: "The place does not exist"
409 Conflict: "The external service already exists"
500 Internal Server Error: Error message

#### Get All External Services

GET /api/publicity/places

Returns all external services.

Response:
```ts
jsonStatus: 200 OK
Content-Type: application/json

{
  "message": "All external services found",
  "data": [
    {
      "id": "string",
      "serviceType": "string",
      "name": "string",
      "description": "string",
      "adress": "string",
      "schedule": "string",
      "website": "string",
      "phoneNumber": "string",
      "place": {
        "id": "string",
        "name": "string",
        // other place properties
      },
      "status": "string",
      "createdAt": "timestamp",
      "updatedAt": "timestamp"
    }
  ]
}
```

Errors:

200 OK (with message): If no external services are found: {"message": ["External services not found"]}
500 Internal Server Error: Error message

#### Get All External Services

GET /api/externalServices

Returns all external services.

Response:
```ts
jsonStatus: 200 OK
Content-Type: application/json

{
  "message": "All external services found",
  "data": [
    {
      "id": "string",
      "serviceType": "string",
      "name": "string",
      "description": "string",
      "adress": "string",
      "schedule": "string",
      "website": "string",
      "phoneNumber": "string",
      "place": {
        "id": "string",
        "name": "string",
        // other place properties
      },
      "status": "string",
      "createdAt": "timestamp",
      "updatedAt": "timestamp"
    }
  ]
}
```

Errors:

200 OK (with message): If no external services are found: {"message": ["External services not found"]}
500 Internal Server Error: Error message

#### Get External Service by ID

GET /api/externalServices/:id

Returns an external service by its ID.

Parameters:
id: External service ID (path parameter)

Response:
```ts
jsonStatus: 200 OK
Content-Type: application/json

{
  "message": "External service found",
  "data": {
    "id": "string",
    "serviceType": "string",
    "name": "string",
    "description": "string",
    "adress": "string",
    "schedule": "string",
    "website": "string",
    "phoneNumber": "string",
    "place": {
      "id": "string",
      "name": "string",
      // other place properties
    },
    "status": "string",
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  }
}
```

Errors:

500 Internal Server Error: Error message (includes 404 Not Found scenarios)

#### Get External Services by Place ID

GET /api/externalServices/findByPlace/:id

Returns all external services associated with a specific place.

Parameters:
id: Place ID (path parameter)

Response:
```ts
jsonStatus: 200 OK
Content-Type: application/json

{
  "message": "Servicios externos encontrados",
  "data": [
    {
      "id": "string",
      "serviceType": "string",
      "name": "string",
      "description": "string",
      "adress": "string",
      "schedule": "string",
      "website": "string",
      "phoneNumber": "string",
      "place": {
        "id": "string",
        "name": "string",
        // other place properties
      },
      "status": "string",
      "createdAt": "timestamp",
      "updatedAt": "timestamp"
    }
  ]
}
```

Errors:

200 OK (with message): If no external services are found: {"message": ["External services not found for that place"]}
404 Not Found: {"message": ["A place with that id was not found"]}
500 Internal Server Error: Error message

#### Create External Service

POST /api/externalServices

Creates a new external service with ACTIVE status.

Request:
```ts
jsonContent-Type: application/json

{
  "serviceType": "string",
  "name": "string",
  "description": "string",
  "adress": "string",
  "schedule": "string",
  "website": "string",
  "phoneNumber": "string",
  "place": "string (ID)"
}
```

Validation:

Los campos deben cumplir con las validaciones del schema del modelo. Website and PhoneNumber are optionals.

Response:
```ts
jsonStatus: 201 Created
Content-Type: application/json

{
  "message": "External service created",
  "data": {
    "id": "string",
    "serviceType": "string",
    "name": "string",
    "description": "string",
    "adress": "string",
    "schedule": "string",
    "website": "string",
    "phoneNumber": "string",
    "place": "string (ID)",
    "status": "ACTIVE",
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  }
}
```

Errors:

404 Not Found: {"message": ["The place does not exist"]}
409 Conflict: {"message": ["The external service already exists"]}
500 Internal Server Error: Error message

#### Accept Publicity Request

POST /api/externalServices/acceptRequest/:id

Changes the status of a pending publicity request to ACTIVE.

Parameters:
id: External service ID (path parameter)

Response:
```ts
jsonStatus: 200 OK
Content-Type: application/json

{
  "message": "The request has been accepted",
  "data": {
    "id": "string",
    "serviceType": "string",
    "name": "string",
    "description": "string",
    "adress": "string",
    "schedule": "string",
    "website": "string",
    "phoneNumber": "string",
    "place": "string (ID)",
    "status": "ACTIVE",
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  }
}
```

Errors:

500 Internal Server Error: Error message

#### Update External Service

PUT /api/externalServices/:id

Updates an external service completely.

Parameters:
id: External service ID (path parameter)

Request:
```ts
jsonContent-Type: application/json

{
  "serviceType": "string",
  "name": "string",
  "description": "string",
  "adress": "string",
  "schedule": "string",
  "website": "string",
  "phoneNumber": "string",
  "place": "string (ID)"
}
```

Validation:

Los campos deben cumplir con las validaciones del schema del modelo.
El middleware sanitizeExternalServiceInput realiza una limpieza de los datos, eliminando campos indefinidos.

Response:
```ts
jsonStatus: 200 OK
Content-Type: application/json

{
  "message": "External service updated",
  "data": {
    "id": "string",
    "serviceType": "string",
    "name": "string",
    "description": "string",
    "adress": "string",
    "schedule": "string",
    "website": "string",
    "phoneNumber": "string",
    "place": "string (ID)",
    "status": "string",
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  }
}
```

Errors:

409 Conflict: {"message": ["There is already a service with that name"]}
500 Internal Server Error: Error message

#### Partially Update External Service

PATCH /api/externalServices/:id

Updates only the provided fields of an external service.

Parameters:
id: External service ID (path parameter)

Request:
```ts
jsonContent-Type: application/json

{
  // Any combination of these fields
  "serviceType": "string",
  "name": "string",
  "description": "string",
  "adress": "string",
  "schedule": "string",
  "website": "string",
  "phoneNumber": "string"
}
```

Validation:
Same as PUT request but all fields are optional.
Response:
```ts
jsonStatus: 200 OK
Content-Type: application/json

{
  "message": "External service updated",
  "data": {
    "id": "string",
    "serviceType": "string",
    "name": "string",
    "description": "string",
    "adress": "string",
    "schedule": "string",
    "website": "string",
    "phoneNumber": "string",
    "place": "string (ID)",
    "status": "string",
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  }
}
```

Errors:

409 Conflict: {"message": ["There is already a service with that name"]}
500 Internal Server Error: Error message

#### Delete External Service

DELETE /api/externalServices/:id

Deletes an external service.

Parameters:
id: External service ID (path parameter)

Response:
```ts
jsonStatus: 200 OK
Content-Type: application/json

{
  "message": "External service deleted"
}
```

Errors:

500 Internal Server Error: Error message

### Activities

####Modelo de datos

Activity
```ts
{
  id: string;               // Identificador único
  name: string;             // Nombre de la actividad
  description: string;      // Descriptionde la actividad
  outdoor: boolean;         // Indica si la actividad es al aire libre
  transport?: boolean;      // Indica si se necesita transporte (opcional)
  scheduleStart: string;    // Hora de inicio (formato HH:MM)
  scheduleEnd: string;      // Hora de fin (formato HH:MM)
  place: Place;             // Referencia al lugar donde se realiza
  itinerary: Itinerary;     // Referencia al itinerario asociado
  opinions: Opinion[];      // Colección de opiniones sobre la actividad
  createdAt: Date;          // Fecha de creación
  updatedAt: Date;          // Fecha de última actualización
}
```

| HTTP Method | Route                              | Description                                   | Protected |
| ------ | --------------                     | --------------------------------               | --------- |
| GET    | /api/activities         | Obtener todas las actividades  | ✅        |
| GET    | /api/activities/:id     | Obtener una actividad por ID             | ✅        |
| POST   | /api/activities                | Crear una nueva actividad                    | ✅        |
| PUT    | /api/activities/               | Actualizar una actividad por completo            | ✅        |
|PATCH   | /api/activities/               | Actualizar parcialmente actividad     | ✅        |
|DELETE  | /api/activities/               | Eliminar una actividad                  | ✅        | 

#### Obtener todas las actividades

GET /api/activities

Retorna todas las actividades existentes en el sistema.

Respuesta:
```ts
jsonContent-Type: application/json

{
  "message": "Todos las activities encontrados",
  "data": [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "outdoor": boolean,
      "transport": boolean,
      "scheduleStart": "string",
      "scheduleEnd": "string",
      "place": {
        "id": "string",
        // otros datos del lugar
      },
      "itinerary": {
        "id": "string",
        // otros datos del itinerario
      },
      "opinions": [
        {
          "id": "string",
          // datos de opiniones
        }
      ],
      "createdAt": "timestamp",
      "updatedAt": "timestamp"
    }
  ]
}
```

Errores:

200 OK (con mensaje): Si no hay actividades: {"message": "No se encontraron activities"}
500 Internal Server Error: {"message": error.message}

#### Obtener actividad por ID

GET /api/activities/:id

Retorna una actividad específica según su ID.

Parámetros:
id: ID de la actividad (parámetro de ruta)

Respuesta:
```ts
jsonContent-Type: application/json

{
  "message": "Activity encontrada",
  "data": {
    "id": "string",
    "name": "string",
    "description": "string",
    "outdoor": boolean,
    "transport": boolean,
    "scheduleStart": "string",
    "scheduleEnd": "string",
    "place": {
      "id": "string",
      // otros datos del lugar
    },
    "itinerary": {
      "id": "string",
      // otros datos del itinerario
    },
    "opinions": [
      {
        "id": "string",
        // datos de opiniones
      }
    ],
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  }
}
```

Errores:

500 Internal Server Error: {"message": error.message} (incluye escenarios de 404 Not Found)

#### Crear actividad

POST /api/activities

Crea una nueva actividad.

Solicitud:
```ts
jsonContent-Type: application/json

{
  "name": "string",
  "description": "string",
  "outdoor": boolean,
  "transport": boolean,
  "scheduleStart": "string",
  "scheduleEnd": "string",
  "place": {
    "id": "string"
  },
  "itinerary": {
    "id": "string"
  }
}
```

Validación:

- name:

  - "Name must be a string"
  - "Name is required"
  - "Name must have at least 3 characters"
  - "Name can have a maximum of 20 characters"

- description:

  - "Description must be a string"
  - "Description is required"
  - "Description must have at least 3 characters"
  - "Description can have a maximum of 100 characters"

- outdoor:

  - "You must specify if the activity is outdoor or not"

- transport (opcional):

  - "You must specify if the activity needs transport or not"

- scheduleStart:

  - "Schedule start must be a string"
  - "Schedule start is required"
  - "Schedule start must be in the format HH"


- scheduleEnd:

  - "Schedule end must be a string"
  - "Schedule end is required"
  - "Schedule end must be in the format HH"


- Validación adicional:

"The activity must start before it ends" (scheduleStart debe ser anterior a scheduleEnd)

Respuesta:
```ts
jsonStatus: 201 Created
Content-Type: application/json

{
  "message": "Actvidad creada",
  "data": {
    "id": "string",
    "name": "string",
    "description": "string",
    "outdoor": boolean,
    "transport": boolean,
    "scheduleStart": "string",
    "scheduleEnd": "string",
    "place": "string (ID)",
    "itinerary": {
      "id": "string",
      // otros datos del itinerario
    },
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  }
}
```

Errores:

400 Bad Request: {"message": ["Itinerario no encontrado"]}
400 Bad Request: {"message": ["Activity ya existente"]}
500 Internal Server Error: {"message": error.message}

#### Actualizar actividad

PUT /api/activities/:id

Actualiza completamente una actividad existente.

Parámetros:
id: ID de la actividad (parámetro de ruta)

Solicitud:
```ts
jsonContent-Type: application/json

{
  "name": "string",
  "description": "string",
  "outdoor": boolean,
  "transport": boolean,
  "scheduleStart": "string",
  "scheduleEnd": "string",
  "place": {
    "id": "string"
  },
  "itinerary": {
    "id": "string"
  }
}
```

Validación:

Los campos deben cumplir con las validaciones del schema del modelo. Se deben incluir todos los campos.


Respuesta:
```ts
jsonStatus: 200 OK
Content-Type: application/json

{
  "message": "Activity actualizada",
  "data": {
    "id": "string",
    "name": "string",
    "description": "string",
    "outdoor": boolean,
    "transport": boolean,
    "scheduleStart": "string",
    "scheduleEnd": "string",
    "place": "string (ID)",
    "itinerary": "string (ID)",
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  },
  "itinerary": {
    "id": "string",
    // otros datos del itinerario
  }
}
```

Errores:

400 Bad Request: {"message": ["Activity ya existente"]}
500 Internal Server Error: {"message": error.message}

#### Actualizar parcialmente actividad

PATCH /api/activities/:id

Actualiza parcialmente una actividad existente.

Parámetros:
id: ID de la actividad (parámetro de ruta)

Solicitud:
```ts
jsonContent-Type: application/json

{
  // Cualquier combinación de estos campos
  "name": "string",
  "description": "string",
  "outdoor": boolean,
  "transport": boolean,
  "scheduleStart": "string",
  "scheduleEnd": "string",
  "place": {
    "id": "string"
  },
  "itinerary": {
    "id": "string"
  }
}
```

Validación:

Same as PUT request but all fields are optional.

Respuesta:
```ts
jsonStatus: 200 OK
Content-Type: application/json

{
  "message": "Activity actualizada",
  "data": {
    "id": "string",
    "name": "string",
    "description": "string",
    "outdoor": boolean,
    "transport": boolean,
    "scheduleStart": "string",
    "scheduleEnd": "string",
    "place": "string (ID)",
    "itinerary": "string (ID)",
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  },
  "itinerary": {
    "id": "string",
    // otros datos del itinerario
  }
}
```

Errores:

400 Bad Request: {"message": ["Activity ya existente"]}
500 Internal Server Error: {"message": error.message}

#### Eliminar actividad

DELETE /api/activities/:id

Elimina una actividad existente.

Parámetros:
id: ID de la actividad (parámetro de ruta)

Respuesta:
```ts
jsonStatus: 200 OK
Content-Type: application/json

{
  "message": "Activity eliminada",
  "data": {
    "id": "string",
    "name": "string",
    "description": "string",
    "outdoor": boolean,
    "transport": boolean,
    "scheduleStart": "string",
    "scheduleEnd": "string",
    "place": "string (ID)",
    "itinerary": "string (ID)",
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  }
}
```

Errores:

500 Internal Server Error: {"message": error.message}
