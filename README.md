# itinerarIA-Backend

## Project Overview

itinerarIA is a RESTful API designed to facilitate the creation and management of personalized travel itineraries.  
The application allows users to register, generate itineraries using AI, add and manage participants, specify preferences, and associate activities for specific locations.
Additionally, users can promote external services, submit reviews and opinions on activities, mark participants as favorites, and include them in itineraries.  
The system features robust authentication and authorization mechanisms, as well as comprehensive data validation to ensure consistency and security across all operations.


## Backend Base URL

## [itinerarIA](https://itineraria-backend.up.railway.app/)

## Technology Stack

- Backend Framework: Node.js with Express
- Database: MongoDB with MikroORM as the ODM (Object Document Mapper)
- Authentication: JWT (JSON Web Tokens)
- Validation: Zod schema validation
- Testing: Vitest and Supertest
- Containerization: Docker

## Prerequisites
List of necessary dependencies and versions to run the project:
- [Docker](https://docs.docker.com/desktop/)

## Installation
Instructions to clone the repository:

```bash
git clone https://github.com/TomasSanchezMachado/itinerarIA-Backend.git
cd itinerarIA-Backend
```

You must create a .env file with:

- The JWT secret key JWT_SECRET
- The MongoDB username MONGO_INITDB_ROOT_USERNAME
- The MongoDB password MONGO_INITDB_ROOT_PASSWORD
- The Gemini API Key GEMINI_API_KEY (you can obtain this key at https://aistudio.google.com/apikey)
- MONGO_URI=your_mongodb_LOCAL_connection_string

*NOTE:* The variable MONGO_URI must contain the connection string to your LOCAL database.
  
Example:
```bash
# .env file
JWT_SECRET=secret
MONGO_INITDB_ROOT_USERNAME=root
MONGO_INITDB_ROOT_PASSWORD=example
GEMINI_API_KEY=example123
MONGO_URI=mongodb://localhost:27017/
```

## Running the Application

To start the application for the first time, run the following command:
```bash
docker compose up --build
```
This will install the necessary dependencies to run the application and connect to the database.

### Development Mode
After the initial setup, if you want to run the server manually without Docker, you can use:
```bash
npm run start:dev
```
*NOTE:* The local server is setted up to run with the database related to the variable MONGO_URI

### Production Mode

The server is continuously running in production (hosted on Railway).
There is no need to manually start it from the terminal. It is already configured to connect to the cloud database.

### Test Environment

To run End-to-End (E2E) tests:

```bash
npm run test:e2e
```

To run unit tests:

```bash
npm run test:vitest
```

To verify that the application is running correctly, you should see the following message in the console:

```bash
itinerarIA-app    | Server is running on http://localhost:3000/
```

## Link to the Frontend of the application
[itinerarIA-Frontend](https://github.com/facundososab/itinerarIA-Frontend.git)
