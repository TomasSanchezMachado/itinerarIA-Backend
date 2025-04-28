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
    return res.status(401).json({ message: "No authorization token provided" });
  }
  jwt.verify(token, secretKey, (err) => {
    if (err) {
      return res.status(403).json({ message: "Failed to authenticate token" });
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
    return res.status(401).json({ message: "No authorization token provided" });
  }
  jwt.verify(token, secretKey, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
    const userId = decoded.id;
    const user = await em.findOne(User, { id: userId.toString() });
    if (user && user.isAdmin) {
      return next();
    }
    return res
      .status(403)
      .json({ message: "You are not authorized to access this resource" });
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
const validateSchema =
  (schema: any) => (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body.sanitizedInput);
      next();
    } catch (error) {
      return res.status(400).json({
        message: (error as any).errors.map((error: any) => error.message),
      });
    }
  };
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

| HTTP Method | Route              | Description                 | Protected |
| ----------- | ------------------ | --------------------------- | --------- |
| POST        | /api/auth/register | Register a new user         | ❌        |
| POST        | /api/auth/login    | User login                  | ❌        |
| POST        | /api/auth/logout   | User logout                 | ✅        |
| POST        | /api/auth/profile  | Get user profile            | ✅        |
| POST        | /api/auth/verify   | Verify authentication token | ✅        |

### Register User

**HTTP Method & URL:** POST /api/auth/register

**Description:** Registers a new user in the system.

**Authentication Requirements:** No authentication required (Public endpoint)

**Request Parameters:** None

**Request Body:**

```json
{
  "username": "traveler2024",
  "password": "Travel2024",
  "names": "John",
  "lastName": "Doe",
  "dateOfBirth": "1990-01-01",
  "mail": "john.doe@example.com",
  "phoneNumber": "1234567890",
  "isAdmin": false
}
```

**Validation Notes:**

- username:
  - Must be a string
  - Required
  - Must be between 3 and 30 characters and can only contain letters, numbers, underscores, and hyphens
- password:
  - Must be a string
  - Required
  - Must be at least 8 characters long and contain at least one uppercase letter and one number
- names:
  - Must be a string
  - Required
  - Must contain only letters
- lastName:
  - Must be a string
  - Required
  - Must contain only letters
- mail:
  - Must be a string
  - Required
  - Must be in a valid email format
- phoneNumber:
  - Must be a string
  - Required

**Response Codes:**

- 200 OK: User successfully registered
- 400 Bad Request: Invalid input or user already exists
- 500 Internal Server Error: Registration failed

**Response Body (Success - 200 OK):**

```json
{
  "message": "User logged successfully",
  "data": {
    "user": {
      "id": "669d9a3503f535edd5c7aabe",
      "username": "traveler2024",
      "names": "John",
      "lastName": "Doe",
      "dateOfBirth": "1990-01-01",
      "mail": "john.doe@example.com",
      "phoneNumber": "1234567890",
      "isAdmin": false
    }
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**

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

**Example Request:**

```bash
curl -X POST https://itineraria-backend.up.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "traveler2024",
    "password": "Travel2024",
    "names": "John",
    "lastName": "Doe",
    "dateOfBirth": "1990-01-01",
    "mail": "john.doe@example.com",
    "phoneNumber": "1234567890",
    "isAdmin": false
  }'
```

### User Login

**HTTP Method & URL:** POST /api/auth/login

**Description:** Authenticates a user and returns a session token.

**Authentication Requirements:** No authentication required (Public endpoint)

**Request Parameters:** None

**Request Body:**

```json
{
  "username": "traveler2024",
  "password": "Travel2024"
}
```

**Validation Notes:**

- username:
  - Must be a string
  - Required
  - Must be between 3 and 30 characters and can only contain letters, numbers, underscores, and hyphens
- password:
  - Must be a string
  - Required
  - Must be at least 8 characters long and contain at least one uppercase letter and one number

**Response Codes:**

- 200 OK: Login successful
- 400 Bad Request: Invalid credentials
- 500 Internal Server Error: Login process failed

**Response Body (Success - 200 OK):**

```json
{
  "message": "User logged successfully",
  "data": {
    "user": {
      "id": "669d9a3503f535edd5c7aabe",
      "username": "traveler2024",
      "names": "John",
      "lastName": "Doe",
      "dateOfBirth": "1990-01-01",
      "mail": "john.doe@example.com",
      "phoneNumber": "1234567890",
      "isAdmin": false,
      "itineraries": [],
      "participants": []
    }
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**

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

**Example Request:**

```bash
curl -X POST https://itineraria-backend.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "traveler2024",
    "password": "Travel2024"
  }'
```

**Notes:** Upon successful login, a JWT token is set as an HTTP-only cookie.

### User Logout

**HTTP Method & URL:** POST /api/auth/logout

**Description:** Logs out the currently authenticated user by invalidating their session.

**Authentication Requirements:** Authentication required (Protected endpoint)

**Request Parameters:** None

**Request Body:** None

**Response Codes:**

- 200 OK: Logout successful
- 401 Unauthorized: No valid authentication
- 500 Internal Server Error: Logout process failed

**Response Body (Success - 200 OK):**

```json
{
  "message": "User logged out"
}
```

**Error Responses:**

401 Unauthorized:

```json
{
  "message": "Authentication required"
}
```

500 Internal Server Error:

```json
{
  "message": "Internal server error during logout"
}
```

**Example Request:**

```bash
curl -X POST https://itineraria-backend.up.railway.app/api/auth/logout \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Notes:** This endpoint clears the authentication token cookie.

### Get User Profile

**HTTP Method & URL:** POST /api/auth/profile

**Description:** Retrieves the profile information of the currently authenticated user.

**Authentication Requirements:** Authentication required (Protected endpoint)

**Request Parameters:** None

**Request Body:** None

**Response Codes:**

- 200 OK: Profile successfully retrieved
- 400 Bad Request: User not found
- 401 Unauthorized: Authentication required
- 500 Internal Server Error: Profile retrieval failed

**Response Body (Success - 200 OK):**

```json
{
  "message": "User profile found",
  "data": {
    "user": {
      "id": "669d9a3503f535edd5c7aabe",
      "username": "traveler2024",
      "names": "John",
      "lastName": "Doe",
      "dateOfBirth": "1990-01-01",
      "mail": "john.doe@example.com",
      "phoneNumber": "1234567890",
      "isAdmin": false
    }
  }
}
```

**Error Responses:**

400 Bad Request:

```json
{
  "message": "User not found"
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
  "message": "The user profile could not be found",
  "data": "Error details"
}
```

**Example Request:**

```bash
curl -X POST https://itineraria-backend.up.railway.app/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Verify Token

**HTTP Method & URL:** POST /api/auth/verify

**Description:** Verifies if the authentication token is valid and returns user information.

**Authentication Requirements:** Authentication required (Protected endpoint)

**Request Parameters:** None

**Request Body:** None

**Response Codes:**

- 200 OK: Token is valid
- 401 Unauthorized: Token is invalid or user not found

**Response Body (Success - 200 OK):**

```json
{
  "message": "User found",
  "data": {
    "user": {
      "id": "669d9a3503f535edd5c7aabe",
      "username": "traveler2024",
      "names": "John",
      "lastName": "Doe",
      "dateOfBirth": "1990-01-01",
      "mail": "john.doe@example.com",
      "phoneNumber": "1234567890",
      "isAdmin": false,
      "itineraries": [],
      "participants": []
    }
  }
}
```

**Error Responses:**

401 Unauthorized:

```json
{
  "message": "User not found",
  "userFound": false
}
```

**Example Request:**

```bash
curl -X POST https://itineraria-backend.up.railway.app/api/auth/verify \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Notes:** This endpoint is typically used to check if a user's session is still valid and to retrieve current user data.

### Users

### Data Model

**User**

```ts
{
  id: string;                // Unique identifier
  username: string;          // Username for authentication
  names: string;             // First name(s)
  lastName: string;          // Last name
  dateOfBirth: Date;         // Date of birth
  mail: string;              // Email address
  phoneNumber: string;       // Contact phone number
  isAdmin: boolean;          // Admin status flag
  itineraries?: Itinerary[]; // References to associated Itineraries
  participants?: Participant[]; // References to associated Participants
}
```

| HTTP Method | Route          | Description                 | Protected |
| ----------- | -------------- | --------------------------- | --------- |
| GET         | /api/users     | Get all users               | ❌        |
| GET         | /api/users/:id | Get a specific user         | ❌        |
| POST        | /api/users     | Create a new user           | ❌        |
| PUT         | /api/users/:id | Update a user completely    | ❌        |
| PATCH       | /api/users/:id | Update specific user fields | ❌        |
| DELETE      | /api/users/:id | Delete a user               | ❌        |

### Get All Users

**HTTP Method & URL:** GET /api/users

**Description:** Retrieves all users registered in the system.

**Authentication Requirements:** None (Public endpoint)

**Request Parameters:** None

**Request Body:** None

**Response Codes:**

- 200 OK: Successfully retrieved users
- 500 Internal Server Error: Server error

**Response Body (Success - 200 OK):**

```json
{
  "message": "Users found successfully",
  "data": [
    {
      "id": "60d21b4667d0d8992e610c85",
      "username": "traveler2024",
      "names": "John",
      "lastName": "Doe",
      "dateOfBirth": "1990-01-15",
      "mail": "john.doe@example.com",
      "phoneNumber": "1234567890",
      "isAdmin": false,
      "itineraries": [...],
      "participants": [...]
    },
    // Additional users
  ]
}
```

**Error Responses:**

500 Internal Server Error:

```json
{
  "message": "Server error while retrieving users"
}
```

**Example Request:**

```bash
curl -X GET https://itineraria-backend.up.railway.app/api/users
```

### Get User by ID

**HTTP Method & URL:** GET /api/users/:id

**Description:** Retrieves detailed information about a specific user.

**Authentication Requirements:** None (Public endpoint)

**Request Parameters:**

- id (path parameter): Unique identifier of the user to retrieve

**Request Body:** None

**Response Codes:**

- 200 OK: Successfully retrieved the user
- 404 Not Found: User not found
- 500 Internal Server Error: Server error

**Response Body (Success - 200 OK):**

```json
{
  "message": "User found successfully",
  "data": {
    "id": "60d21b4667d0d8992e610c85",
    "username": "traveler2024",
    "names": "John",
    "lastName": "Doe",
    "dateOfBirth": "1990-01-15",
    "mail": "john.doe@example.com",
    "phoneNumber": "1234567890",
    "isAdmin": false,
    "itineraries": [...],
    "participants": [...]
  }
}
```

**Error Responses:**

404 Not Found:

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

**Example Request:**

```bash
curl -X GET https://itineraria-backend.up.railway.app/api/users/60d21b4667d0d8992e610c85
```

### Create User

**HTTP Method & URL:** POST /api/users

**Description:** Registers a new user in the system and returns authentication token.

**Authentication Requirements:** None (Public endpoint)

**Request Parameters:** None

**Request Body:**

```json
{
  "username": "traveler2024",
  "password": "Travel2024",
  "names": "John",
  "lastName": "Doe",
  "dateOfBirth": "1990-01-15",
  "mail": "john.doe@example.com",
  "phoneNumber": "1234567890"
}
```

**Validation Notes:**

- username:
  - Must be a string
  - Required
  - Must be between 3 and 30 characters
  - Can only contain letters, numbers, underscores, and hyphens
- password:
  - Must be a string
  - Required
  - Must be at least 8 characters long
  - Must contain at least one uppercase letter and one number
- names:
  - Must be a string
  - Required
  - Must contain only letters
- lastName:
  - Must be a string
  - Required
  - Must contain only letters
- mail:
  - Must be a string
  - Required
  - Must be in a valid email format
- phoneNumber:
  - Must be a string
  - Required

**Response Codes:**

- 200 OK: User successfully created and logged in
- 400 Bad Request: Invalid user data or username/email already exists
- 500 Internal Server Error: Server error

**Response Body (Success - 200 OK):**

```json
{
  "message": "User logged successfully",
  "data": {
    "user": {
      "id": "60d21b4667d0d8992e610c85",
      "username": "traveler2024",
      "names": "John",
      "lastName": "Doe",
      "dateOfBirth": "1990-01-15",
      "mail": "john.doe@example.com",
      "phoneNumber": "1234567890",
      "isAdmin": false
    }
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**

400 Bad Request:

```json
{
  "message": "Username or email already exists"
}
```

OR

```json
{
  "message": "Invalid user data",
  "errors": ["Username must be between 3 and 30 characters"]
}
```

500 Internal Server Error:

```json
{
  "message": "Error creating user"
}
```

**Example Request:**

```bash
curl -X POST https://itineraria-backend.up.railway.app/api/users \
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

### Update User (Complete)

**HTTP Method & URL:** PUT /api/users/:id

**Description:** Updates all fields of an existing user.

**Authentication Requirements:** None (Public endpoint)

**Request Parameters:**

- id (path parameter): Unique identifier of the user to update

**Request Body:**

```json
{
  "username": "traveler2024_updated",
  "password": "Travel2024New",
  "names": "John",
  "lastName": "Doe",
  "mail": "john.updated@example.com",
  "phoneNumber": "9876543210",
  "isAdmin": false,
  "itineraries": [{ "id": "60d21b4667d0d8992e610c86" }]
}
```

**Validation Notes:**

- All fields must comply with the model schema validations as listed in Create User
- The sanitizeUserInput middleware cleans the data by removing undefined fields

**Response Codes:**

- 200 OK: User successfully updated
- 400 Bad Request: Invalid user data or username/email already exists
- 404 Not Found: User not found
- 500 Internal Server Error: Server error

**Response Body (Success - 200 OK):**

```json
{
  "message": "User updated successfully",
  "data": {
    "id": "60d21b4667d0d8992e610c85",
    "username": "traveler2024_updated",
    "names": "John",
    "lastName": "Doe",
    "mail": "john.updated@example.com",
    "phoneNumber": "9876543210",
    "isAdmin": false,
    "itineraries": [...]
  }
}
```

**Error Responses:**

400 Bad Request:

```json
{
  "message": "Username or email already exists"
}
```

OR

```json
{
  "message": "Invalid user data"
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
  "message": "Error updating user"
}
```

**Example Request:**

```bash
curl -X PUT https://itineraria-backend.up.railway.app/api/users/60d21b4667d0d8992e610c85 \
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

### Update User (Partial)

**HTTP Method & URL:** PATCH /api/users/:id

**Description:** Updates only specific fields of an existing user.

**Authentication Requirements:** None (Public endpoint)

**Request Parameters:**

- id (path parameter): Unique identifier of the user to partially update

**Request Body:**

```json
{
  "phoneNumber": "9876543210",
  "mail": "john.updated@example.com"
}
```

**Validation Notes:**

- Any included field must comply with the model schema validations
- Fields are optional
- The sanitizeUserInput middleware cleans the data by removing undefined fields

**Response Codes:**

- 200 OK: User successfully updated
- 400 Bad Request: Invalid user data or username/email already exists
- 404 Not Found: User not found
- 500 Internal Server Error: Server error

**Response Body (Success - 200 OK):**

```json
{
  "message": "User updated successfully",
  "data": {
    "id": "60d21b4667d0d8992e610c85",
    "username": "traveler2024",
    "names": "John",
    "lastName": "Doe",
    "mail": "john.updated@example.com",
    "phoneNumber": "9876543210",
    "isAdmin": false,
    "itineraries": [...]
  }
}
```

**Error Responses:**

400 Bad Request:

```json
{
  "message": "Username or email already exists"
}
```

OR

```json
{
  "message": "Invalid user data"
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
  "message": "Error updating user"
}
```

**Example Request:**

```bash
curl -X PATCH https://itineraria-backend.up.railway.app/api/users/60d21b4667d0d8992e610c85 \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "9876543210",
    "mail": "john.updated@example.com"
  }'
```

### Delete User

**HTTP Method & URL:** DELETE /api/users/:id

**Description:** Removes a specific user from the system.

**Authentication Requirements:** None (Public endpoint)

**Request Parameters:**

- id (path parameter): Unique identifier of the user to delete

**Request Body:** None

**Response Codes:**

- 200 OK: User successfully deleted
- 404 Not Found: User not found
- 500 Internal Server Error: Server error

**Response Body (Success - 200 OK):**

```json
{
  "message": "User deleted successfully"
}
```

**Error Responses:**

404 Not Found:

```json
{
  "message": "User not found"
}
```

500 Internal Server Error:

```json
{
  "message": "Error deleting user"
}
```

**Example Request:**

```bash
curl -X DELETE https://itineraria-backend.up.railway.app/api/users/60d21b4667d0d8992e610c85
```

| HTTP Method | Route                | Description                       | Protected  |
| ----------- | -------------------- | --------------------------------- | ---------- |
| GET         | /api/preferences     | Get all preferences               | ✅ (Admin) |
| GET         | /api/preferences/:id | Get a specific preference         | ✅ (Admin) |
| POST        | /api/preferences     | Create a new preference           | ✅ (Admin) |
| PUT         | /api/preferences/:id | Update a preference completely    | ✅ (Admin) |
| PATCH       | /api/preferences/:id | Update specific preference fields | ✅ (Admin) |
| DELETE      | /api/preferences/:id | Delete a preference               | ✅ (Admin) |

### Get All Preferences

**HTTP Method & URL:** GET /api/preferences

**Description:** Retrieves all preferences registered in the system.

**Authentication Requirements:** Admin access required (Protected endpoint)

**Request Parameters:** None

**Request Body:** None

**Response Codes:**

- 200 OK: Successfully retrieved preferences (also returned if no preferences found)
- 401 Unauthorized: Authentication issues
- 403 Forbidden: Insufficient permissions
- 500 Internal Server Error: Server error

**Response Body (Success - 200 OK):**

```json
{
  "data": [
    {
      "id": "60d21b4667d0d8992e610c85",
      "name": "Early Morning",
      "description": "Preference for early morning departures",
      "participants": [...]
    },
    // Additional preferences
  ]
}
```

**Response Body (No Preferences - 200 OK):**

```json
{
  "message": "Preferences not found"
}
```

**Error Responses:**

401 Unauthorized:

```json
{
  "message": "No authorization token provided"
}
```

OR

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

**Example Request:**

```bash
curl -X GET https://itineraria-backend.up.railway.app/api/preferences \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Preference by ID

**HTTP Method & URL:** GET /api/preferences/:id

**Description:** Retrieves detailed information about a specific preference.

**Authentication Requirements:** Admin access required (Protected endpoint)

**Request Parameters:**

- id (path parameter): Unique identifier of the preference to retrieve

**Request Body:** None

**Response Codes:**

- 200 OK: Successfully retrieved the preference
- 401 Unauthorized: Authentication issues
- 403 Forbidden: Insufficient permissions
- 404 Not Found: Preference not found
- 500 Internal Server Error: Server error

**Response Body (Success - 200 OK):**

```json
{
  "data": {
    "id": "60d21b4667d0d8992e610c85",
    "name": "Early Morning",
    "description": "Preference for early morning departures",
    "participants": [...]
  }
}
```

**Error Responses:**

401 Unauthorized:

```json
{
  "message": "No authorization token provided"
}
```

OR

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
  "message": "Error fetching preference"
}
```

**Example Request:**

```bash
curl -X GET https://itineraria-backend.up.railway.app/api/preferences/60d21b4667d0d8992e610c85 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Create Preference

**HTTP Method & URL:** POST /api/preferences

**Description:** Creates a new preference in the system.

**Authentication Requirements:** Admin access required (Protected endpoint)

**Request Parameters:** None

**Request Body:**

```json
{
  "name": "Early Morning",
  "description": "Preference for early morning departures",
  "participants": [] // optional
}
```

**Validation Notes:**

- name:
  - Must be a string
  - Required
- description:
  - Must be a string
  - Required
- participants:
  - Optional array of participant references

**Response Codes:**

- 201 Created: Preference successfully created
- 400 Bad Request: Invalid preference data
- 401 Unauthorized: Authentication issues
- 403 Forbidden: Insufficient permissions
- 500 Internal Server Error: Server error

**Response Body (Success - 201 Created):**

```json
{
  "message": "Preference created successfully",
  "data": {
    "id": "60d21b4667d0d8992e610c85",
    "name": "Early Morning",
    "description": "Preference for early morning departures",
    "participants": []
  }
}
```

**Error Responses:**

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

OR

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

**Example Request:**

```bash
curl -X POST https://itineraria-backend.up.railway.app/api/preferences \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Early Morning",
    "description": "Preference for early morning departures"
  }'
```

### Update Preference (Complete)

**HTTP Method & URL:** PUT /api/preferences/:id

**Description:** Updates all fields of an existing preference.

**Authentication Requirements:** Admin access required (Protected endpoint)

**Request Parameters:**

- id (path parameter): Unique identifier of the preference to update

**Request Body:**

```json
{
  "name": "Evening Departure",
  "description": "Preference for evening departures"
}
```

**Validation Notes:**

- All fields must comply with the model schema validations
- The sanitizePreferenceInput middleware cleans the data by removing undefined fields

**Response Codes:**

- 200 OK: Preference successfully updated
- 400 Bad Request: Invalid preference data
- 401 Unauthorized: Authentication issues
- 403 Forbidden: Insufficient permissions
- 404 Not Found: Preference not found
- 500 Internal Server Error: Server error

**Response Body (Success - 200 OK):**

```json
{
  "message": "Preference updated successfully",
  "data": {
    "id": "60d21b4667d0d8992e610c85",
    "name": "Evening Departure",
    "description": "Preference for evening departures",
    "participants": [...]
  }
}
```

**Error Responses:**

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

OR

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

**Example Request:**

```bash
curl -X PUT https://itineraria-backend.up.railway.app/api/preferences/60d21b4667d0d8992e610c85 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Evening Departure",
    "description": "Preference for evening departures"
  }'
```

### Update Preference (Partial)

**HTTP Method & URL:** PATCH /api/preferences/:id

**Description:** Updates only specific fields of an existing preference.

**Authentication Requirements:** Admin access required (Protected endpoint)

**Request Parameters:**

- id (path parameter): Unique identifier of the preference to partially update

**Request Body:**

```json
{
  "description": "Updated preference for afternoon departures"
}
```

**Validation Notes:**

- Any included field must comply with the model schema validations
- Fields are optional
- The sanitizePreferenceInput middleware cleans the data by removing undefined fields

**Response Codes:**

- 200 OK: Preference successfully updated
- 400 Bad Request: Invalid preference data
- 401 Unauthorized: Authentication issues
- 403 Forbidden: Insufficient permissions
- 404 Not Found: Preference not found
- 500 Internal Server Error: Server error

**Response Body (Success - 200 OK):**

```json
{
  "message": "Preference updated successfully",
  "data": {
    "id": "60d21b4667d0d8992e610c85",
    "name": "Evening Departure",
    "description": "Updated preference for afternoon departures",
    "participants": [...]
  }
}
```

**Error Responses:**

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

OR

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

**Example Request:**

```bash
curl -X PATCH https://itineraria-backend.up.railway.app/api/preferences/60d21b4667d0d8992e610c85 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "description": "Updated preference for afternoon departures"
  }'
```

### Delete Preference

**HTTP Method & URL:** DELETE /api/preferences/:id

**Description:** Removes a specific preference from the system.

**Authentication Requirements:** Admin access required (Protected endpoint)

**Request Parameters:**

- id (path parameter): Unique identifier of the preference to delete

**Request Body:** None

**Response Codes:**

- 200 OK: Preference successfully deleted
- 400 Bad Request: Cannot delete preference with associated participants
- 401 Unauthorized: Authentication issues
- 403 Forbidden: Insufficient permissions
- 404 Not Found: Preference not found
- 500 Internal Server Error: Server error

**Response Body (Success - 200 OK):**

```json
{
  "message": "Preference deleted",
  "data": {
    "id": "60d21b4667d0d8992e610c85",
    "name": "Evening Departure",
    "description": "Updated preference for afternoon departures",
    "participants": []
  }
}
```

**Error Responses:**

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

OR

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

**Example Request:**

```bash
curl -X DELETE https://itineraria-backend.up.railway.app/api/preferences/60d21b4667d0d8992e610c85 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Places

### Data Model

**Place**

```ts
{
  id: string;                        // Unique identifier
  name: string;                      // Name of the place
  latitude: number;                  // Geographical latitude
  longitude: number;                 // Geographical longitude
  zipCode: string;                   // Postal/ZIP code
  province: string;                  // Province/State
  country: string;                   // Country
  externalServices?: ExternalService[]; // Associated external services
  activities?: Activity[];           // Associated activities
  itineraries?: Itinerary[];         // Associated itineraries
  createdAt?: Date;                  // Creation timestamp
  updatedAt?: Date;                  // Last update timestamp
}
```

| HTTP Method | Route           | Description                  | Protected |
| ----------- | --------------- | ---------------------------- | --------- |
| GET         | /api/places     | Get all places               | ❌        |
| GET         | /api/places/:id | Get a specific place         | ❌        |
| POST        | /api/places     | Create a new place           | ❌        |
| PUT         | /api/places/:id | Update a place completely    | ❌        |
| PATCH       | /api/places/:id | Update specific place fields | ❌        |
| DELETE      | /api/places/:id | Delete a place               | ❌        |

### Get All Places

**HTTP Method & URL:** GET /api/places

**Description:** Retrieves all places registered in the system.

**Authentication Requirements:** None (Public endpoint)

**Request Parameters:** None

**Request Body:** None

**Response Codes:**

- 200 OK: Places retrieved successfully (also returned if no places found)
- 500 Internal Server Error: Server error

**Response Body (Success - 200 OK):**

```json
{
  "data": [
    {
      "id": "60d21b4667d0d8992e610c85",
      "name": "Central Park",
      "latitude": 40.7829,
      "longitude": -73.9654,
      "zipCode": "10022",
      "province": "New York",
      "country": "United States",
      "externalServices": [...],
      "activities": [...],
      "itineraries": [...]
    },
    // Additional places
  ]
}
```

**Response Body (No Places - 200 OK):**

```json
{
  "message": "No places found",
  "data": []
}
```

**Error Responses:**

500 Internal Server Error:

```json
{
  "message": "Error retrieving places"
}
```

**Example Request:**

```bash
curl -X GET https://itineraria-backend.up.railway.app/api/places
```

### Get Specific Place

**HTTP Method & URL:** GET /api/places/:id

**Description:** Retrieves information about a specific place based on its ID.

**Authentication Requirements:** None (Public endpoint)

**Request Parameters:**

- id (path parameter): Unique identifier of the place to retrieve

**Request Body:** None

**Response Codes:**

- 200 OK: Place retrieved successfully
- 404 Not Found: Place not found
- 500 Internal Server Error: Server error

**Response Body (Success - 200 OK):**

```json
{
  "data": {
    "id": "60d21b4667d0d8992e610c85",
    "name": "Central Park",
    "latitude": 40.7829,
    "longitude": -73.9654,
    "zipCode": "10022",
    "province": "New York",
    "country": "United States",
    "externalServices": [...],
    "activities": [...],
    "itineraries": [...]
  }
}
```

**Error Responses:**

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

**Example Request:**

```bash
curl -X GET https://itineraria-backend.up.railway.app/api/places/60d21b4667d0d8992e610c85
```

### Create New Place

**HTTP Method & URL:** POST /api/places

**Description:** Registers a new place in the system.

**Authentication Requirements:** None (Public endpoint)

**Request Parameters:** None

**Request Body:**

```json
{
  "name": "Central Park",
  "latitude": 40.7829,
  "longitude": -73.9654,
  "zipCode": "10022",
  "province": "New York",
  "country": "United States"
}
```

**Validation Notes:**

- The sanitizePlaceInput middleware cleans the data by removing undefined fields
- The validateSchema(postSchema) middleware validates the format of the submitted data
- System checks for duplicate places based on coordinates or name+province+country

**Response Codes:**

- 201 Created: Place successfully created
- 400 Bad Request: Validation error or duplicate place
- 500 Internal Server Error: Server error

**Response Body (Success - 201 Created):**

```json
{
  "message": "Place created successfully",
  "data": {
    "id": "60d21b4667d0d8992e610c85",
    "name": "Central Park",
    "latitude": 40.7829,
    "longitude": -73.9654,
    "zipCode": "10022",
    "province": "New York",
    "country": "United States",
    "externalServices": [],
    "activities": [],
    "itineraries": []
  }
}
```

**Error Responses:**

400 Bad Request (Duplicate Coordinates):

```json
{
  "message": "There is already a place with the same coordinates"
}
```

400 Bad Request (Duplicate Name/Location):

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

**Example Request:**

```bash
curl -X POST https://itineraria-backend.up.railway.app/api/places \
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

### Update Place (Complete)

**HTTP Method & URL:** PUT /api/places/:id

**Description:** Updates all fields of an existing place.

**Authentication Requirements:** None (Public endpoint)

**Request Parameters:**

- id (path parameter): Unique identifier of the place to update

**Request Body:**

```json
{
  "name": "Updated Park",
  "latitude": 40.7829,
  "longitude": -73.9654,
  "zipCode": "10022",
  "province": "New York",
  "country": "United States"
}
```

**Validation Notes:**

- The sanitizePlaceInput middleware cleans the data by removing undefined fields
- The validateSchema(putSchema) middleware validates the format of the submitted data
- System checks for duplicate places based on coordinates or name+province+country

**Response Codes:**

- 200 OK: Place successfully updated
- 400 Bad Request: Validation error or duplicate place
- 404 Not Found: Place not found
- 500 Internal Server Error: Server error

**Response Body (Success - 200 OK):**

```json
{
  "message": "Place updated successfully",
  "data": {
    "id": "60d21b4667d0d8992e610c85",
    "name": "Updated Park",
    "latitude": 40.7829,
    "longitude": -73.9654,
    "zipCode": "10022",
    "province": "New York",
    "country": "United States",
    "externalServices": [...],
    "activities": [...],
    "itineraries": [...]
  }
}
```

**Error Responses:**

400 Bad Request (Duplicate Coordinates):

```json
{
  "message": "There is already a place with the same coordinates!"
}
```

400 Bad Request (Duplicate Name/Location):

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

**Example Request:**

```bash
curl -X PUT https://itineraria-backend.up.railway.app/api/places/60d21b4667d0d8992e610c85 \
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

### Update Place (Partial)

**HTTP Method & URL:** PATCH /api/places/:id

**Description:** Updates specific fields of an existing place.

**Authentication Requirements:** None (Public endpoint)

**Request Parameters:**

- id (path parameter): Unique identifier of the place to partially update

**Request Body:**

```json
{
  "name": "Central Park Updated",
  "zipCode": "10023"
}
```

**Validation Notes:**

- Any included field must meet the validations of the model schema
- The sanitizePlaceInput middleware cleans the data by removing undefined fields
- System checks for duplicate places based on coordinates or name+province+country if those fields are included

**Response Codes:**

- 200 OK: Place successfully updated
- 400 Bad Request: Validation error or duplicate place
- 404 Not Found: Place not found
- 500 Internal Server Error: Server error

**Response Body (Success - 200 OK):**

```json
{
  "message": "Place updated successfully",
  "data": {
    "id": "60d21b4667d0d8992e610c85",
    "name": "Central Park Updated",
    "latitude": 40.7829,
    "longitude": -73.9654,
    "zipCode": "10023",
    "province": "New York",
    "country": "United States",
    "externalServices": [...],
    "activities": [...],
    "itineraries": [...]
  }
}
```

**Error Responses:**

400 Bad Request (Duplicate Coordinates):

```json
{
  "message": "There is already a place with the same coordinates!"
}
```

400 Bad Request (Duplicate Name/Location):

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

**Example Request:**

```bash
curl -X PATCH https://itineraria-backend.up.railway.app/api/places/60d21b4667d0d8992e610c85 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Central Park Updated",
    "zipCode": "10023"
  }'
```

### Delete Place

**HTTP Method & URL:** DELETE /api/places/:id

**Description:** Removes a place from the system.

**Authentication Requirements:** None (Public endpoint)

**Request Parameters:**

- id (path parameter): Unique identifier of the place to delete

**Request Body:** None

**Response Codes:**

- 200 OK: Place successfully deleted
- 400 Bad Request: Cannot delete due to associated data
- 404 Not Found: Place not found
- 500 Internal Server Error: Server error

**Response Body (Success - 200 OK):**

```json
{
  "message": "Place deleted",
  "data": {
    "id": "60d21b4667d0d8992e610c85",
    "name": "Central Park",
    "latitude": 40.7829,
    "longitude": -73.9654,
    "zipCode": "10022",
    "province": "New York",
    "country": "United States",
    "externalServices": [],
    "activities": [],
    "itineraries": []
  }
}
```

**Error Responses:**

400 Bad Request (Has External Services):

```json
{
  "message": "Cannot delete the place because it has associated external services"
}
```

400 Bad Request (Has Itineraries):

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
```

**Example Request:**

```bash
curl -X DELETE https://itineraria-backend.up.railway.app/api/places/60d21b4667d0d8992e610c85
```

| HTTP Method | Route                        | Description                        | Protected |
| ----------- | ---------------------------- | ---------------------------------- | --------- |
| GET         | /api/participants/:userId    | Get all participants for a user    | ✅        |
| GET         | /api/participants/getone/:id | Get a specific participant         | ✅        |
| POST        | /api/participants            | Create a new participant           | ✅        |
| POST        | /api/participants/favorite   | Add favorite participant           | ✅        |
| PUT         | /api/participants/:id        | Update a participant completely    | ✅        |
| PATCH       | /api/participants/:id        | Update specific participant fields | ✅        |
| DELETE      | /api/participants/:id        | Delete a participant               | ✅        |

### Get All Participants for a User

**HTTP Method & URL:** GET /api/participants/:userId

**Description:** Retrieves all participants associated with a specific user.

**Authentication Requirements:** Authentication required (Protected endpoint)

**Request Parameters:**

- userId (path parameter): ID of the user whose participants are being requested

**Request Body:** None

**Response Codes:**

- 200 OK: Participants retrieved successfully
- 401 Unauthorized: Authentication required
- 404 Not Found: User not found
- 500 Internal Server Error: Server error

**Response Body (Success - 200 OK):**

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
      "id": "670bd1cc60eb88e665c9fb91",
      "name": "Participant 2",
      "age": 20,
      "disability": false,
      "preferences": [...],
      "user": "66fc4785f2b5cf4ef633816a"
    }
  ]
}
```

**Error Responses:**

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

**Example Request:**

```bash
curl -X GET https://itineraria-backend.up.railway.app/api/participants/66fc4785f2b5cf4ef633816a \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Specific Participant

**HTTP Method & URL:** GET /api/participants/getone/:id

**Description:** Retrieves detailed information about a specific participant.

**Authentication Requirements:** Authentication required (Protected endpoint)

**Request Parameters:**

- id (path parameter): ID of the participant to retrieve

**Request Body:** None

**Response Codes:**

- 200 OK: Participant retrieved successfully
- 401 Unauthorized: Authentication required
- 404 Not Found: Participant not found
- 500 Internal Server Error: Server error

**Response Body (Success - 200 OK):**

```json
{
  "message": "Participant retrieved successfully",
  "data": {
    "id": "670bd0cc60eb88e665c9fb90",
    "name": "Facundo",
    "age": 24,
    "disability": false,
    "preferences": [
      { "id": "670bce8c16da0fb6e0947f33" },
      { "id": "670bce6416da0fb6e0947f31" }
    ],
    "user": "66fc4785f2b5cf4ef633816a"
  }
}
```

**Error Responses:**

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

**Example Request:**

```bash
curl -X GET https://itineraria-backend.up.railway.app/api/participants/getone/670bd0cc60eb88e665c9fb90 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Create New Participant

**HTTP Method & URL:** POST /api/participants

**Description:** Creates a new participant in the system.

**Authentication Requirements:** Authentication required (Protected endpoint)

**Request Parameters:** None

**Request Body:**

```json
{
  "name": "Participant 2",
  "age": 20,
  "disability": false,
  "preferences": ["670bcc78732bbbc7b6926278"],
  "user": "66fc4785f2b5cf4ef633816a"
}
```

**Validation Notes:**

- name:
  - Must be a string
  - Must be at least 3 characters if provided
- age:
  - Must be a number
  - Required
  - Must be between 1 and 3 digits
- disability:
  - Must be a boolean
  - Required

**Response Codes:**

- 201 Created: Participant successfully created
- 400 Bad Request: Invalid participant data
- 401 Unauthorized: Authentication required
- 500 Internal Server Error: Server error

**Response Body (Success - 201 Created):**

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

**Error Responses:**

400 Bad Request:

```json
{
  "message": "Invalid participant data",
  "errors": ["Name must be at least 3 characters"]
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

**Example Request:**

```bash
curl -X POST https://itineraria-backend.up.railway.app/api/participants \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Participant 2",
    "age": 20,
    "disability": false,
    "preferences": ["670bcc78732bbbc7b6926278"],
    "user": "66fc4785f2b5cf4ef633816a"
  }'
```

### Add Favorite Participant

**HTTP Method & URL:** POST /api/participants/favorite

**Description:** Adds a participant as a favorite.

**Authentication Requirements:** Authentication required (Protected endpoint)

**Request Parameters:** None

**Request Body:**

```json
{
  "name": "Participant 1",
  "age": 20,
  "disability": true,
  "preferences": ["670bce6416da0fb6e0947f31"],
  "user": "66fc4785f2b5cf4ef633816a"
}
```

**Validation Notes:**

- Same validations as creating a new participant
- The sanitizeParticipantInput middleware cleans the data by removing undefined fields

**Response Codes:**

- 201 Created: Favorite participant successfully added
- 400 Bad Request: Invalid participant data
- 401 Unauthorized: Authentication required
- 500 Internal Server Error: Server error

**Response Body (Success - 201 Created):**

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

**Error Responses:**

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
```

**Example Request:**

```bash
curl -X POST https://itineraria-backend.up.railway.app/api/participants/favorite \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Participant 1",
    "age": 20,
    "disability": true,
    "preferences": ["670bce6416da0fb6e0947f31"],
    "user": "66fc4785f2b5cf4ef633816a"
  }'
```

### Update Participant (Complete)

**HTTP Method & URL:** PUT /api/participants/:id

**Description:** Updates all the data of an existing participant.

**Authentication Requirements:** Authentication required (Protected endpoint)

**Request Parameters:**

- id (path parameter): ID of the participant to update

**Request Body:**

```json
{
  "name": "Facundo",
  "age": 24,
  "disability": false,
  "preferences": [
    { "id": "670bce8c16da0fb6e0947f33" },
    { "id": "670bce6416da0fb6e0947f31" }
  ]
}
```

**Validation Notes:**

- name:
  - Must be a string
  - Required
  - Must be at least 3 characters
- age:
  - Must be a number
  - Required
  - Must be between 1 and 3 digits
- disability:
  - Must be a boolean
  - Required

**Response Codes:**

- 200 OK: Participant successfully updated
- 400 Bad Request: Invalid participant data
- 401 Unauthorized: Authentication required
- 404 Not Found: Participant not found
- 500 Internal Server Error: Server error

**Response Body (Success - 200 OK):**

```json
{
  "message": "Participant updated successfully",
  "data": {
    "id": "670bd0cc60eb88e665c9fb90",
    "name": "Facundo",
    "age": 24,
    "disability": false,
    "preferences": [
      { "id": "670bce8c16da0fb6e0947f33" },
      { "id": "670bce6416da0fb6e0947f31" }
    ],
    "user": "66fc4785f2b5cf4ef633816a"
  }
}
```

**Error Responses:**

400 Bad Request:

```json
{
  "message": "Invalid participant data",
  "errors": ["Name must be at least 3 characters"]
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

**Example Request:**

```bash
curl -X PUT https://itineraria-backend.up.railway.app/api/participants/670bd0cc60eb88e665c9fb90 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
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

### Update Participant (Partial)

**HTTP Method & URL:** PATCH /api/participants/:id

**Description:** Updates only specific fields of an existing participant.

**Authentication Requirements:** Authentication required (Protected endpoint)

**Request Parameters:**

- id (path parameter): ID of the participant to partially update

**Request Body:**

```json
{
  "name": "Nicolás Escobar"
}
```

**Validation Notes:**

- Any included field must meet the validations of the model schema
- Fields are optional
- The sanitizeParticipantInput middleware cleans the data by removing undefined fields

**Response Codes:**

- 200 OK: Participant successfully updated
- 400 Bad Request: Invalid participant data
- 401 Unauthorized: Authentication required
- 404 Not Found: Participant not found
- 500 Internal Server Error: Server error

**Response Body (Success - 200 OK):**

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

**Error Responses:**

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

**Example Request:**

```bash
curl -X PATCH https://itineraria-backend.up.railway.app/api/participants/66ff22aece8bda39a2e5be6c \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Nicolás Escobar"
  }'
```

### Delete Participant

**HTTP Method & URL:** DELETE /api/participants/:id

**Description:** Removes a specific participant from the system.

**Authentication Requirements:** Authentication required (Protected endpoint)

**Request Parameters:**

- id (path parameter): ID of the participant to delete

**Request Body:** None

**Response Codes:**

- 200 OK: Participant successfully deleted
- 401 Unauthorized: Authentication required
- 404 Not Found: Participant not found
- 500 Internal Server Error: Server error

**Response Body (Success - 200 OK):**

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

**Error Responses:**

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

**Example Request:**

```bash
curl -X DELETE https://itineraria-backend.up.railway.app/api/participants/66ff22aece8bda39a2e5be6c \
  -H "Authorization: Bearer YOUR_TOKEN"
```

| HTTP Method | Route                      | Description                    | Protected |
| ----------- | -------------------------- | ------------------------------ | --------- |
| GET         | /api/opinions              | Get all opinions               | ✅        |
| GET         | /api/opinions/:id          | Get a specific opinion         | ✅        |
| GET         | /api/opinions/activity/:id | Get opinions by activity       | ✅        |
| POST        | /api/opinions              | Create a new opinion           | ✅        |
| PUT         | /api/opinions/:id          | Update an opinion completely   | ✅        |
| PATCH       | /api/opinions/:id          | Update specific opinion fields | ✅        |
| DELETE      | /api/opinions/:id          | Delete an opinion              | ✅        |

### Get All Opinions

**HTTP Method & URL:** GET /api/opiniones

**Description:** Retrieves all opinions registered in the system.

**Authentication Requirements:** Authentication required (Protected endpoint)

**Request Parameters:** None

**Request Body:** None

**Response Codes:**

- 200 OK: Successfully retrieved opinions (also returned if no opinions found)
- 401 Unauthorized: Authentication required
- 500 Internal Server Error: Server error

**Response Body (Success - 200 OK):**

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
    // Additional opinions
  ]
}
```

**Response Body (No Opinions - 200 OK):**

```json
{
  "message": "No opinions found",
  "data": []
}
```

**Error Responses:**

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

**Example Request:**

```bash
curl -X GET https://itineraria-backend.up.railway.app/api/opiniones \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Opinion by ID

**HTTP Method & URL:** GET /api/opiniones/:id

**Description:** Retrieves detailed information about a specific opinion.

**Authentication Requirements:** Authentication required (Protected endpoint)

**Request Parameters:**

- id (path parameter): Unique identifier of the opinion to retrieve

**Request Body:** None

**Response Codes:**

- 200 OK: Successfully retrieved the opinion
- 401 Unauthorized: Authentication required
- 404 Not Found: Opinion not found
- 500 Internal Server Error: Server error

**Response Body (Success - 200 OK):**

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

**Error Responses:**

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

**Example Request:**

```bash
curl -X GET https://itineraria-backend.up.railway.app/api/opiniones/670bd0cc60eb88e665c9fb90 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Opinions by Activity ID

**HTTP Method & URL:** GET /api/opiniones/activity/:id

**Description:** Retrieves all opinions associated with a specific activity.

**Authentication Requirements:** Authentication required (Protected endpoint)

**Request Parameters:**

- id (path parameter): Unique identifier of the activity whose opinions are being requested

**Request Body:** None

**Response Codes:**

- 200 OK: Successfully retrieved activity's opinions (also returned if no opinions found)
- 401 Unauthorized: Authentication required
- 404 Not Found: Activity not found
- 500 Internal Server Error: Server error

**Response Body (Success - 200 OK):**

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
    // Additional opinions
  ]
}
```

**Response Body (No Opinions - 200 OK):**

```json
{
  "message": "No opinions found",
  "data": []
}
```

**Error Responses:**

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

**Example Request:**

```bash
curl -X GET https://itineraria-backend.up.railway.app/api/opiniones/activity/67178bbf8fec993032a05aa9 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Create Opinion

**HTTP Method & URL:** POST /api/opiniones

**Description:** Creates a new opinion in the system.

**Authentication Requirements:** Authentication required (Protected endpoint)

**Request Parameters:** None

**Request Body:**

```json
{
  "rating": 5,
  "comment": "Excellent place to spend the day",
  "activity": "67178bbf8fec993032a05aa9",
  "user": "669d9a3503f535edd5c7aabe"
}
```

**Validation Notes:**

- rating:
  - Must be a number
  - Required
  - Must be between 1 and 5
- comment:
  - Must be a string
  - Required
  - Must be between 1 and 100 characters
- activity:
  - Must reference a valid activity ID
  - Required
- user:
  - Must reference a valid user ID
  - Required

**Response Codes:**

- 201 Created: Opinion successfully created
- 400 Bad Request: Invalid opinion data
- 401 Unauthorized: Authentication required
- 404 Not Found: Activity or user not found
- 500 Internal Server Error: Server error

**Response Body (Success - 201 Created):**

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

**Error Responses:**

400 Bad Request:

```json
{
  "message": "Invalid opinion data",
  "errors": ["Rating must be a number between 1 and 5"]
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

**Example Request:**

```bash
curl -X POST https://itineraria-backend.up.railway.app/api/opiniones \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "rating": 5,
    "comment": "Excellent place to spend the day",
    "activity": "67178bbf8fec993032a05aa9",
    "user": "669d9a3503f535edd5c7aabe"
  }'
```

### Update Opinion

**HTTP Method & URL:** PUT /api/opiniones/:id

**Description:** Updates all data of an existing opinion.

**Authentication Requirements:** Authentication required (Protected endpoint)

**Request Parameters:**

- id (path parameter): Unique identifier of the opinion to update

**Request Body:**

```json
{
  "rating": 4,
  "comment": "Excellent place to spend the day"
}
```

**Validation Notes:**

- All fields must comply with the model schema validations
- All fields must be included in the request
- The sanitizeOpinionInput middleware cleans the data by removing undefined fields

**Response Codes:**

- 200 OK: Opinion successfully updated
- 400 Bad Request: Invalid opinion data
- 401 Unauthorized: Authentication required
- 404 Not Found: Opinion not found
- 500 Internal Server Error: Server error

**Response Body (Success - 200 OK):**

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

**Error Responses:**

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

**Example Request:**

```bash
curl -X PUT https://itineraria-backend.up.railway.app/api/opiniones/670bd0cc60eb88e665c9fb90 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "rating": 4,
    "comment": "Excellent place to spend the day"
  }'
```

### Update Opinion (Partial)

**HTTP Method & URL:** PATCH /api/opiniones/:id

**Description:** Updates only specific fields of an existing opinion.

**Authentication Requirements:** Authentication required (Protected endpoint)

**Request Parameters:**

- id (path parameter): Unique identifier of the opinion to partially update

**Request Body:**

```json
{
  "rating": 3
}
```

**Validation Notes:**

- Any included field must comply with the model schema validations
- Fields are optional
- The sanitizeOpinionInput middleware cleans the data by removing undefined fields

**Response Codes:**

- 200 OK: Opinion successfully updated
- 400 Bad Request: Invalid opinion data
- 401 Unauthorized: Authentication required
- 404 Not Found: Opinion not found
- 500 Internal Server Error: Server error

**Response Body (Success - 200 OK):**

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

**Error Responses:**

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

**Example Request:**

```bash
curl -X PATCH https://itineraria-backend.up.railway.app/api/opiniones/670bd0cc60eb88e665c9fb90 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "rating": 3
  }'
```

### Delete Opinion

**HTTP Method & URL:** DELETE /api/opiniones/:id

**Description:** Removes a specific opinion from the system.

**Authentication Requirements:** Authentication required (Protected endpoint)

**Request Parameters:**

- id (path parameter): Unique identifier of the opinion to delete

**Request Body:** None

**Response Codes:**

- 200 OK: Opinion successfully deleted
- 401 Unauthorized: Authentication required
- 404 Not Found: Opinion not found
- 500 Internal Server Error: Server error

**Response Body (Success - 200 OK):**

```json
{
  "message": "Opinion deleted"
}
```

**Error Responses:**

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

**Example Request:**

```bash
curl -X DELETE https://itineraria-backend.up.railway.app/api/opiniones/670bd0cc60eb88e665c9fb90 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Itineraries

### Data Model

**Itinerary**

```ts
{
  id: string;                   // Unique identifier
  title: string;                // Title of the itinerary
  description: string;          // Description of the itinerary
  dayStart: Date;               // Start date of the itinerary
  dayEnd: Date;                 // End date of the itinerary
  activities: Activity[];       // Collection of activities in this itinerary
  user: string | User;          // Reference to a User
  participants: Participant[];  // Collection of participants for this itinerary
  place: string | Place;        // Reference to a Place
  createdAt?: Date;             // Creation timestamp
  updatedAt?: Date;             // Last update timestamp
}
```

| HTTP Method | Route                     | Description                      | Protected |
| ----------- | ------------------------- | -------------------------------- | --------- |
| GET         | /api/itineraries          | Get all itineraries              | ✅        |
| GET         | /api/itineraries/:id      | Get a specific itinerary         | ✅        |
| GET         | /api/itineraries/user/:id | Get itineraries by user          | ✅        |
| POST        | /api/itineraries          | Create a new itinerary           | ✅        |
| POST        | /api/itineraries/ia       | Create a new itinerary with AI   | ✅        |
| PUT         | /api/itineraries/:id      | Update an itinerary completely   | ✅        |
| PATCH       | /api/itineraries/:id      | Update specific itinerary fields | ✅        |
| DELETE      | /api/itineraries/:id      | Delete an itinerary              | ✅        |

### Get All Itineraries

**HTTP Method & URL:** GET /api/itineraries

**Description:** Retrieves all itineraries registered in the system.

**Authentication Requirements:** Authentication required (Protected endpoint)

**Request Parameters:** None

**Request Body:** None

**Response Codes:**

- 200 OK: Successfully retrieved itineraries (also returned if no itineraries found)
- 401 Unauthorized: Authentication required
- 500 Internal Server Error: Server error

**Response Body (Success - 200 OK):**

```json
{
  "message": "All itineraries found",
  "data": [
    {
      "id": "670bd0cc60eb88e665c9fb90",
      "title": "Itinerary 1111",
      "description": "Itinerary made for 7 days at Disney...",
      "dayStart": "2024-10-30T00:00:00.000Z",
      "dayEnd": "2024-11-23T00:00:00.000Z",
      "activities": [...],
      "participants": [...],
      "user": {...},
      "place": {...}
    },
    // Additional itineraries
  ]
}
```

**Response Body (No Itineraries - 200 OK):**

```json
{
  "message": "No itineraries found",
  "data": []
}
```

**Error Responses:**

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

**Example Request:**

```bash
curl -X GET https://itineraria-backend.up.railway.app/api/itineraries \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Itinerary by ID

**HTTP Method & URL:** GET /api/itineraries/:id

**Description:** Retrieves detailed information about a specific itinerary.

**Authentication Requirements:** Authentication required (Protected endpoint)

**Request Parameters:**

- id (path parameter): Unique identifier of the itinerary to retrieve

**Request Body:** None

**Response Codes:**

- 200 OK: Successfully retrieved the itinerary
- 401 Unauthorized: Authentication required
- 404 Not Found: Itinerary not found
- 500 Internal Server Error: Server error

**Response Body (Success - 200 OK):**

```json
{
  "message": "Itinerary found",
  "data": {
    "id": "670bd0cc60eb88e665c9fb90",
    "title": "Itinerary 1111",
    "description": "Itinerary made for 7 days at Disney...",
    "dayStart": "2024-10-30T00:00:00.000Z",
    "dayEnd": "2024-11-23T00:00:00.000Z",
    "activities": [...],
    "participants": [...],
    "user": {...},
    "place": {...}
  }
}
```

**Error Responses:**

401 Unauthorized:

```json
{
  "message": "Authentication required"
}
```

404 Not Found:

```json
{
  "message": "Itinerary not found"
}
```

500 Internal Server Error:

```json
{
  "message": "Server error"
}
```

**Example Request:**

```bash
curl -X GET https://itineraria-backend.up.railway.app/api/itineraries/670bd0cc60eb88e665c9fb90 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Itineraries by User

**HTTP Method & URL:** GET /api/itineraries/user/:id

**Description:** Retrieves all itineraries associated with a specific user.

**Authentication Requirements:** Authentication required (Protected endpoint)

**Request Parameters:**

- id (path parameter): Unique identifier of the user whose itineraries are requested

**Request Body:** None

**Response Codes:**

- 200 OK: Successfully retrieved user's itineraries (also returned if no itineraries found)
- 401 Unauthorized: Authentication required
- 404 Not Found: User not found
- 500 Internal Server Error: Server error

**Response Body (Success - 200 OK):**

```json
{
  "message": "User itineraries found",
  "data": [
    {
      "id": "670bd0cc60eb88e665c9fb90",
      "title": "Itinerary 1111",
      "description": "Itinerary made for 7 days at Disney...",
      "dayStart": "2024-10-30T00:00:00.000Z",
      "dayEnd": "2024-11-23T00:00:00.000Z",
      "place": {...}
    },
    // Additional itineraries
  ]
}
```

**Response Body (No Itineraries - 200 OK):**

```json
{
  "message": "No itineraries found for this user",
  "data": []
}
```

**Error Responses:**

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
  "message": "Server error"
}
```

**Example Request:**

```bash
curl -X GET https://itineraria-backend.up.railway.app/api/itineraries/user/6722862eeed0a44e8abde61f \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Create Itinerary

**HTTP Method & URL:** POST /api/itineraries

**Description:** Creates a new itinerary in the system.

**Authentication Requirements:** Authentication required (Protected endpoint)

**Request Parameters:** None

**Request Body:**

```json
{
  "title": "Itinerary 1111",
  "description": "Itinerary made for 7 days at Disney...",
  "dayStart": "2024-10-30",
  "dayEnd": "2024-11-23",
  "user": "6722862eeed0a44e8abde61f",
  "place": "67157b64371c9028019e640c",
  "activities": ["66fd97cb2e28ca23b47f2058", "66fd97cb2e28ca23b47f2058"],
  "participants": []
}
```

**Validation Notes:**

- title:
  - Must be a string
  - Required
  - Minimum 3 characters
  - Maximum 20 characters
- description:
  - Must be a string
  - Minimum 10 characters
  - Maximum 100 characters
- place:
  - Must be a string referencing a valid place ID
  - Required
- user:
  - Must be a string referencing a valid user ID
  - Required
- dayStart:
  - Must be a valid date
  - Required
- dayEnd:
  - Must be a valid date
  - Required
  - Must be after start day
  - Itinerary must last at least 2 days
  - Itinerary must not last more than 31 days

**Response Codes:**

- 201 Created: Itinerary successfully created
- 400 Bad Request: Invalid itinerary data or user does not exist
- 401 Unauthorized: Authentication required
- 500 Internal Server Error: Server error

**Response Body (Success - 201 Created):**

```json
{
  "message": "Itinerary created successfully",
  "data": {
    "id": "670bd0cc60eb88e665c9fb90",
    "title": "Itinerary 1111",
    "description": "Itinerary made for 7 days at Disney...",
    "dayStart": "2024-10-30T00:00:00.000Z",
    "dayEnd": "2024-11-23T00:00:00.000Z",
    "activities": [...],
    "participants": [],
    "user": "6722862eeed0a44e8abde61f",
    "place": "67157b64371c9028019e640c"
  }
}
```

**Error Responses:**

400 Bad Request:

```json
{
  "message": "The entered user does not exist"
}
```

OR

```json
{
  "message": "Invalid itinerary data",
  "errors": ["Title is required", "DayEnd must be after DayStart"]
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
  "message": "Server error"
}
```

**Example Request:**

```bash
curl -X POST https://itineraria-backend.up.railway.app/api/itineraries \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Itinerary 1111",
    "description": "Itinerary made for 7 days at Disney...",
    "dayStart": "2024-10-30",
    "dayEnd": "2024-11-23",
    "user": "6722862eeed0a44e8abde61f",
    "place": "67157b64371c9028019e640c",
    "activities": ["66fd97cb2e28ca23b47f2058", "66fd97cb2e28ca23b47f2058"],
    "participants": []
  }'
```

### Create Itinerary with AI

**HTTP Method & URL:** POST /api/itineraries/ia

**Description:** Creates a new itinerary using artificial intelligence based on preferences and participants.

**Authentication Requirements:** Authentication required (Protected endpoint)

**Request Parameters:** None

**Request Body:**

```json
{
  "title": "DISNEY",
  "description": "Itinerary made for 7 days at Disney...",
  "dayStart": "2024-10-30",
  "dayEnd": "2024-11-23",
  "user": "6722862eeed0a44e8abde61f",
  "place": "67236e6e1706dd5a0709c4df",
  "participants": ["6724d5e367bf8ca176f0b7ca", "6724d5ee67bf8ca176f0b7cb"]
}
```

**Validation Notes:**

- All fields must comply with the model schema validations (same as regular itinerary creation)
- All fields are required
- AI will generate appropriate activities based on the participants and destination

**Response Codes:**

- 201 Created: AI-generated itinerary successfully created
- 400 Bad Request: Invalid input, user does not exist, or place does not exist
- 401 Unauthorized: Authentication required
- 500 Internal Server Error: Server error

**Response Body (Success - 201 Created):**

```json
{
  "message": "AI-generated itinerary created successfully",
  "data": {
    "id": "670bd0cc60eb88e665c9fb90",
    "title": "DISNEY",
    "description": "Itinerary made for 7 days at Disney...",
    "dayStart": "2024-10-30T00:00:00.000Z",
    "dayEnd": "2024-11-23T00:00:00.000Z",
    "activities": [...],
    "participants": ["6724d5e367bf8ca176f0b7ca", "6724d5ee67bf8ca176f0b7cb"],
    "user": "6722862eeed0a44e8abde61f",
    "place": "67236e6e1706dd5a0709c4df"
  }
}
```

**Error Responses:**

400 Bad Request:

```json
{
  "message": "The entered user does not exist"
}
```

OR

```json
{
  "message": "The entered place does not exist"
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
  "message": "Server error"
}
```

**Example Request:**

```bash
curl -X POST https://itineraria-backend.up.railway.app/api/itineraries/ia \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "DISNEY",
    "description": "Itinerary made for 7 days at Disney...",
    "dayStart": "2024-10-30",
    "dayEnd": "2024-11-23",
    "user": "6722862eeed0a44e8abde61f",
    "place": "67236e6e1706dd5a0709c4df",
    "participants": ["6724d5e367bf8ca176f0b7ca", "6724d5ee67bf8ca176f0b7cb"]
  }'
```

### Update Itinerary

**HTTP Method & URL:** PUT /api/itineraries/:id

**Description:** Updates all data of an existing itinerary.

**Authentication Requirements:** Authentication required (Protected endpoint)

**Request Parameters:**

- id (path parameter): Unique identifier of the itinerary to update

**Request Body:**

```json
{
  "title": "Itinerary 2",
  "description": "Itinerary made for 7 days at Disney...",
  "dayStart": "2024-10-30",
  "dayEnd": "2024-11-23",
  "place": {
    "id": "67157b64371c9028019e640c"
  },
  "participants": []
}
```

**Validation Notes:**

- All fields must comply with the model schema validations
- All fields must be included in the request
- The sanitizeItineraryInput middleware cleans the data by removing undefined fields

**Response Codes:**

- 200 OK: Itinerary successfully updated
- 400 Bad Request: Invalid itinerary data
- 401 Unauthorized: Authentication required
- 404 Not Found: Itinerary not found
- 500 Internal Server Error: Server error

**Response Body (Success - 200 OK):**

```json
{
  "message": "Itinerary updated successfully",
  "data": {
    "id": "670bd0cc60eb88e665c9fb90",
    "title": "Itinerary 2",
    "description": "Itinerary made for 7 days at Disney...",
    "dayStart": "2024-10-30T00:00:00.000Z",
    "dayEnd": "2024-11-23T00:00:00.000Z",
    "place": "67157b64371c9028019e640c",
    "participants": []
  }
}
```

**Error Responses:**

400 Bad Request:

```json
{
  "message": "Invalid itinerary data"
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
  "message": "Itinerary not found"
}
```

500 Internal Server Error:

```json
{
  "message": "Server error"
}
```

**Example Request:**

```bash
curl -X PUT https://itineraria-backend.up.railway.app/api/itineraries/670bd0cc60eb88e665c9fb90 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Itinerary 2",
    "description": "Itinerary made for 7 days at Disney...",
    "dayStart": "2024-10-30",
    "dayEnd": "2024-11-23",
    "place": {
      "id": "67157b64371c9028019e640c"
    },
    "participants": []
  }'
```

### Update Itinerary (Partial)

**HTTP Method & URL:** PATCH /api/itineraries/:id

**Description:** Updates only specific fields of an existing itinerary.

**Authentication Requirements:** Authentication required (Protected endpoint)

**Request Parameters:**

- id (path parameter): Unique identifier of the itinerary to partially update

**Request Body:**

```json
{
  "title": "New title"
}
```

**Validation Notes:**

- Any included field must comply with the model schema validations
- Fields are optional
- The sanitizeItineraryInput middleware cleans the data by removing undefined fields

**Response Codes:**

- 200 OK: Itinerary successfully updated
- 400 Bad Request: Invalid itinerary data
- 401 Unauthorized: Authentication required
- 404 Not Found: Itinerary not found
- 500 Internal Server Error: Server error

**Response Body (Success - 200 OK):**

```json
{
  "message": "Itinerary updated successfully",
  "data": {
    "id": "670bd0cc60eb88e665c9fb90",
    "title": "New title",
    "description": "Itinerary made for 7 days at Disney...",
    "dayStart": "2024-10-30T00:00:00.000Z",
    "dayEnd": "2024-11-23T00:00:00.000Z",
    "place": "67157b64371c9028019e640c",
    "participants": []
  }
}
```

**Error Responses:**

400 Bad Request:

```json
{
  "message": "Invalid itinerary data"
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
  "message": "Itinerary not found"
}
```

500 Internal Server Error:

```json
{
  "message": "Server error"
}
```

**Example Request:**

```bash
curl -X PATCH https://itineraria-backend.up.railway.app/api/itineraries/670bd0cc60eb88e665c9fb90 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "New title"
  }'
```

### Delete Itinerary

**HTTP Method & URL:** DELETE /api/itineraries/:id

**Description:** Removes a specific itinerary from the system.

**Authentication Requirements:** Authentication required (Protected endpoint)

**Request Parameters:**

- id (path parameter): Unique identifier of the itinerary to delete

**Request Body:** None

**Response Codes:**

- 200 OK: Itinerary successfully deleted
- 401 Unauthorized: Authentication required
- 404 Not Found: Itinerary not found
- 500 Internal Server Error: Server error

**Response Body (Success - 200 OK):**

```json
{
  "message": "Itinerary deleted",
  "data": {
    "id": "670bd0cc60eb88e665c9fb90",
    "title": "Itinerary 1111",
    "description": "Itinerary made for 7 days at Disney...",
    "dayStart": "2024-10-30T00:00:00.000Z",
    "dayEnd": "2024-11-23T00:00:00.000Z"
  }
}
```

**Error Responses:**

401 Unauthorized:

```json
{
  "message": "Authentication required"
}
```

404 Not Found:

```json
{
  "message": "Itinerary not found"
}
```

500 Internal Server Error:

```json
{
  "message": "Server error"
}
```

**Example Request:**

```bash
curl -X DELETE https://itineraria-backend.up.railway.app/api/itineraries/670bd0cc60eb88e665c9fb90 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### External Services

##### Data Models

ExternalService

```ts
{
  id: string; // Unique identifier
  serviceType: string; // Type of service
  name: string; // Service name (unique)
  description: string; // Service description
  address: string; // Service address
  schedule: string; // Service schedule (optional)
  website: string; // Service website (optional)
  phoneNumber: string; // Service phone number (optional)
  place: string | Place; // Reference to a Place
  status: string; // PENDING, ACTIVE, or CANCELED
  createdAt: Date; // Creation timestamp
  updatedAt: Date; // Last update timestamp
}
```

- Status Values
  - PENDING: Default status for new publicity requests
  - ACTIVE: Status after admin approval or direct creation
  - CANCELED: Service has been canceled

| HTTP Method | Route                                | Description                       | Protected |
| ----------- | ------------------------------------ | --------------------------------- | --------- |
| POST        | /api/publicity                       | Submit a publicity request        | ❌        |
| GET         | /api/publicity/places                | Get all external services         | ❌        |
| GET         | /api/externalServices                | Get all external services         | ✅        |
| GET         | /api/externalServices/               | Get an external service by ID     | ✅        |
| GET         | /api/externalServices/findByPlace/   | Get external services by place ID | ✅        |
| POST        | /api/externalServices                | Create a new external service     | ✅        |
| POST        | /api/externalServices/acceptRequest/ | Accept a publicity request        | ✅        |
| PUT         | /api/externalServices/               | Update an external service        | ✅        |
| PATCH       | /api/externalServices/               | Partially update external service | ✅        |
| DELETE      | /api/externalServices/               | Delete an external service        | ✅        |

### Submit Publicity Request

**HTTP Method & URL:** POST /api/publicity

**Description:** Creates a new publicity request with PENDING status for approval by administrators.

**Authentication Requirements:** No authentication required (Public endpoint)

**Request Parameters:** None

**Request Body:**

```json
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

**Validation Notes:**

- serviceType:
  - Must be a string
  - Required
  - Minimum 3 characters
- name:
  - Must be a string
  - Required
  - Minimum 3 characters
- description:
  - Must be a string
  - Required
  - Minimum 3 characters
- adress:
  - Must be a string
  - Required
  - Minimum 3 characters
- schedule:
  - Must be a string
  - Required
  - Minimum 3 characters
- website (optional):
  - Must match format: www.example.com
- phoneNumber (optional):
  - Must be 10 digits
- place:
  - Must be a registered place ID

**Response Codes:**

- 201 Created: Request successfully submitted
- 404 Not Found: Place not found
- 409 Conflict: External service already exists
- 500 Internal Server Error: Server error

**Response Body (Success - 201 Created):**

```json
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

**Error Responses:**

404 Not Found:

```json
{
  "message": "The place does not exist"
}
```

409 Conflict:

```json
{
  "message": "The external service already exists"
}
```

500 Internal Server Error:

```json
{
  "message": "Server error"
}
```

**Example Request:**

```bash
curl -X POST https://api.itineraria.com/api/publicity \
  -H "Content-Type: application/json" \
  -d '{
    "serviceType": "Restaurant",
    "name": "Bella Italia",
    "description": "Authentic Italian cuisine in a family-friendly environment",
    "adress": "123 Main St, Cityville",
    "schedule": "Mon-Sun: 11:00-22:00",
    "website": "www.bellaitalia.com",
    "phoneNumber": "1234567890",
    "place": "67157b64371c9028019e640c"
  }'
```

### Get Public External Services

**HTTP Method & URL:** GET /api/publicity/places

**Description:** Retrieves all public external services.

**Authentication Requirements:** No authentication required (Public endpoint)

**Request Parameters:** None

**Request Body:** None

**Response Codes:**

- 200 OK: Successfully retrieved external services (also returned if no services found)
- 500 Internal Server Error: Server error

**Response Body (Success - 200 OK):**

```json
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
        "name": "string"
        // other place properties
      },
      "status": "string",
      "createdAt": "timestamp",
      "updatedAt": "timestamp"
    }
  ]
}
```

**Response Body (No Services - 200 OK):**

```json
{
  "message": "External services not found"
}
```

**Error Responses:**

500 Internal Server Error:

```json
{
  "message": "Server error"
}
```

**Example Request:**

```bash
curl -X GET https://api.itineraria.com/api/publicity/places
```

### Get All External Services (Admin)

**HTTP Method & URL:** GET /api/externalServices

**Description:** Retrieves all external services, including those with PENDING status.

**Authentication Requirements:** Authentication required (Protected endpoint)

**Request Parameters:** None

**Request Body:** None

**Response Codes:**

- 200 OK: Successfully retrieved external services (also returned if no services found)
- 401 Unauthorized: Authentication required
- 500 Internal Server Error: Server error

**Response Body (Success - 200 OK):**

```json
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
        "name": "string"
        // other place properties
      },
      "status": "string",
      "createdAt": "timestamp",
      "updatedAt": "timestamp"
    }
  ]
}
```

**Response Body (No Services - 200 OK):**

```json
{
  "message": "External services not found"
}
```

**Error Responses:**

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

**Example Request:**

```bash
curl -X GET https://api.itineraria.com/api/externalServices \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get External Service by ID

**HTTP Method & URL:** GET /api/externalServices/:id

**Description:** Retrieves detailed information about a specific external service.

**Authentication Requirements:** Authentication required (Protected endpoint)

**Request Parameters:**

- id (path parameter): Unique identifier of the external service to retrieve

**Request Body:** None

**Response Codes:**

- 200 OK: Successfully retrieved the external service
- 401 Unauthorized: Authentication required
- 404 Not Found: External service not found
- 500 Internal Server Error: Server error

**Response Body (Success - 200 OK):**

```json
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
      "name": "string"
      // other place properties
    },
    "status": "string",
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  }
}
```

**Error Responses:**

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

**Example Request:**

```bash
curl -X GET https://api.itineraria.com/api/externalServices/670bd0cc60eb88e665c9fb90 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get External Services by Place ID

**HTTP Method & URL:** GET /api/externalServices/findByPlace/:id

**Description:** Retrieves all external services associated with a specific place.

**Authentication Requirements:** Authentication required (Protected endpoint)

**Request Parameters:**

- id (path parameter): Unique identifier of the place whose services are requested

**Request Body:** None

**Response Codes:**

- 200 OK: Successfully retrieved place's external services (also returned if no services found)
- 401 Unauthorized: Authentication required
- 404 Not Found: Place not found
- 500 Internal Server Error: Server error

**Response Body (Success - 200 OK):**

```json
{
  "message": "External services found",
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
        "name": "string"
        // other place properties
      },
      "status": "string",
      "createdAt": "timestamp",
      "updatedAt": "timestamp"
    }
  ]
}
```

**Response Body (No Services - 200 OK):**

```json
{
  "message": "External services not found for that place"
}
```

**Error Responses:**

401 Unauthorized:

```json
{
  "message": "Authentication required"
}
```

404 Not Found:

```json
{
  "message": "A place with that id was not found"
}
```

500 Internal Server Error:

```json
{
  "message": "Server error"
}
```

**Example Request:**

```bash
curl -X GET https://api.itineraria.com/api/externalServices/findByPlace/67157b64371c9028019e640c \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Create External Service

**HTTP Method & URL:** POST /api/externalServices

**Description:** Creates a new external service with ACTIVE status.

**Authentication Requirements:** Authentication required (Protected endpoint)

**Request Parameters:** None

**Request Body:**

```json
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

**Validation Notes:**

- All fields must comply with the model schema validations
- website and phoneNumber are optional

**Response Codes:**

- 201 Created: External service successfully created
- 401 Unauthorized: Authentication required
- 404 Not Found: Place not found
- 409 Conflict: External service already exists
- 500 Internal Server Error: Server error

**Response Body (Success - 201 Created):**

```json
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

**Error Responses:**

401 Unauthorized:

```json
{
  "message": "Authentication required"
}
```

404 Not Found:

```json
{
  "message": "The place does not exist"
}
```

409 Conflict:

```json
{
  "message": "The external service already exists"
}
```

500 Internal Server Error:

```json
{
  "message": "Server error"
}
```

**Example Request:**

```bash
curl -X POST https://api.itineraria.com/api/externalServices \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "serviceType": "Restaurant",
    "name": "Bella Italia",
    "description": "Authentic Italian cuisine in a family-friendly environment",
    "adress": "123 Main St, Cityville",
    "schedule": "Mon-Sun: 11:00-22:00",
    "website": "www.bellaitalia.com",
    "phoneNumber": "1234567890",
    "place": "67157b64371c9028019e640c"
  }'
```

### Accept Publicity Request

**HTTP Method & URL:** POST /api/externalServices/acceptRequest/:id

**Description:** Changes the status of a pending publicity request to ACTIVE.

**Authentication Requirements:** Authentication required (Protected endpoint)

**Request Parameters:**

- id (path parameter): Unique identifier of the external service request to approve

**Request Body:** None

**Response Codes:**

- 200 OK: Request successfully accepted
- 401 Unauthorized: Authentication required
- 404 Not Found: Request not found
- 500 Internal Server Error: Server error

**Response Body (Success - 200 OK):**

```json
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

**Error Responses:**

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

**Example Request:**

```bash
curl -X POST https://api.itineraria.com/api/externalServices/acceptRequest/670bd0cc60eb88e665c9fb90 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Update External Service

**HTTP Method & URL:** PUT /api/externalServices/:id

**Description:** Updates all data of an existing external service.

**Authentication Requirements:** Authentication required (Protected endpoint)

**Request Parameters:**

- id (path parameter): Unique identifier of the external service to update

**Request Body:**

```json
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

**Validation Notes:**

- All fields must comply with the model schema validations
- All fields must be included
- The sanitizeExternalServiceInput middleware cleans the data by removing undefined fields

**Response Codes:**

- 200 OK: External service successfully updated
- 401 Unauthorized: Authentication required
- 404 Not Found: External service not found
- 409 Conflict: Service with that name already exists
- 500 Internal Server Error: Server error

**Response Body (Success - 200 OK):**

```json
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

**Error Responses:**

401 Unauthorized:

```json
{
  "message": "Authentication required"
}
```

409 Conflict:

```json
{
  "message": "There is already a service with that name"
}
```

500 Internal Server Error:

```json
{
  "message": "Server error"
}
```

**Example Request:**

```bash
curl -X PUT https://api.itineraria.com/api/externalServices/670bd0cc60eb88e665c9fb90 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "serviceType": "Restaurant",
    "name": "Bella Italia Updated",
    "description": "Updated description for Italian restaurant",
    "adress": "456 New St, Cityville",
    "schedule": "Mon-Sun: 12:00-23:00",
    "website": "www.bellaitalia-updated.com",
    "phoneNumber": "9876543210",
    "place": "67157b64371c9028019e640c"
  }'
```

### Update External Service (Partial)

**HTTP Method & URL:** PATCH /api/externalServices/:id

**Description:** Updates only specific fields of an existing external service.

**Authentication Requirements:** Authentication required (Protected endpoint)

**Request Parameters:**

- id (path parameter): Unique identifier of the external service to partially update

**Request Body:**

```json
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

**Validation Notes:**

- Any included field must comply with the model schema validations
- All fields are optional
- The sanitizeExternalServiceInput middleware cleans the data by removing undefined fields

**Response Codes:**

- 200 OK: External service successfully updated
- 401 Unauthorized: Authentication required
- 404 Not Found: External service not found
- 409 Conflict: Service with that name already exists
- 500 Internal Server Error: Server error

**Response Body (Success - 200 OK):**

```json
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

**Error Responses:**

401 Unauthorized:

```json
{
  "message": "Authentication required"
}
```

409 Conflict:

```json
{
  "message": "There is already a service with that name"
}
```

500 Internal Server Error:

```json
{
  "message": "Server error"
}
```

**Example Request:**

```bash
curl -X PATCH https://api.itineraria.com/api/externalServices/670bd0cc60eb88e665c9fb90 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "description": "Updated description only",
    "schedule": "Mon-Fri: 9:00-18:00"
  }'
```

### Delete External Service

**HTTP Method & URL:** DELETE /api/externalServices/:id

**Description:** Removes a specific external service from the system.

**Authentication Requirements:** Authentication required (Protected endpoint)

**Request Parameters:**

- id (path parameter): Unique identifier of the external service to delete

**Request Body:** None

**Response Codes:**

- 200 OK: External service successfully deleted
- 401 Unauthorized: Authentication required
- 404 Not Found: External service not found
- 500 Internal Server Error: Server error

**Response Body (Success - 200 OK):**

```json
{
  "message": "External service deleted"
}
```

**Error Responses:**

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

**Example Request:**

```bash
curl -X DELETE https://api.itineraria.com/api/externalServices/670bd0cc60eb88e665c9fb90 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Activities

##### Data Model

Activity

```ts
{
  id: string;               // Unique identifier
  name: string;             // Activity name
  description: string;      // Activity description
  outdoor: boolean;         // Indicates if the activity is outdoors
  transport?: boolean;      // Indicates if transportation is needed (optional)
  scheduleStart: string;    // Start time (format HH:MM)
  scheduleEnd: string;      // End time (format HH:MM)
  place: Place;             // Reference to the location where it takes place
  itinerary: Itinerary;     // Reference to the associated itinerary
  opinions: Opinion[];      // Collection of opinions about the activity
}
```

### Activities

##### Data Model

Activity

```ts
{
  id: string;               // Unique identifier
  name: string;             // Activity name
  description: string;      // Activity description
  outdoor: boolean;         // Indicates if the activity is outdoors
  transport?: boolean;      // Indicates if transportation is needed (optional)
  scheduleStart: string;    // Start time (format HH:MM)
  scheduleEnd: string;      // End time (format HH:MM)
  place: Place;             // Reference to the location where it takes place
  itinerary: Itinerary;     // Reference to the associated itinerary
  opinions: Opinion[];      // Collection of opinions about the activity
}
```

Activity

### Data Model

**Activity**

```ts
{
  id: string;                // Unique identifier
  name: string;              // Activity name
  description: string;       // Activity description
  outdoor: boolean;          // Whether the activity is outdoors
  transport?: boolean;       // Whether transport is needed (optional)
  scheduleStart: string;     // Start time in HH format
  scheduleEnd: string;       // End time in HH format
  place: string | Place;     // Reference to a Place
  itinerary: string | Itinerary; // Reference to an Itinerary
  opinions: Opinion[];       // Collection of related opinions
  createdAt?: Date;          // Creation timestamp
  updatedAt?: Date;          // Last update timestamp
}
```

| HTTP Method | Route               | Description                     | Protected |
| ----------- | ------------------- | ------------------------------- | --------- |
| GET         | /api/activities     | Get all activities              | ✅        |
| GET         | /api/activities/:id | Get a specific activity         | ✅        |
| POST        | /api/activities     | Create a new activity           | ✅        |
| PUT         | /api/activities/:id | Update an activity completely   | ✅        |
| PATCH       | /api/activities/:id | Update specific activity fields | ✅        |
| DELETE      | /api/activities/:id | Delete an activity              | ✅        |

### Get All Activities

**HTTP Method & URL:** GET /api/activities

**Description:** Retrieves all activities registered in the system.

**Authentication Requirements:** Authentication required (Protected endpoint)

**Request Parameters:** None

**Request Body:** None

**Response Codes:**

- 200 OK: Successfully retrieved activities (also returned if no activities found)
- 401 Unauthorized: Authentication required
- 500 Internal Server Error: Server error

**Response Body (Success - 200 OK):**

```json
{
  "message": "All activities found",
  "data": [
    {
      "id": "60d21b4667d0d8992e610c85",
      "name": "Beach Trip",
      "description": "Day at the beach with surfing lessons",
      "outdoor": true,
      "transport": true,
      "scheduleStart": "09",
      "scheduleEnd": "17",
      "place": {...},
      "itinerary": {...},
      "opinions": [...]
    },
    // Additional activities
  ]
}
```

**Response Body (No Activities - 200 OK):**

```json
{
  "message": "No activities found",
  "data": []
}
```

**Error Responses:**

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

**Example Request:**

```bash
curl -X GET https://itineraria-backend.up.railway.app/api/activities \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Activity by ID

**HTTP Method & URL:** GET /api/activities/:id

**Description:** Retrieves detailed information about a specific activity.

**Authentication Requirements:** Authentication required (Protected endpoint)

**Request Parameters:**

- id (path parameter): Unique identifier of the activity to retrieve

**Request Body:** None

**Response Codes:**

- 200 OK: Successfully retrieved the activity
- 401 Unauthorized: Authentication required
- 404 Not Found: Activity not found
- 500 Internal Server Error: Server error

**Response Body (Success - 200 OK):**

```json
{
  "message": "Activity found",
  "data": {
    "id": "60d21b4667d0d8992e610c85",
    "name": "Beach Trip",
    "description": "Day at the beach with surfing lessons",
    "outdoor": true,
    "transport": true,
    "scheduleStart": "09",
    "scheduleEnd": "17",
    "place": {...},
    "itinerary": {...},
    "opinions": [...],
    "createdAt": "2023-04-15T10:30:00.000Z",
    "updatedAt": "2023-04-15T10:30:00.000Z"
  }
}
```

**Error Responses:**

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

**Example Request:**

```bash
curl -X GET https://itineraria-backend.up.railway.app/api/activities/60d21b4667d0d8992e610c85 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Create Activity

**HTTP Method & URL:** POST /api/activities

**Description:** Creates a new activity in the system.

**Authentication Requirements:** Authentication required (Protected endpoint)

**Request Parameters:** None

**Request Body:**

```json
{
  "name": "Beach Trip",
  "description": "Day at the beach with surfing lessons",
  "outdoor": true,
  "transport": true,
  "scheduleStart": "09",
  "scheduleEnd": "17",
  "place": {
    "id": "60d21b4667d0d8992e610c87"
  },
  "itinerary": {
    "id": "60d21b4667d0d8992e610c86"
  }
}
```

**Validation Notes:**

- name:
  - Must be a string
  - Required
  - Minimum 3 characters
  - Maximum 20 characters
- description:
  - Must be a string
  - Required
  - Minimum 3 characters
  - Maximum 100 characters
- outdoor:
  - Must be a boolean
  - Required
- transport:
  - Must be a boolean
  - Optional
- scheduleStart:
  - Must be a string
  - Required
  - Must be in HH format
- scheduleEnd:
  - Must be a string
  - Required
  - Must be in HH format
- place:
  - Must reference a valid place ID
  - Required
- itinerary:
  - Must reference a valid itinerary ID
  - Required
- Additional validation:
  - The activity must start before it ends (scheduleStart must be before scheduleEnd)

**Response Codes:**

- 201 Created: Activity successfully created
- 400 Bad Request: Invalid activity data, itinerary not found, or activity already exists
- 401 Unauthorized: Authentication required
- 500 Internal Server Error: Server error

**Response Body (Success - 201 Created):**

```json
{
  "message": "Activity created",
  "data": {
    "id": "60d21b4667d0d8992e610c85",
    "name": "Beach Trip",
    "description": "Day at the beach with surfing lessons",
    "outdoor": true,
    "transport": true,
    "scheduleStart": "09",
    "scheduleEnd": "17",
    "place": "60d21b4667d0d8992e610c87",
    "itinerary": {
      "id": "60d21b4667d0d8992e610c86"
      // other itinerary data
    },
    "createdAt": "2023-04-15T10:30:00.000Z",
    "updatedAt": "2023-04-15T10:30:00.000Z"
  }
}
```

**Error Responses:**

400 Bad Request:

```json
{
  "message": ["Itinerary not found"]
}
```

OR

```json
{
  "message": ["Activity already exists"]
}
```

OR

```json
{
  "message": ["Invalid activity data"]
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
  "message": "Server error"
}
```

**Example Request:**

```bash
curl -X POST https://itineraria-backend.up.railway.app/api/activities \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Beach Trip",
    "description": "Day at the beach with surfing lessons",
    "outdoor": true,
    "transport": true,
    "scheduleStart": "09",
    "scheduleEnd": "17",
    "place": {
      "id": "60d21b4667d0d8992e610c87"
    },
    "itinerary": {
      "id": "60d21b4667d0d8992e610c86"
    }
  }'
```

### Update Activity

**HTTP Method & URL:** PUT /api/activities/:id

**Description:** Updates all data of an existing activity.

**Authentication Requirements:** Authentication required (Protected endpoint)

**Request Parameters:**

- id (path parameter): Unique identifier of the activity to update

**Request Body:**

```json
{
  "name": "Museum Tour",
  "description": "Guided tour through the city museum",
  "outdoor": false,
  "transport": true,
  "scheduleStart": "10",
  "scheduleEnd": "13",
  "place": {
    "id": "60d21b4667d0d8992e610c87"
  },
  "itinerary": {
    "id": "60d21b4667d0d8992e610c86"
  }
}
```

**Validation Notes:**

- All fields must meet the validations of the model schema
- All fields must be included in the request

**Response Codes:**

- 200 OK: Activity successfully updated
- 400 Bad Request: Invalid activity data or activity already exists with provided data
- 401 Unauthorized: Authentication required
- 404 Not Found: Activity not found
- 500 Internal Server Error: Server error

**Response Body (Success - 200 OK):**

```json
{
  "message": "Activity updated",
  "data": {
    "id": "60d21b4667d0d8992e610c85",
    "name": "Museum Tour",
    "description": "Guided tour through the city museum",
    "outdoor": false,
    "transport": true,
    "scheduleStart": "10",
    "scheduleEnd": "13",
    "place": "60d21b4667d0d8992e610c87",
    "itinerary": "60d21b4667d0d8992e610c86",
    "createdAt": "2023-04-15T10:30:00.000Z",
    "updatedAt": "2023-04-15T11:45:00.000Z"
  },
  "itinerary": {
    "id": "60d21b4667d0d8992e610c86"
    // other itinerary data
  }
}
```

**Error Responses:**

400 Bad Request:

```json
{
  "message": ["Activity already exists"]
}
```

OR

```json
{
  "message": ["Invalid activity data"]
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

500 Internal Server Error:

```json
{
  "message": "Server error"
}
```

**Example Request:**

```bash
curl -X PUT https://itineraria-backend.up.railway.app/api/activities/60d21b4667d0d8992e610c85 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Museum Tour",
    "description": "Guided tour through the city museum",
    "outdoor": false,
    "transport": true,
    "scheduleStart": "10",
    "scheduleEnd": "13",
    "place": {
      "id": "60d21b4667d0d8992e610c87"
    },
    "itinerary": {
      "id": "60d21b4667d0d8992e610c86"
    }
  }'
```

### Update Activity (Partial)

**HTTP Method & URL:** PATCH /api/activities/:id

**Description:** Updates only specific fields of an existing activity.

**Authentication Requirements:** Authentication required (Protected endpoint)

**Request Parameters:**

- id (path parameter): Unique identifier of the activity to partially update

**Request Body:**

```json
{
  "name": "Updated Activity Name",
  "transport": false
}
```

**Validation Notes:**

- Any included field must meet the validations of the model schema
- Fields are optional for a partial update

**Response Codes:**

- 200 OK: Activity successfully updated
- 400 Bad Request: Invalid activity data or activity already exists with provided data
- 401 Unauthorized: Authentication required
- 404 Not Found: Activity not found
- 500 Internal Server Error: Server error

**Response Body (Success - 200 OK):**

```json
{
  "message": "Activity updated",
  "data": {
    "id": "60d21b4667d0d8992e610c85",
    "name": "Updated Activity Name",
    "description": "Guided tour through the city museum",
    "outdoor": false,
    "transport": false,
    "scheduleStart": "10",
    "scheduleEnd": "13",
    "place": "60d21b4667d0d8992e610c87",
    "itinerary": "60d21b4667d0d8992e610c86",
    "createdAt": "2023-04-15T10:30:00.000Z",
    "updatedAt": "2023-04-15T12:15:00.000Z"
  },
  "itinerary": {
    "id": "60d21b4667d0d8992e610c86"
    // other itinerary data
  }
}
```

**Error Responses:**

400 Bad Request:

```json
{
  "message": ["Activity already exists"]
}
```

OR

```json
{
  "message": ["Invalid activity data"]
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

500 Internal Server Error:

```json
{
  "message": "Server error"
}
```

**Example Request:**

```bash
curl -X PATCH https://itineraria-backend.up.railway.app/api/activities/60d21b4667d0d8992e610c85 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Updated Activity Name",
    "transport": false
  }'
```

### Delete Activity

**HTTP Method & URL:** DELETE /api/activities/:id

**Description:** Removes a specific activity from the system.

**Authentication Requirements:** Authentication required (Protected endpoint)

**Request Parameters:**

- id (path parameter): Unique identifier of the activity to delete

**Request Body:** None

**Response Codes:**

- 200 OK: Activity successfully deleted
- 401 Unauthorized: Authentication required
- 404 Not Found: Activity not found
- 500 Internal Server Error: Server error

**Response Body (Success - 200 OK):**

```json
{
  "message": "Activity deleted",
  "data": {
    "id": "60d21b4667d0d8992e610c85",
    "name": "Updated Activity Name",
    "description": "Guided tour through the city museum",
    "outdoor": false,
    "transport": false,
    "scheduleStart": "10",
    "scheduleEnd": "13",
    "place": "60d21b4667d0d8992e610c87",
    "itinerary": "60d21b4667d0d8992e610c86",
    "createdAt": "2023-04-15T10:30:00.000Z",
    "updatedAt": "2023-04-15T12:15:00.000Z"
  }
}
```

**Error Responses:**

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

**Example Request:**

```bash
curl -X DELETE https://itineraria-backend.up.railway.app/api/activities/60d21b4667d0d8992e610c85 \
  -H "Authorization: Bearer YOUR_TOKEN"
```
