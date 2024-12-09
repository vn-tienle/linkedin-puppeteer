import { Page } from "puppeteer"
import { wait } from "../../utils/timer.js"

/**
 * @param {Page} page
 */
export default async (page, { phone }) => {
  console.log('Start entering phone number')

  await wait(2000)

  await page.click('#register-verification-phone-number')
  await page.keyboard.type(phone, { delay: 120 })

  await wait(3000)

  await page.keyboard.press('Enter', { delay: 120 })
  await wait(20000)
}
