import axios from 'axios'
import { GPM_API_URL } from '../config.js'

export const getProfiles = async () => {
  const { data: { data } } = await axios.get(GPM_API_URL + '/api/v3/profiles')

  return data
}

export const createProfile = async (profileData = {
  "profile_name": "Test profile",
  "group_name": "All",
  "browser_core": "chromium",
  "browser_name": "Chrome",
  "browser_version": "119.0.6045.124",
  "is_random_browser_version": false,
  "raw_proxy" : "",
  "startup_urls": "",
  "is_masked_font": true,
  "is_noise_canvas": false,
  "is_noise_webgl": false,
  "is_noise_client_rect": false,
  "is_noise_audio_context": true,
  "is_random_screen": false,
  "is_masked_webgl_data": true,
  "is_masked_media_device": true,
  "is_masked_font": true,
  "is_random_os": false,
  "os": "Windows 11",
  "webrtc_mode": 2,
  "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36"
}) => {
  console.log(profileData)
  // const { data: { data } } = await axios.post(GPM_API_URL + '/api/v3/profiles', profileData)

  // return data
}

/**
 *
 * @param {string} id
 * @param {Object} params
 * @returns
 */
export const startProfile = async (id, { addination_args, win_scale, win_pos, win_size }) => {
  const { data: { data } } = await axios.get(GPM_API_URL + '/api/v3/profiles/start/' + id, { params: { addination_args, win_scale, win_pos, win_size }})

  return data
}

export const closeProfile = async (id) => {
  const { data } = await axios.get(GPM_API_URL + '/api/v3/profiles/close/' + id)

  return data
}
