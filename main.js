import { wait } from './utils/timer.js';

// (async () => {

  // const response = await get2FACode({
  //   email: 'johnsen539@hotmail.com',
  //   password: '8nUcUmDXv(m1',
  //   clientId: '78358d9a-1f8e-4376-9404-8410cdcad22b',
  //   refreshToken: 'M.C554_BAY.0.U.-CmdWM071FXIlHRtFxtXZoEpX6hf4jG!i!jYdWUwzHBWzTj0n*PCGzlafRpufQA*pLOe41QYnf7ZrdAIxYK347j*Rqrui8ZsLianxf8!WYymCUm2*9oLVy8w*xgE9Gc8I!o4s*a8zLiEqNA*C5xql9T2gGQ0xpO18OaNwO!VdiPFAPbl5ON0fn5OF5SWx6AQDO6wDADADjrBKUKmx0CkLlOgWZtYqcrfsS1k5q46ATpmBgbSoE3rvUTdirDYNA0mQ04bDQ8B2m0Wq2dmFB8!X8qiI*7kZDVOAG!o!quRfUUvrOwAEy0eg1dhlFZrdEFHi8g$$',
  // });

  // console.log('Response', response)

  // const code = await getMfaCode('ACCGH6D3EOUKNFQ6');
  // console.log('MFA Code (Authenticator)', code)

// })()

// import { readCsvRow } from './utils/csv.js'
// import { join, resolve } from 'path'

// for await (const line of readCsvRow(resolve('./data/hotmail.csv'))) {
//   console.log('Line', line)
// }

import { getProfiles, startProfile, closeProfile } from './utils/gpm.js'

// const profiles = await getProfiles()
// console.log(profiles)

const profile = await startProfile('0877e773-1d8d-4741-a23b-cd2aa1b421b8', {
  win_scale: 0.8,
  win_pos: '0,0',
  win_size: '800,600'
})

console.log('Profile started', profile)

await wait(6000)

const endProfile = await closeProfile('0877e773-1d8d-4741-a23b-cd2aa1b421b8')
console.log('Profile closed', endProfile)


