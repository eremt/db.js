const { randomUUID } = require('crypto')

function filter (needles, haystack) {
  return haystack.filter(obj => {
    let matches = []
    for ([key, value] of needles) {
      if (value instanceof RegExp && obj[key].search && obj[key].search(value) !== -1) {
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

  async get (query) {
    let data = []
    if (query) {
      if (typeof query === 'string') {
        // assume it's a key
        if (this.data[query]) data = [this.data[query]]
      } else {
        // probably object
        const filters = Object.entries(query)
        if (filters.length) data = filter(filters, Object.values(this.data))
      }
    } else {
      data = Object.values(this.data)
    }
    return data
  }

  async set (data = {}, key) {
    const updated = Date.now()
    let id, value
    if (key) {
      // update
      id = key
      value = { ...this.data[key], updated }
    } else {
      // create
      id = randomUUID()
      value = { id, created: updated, updated }
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
