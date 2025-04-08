const puppeteer = require('puppeteer');
const fs = require('fs');
const handlebars = require('handlebars');
const dataset = require('./data');

// console.log(data)


(async () => {
   const data = await dataset.dataset()
  const templateHtml = fs.readFileSync('./templates/itinerary.hbs', 'utf8');
  const template = handlebars.compile(templateHtml);
  const html = template(data);


  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });

  await page.pdf({
    path: '5_Days_Trip_Plan_In_.pdf',
    format: 'A4',
    printBackground: true,
  });

  await browser.close();
  console.log("✅ PDF Generated: itinerary.pdf");
})();

