import axios from 'axios'
import { TWO_CAPTCHA_API_KEY } from '../config.js'
import { wait } from './timer.js'

export const inquiryFunCaptcha = async ({ publickey, surl, pageurl, userAgent }) => {
  const { data } = await axios.get('https://2captcha.com/in.php', {
    params: {
      key: TWO_CAPTCHA_API_KEY,
      method: 'funcaptcha',
      json: 1,
      surl,
      publickey,
      pageurl,
      userAgent,
    },
  })

  return data
}

// https://2captcha.com/res.php?key=1abc234de56fab7c89012d34e56fa7b8&action=get&id=2122988149
export const resolveFunCaptcha = async ({ id }) => {
  let data

  do {
    const response = await axios.get('https://2captcha.com/res.php', {
      params: {
        key: TWO_CAPTCHA_API_KEY,
        json: 1,
        action: 'get',
        id,
      },
    })

    data = response.data

    console.log('[' + id + '] Resolve Captcha Response:', data)

    if (data.status == 0 && data.request === 'CAPCHA_NOT_READY') {
      console.log('[' + id + '] Retry after 5 seconds')

      await wait(5000)
    }
  } while (data.status == 0 && data.request == 'CAPCHA_NOT_READY')

  return data
}

// https://api.2captcha.com/createTask
export const createTaskFunCaptcha = async ({ publickey, surl, pageurl, userAgent }) => {
  const { data } = await axios.post('https://api.2captcha.com/createTask', {
    clientKey: TWO_CAPTCHA_API_KEY,
    task: {
      type: "FunCaptchaTaskProxyless",
      websiteURL: pageurl,
      websitePublicKey: publickey,
      funcaptchaApiJSSubdomain: surl,
      userAgent,
    }
  })

  return data
}

export const getResultFunCaptcha = async ({ id }) => {
  let data

  do {
    const response = await await axios.post('https://api.2captcha.com/getTaskResult', {
      clientKey: TWO_CAPTCHA_API_KEY,
      taskId: id,
    })

    data = response.data

    console.log('[' + id + '] Resolve Captcha Response:', data)

    if (data.status == 'processing' && data.errorId == 0) {
      console.log('[' + id + '] Retry after 5 seconds')

      await wait(5000)
    }
  } while (data.status == 'processing' && data.errorId == 0)

  return data
}
