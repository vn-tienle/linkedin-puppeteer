import { Browser } from 'puppeteer'
import { wait } from '../../utils/timer.js';

const URL = 'https://whatismyipaddress.com/'

/**
 * @param {Browser} browser
 */
export default async (browser) => {
  const page = await browser.newPage();

  await page.goto(URL)
  await wait(5000)

  const ipAddressV6 = await page.$eval('#ipv6', (elem) => elem.innerText)
  console.log(`IP Address (v6): ${ipAddressV6}`)
  const ipAddressV4 = await page.$eval('#ipv4', (elem) => elem.innerText)
  console.log(`IP Address (v4): ${ipAddressV4}`)

  await page.close();
}
