const CryptoJS = require('crypto-js')

const KEY = '1234567890'
const IV = '99999999'

/**
 * @desc AES加密
 * @param {String} msg 加密信息
 */
export function aesEncrypt(msg) {
  const keyHex = CryptoJS.enc.Utf8.parse(KEY)
  const srcs = CryptoJS.enc.Utf8.parse(msg)
  const encrypted = CryptoJS.AES.encrypt(srcs, keyHex, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  })
  return encrypted.toString()
}

/**
 * @desc AES解密
 * @param {String} msg 解密信息
 */
export function aesDecrypt(msg) {
  const keyHex = CryptoJS.enc.Utf8.parse(KEY)
  const decrypt = CryptoJS.AES.decrypt(msg, keyHex, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  })
  return CryptoJS.enc.Utf8.stringify(decrypt).toString()
}


/**
 * @desc AES加密：字符串 key iv  返回base64 
 */
export const Encrypt = (msg, keyStr = KEY, ivStr = IV) => {
  const keyHex = CryptoJS.enc.Utf8.parse(keyStr)
  const srcs = CryptoJS.enc.Utf8.parse(msg)
  const encrypted = CryptoJS.AES.encrypt(srcs, keyHex, {
    iv: CryptoJS.enc.Utf8.parse(ivStr),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.ZeroPadding
  })
  return CryptoJS.enc.Base64.stringify(encrypted.ciphertext)
}

/**
 * @desc AES解密：字符串 key iv  返回base64 
 */
export const Decrypt = (msg, keyStr = KEY, ivStr = IV) => {
  const keyHex = CryptoJS.enc.Utf8.parse(keyStr)
  const srcs = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Base64.parse(msg))
  const decrypted = CryptoJS.AES.decrypt(srcs, keyHex, {
    iv: CryptoJS.enc.Utf8.parse(ivStr),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.ZeroPadding
  })
  return decrypted.toString(CryptoJS.enc.Utf8).toString()
}
