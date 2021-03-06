import store from '@/store/index.js'
import { randomChoice } from './common.js'

export const happyEmojis = ['đ','đ','đ','đ','đ','đ','đ','đ¤Ŗ','đ','đ','đ','đ','đ','đĨ°','đ','đ','đ','đ','đ']
export const sadEmojis = ['đ','đ','đ','đ','đ','đ','âšī¸','đŖ','đ','đĢ','đŠ']

export function randomHappyEmoji () {
  return randomChoice(happyEmojis)
}

export function randomSadEmoji () {
  return randomChoice(sadEmojis)
}

export const messages = {
  successs: () => `Done! ${randomHappyEmoji()}`,
  errorOccurred: () => `Something's wrong ${randomSadEmoji()} please try again.`
}

export function alertSuccess (msg) {
  if (msg === undefined) msg = messages.successs()
  else msg += ` ${randomHappyEmoji()}`
  store.dispatch('alert/success', msg)
}

export function alertError (msg) {
  if (msg === undefined) msg = messages.errorOccurred()
  else msg += ` ${randomSadEmoji()}`
  store.dispatch('alert/error', msg)
}
