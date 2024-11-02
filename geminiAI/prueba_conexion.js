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
  const prompt = `Give me an itinerary for 20 days in Europe with this JSON schema,and make the activities to be only in ONE PLACE: { "type":"object", "properties": { "title": {"type":"string"}, "description": {"type":"string"}, "duration": {"type":"number"}, "activities": {"type":"array", "items": { "type":"object", "properties": { "name": {"type":"string"}, "description": {"type":"string"} "transport": {"type":"boolean"},"outdoor": {"type":"boolean"}} 
  "place": {"type":"object", "properties":{
        "name": "string",
        "latitude": "number",
        "longitude": "number",
        "zipCode": "string"NOTNULL,
        "province": "string"NOTNULL,
        "country": "string"}}, } } }, 
        
        } } Example: { 
    "title": "Disney Trip",
  "descripcion": "Disney World is a magical place",
    "duration": 21,
      "activities": [ { "name": "Magic Kingdom",
        "descripcion": "Magic Kingdom is a magical place",
          "place": { "name": "Magic Kingdom",
            "latitude": 28.4187,
              "longitude": -81.5812 ,
            "zipCode": "32830",
            "province": "Florida",
            "country": "USA" } } ],
            "transport": true }`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  console.log(text);
}

generateText();
