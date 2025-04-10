const express = require('express')
const cors =require('cors')
const app = express()
const bodyParser = require('body-parser')
const mainRoutes = require('./Routes/route')
const PORT = 3000

app.use(cors())
// app.use(cors({
//   origin: 'http://localhost:5173',
//   credentials: true // if you're using cookies or authentication headers
// }));
app.use(bodyParser.json());

app.use('/discover',mainRoutes)






app.listen(PORT,()=>{
  console.log(`listening on PORT ${PORT} `)
})











































// const puppeteer = require('puppeteer');
// const fs = require('fs');
// const handlebars = require('handlebars');
// const dataset = require('./data');

// // console.log(data)


// (async () => {
//    const data = await dataset.dataset()
//   const templateHtml = fs.readFileSync('./templates/itinerary.hbs', 'utf8');
//   const template = handlebars.compile(templateHtml);
//   const html = template(data);


//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();
//   await page.setContent(html, { waitUntil: 'networkidle0' });

//   await page.pdf({
//     path: '5_Days_Trip_Plan_In_.pdf',
//     format: 'A4',
//     printBackground: true,
//   });

//   await browser.close();
//   console.log("✅ PDF Generated: itinerary.pdf");
// })();

