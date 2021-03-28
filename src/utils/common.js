export function wait (miliseconds) {
  return new Promise(resolve => setTimeout(resolve, miliseconds))
}

export function randomChoice (choices) {
  const index = Math.floor(Math.random() * choices.length)
  return choices[index]
}

export function splitPaths (pathString) {
  return pathString.split('/')
}

export function joinPaths (pathArray) {
  return pathArray.join('/')
}

export function makeUniqueArray (array) {
  return array.filter((value, index, self) => self.indexOf(value) === index)
}

export function arrayEqual (array1, array2) {
  if (
    (array1.length === 0 && array2.length !== 0) ||
    (array1.length !== 0 && array2.length === 0)
  ) {
    return false
  }
  return array1.every((value, index) => array2[index] === value)
}
