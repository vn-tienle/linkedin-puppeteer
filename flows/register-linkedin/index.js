import puppeteer from 'puppeteer'
import { wait } from '../../utils/timer.js'

import visitIpinfo from './visit-ipinfo.js'
import signUpLinkedin from './sign-up-linkedin.js'
import signUpEnterName from './sign-up-enter-name.js'
import signUpEnterPhone from './sign-up-enter-phone.js'
import solvingFunCaptcha from './solving-fun-captcha.js'

/// START THE PROCESS

// Initial the process
const width = 800, height = 600
const chromeUserAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_0) AppleWebKit/1182.36 (KHTML, like Gecko) Chrome/76.0.3163.100 Safari/1182.36';
// const pathToExtension = path.resolve('extensions/2captcha-solver-chrome-3.7.2')
// console.log(pathToExtension);

let browser

try {
  browser = await puppeteer.connect({
    browserURL: 'http://127.0.0.1:51525',
  })

  // Check IP
  // await visitIpinfo(browser)

  const page = await browser.newPage()
  await page.deleteCookie()

  const dataRow = {
    email: 'tiencmu+1900@gmail.com',
    password: 'CMVN@123',
    firstName: 'Tien',
    lastName: 'Cmu',
    phone: '0818333444'
  }

  // Start signing up in Linked In
  await signUpLinkedin(page, dataRow)
  await signUpEnterName(page, dataRow)

  // TODO: Solving FunCaptcha
  // await wait(30000)
  await solvingFunCaptcha(page)

  // Input phone number
  await signUpEnterPhone(page, dataRow)

  await wait(10000)

  // Close the browser
  await browser.disconnect()
} catch (e) {
  console.log(e)

  // Close the browser
  await browser.disconnect()
}
