# itinerarIA-Backend

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
  
Example:
```bash
# .env file
JWT_SECRET=secret
MONGO_INITDB_ROOT_USERNAME=root
MONGO_INITDB_ROOT_PASSWORD=example
GEMINI_API_KEY=example123
```

## Usage
Run the command `docker compose up --build`. This will install the necessary dependencies to run the application and connect to the database.

To verify that the application is running correctly, you should see the following message in the console:

```bash
itinerarIA-app    | Server is running on http://localhost:3000/
```

## Link to the Frontend of the application
[itinerarIA-Frontend](https://github.com/facundososab/itinerarIA-Frontend.git)
