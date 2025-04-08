const http = require('https');
const path = require('path');

const dotenv = require('dotenv').config({path: '../.env'})


const options = {
	method: 'GET',
	hostname: 'travel-advisor.p.rapidapi.com',
	port: null,
	path: '/attractions/list?location_id=304554&currency=USD&lang=en_US&lunit=km&limit=30&sort=recommended',
	headers: {
		'x-rapidapi-key': process.env.X_RAPID_API_KEY,
		'x-rapidapi-host': 'travel-advisor.p.rapidapi.com'
	}
};

const req = http.request(options, function (res) {
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
						moreImages : imageArray
						})
						
						// description:item.description
						
						
						
						i = false;
				};
				

				
			} catch(err){
				console.log("error again")
			}
			
			if (i) {
				
			console.log(i)
					arr.push({
						name: item.name,
			
						location: item.location_string,
						//  imageUrl: item.photo.images.large.url,
						// imageCaption: item.photo.caption,
						rating: item.rating,
						moreInfo: item.web_url,
						// description:item.description
			
						})
				 
			}




			

			
			// console.log(item.photo.images.large.url)
			// console.log(item.photo.caption)

		})

console.log(arr)

	});
});

req.end();