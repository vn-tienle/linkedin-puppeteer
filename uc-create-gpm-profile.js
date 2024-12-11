import fs from 'fs/promises'
import { createProfile } from './utils/gpm.js'
import { readCsvRow, readAccountRow } from './utils/csv.js'

export default async () => {
  // List of proxies
  const proxies = []

  // Read proxies
  for await (const proxy of readCsvRow('./data/proxy.csv')) {
    proxies.push(proxy[0])
  }

  // List of accounts
  const accounts = []

  // Read accounts
  for await (const account of readAccountRow('./data/hotmail.tsv', "\t")) {
    accounts.push({
      ...account,
      proxy: proxies.shift(),
    })
  }

  // Write data to temp file
  const filePath = exportDataToTempFile(
    JSON.stringify(accounts, null, "  "),
    'accounts',
  )

  // Create GPM profiles
  console.log('Ready to create profiles in GPM Login')
  const responses = []

  for (const { email, proxy } of accounts) {
    console.log(`> Email: ${email} | Proxy: ${proxy}`)

    const res = await createProfile({
      profile_name: `LinkedIn_${email}`,
      raw_proxy: proxy,
    })

    responses.push(res)
  }

  await exportDataToTempFile(
    JSON.stringify(responses, null, "  "),
    'profile'
  )

  return filePath
}

const exportDataToTempFile = async (data, prefix) => {
  const filePath = `./tmp/${prefix}_${new Date().getTime()}.json`

  // Open file stream
  const fd = await fs.open(filePath, 'w+')

  await fd.write(data)
  await fd.close()

  return filePath
}
