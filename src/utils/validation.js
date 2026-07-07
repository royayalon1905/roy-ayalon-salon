const PHONE_REGEX = /^0\d{8,9}$/
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function isValidIsraeliPhone(value) {
  return PHONE_REGEX.test(value.trim())
}

export function isValidEmail(value) {
  return EMAIL_REGEX.test(value.trim())
}
