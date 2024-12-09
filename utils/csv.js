import * as fs from 'node:fs/promises'

export async function* readCsvRow(filePath) {
  try {
    const fd = await fs.open(filePath, 'r');

    for await (const line of fd.readLines()) {
      const [
        email, password, refreshToken, clientId,
      ] = line.split(',')

      yield {
        email, password, refreshToken, clientId,
      }
    }
  } catch (e) {
    console.error(e.message)

    throw e
  }
}
