const http = require('https');
const path = require('path');

const dotenv = require('dotenv').config({path: '../.env'})

const options = {
	method: 'GET',
	hostname: 'travel-advisor.p.rapidapi.com',
	port: null,
	path: '/photos/list?location_id=304554&currency=USD&limit=50&lang=en_US',
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
		const data = JSON.parse(body.toString()).data;
        const arr = [];
        data.map((data)=>{
            arr.push(data.images.large.url)
           
        })
        console.log(arr)
	});
});

req.end();