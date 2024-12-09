import axios from 'axios'
import { GPM_API_URL } from '../config.js'

export const getProfiles = async () => {
  const { data: { data } } = await axios.get(GPM_API_URL + '/api/v3/profiles')

  return data
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
