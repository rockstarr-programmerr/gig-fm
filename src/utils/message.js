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
  store.dispatch('alert/success', msg)
}

export function alertError () {
  store.dispatch('alert/error', messages.errorOccurred())
}
