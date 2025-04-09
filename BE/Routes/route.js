const {Router} = require('express');
const route =Router();
const http = require('https');
const path = require('path');
const dotenv = require('dotenv').config({path: '/home/saidarshan74/Desktop/Tripmate/.env'})





route.get('/places',async(req,response)=>{

    const options = {
        method: 'GET',
        hostname: 'travel-advisor.p.rapidapi.com',
        port: null,
        path: '/attractions/list?location_id=304554&currency=USD&lang=en_US&lunit=km&limit=5&sort=recommended',
        headers: {
            'x-rapidapi-key': process.env.X_RAPID_API_KEY,
            'x-rapidapi-host': 'travel-advisor.p.rapidapi.com'
        }
    };
    
    const requests = http.request(options, function (res) {
        const chunks = [];
    
        res.on('data', function (chunk) {
            chunks.push(chunk);
        });
    
        res.on('end', function () {
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

            
            console.log(arr)
    
            // res.json({
            //     placesData: arr,
            // })

  
           
            response.json({
                    placesData: arr,
                })
    
    
        })
       
          
        
    })
   

    requests.end();

})


/// ROUTE FOR GENERATING ITINERARY PDF

route.get('/download',async(req,res)=>{

})

module.exports= route