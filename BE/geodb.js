const http = require('https');
const path = require('path');

const dotenv = require('dotenv').config({path: '../.env'})

const options = {
	method: 'GET',
	hostname: 'wft-geo-db.p.rapidapi.com',
	port: null,
	path: '/v1/geo/places?countryIds=IN&namePrefix=Mumb&limit=5',
	headers: {
		'x-rapidapi-key': process.env.X_RAPID_API_KEY,
		'x-rapidapi-host': 'wft-geo-db.p.rapidapi.com'
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

data.map((data)=>{
                let name = data.name
                let region = data.region
                let country = data.country

                let detailes = `${name},${region},${country}`;
                console.log(detailes)
            })

		// console.log(body.toString());
	});
});

req.end();









  