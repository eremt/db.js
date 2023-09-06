const dbjs = require('../src/db')
const { randomUUID } = require('crypto')

// Mock data
// tests all types in truthy/falsy versions
// total 8 items
const data = [
  // 4 strings
  { value: 'example' },
  { value: 'example two' },
  { value: 'third example' },
  { value: '' },
  // 2 numbers
  { value: 1 },
  { value: 0 },
  // 2 booleans
  { value: true },
  { value: false },
]

describe('db = new dbjs()', () => {
  it('is instanceof dbjs', async () => {
    const db = new dbjs()
    expect(db).toBeInstanceOf(dbjs)
  })

  it('is created empty', async () => {
    const db = new dbjs()
    expect(await db.get()).toHaveLength(0)
  })
})

describe('db.get', () => {
  let db
  beforeEach(async () => {
    db = new dbjs()
    await Promise.all(data.map(obj => db.set(undefined, obj)))
  })

  it('db.get() gets all', async () => {
    expect(await db.get()).toHaveLength(8)
  })

  it('db.get(key) gets one', async () => {
    const [first] = await db.get()
    expect(await db.get(first.id)).toEqual(first)
  })

  it('db.get(\'undefined-key\') gets none', async () => {
    expect(await db.get('undefined-key')).toBeUndefined()
  })

  it('db.get(undefined, { value: string })', async () => {
    expect(await db.get(undefined, { value: 'example' })).toHaveLength(1)
    expect(await db.get(undefined, { value: '' })).toHaveLength(1)
  })

  it('db.get(undefined, { value: number })', async () => {
    expect(await db.get(undefined, { value: 1 })).toHaveLength(1)
    expect(await db.get(undefined, { value: 0 })).toHaveLength(1)
  })

  it('db.get(undefined, { value: boolean })', async () => {
    expect(await db.get(undefined, { value: true })).toHaveLength(1)
    expect(await db.get(undefined, { value: false })).toHaveLength(1)
  })

  it('db.get(undefined, { value: RegExp })', async () => {
    // 3 partial
    expect(await db.get(undefined, { value: /example/ })).toHaveLength(3)
    // 2 starging with
    expect(await db.get(undefined, { value: /^example/ })).toHaveLength(2)
    // 2 ending with
    expect(await db.get(undefined, { value: /example$/ })).toHaveLength(2)
    // 1 exact
    expect(await db.get(undefined, { value: /^example$/ })).toHaveLength(1)
  })
})


describe('db.set', () => {
  let db
  beforeEach(() => {
    db = new dbjs()
  })

  it('db.set() creates with { id, created }', async () => {
    const result = await db.set()
    const { id, created } = result
    expect(result).toEqual({ id, created })
    expect(await db.get()).toHaveLength(1)
  })

  it('db.set(undefined, { value }) creates with { ..., value }', async () => {
    const data = { value: 'example' }
    const result = await db.set(undefined, data)
    const { id, created, value } = result
    expect(result).toEqual({ id, created, value })
  })

  it('db.set(key, { value }) updates existing', async () => {
    const result = await db.set(undefined, { value: 'example' })
    const { id, created } = result

    const updated = await db.set(id, { value: 'updated' })
    const { value } = updated

    expect(updated).toEqual({ id, created, value })
    // make sure it doesn't create another
    expect(await db.get()).toHaveLength(1)
  })
})

describe('db.del', () => {
  let db
  beforeEach(() => {
    db = new dbjs()
  })

  it('db.del(key) deletes one', async () => {
    const { id } = await db.set()
    expect(await db.del(id)).toEqual(id)
    expect(await db.get(id)).toBeUndefined()
  })

  it('db.del(\'undefined-key\') deletes none', async () => {
    expect(await db.del('undefined-key')).toBeUndefined()
  })

  it('db.del() throws', async () => {
    expect(async () => { await db.del() }).rejects.toThrow()
  })
})
