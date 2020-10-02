async function main() {
  const puppeteer = require('puppeteer');
  const browser = await puppeteer.launch({headless: false, args: ['--no-sandbox', '--disable-setuid-sandbox']});

  const page = await browser.newPage();
  await page.goto('https://girisv3.itu.edu.tr/Login.aspx?subSessionId=06a6b13e-3257-4c10-af81-23b7acfd5625&currentURL=http%3a%2f%2frehber.itu.edu.tr%2fLogin.aspx%3fReturnURL%3dhttp%253a%252f%252frehber.itu.edu.tr%252fdefault.aspx%253ffrom%253dgirisctl00$ContentPlaceHolder1$tbUserName');
  console.log("İTÜ Portala giriş yapılıyor")
  await page.type('#ContentPlaceHolder1_tbUserName', 'kavraz19');
  await page.type('#ContentPlaceHolder1_tbPassword', '');
  await page.click('#ContentPlaceHolder1_btnLogin');

  console.log("İTÜRehbere giriş yapılıyor.")
  await page.goto('http://rehber.itu.edu.tr/search?fullName=ahmet+furkan+kavraz&type=tum');
  await page.click('#cphMain_rpSearchResult_lbtnFullName_0');
  await page.waitForNavigation( 2000 );
  console.log("Bilgiler alınıyor.")
  var linkTexts = await page.$$eval("#cphMain_lblITUNumber",
  elements=> elements.map(item=>item.textContent))
  console.log(linkTexts[0])

  var linkTexts2 = await page.$$eval("#cphMain_rpContactInformationList_lblContactInformationValue_0",
  elements=> elements.map(item=>item.textContent))
  console.log(linkTexts2[0])

}

main();