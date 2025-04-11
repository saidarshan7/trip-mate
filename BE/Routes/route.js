const {Router} = require('express');
const route =Router();
const http = require('https');
const path = require('path');
const dotenv = require('dotenv').config({path: '/home/saidarshan74/Desktop/Tripmate/.env'})
const { GoogleGenAI } = require("@google/genai");





route.post('/places',async(req,response)=>{

    const PlaceName = req.body.destination;
    console.log(PlaceName)
    const noOfDays = req.body.duration;
    console.log(noOfDays)
    const begin = req.body.startDate;
    console.log(begin)
    
    






//code to get the given location ID


const options1 = {
    method: 'POST',
    hostname: 'travel-advisor.p.rapidapi.com',
    port: null,
    path: '/locations/v2/search?currency=USD&units=km&lang=en_US',
    headers: {
        'x-rapidapi-key':process.env.X_RAPID_API_KEY,
        'x-rapidapi-host': 'travel-advisor.p.rapidapi.com',
        'Content-Type': 'application/json'
    }
};

async function getPlaceId(query) {
    return new Promise((resolve, reject) => {
        const request1 = http.request(options1, function (res1) {
            const chunks = [];

            res1.on('data', function (chunk) {
                chunks.push(chunk);
            });

            res1.on('end', function () {
                try {
                    const body = Buffer.concat(chunks);
                    const data = JSON.parse(body.toString())
                        .data.AppPresentation_queryAppSearch.sections[1]
                        .appSearchCardContent.saveId.id;
                    resolve(data);
                } catch (error) {
                    reject(error);
                }
            });

            res1.on('error', reject);
        });

        request1.on('error', reject);
        request1.write(JSON.stringify({ query }));
        request1.end(); // Important: this must be called to send the request
    });
}


        const placesID = await getPlaceId(PlaceName);
        console.log("hello world")
        console.log(placesID);
       




// Another Request to get place details 

    const options2 = {
        method: 'GET',
        hostname: 'travel-advisor.p.rapidapi.com',
        port: null,
        path: `/attractions/list?location_id=${placesID}&currency=USD&lang=en_US&lunit=km&limit=10&sort=recommended`,
        headers: {
            'x-rapidapi-key': process.env.X_RAPID_API_KEY,
            'x-rapidapi-host': 'travel-advisor.p.rapidapi.com'
        }
    };
    
    const requests = await http.request(options2, function (res) {
        const chunks = [];
    
        res.on('data', function (chunk) {
            chunks.push(chunk);
        });
    
        res.on('end', async function () {
            const body = Buffer.concat(chunks);
             
            let arr = []
    
            const data = JSON.parse(body.toString()).data
            
            // console.log(data)
            data.map((item)=>{
              
                let i = true;
    
                try {
                 
                    if (item.photo.images.large.ur || item.photo.caption || item.offer_group.lowest_price){
                        
    
                        let imageArray = []
                        item.offer_group.offer_list.map((obj)=>{
                        imageArray.push(obj.image_url)})
    
                        arr.push({
                            name: item.name,
                            location: item.location_string,
                             imageUrl: item.photo.images.large.url,
                            imageCaption: item.photo.caption,
                            rating: item.rating,
                            lowest_price: item.offer_group.lowest_price,
                            moreInfo: item.web_url,
                            longitude:item.longitude,
                            latitude:item.latitude,
                            moreImages : imageArray
                            })
                            
                            
                            
                            
                            
                            i = false;
                    };
                    
    
                    
                } catch(err){
                    // console.log("there is an error")
                }
                
                if (i) {
                    
                
                        arr.push({
                            name: item.name,
                
                            location: item.location_string,
                            longitude:item.longitude,
                            latitude:item.latitude,
                            rating: item.rating,
                            moreInfo: item.web_url,
                            
                
                            })
                     
                }
    
                
            })
        


// console.log(arr)

       let arr2 = []

          arr.map((item)=>{
             arr2.push({
                name: item.name,
                image: item.imageUrl,
                description:'generate yourself dont keep empty',
                location:item.location

             })
          })

        //   console.log(arr2)

          // Gemini Model Which Will Geneate intenrary content

          
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
          
          
          const places = arr2;
          
          const days = noOfDays;
          const startDate = begin; // format: YYYY-MM-DD
          
          async function generate(places,days,startDate) {
            const data= await generateItinerary({ places, days, startDate });
          
          return data;
          }
          
          
          let data1 = await generate(places,days,startDate)
                data1= await JSON.parse(data1)
                console.log(data1)
          
            
           
  
           
            response.json({
                    placesData: data1,
                   
                })
    
    
        })
       
          
        
    })
   

    requests.end();

})


/// ROUTE FOR GENERATING ITINERARY PDF

route.get('/autocomplete',async(req,res)=>{

    let value = req.query.value;

    const options = {
        method: 'GET',
        hostname: 'wft-geo-db.p.rapidapi.com',
        port: null,
        path: `/v1/geo/places?countryIds=IN&namePrefix=${value}&limit=3`,
        headers: {
            'x-rapidapi-key': process.env.X_RAPID_API_KEY,
            'x-rapidapi-host': 'wft-geo-db.p.rapidapi.com'
        }
    };
    
    const request = http.request(options,  function (response) {
        const chunks = [];
    
        response.on('data', function (chunk) {
            chunks.push(chunk);
        });
    
        response.on('end',async function () {
            const body = Buffer.concat(chunks);
    
    const data = JSON.parse(body.toString()).data;
    
    let details =[]
    let result =  data.map((data)=>{
                    let name = data.name
                    let region = data.region
                    let country = data.country
    
                    details.push(`${name}, ${region}, ${country}`)
                    // let detailes = ;
                   
                })
    console.log("helo g req madde")
                res.json({
                    values:details
                   })
                

            // console.log(body.toString());
        });
    });

 
    
    request.end();

})

module.exports= route






















   
        // ai generated itenerary
        // const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

        // function formatDate(date, offsetDays) {
        //   const options = { weekday: 'short', day: 'numeric', month: 'short' };
        //   const currentDate = new Date(date);
        //   currentDate.setDate(currentDate.getDate() + offsetDays);
        //   return currentDate.toLocaleDateString('en-US', options);
        // }
        
        // async function generateItinerary({ places, days, startDate }) {
        //   let dayDescriptions = "";
        
        //   for (let i = 0; i < days; i++) {
        //     const dateFormatted = formatDate(startDate, i);
        //     dayDescriptions += `\nDay ${i + 1} - ${dateFormatted}\n`;
        //     dayDescriptions += `Suggest places to visit from the given list.\n\n`;
        //   }
        
        //   const prompt = `
        // Create a JSON itinerary for a ${days}-day trip starting on ${formatDate(startDate, 0)}.
        
        // Places to include:
        // ${places.map((place, index) => `
        // ${index + 1}. Name: ${place.name}
        //    Description: ${place.description}
        //    Location: ${place.location}
        //    Image URL: ${place.image}
        // `).join('')}
        
        // Itinerary format should be:
        // [
        //   {
        //     "day": 1,
        //     "date": "Fri, 18 Apr",
        //     "activities": [
        //       {
        //         "title": "Place name",
        //         "description": "Short description",
        //         "duration": "e.g. 120 min",
        //         "location": "City name",
        //         "image": "image url"
        //       }
        //     ]
        //   }
        // ]
        // `;
        
        //   let response = await ai.models.generateContent({
        //     model: "gemini-2.0-flash",
        //     contents: prompt,
        //   });
        
        //   response = response.text.replace(/^```(?:json)?\s*/i, "").replace(/```$/, "").trim();
        //   console.log(JSON.parse(response))
        // }
        
        
        // const places = arr;
        
        // const days = noOfDays;
        // const startDate = begin; // format: YYYY-MM-DD
        
        // generateItinerary({ places, days, startDate });


