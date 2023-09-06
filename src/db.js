const { randomUUID } = require('crypto')

function filter (needles, haystack) {
  return haystack.filter(obj => {
    let matches = []
    for ([key, value] of needles) {
      if (value instanceof RegExp && obj[key].search(value) !== -1) {
        matches.push(key)
      } else if (obj[key] === value) {
        matches.push(key)
      }
    }
    return matches.length === needles.length
  })
}

module.exports = class dbjs {
  constructor () {
    this.data = {}
  }

  async get (key, query = {}) {
    let data, f
    if (key) {
      data = this.data[key] || undefined
    } else if ((f = Object.entries(query)).length) {
      data = filter(f, Object.values(this.data))
    } else {
      data = Object.values(this.data)
    }
    return data
  }

  async set (key, data = {}) {
    let id, value
    if (key) {
      id = key
      value = { ...this.data[key] }
    } else {
      id = randomUUID()
      value = { id, created: Date.now() }
    }
    value = { ...value, ...data }
    this.data[id] = value
    return { ...this.data[id] }
  }

  async del (key) {
    if (!key) throw new Error('Can\'t delete without key')
    if (!this.data[key]) return undefined
    delete this.data[key]
    return key
  }
}
