import { Browser } from 'puppeteer'
import { wait } from '../../utils/timer.js';

const URL = 'https://ipinfo.io/'

/**
 * @param {Browser} browser
 */
export default async (browser) => {
  const page = await browser.newPage();

  await page.goto(URL)
  await page.waitForSelector('#search-widget > input')
  await wait(3000)
  const ipAddress = await page.$eval('#search-widget > input', (elem) => elem.value)

  console.log(`IP Address: ${ipAddress}`)

  await page.close();
}
