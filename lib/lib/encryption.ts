import crypto from 'crypto'

const algorithm = 'aes-256-gcm'
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY!

export function encrypt(text: string): { encrypted: string; iv: string; tag: string } {
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(ENCRYPTION_KEY, 'base64'), iv)
  let encrypted = cipher.update(text, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  const tag = cipher.getAuthTag()
  return {
    encrypted,
    iv: iv.toString('hex'),
    tag: tag.toString('hex')
  }
}

export function decrypt(encrypted: string, iv: string, tag: string): string {
  const decipher = crypto.createDecipheriv(
    algorithm,
    Buffer.from(ENCRYPTION_KEY, 'base64'),
    Buffer.from(iv, 'hex')
  )
  decipher.setAuthTag(Buffer.from(tag, 'hex'))
  let decrypted = decipher.update(encrypted, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  return decrypted
}
