const { test, beforeEach } = require("node:test")
const assert = require("node:assert/strict")
const { decrypt, encrypt, generateKey } = require("../lib/crypto.js")

let key

beforeEach(async () => {
  key = await generateKey()
})

test("encrypts and decrypts round trip", async () => {
  const message = "Confidential: payroll Q4"
  const cipher = await encrypt(message, key)
  const plain = await decrypt(cipher, key)
  assert.equal(plain, message)
})

test("uses unique IVs per encryption", async () => {
  const cipher1 = await encrypt("a", key)
  const cipher2 = await encrypt("a", key)
  assert.notEqual(cipher1.iv, cipher2.iv)
})

test("fails decryption with wrong key", async () => {
  const cipher = await encrypt("secret", key)
  const wrongKey = await generateKey()
  await assert.rejects(async () => decrypt(cipher, wrongKey))
})
