import { Page } from 'puppeteer'
import { wait } from '../../utils/timer.js'

/**
 * @param {Page} page
 */
export default async (page, { email, password, firstName, lastName }) => {

  const keyboard = page.keyboard

  // Open LinkedIn
  await page.goto('https://www.linkedin.com/')
  await page.waitForSelector('a.nav__button-tertiary.btn-md.btn-tertiary')

  // Click to register link
  await page.click('a.nav__button-tertiary.btn-md.btn-tertiary')
  await page.waitForSelector('#email-address')

  await wait(2000)

  // Fill in the credentials data
  console.log('Fill in the email, password credentials')
  await page.type('#email-address', email, { delay: 100 })
  await keyboard.press('Tab')
  await keyboard.type(password, { delay: 150 })
  await keyboard.press('Enter')
  await wait(5000)
}
