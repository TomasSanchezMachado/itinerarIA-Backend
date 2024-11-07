# itinerarIA-Backend
Requisitos previos
Lista de dependencias y versiones necesarias para ejecutar el proyecto:

Node.js (versión 21.7.1 o superior)
npm
mongoDB

Instalación
Instrucciones para clonar el repositorio e instalar dependencias:

git clone https://github.com/tuusuario/nombre-proyecto.git
cd nombre-proyecto
npm install

Debe crear un archivo .env donde se va a colocar la API_KEY de Gemini AI(esta misma se debe obtener en https://aistudio.google.com/apikey), de la siguiente manera:

GEMINI_API_KEY = apiKey
Dentro del archivo .env tambien se debe colocar el JWT_SECRET, el cual debe ser una clave secreta que usara JWT para validar el usuario.



Uso
Cómo ejecutar la aplicación en un entorno de desarrollo:

npm run start:dev
Esto abrirá la aplicación en http://localhost:3000

Para que la aplicación funcione correctamente, debe haber un servidor de mongoDB en la url mongodb://localhost:27017 el cual debe estar funcionando
