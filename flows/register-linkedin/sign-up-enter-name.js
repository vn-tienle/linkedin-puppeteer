import { Page } from 'puppeteer';
import { wait } from '../../utils/timer.js';

/**
 * @param {Page page
 */
export default async (page, { firstName, lastName }) => {

  const keyboard = page.keyboard

  // Enter first name and last name
  console.log('First name and last name')
  await wait(2000)
  await (await page.$('#first-name')).focus();
  await wait(200)
  await keyboard.type(firstName, { delay: 100 })
  await wait(200)
  await keyboard.press('Tab')
  await wait(200)
  await keyboard.type(lastName, { delay: 120 })
  await wait(2000)
  await keyboard.press('Enter');
  await wait(6000)
}
