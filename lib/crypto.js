"use strict"

/**
 * CommonJS wrapper for crypto helpers to support Node tests.
 * Runtime mirrors lib/crypto.ts but without TypeScript types.
 */

const { webcrypto } = require("crypto")
const subtle = globalThis.crypto?.subtle || webcrypto?.subtle

function getSubtle() {
  if (!subtle) {
    throw new Error("Web Crypto API not available in this environment.")
  }
  return subtle
}

function toUint8(value) {
  return value instanceof Uint8Array ? value : new Uint8Array(value)
}

function toBase64(buf) {
  return Buffer.from(toUint8(buf)).toString("base64")
}

function fromBase64(b64) {
  return new Uint8Array(Buffer.from(b64, "base64"))
}

async function generateKey() {
  const cryptoSubtle = getSubtle()
  const key = await cryptoSubtle.generateKey({ name: "AES-GCM", length: 256 }, true, ["encrypt", "decrypt"])
  const raw = await cryptoSubtle.exportKey("raw", key)
  return toBase64(raw)
}

async function importKey(keyB64) {
  const cryptoSubtle = getSubtle()
  return cryptoSubtle.importKey("raw", fromBase64(keyB64), { name: "AES-GCM", length: 256 }, false, [
    "encrypt",
    "decrypt",
  ])
}

async function encrypt(plaintext, keyB64) {
  const cryptoSubtle = getSubtle()
  const key = await importKey(keyB64)
  const iv = webcrypto.getRandomValues(new Uint8Array(12))
  const encoded = new TextEncoder().encode(plaintext)
  const cipher = await cryptoSubtle.encrypt({ name: "AES-GCM", iv }, key, encoded)
  return { ciphertext: toBase64(cipher), iv: toBase64(iv) }
}

async function decrypt(result, keyB64) {
  const cryptoSubtle = getSubtle()
  const key = await importKey(keyB64)
  const plaintext = await cryptoSubtle.decrypt(
    { name: "AES-GCM", iv: toUint8(fromBase64(result.iv)) },
    key,
    toUint8(fromBase64(result.ciphertext)),
  )
  return new TextDecoder().decode(plaintext)
}

module.exports = {
  encrypt,
  decrypt,
  generateKey,
}
