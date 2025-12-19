'use client'

/**
 * Minimal client-side crypto helpers for demo purposes.
 * Uses AES-GCM 256 with random IVs. Keys are never persisted server-side.
 */
const subtle = typeof crypto !== "undefined" ? crypto.subtle : undefined

function getSubtle() {
  if (!subtle) {
    throw new Error("Web Crypto API not available in this environment.")
  }
  return subtle
}

function toUint8(value: ArrayBuffer | Uint8Array) {
  return value instanceof Uint8Array ? value : new Uint8Array(value)
}

function toBase64(buf: ArrayBuffer | Uint8Array) {
  const bytes = toUint8(buf)
  let binary = ""
  bytes.forEach((b) => {
    binary += String.fromCharCode(b)
  })
  return btoa(binary)
}

function fromBase64(b64: string) {
  const binary = atob(b64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes.buffer
}

export async function generateKey(): Promise<string> {
  const cryptoSubtle = getSubtle()
  const key = await cryptoSubtle.generateKey({ name: "AES-GCM", length: 256 }, true, ["encrypt", "decrypt"])
  const raw = await cryptoSubtle.exportKey("raw", key)
  return toBase64(raw)
}

async function importKey(keyB64: string) {
  const cryptoSubtle = getSubtle()
  return cryptoSubtle.importKey("raw", fromBase64(keyB64), { name: "AES-GCM", length: 256 }, false, [
    "encrypt",
    "decrypt",
  ])
}

export type EncryptResult = {
  ciphertext: string
  iv: string
}

export async function encrypt(plaintext: string, keyB64: string): Promise<EncryptResult> {
  const cryptoSubtle = getSubtle()
  const key = await importKey(keyB64)
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const encoded = new TextEncoder().encode(plaintext)
  const cipher = await cryptoSubtle.encrypt({ name: "AES-GCM", iv }, key, encoded)
  return { ciphertext: toBase64(cipher), iv: toBase64(iv) }
}

export async function decrypt(result: EncryptResult, keyB64: string): Promise<string> {
  const cryptoSubtle = getSubtle()
  const key = await importKey(keyB64)
  const plaintext = await cryptoSubtle.decrypt(
    { name: "AES-GCM", iv: toUint8(fromBase64(result.iv)) },
    key,
    fromBase64(result.ciphertext),
  )
  return new TextDecoder().decode(plaintext)
}
