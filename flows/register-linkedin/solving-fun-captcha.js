// https://2captcha.com/2captcha-api#solving_funcaptcha_new

//

import { Page } from "puppeteer"
import { wait } from "../../utils/timer.js"
import { inquiryFunCaptcha, resolveFunCaptcha } from "../../utils/2captcha.js"

/**
 * @param {Page} page
 */
export default async (page) => {
  console.log('== Resolving FunCaptcha')
  await wait(6000)

  // Find CaptchaFrame in the Page
  console.log('> Find CaptchaFrame in the Page')
  const captchaFrame = await page.frames().find(e => e.name() === 'CaptchaFrame')

  // Waiting for the presence of #home_children_button
  await captchaFrame.waitForSelector('#home_children_button', { timeout: 60000 })
  await captchaFrame.click('#home_children_button', { delay: 200 })

  // Preparing to resolve FunCaptcha
  console.log('> Prepare to resolve FunCaptcha')
  const resolveCaptchaFrame = await page.frames().find(e => /^https:\/\/client-api.arkoselabs.com\/v2/.test(e.url()))

  // // Waiting for the presence of data-pkey
  // await resolveCaptchaFrame.waitForSelector('captcha-widget[data-pkey]')
  // const publicKey = await resolveCaptchaFrame.$eval('captcha-widget[data-pkey]', elem => elem.dataset.pkey)
  // console.log('> publickey:', publicKey)

  // Waiting for the presence of fc-token
  await resolveCaptchaFrame.waitForSelector('input[name="fc-token"]')
  const tokens = await resolveCaptchaFrame.$eval('input[name="fc-token"]', elem => decodeURI(elem.value).split('|'))
  const publicKey = await tokens.find(e => /^pk=/.test(e)).split('=')[1]
  const surl = await tokens.find(e => /^surl=/.test(e)).split('=')[1]
  console.log('> publicKey:', publicKey)
  console.log('> surl:', surl)

  // Inquiry FunCaptcha
  console.log('Inquiry FunCaptcha Request:', {
    pageurl: page.url(),
    publickey: publicKey,
    surl,
  })
  const inq = await inquiryFunCaptcha({
    pageurl: page.url(),
    publickey: publicKey,
    surl,
  })
  console.log('Inquiry Captcha Request:', inq)

  // Resolve FunCaptcha
  let res = await resolveFunCaptcha({ id: inq.request })
  if (! res.status) {
    throw new Error(res.request)
  }

  // Continue to the next step
  await wait(2000)
  console.log('Fill value to [fc-token] input')
  await resolveCaptchaFrame.$eval('input[name="fc-token"]', e => e.value = res.request)

  console.log('Compare the value once again')
  const reqCaptcha = await resolveCaptchaFrame.$eval('input[name="fc-token"]', e => e.value)
  console.log('Input Value = ', reqCaptcha)
}
