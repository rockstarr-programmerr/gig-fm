import store from '@/store/index.js'
import { randomChoice } from './common.js'

export const happyEmojis = ['😀','😃','😄','😁','😆','😅','😂','🤣','😊','😇','😉','😌','😍','🥰','😘','😗','😛','😝','😜']
export const sadEmojis = ['😒','😞','😔','😕','🙃','🙁','☹️','😣','😖','😫','😩']

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
