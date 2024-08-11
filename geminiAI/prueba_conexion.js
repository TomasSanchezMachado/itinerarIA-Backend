import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
console.log(apiKey);

import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
  generationConfig: { responseMimeType: 'application/json' },
});

async function generateText() {
  const prompt = `Dame un itinerario de 20 dias en Europa usando este JSON schema: { "type":"object", "properties": { "titulo": {"type":"string"}, "descripcion": {"type":"string"}, "cantDias": {"type":"number"}, "actividades": {"type":"array", "items": { "type":"object", "properties": { "nombre": {"type":"string"}, "descripcion": {"type":"string"}, "lugar": {"type":"object", "properties":{"nombre": "string",
    "ubicacion":{"type":"object", "properties": {
        "latitud": number,
        "longitud": number
}},
    "codigoPostal": "string",
    "provincia": "string",
    "pais": "string"}}, } } }, "transporte": {"type":"string"} } } Example: { "titulo": "Disney World",
  "descripcion": "Disney World is a magical place",
    "cantDias": 3,
      "actividades": [ { "nombre": "Magic Kingdom",
        "descripcion": "Magic Kingdom is a magical place",
          "lugar": { "nombre": "Magic Kingdom",
            "ubicacion": { "latitud": 28.4187,
              "longitud": -81.5812 },
            "codigoPostal": "32830",
            "provincia": "Florida",
            "pais": "USA" } } ],

  "transporte": "Car" }`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  console.log(text);
}

generateText();
