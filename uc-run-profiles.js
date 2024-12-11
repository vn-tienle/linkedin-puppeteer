import startLinkedInFlow from './flows/register-linkedin/index.js'
import { startProfile } from './utils/gpm.js'
import profiles from './data/profile.json' with { type: 'json' }

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
}

