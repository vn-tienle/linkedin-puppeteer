/**
 * @param {Number} miliseconds
 * @returns
 */

export const wait = async (miliseconds) => {
  return new Promise(res => setTimeout(res, miliseconds))
}
