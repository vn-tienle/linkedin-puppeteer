import puppeteer from 'puppeteer'
import { faker } from '@faker-js/faker'
import { wait } from '../../utils/timer.js'

import visitIpinfo from './visit-ipinfo.js'
import signUpLinkedin from './sign-up-linkedin.js'
import signUpEnterName from './sign-up-enter-name.js'
import signUpEnterPhone from './sign-up-enter-phone.js'
import solvingFunCaptcha from './solving-fun-captcha.js'

export default async ({ profile, browserURL }) => {

  let browser

  try {
    browser = await puppeteer.connect({
      browserURL,
    })

    // Check IP
    // await visitIpinfo(browser)

    const page = await browser.newPage()
    await page.deleteCookie()

    const dataRow = {
      email: profile.email,
      password: profile.password,
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      phone: faker.phone.number()
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

}
