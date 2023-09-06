const dbjs = require('../src/index')
const { randomUUID } = require('crypto')

describe('db.js', () => {
  describe('db = new dbjs()', () => {
    it('initializes', async () => {
      const db = new dbjs()
      expect(db).toBeInstanceOf(dbjs)
    })
    it('is emtpy', async () => {
      const db = new dbjs()
      expect(await db.get()).toEqual([])
    })
  })

  describe('db.get', () => {
    it('gets all', async () => {
      const db = new dbjs()
      const count = 3
      for (let i = 0; i < count; i++) await db.set()
      expect(await db.get()).toHaveLength(count)
    })

    it('gets one', async () => {
      const db = new dbjs()
      const { id } = await db.set()
      expect(await db.get(id)).toHaveProperty('id', id)
    })

    it('gets none', async () => {
      const db = new dbjs()
      expect(await db.get('undefined-id')).toBeUndefined()
    })
  })

  describe('db.set', () => {
    it('creates new', async () => {
      const db = new dbjs()
      const data = { value: 'example' }
      const result = await db.set(undefined, data)
      expect(result).toHaveProperty('id')
      expect(result).toHaveProperty('created')
      expect(result).toHaveProperty('value', data.value)
      expect(await db.get()).toHaveLength(1)
      await db.set(undefined, data)
      expect(await db.get()).toHaveLength(2)
    })

    it('updates existing', async () => {
      const db = new dbjs()
      const created = await db.set(undefined, { value: 'example' })
      const updated = await db.set(created.id, { value: 'updated' })
      expect(updated).toHaveProperty('id')
      expect(updated).toHaveProperty('created')
      expect(updated).toHaveProperty('value', 'updated')
      expect(await db.get()).toHaveLength(1)
    })
  })

  describe('db.del', () => {
    it('deletes', async () => {
      const db = new dbjs()
      const { id } = await db.set()
      expect(await db.del(id)).toEqual(id)
      expect(await db.get(id)).toBeUndefined()
    })
    it('is undefined if key not found', async () => {
      const db = new dbjs()
      expect(await db.del(randomUUID())).toBeUndefined()
    })
    it('throws without key', async () => {
      const db = new dbjs()
      expect(async () => { await db.del() }).rejects.toThrow()
    })
  })
})
