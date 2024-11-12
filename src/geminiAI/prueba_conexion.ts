import * as dotenv from 'dotenv';
import { Itinerary } from '../itinerary/itinerary.entity.js';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

import { GoogleGenerativeAI } from '@google/generative-ai';
import { Preference } from '../preference/preference.entity.js';

const genAI = new GoogleGenerativeAI(apiKey || 'undefined');

const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
  generationConfig: { responseMimeType: 'application/json' },
});

export async function generateText(dayStart: Date, dayEnd: Date, place: string, title: string, participantsAge: number[], preferences: Preference[],description: string) {
  const prompt =
  `Give me an itinerary for this days: ${dayStart} ${dayEnd} in ${place} with this title ${title} ,with this JSON schema,and make the activities place to be in ${place} and make it an object like this one ${Itinerary}: 
    { "type":"object", "properties": { "title": {"type":"string"}, "description": {"type":"string"}, "dayStart":{"type":"date"},"dayEnd":{"type":"date"}, "activities": {"type":"array", "items": { "type":"object", "properties": { "name": {"type":"string"}, "description": {"type":"string"} "transport": {"type":"boolean"},"outdoor": {"type":"boolean"},"scheduleStart":{"type":"string"},"scheduleEnd":{"type":"string"}} 
    "place": 
    {"type":"object", "properties":{"name": "string","latitude": "number","longitude": "number","zipCode": "string"NOTNULL,
    "province":"string"NOTNULL,"country": "string"}}
    take into account that the participants are ${participantsAge} years old,
    and have this preferences:${preferences} and the itinerary has this description:${description}(create a new one, use this one for creating the activities only)
    If the participants age or preferences or the description are null, you can ignore them,if not, take them into account for the activities.
    All the fields are REQUIRED, THEY CAN'T BE NULL.
    Example: { 
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
              "transport": true
              "scheduleStart":"08:00"
              "scheduleEnd":"20:00" }`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const itinerary = response.text();
  console.log(itinerary);
  return itinerary;
}

// generateText();
