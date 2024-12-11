// https://2captcha.com/2captcha-api#solving_funcaptcha_new

//

import { Page } from "puppeteer"
import { wait } from "../../utils/timer.js"
import { createTaskFunCaptcha, getResultFunCaptcha } from "../../utils/2captcha.js"

/**
 * @param {Page} page
 */
export default async (page) => {
  console.log('== Resolving FunCaptcha')

  const userAgent = await page.browser().userAgent()
  console.log('Browser userAgent: ' + userAgent)
  // await wait(6000)

  // Find CaptchaFrame in the Page
  console.log('> Find CaptchaFrame in the Page')
  const captchaFrame = await page.frames().find(e => e.name() === 'CaptchaFrame')
  // console.log(captchaFrame)
  await wait(2000)

  // Waiting for the presence of #home_children_button
  try {
    await captchaFrame.waitForSelector('#home_children_button', { timeout: 60000 })
    await captchaFrame.click('#home_children_button', { delay: 200 })
  } catch (e) {
    console.log('[ERROR] ' + e.message)
  }

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

  // Inquiry FunCaptcha
  console.log('Inquiry FunCaptcha Request:', {
    pageurl: page.url(),
    publickey: publicKey,
    surl: decodeURIComponent(surl),
  })
  const task = await createTaskFunCaptcha({
    pageurl: page.url(),
    publickey: publicKey,
    surl: decodeURIComponent(surl),
    userAgent,
  })
  console.log('Create Task Captcha Request:', task)

  // Resolve FunCaptcha
  let res = await getResultFunCaptcha({ id: task.taskId })
  if (res.errorId) {
    throw new Error(res)
  }

  // Continue to the next step
  await wait(2000)
  console.log('Fill value to [fc-token] input')
  await resolveCaptchaFrame.$eval('input[name="fc-token"]', e => e.value = res.solution.token)

  console.log('Compare the value once again')
  const reqCaptcha = await resolveCaptchaFrame.$eval('input[name="fc-token"]', e => e.value)
  console.log('Input Value = ', reqCaptcha)
}
