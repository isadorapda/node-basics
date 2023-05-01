import fs from 'node:fs'
import { parse } from 'csv-parse'
import fetch from 'node-fetch'

const csvPath = new URL('./tasks.csv', import.meta.url)

const stream = fs.createReadStream(csvPath)

const cvsParse = parse({
  delimiter: ',',
  skipEmptyLines: true,
  fromLine: 2,
})

async function run() {
  const linesParse = stream.pipe(cvsParse)
  for await (const line of linesParse) {
    const [title, description] = line

    await fetch('http://localhost:3333/tasks', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        title,
        description,
      }),
    })
    await wait(1000)
  }
}

run()

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
