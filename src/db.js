const { randomUUID } = require('crypto')

module.exports = class dbjs {
  constructor () {
    this.data = {}
  }

  async get (key) {
    let data
    if (key) {
      data = this.data[key] || undefined
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
