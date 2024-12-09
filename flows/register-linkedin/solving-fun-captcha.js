// https://2captcha.com/2captcha-api#solving_funcaptcha_new

//

import { Page } from "puppeteer"
import { wait } from "../../utils/timer.js"

/**
 * @param {Page} page
 */
export default async (page) => {
  console.log('== Resolving FunCaptcha')
  await wait(3000)

  // Find CaptchaFrame in the Page
  console.log('> Find CaptchaFrame in the Page')
  const captchaFrame = await page.frames().find(e => e.name() === 'CaptchaFrame')

  // Waiting for the presence of #home_children_button
  await captchaFrame.waitForSelector('#home_children_button', { timeout: 60000 })
  await captchaFrame.click('#home_children_button', { delay: 200 })

  // Preparing to resolve FunCaptcha
  console.log('> Prepare to resolve FunCaptcha')
  const resolveCaptchaFrame = await page.frames().find(e => /^https:\/\/client-api.arkoselabs.com\/v2/.test(e.url()))

  // Waiting for the presence of data-pkey
  await resolveCaptchaFrame.waitForSelector('captcha-widget[data-pkey]')
  const publicKey = await resolveCaptchaFrame.$eval('captcha-widget[data-pkey]', elem => elem.dataset.pkey)
  console.log('Public Key:', publicKey)

  // Waiting for the presence of fc-token
  await resolveCaptchaFrame.waitForSelector('input[name="fc-token"]')
  const tokens = resolveCaptchaFrame.$eval('input[name="fc-token"]', elem => decodeURI(elem.value).split('|'))

  console.log('FunCaptcha Tokens:', tokens)
}
