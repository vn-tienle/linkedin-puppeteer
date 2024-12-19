import startLinkedInFlow from './flows/register-linkedin/index.js'
import { startProfile } from './utils/gpm.js'
import profiles from './data/profile.json' with { type: 'json' }
import { wait } from './utils/timer.js'

profiles.shift()
profiles.shift()
// profiles.shift()
// profiles.shift()
profiles.shift()
profiles.shift()

// Get profiles data/profile.json
for (const account of profiles) {
  // Start profile
  console.log('== Start profile: ' + account.profile.id)

  const startProfileRes = await startProfile(account.profile.id, {
    addination_args: '',
    win_scale: '0.8',
    win_pos: '0,0',
    win_size: '800,600',
  })
  console.log('Response:', startProfileRes)

  await wait(3000)

  // Start the flow
  console.log('Start the flow [LinkedIn] for #' + account.profile.id + ' - Email: ' + account.email)
  await startLinkedInFlow({
    profile: account,
    browserURL: 'http://' + startProfileRes.remote_debugging_address,
  })

  break;
}
