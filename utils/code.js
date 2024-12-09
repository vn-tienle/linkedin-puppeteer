import axios from 'axios'
import { authenticator } from 'otplib'

export const getEmailCode = async ({ email, password, refreshToken, clientId }) => {
  try {
    const { data } = await axios.post('https://tools.dongvanfb.net/api/get_code_oauth2', {
      email,
      pass: password,
      client_id: clientId,
      refresh_token: refreshToken,
    })

    return data
  } catch (e) {
    console.log(`Error while processing 2FA: ${e.message}`)
  }
}

export const getMfaCode = async (secret) => {
  return authenticator.generate(secret)
}
