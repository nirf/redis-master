import * as moment from 'moment'

const uuidv1 = require('uuid/v1')

export function getDateDiffInSeconds(preDate, postDate) {
  const date1 = moment(preDate)
  const date2 = moment(postDate)
  return date2.diff(date1, 'seconds')
}

export function generateUniqueUUID() {
  return uuidv1()
}
