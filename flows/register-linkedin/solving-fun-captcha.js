// https://2captcha.com/2captcha-api#solving_funcaptcha_new

//

import { Page } from "puppeteer"
import { wait } from "../../utils/timer.js"
import { createTaskFunCaptcha, getResultFunCaptcha, solveFunCaptcha } from "../../utils/2captcha.js"

/**
 * @param {Page} page
 */
export default async (page) => {
  console.log('== Resolving FunCaptcha')

  const userAgent = await page.browser().userAgent()
  console.log('Browser userAgent: ' + userAgent)
  await wait(6000)

  // Find CaptchaFrame in the Page
  console.log('> Find CaptchaFrame in the Page')
  console.log(page.frames())
  const captchaFrame = await page.frames().find(async (e) => {
    console.log(e)
    const elem = await e.frameElement()
    if (!elem) return false

    const frameId = await elem.evaluate(f => f.id)

    return frameId == 'CaptchaFrame'
  })
  await wait(2000)

  // Waiting for the presence of #home_children_button
  try {
    await captchaFrame.waitForSelector('#home_children_button', { timeout: 60000 })
    await captchaFrame.click('#home_children_button', { delay: 200 })
  } catch (e) {
    console.log('[ERROR] ' + e.message)
  }

  // Get blob
  const blob = (await captchaFrame.$eval('#game_challengeItem_image', e => e.src)).substr(23)

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
  console.log('> surl:', decodeURIComponent(surl))

  // Solving Captcha
  const captchaPayload = {
    pageurl: page.url(),
    publickey: publicKey,
    surl: decodeURIComponent(surl),
    userAgent,
    blob,
  }
  console.log('Inquiry FunCaptcha Request:', captchaPayload)
  const funCaptchaResult = await solveFunCaptcha(captchaPayload)
  console.log('> FunCaptcha Resolved:', funCaptchaResult)

  if (! funCaptchaResult.status) {
    throw new Error(funCaptchaResult)
  }

  // Continue to the next step
  await wait(2000)
  console.log('Fill value to [fc-token] input')
  await resolveCaptchaFrame.evaluate(({ data }) => {
    document.querySelector('input[name="fc-token"]').value = data
    console.log(document.querySelector('form'))
  }, funCaptchaResult)
  // await resolveCaptchaFrame.type('input[name="fc-token"]', funCaptchaResult.data)

  /// Trigger to checkAnswer in 2Captcha (TODO)
  // const captchaChallengeFrame = await page.frames().find(e => /^https:\/\/www.linkedin.com\/checkpoint\/challengeIframe/.test(e.url()))
  // await captchaChallengeFrame.$eval('#captcha-challenge', e => e.submit())

  await wait(30000)
}
