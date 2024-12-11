import * as fs from 'node:fs/promises'

export async function* readCsvRow(filePath, delimiter = ',') {
  try {
    const fd = await fs.open(filePath, 'r');

    for await (const line of fd.readLines()) {
      yield line.split(delimiter)
    }
  } catch (e) {
    console.error(e.message)

    throw e
  }
}

export async function* readAccountRow(filePath, delimiter = ',') {
  try {
    const fd = await fs.open(filePath, 'r');

    for await (const line of fd.readLines()) {
      const [
        email, password, refreshToken, clientId,
      ] = line.split(delimiter)

      yield {
        email, password, refreshToken, clientId,
      }
    }
  } catch (e) {
    console.error(e.message)

    throw e
  }
}
