import { Buffer } from 'node:buffer'

export async function json(req, res) {
  const buff = []
  for await (const chunk of req) {
    buff.push(chunk)
  }

  try {
    req.body = JSON.parse(Buffer.concat(buff).toString())
  } catch {
    req.body = null
  }
  res.setHeader('Content-type', 'application/json')
}
