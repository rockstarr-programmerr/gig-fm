import { randomSadEmoji } from './message.js'

export const required = value => (value !== '' && value !== undefined && value !== null) ||
                                  `This field is required ${randomSadEmoji()}.`
