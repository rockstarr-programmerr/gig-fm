export function wait (miliseconds) {
  return new Promise(resolve => setTimeout(resolve, miliseconds))
}

export function randomChoice (choices) {
  const index = Math.floor(Math.random() * choices.length)
  return choices[index]
}
