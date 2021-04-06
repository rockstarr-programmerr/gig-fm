import { randomSadEmoji } from './message.js'

const isBlank = value => value === '' || value === undefined || value === null

export const required = value => !isBlank(value) ||
                                  `This field is required ${randomSadEmoji()}.`

export const validEmail = value => (isBlank(value) || /.+@.+\..+/.test(value)) ||
                                   `This is not a valid email ${randomSadEmoji()}.`
