const { GoogleGenAI } = require("@google/genai");
const path = require('path');

const dotenv = require('dotenv').config({path: '/home/saidarshan74/Desktop/Tripmate/.env'})







const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });


function formatDate(date, offsetDays) {
  const options = { weekday: 'short', day: 'numeric', month: 'short' };
  const currentDate = new Date(date);
  currentDate.setDate(currentDate.getDate() + offsetDays);
  return currentDate.toLocaleDateString('en-US', options);
}

async function generateItinerary({ places, days, startDate }) {
  let dayDescriptions = "";

  for (let i = 0; i < days; i++) {
    const dateFormatted = formatDate(startDate, i);
    dayDescriptions += `\nDay ${i + 1} - ${dateFormatted}\n`;
    dayDescriptions += `Suggest places to visit from the given list.\n\n`;
  }

  const prompt = `
Create a JSON itinerary for a ${days}-day trip starting on ${formatDate(startDate, 0)}.

Places to include:
${places.map((place, index) => `
${index + 1}. Name: ${place.name}
   Description: ${place.description}
   Location: ${place.location}
   Image URL: ${place.image}
`).join('')}

Itinerary format should be:
[
  {
    "day": 1,
    "date": "Fri, 18 Apr",
    "activities": [
      {
        "title": "Place name",
        "description": "Short description",
        "duration": "e.g. 120 min",
        "location": "City name",
        "image": "image url"
      }
    ]
  }
]
`;

  let response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: prompt,
  });

  response = await response.text.replace(/^```(?:json)?\s*/i, "").replace(/```$/, "").trim();
  let data = await response
  return data;
  
}


const places = [
  {
    name: "Siddheshwar Temple",
    image: "https://upload.wikimedia.org/wikipedia/commons/7/75/Siddheshwar_temple_Solapur_ceiling.jpg",
    description: "A revered Hindu temple dedicated to Lord Shiva, known for its intricate carvings and peaceful atmosphere.",
    location: "Solapur"
  },
  {
    name: "Global Vipassana Pagoda",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Global_Vipassana_Pagoda_Mumbai.jpg/800px-Global_Vipassana_Pagoda_Mumbai.jpg",
    description: "A serene Buddhist meditation center with a giant dome and peaceful gardens.",
    location: "Gopalpur"
  }
];

const days = 2;
const startDate = "2025-04-25"; // format: YYYY-MM-DD

const data= await generateItinerary({ places, days, startDate });

console.log(data)






















// const ai = new GoogleGenAI({
//   apiKey: "AIzaSyDABqday_5M1BAcoAGykBT1MADzWMBtjA4",
// });

// async function generateItineraryData({
//   flightNumber,
//   hotelAddress,
//   arrival,
//   departure,
//   placeName
// }) {
//   const result = await ai.models.generateContent({
//     model: "gemini-1.5-flash",
//     contents: [
//       {
//         role: "user",
//         parts: [
//           {
//             text: `
// You are a travel expert. Generate a 5-day travel itinerary in JSON format for a trip to ${placeName}.
// Include:
// - flightNumber: ${flightNumber}
// - hotelAddress: ${hotelAddress}
// - arrival: ${arrival}
// - departure: ${departure}

// For each day, include:
// - day
// - morning
// - afternoon
// - evening

// Respond with only JSON like:
// {
//   "flightNumber": "...",
//   "hotelAddress": "...",
//   "arrival": "...",
//   "departure": "...",
//   "days": [
//     {
//       "day": "Day 1",
//       "morning": "...",
//       "afternoon": "...",
//       "evening": "..."
//     },
//     ...
//   ]
// }
// `
//           }
//         ]
//       }
//     ]
//   });

//   const text = result.candidates[0].content.parts[0].text;

//   try {
//     const start = text.indexOf("{");
//     const end = text.lastIndexOf("}");
//     const jsonString = text.substring(start, end + 1);
//     const itineraryData = JSON.parse(jsonString);
//     return itineraryData;
//   } catch (error) {
//     console.error("❌ Failed to parse JSON:", error);
//     console.log("Raw response:\n", text);
//   }
// }

// // Example usage wrapped in async function
//  const dataset= async () => {
//   const data = await generateItineraryData({
//     // place:"Mumbai",
//     flightNumber: "AI123",
//     hotelAddress: "Palm Residency, Delhi",
//     arrival: "May 1, 2025",
//     departure: "May 5, 2025",
//     placeName: "Mumbai"
//   }) 
// console.log(data)
//   return data;
// }

// module.exports = {
//     dataset
//    };








