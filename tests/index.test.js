const dbjs = require('../db.js')
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
    await Promise.all(data.map(obj => db.set(obj)))
  })

  it('db.get() gets all', async () => {
    expect(await db.get()).toHaveLength(8)
  })

  it('db.get(string) gets one', async () => {
    const [first] = await db.get()
    expect(await db.get(first.id)).toEqual([first])
  })

  it('db.get(\'undefined-key\') gets none', async () => {
    expect(await db.get('undefined-key')).toHaveLength(0)
  })

  it('db.get({ value: string })', async () => {
    expect(await db.get({ value: 'example' })).toHaveLength(1)
    expect(await db.get({ value: '' })).toHaveLength(1)
  })

  it('db.get({ value: number })', async () => {
    expect(await db.get({ value: 1 })).toHaveLength(1)
    expect(await db.get({ value: 0 })).toHaveLength(1)
  })

  it('db.get({ value: boolean })', async () => {
    expect(await db.get({ value: true })).toHaveLength(1)
    expect(await db.get({ value: false })).toHaveLength(1)
  })

  it('db.get({ value: RegExp })', async () => {
    // 3 partial
    expect(await db.get({ value: /example/ })).toHaveLength(3)
    // 2 starging with
    expect(await db.get({ value: /^example/ })).toHaveLength(2)
    // 2 ending with
    expect(await db.get({ value: /example$/ })).toHaveLength(2)
    // 1 exact
    expect(await db.get({ value: /^example$/ })).toHaveLength(1)
  })
})


describe('db.set', () => {
  let db
  beforeEach(() => {
    db = new dbjs()
  })

  it('db.set() creates { id, created, updated }', async () => {
    const result = await db.set()
    const { id, created, updated } = result
    expect(result).toEqual({ id, created, updated })
    // created and updated should be the same
    expect(created).toEqual(updated)
    expect(await db.get()).toHaveLength(1)
  })

  it('db.set({ value }) creates { ..., value }', async () => {
    const data = { value: 'example' }
    const result = await db.set(data)
    const { id, created, updated, value } = result
    expect(result).toEqual({ id, created, updated, value })
  })

  it('db.set({ value }, key) updates { updated, value }', async () => {
    const { id, created } = await db.set({ value: 'example' })

    // mock time to pass before update
    jest.useFakeTimers().setSystemTime(new Date(created + 1000))
    const result = await db.set({ value: 'updated' }, id)
    const { updated, value } = result

    expect(result).toEqual({ id, created, updated, value })
    // created and result.created should be the same
    expect(result.created).toEqual(created)
    // but result.created and updated should not
    expect(result.created).not.toEqual(updated)
    // make sure it doesn't create another
    expect(await db.get()).toHaveLength(1)

    jest.useRealTimers() // restore mocks
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
    expect(await db.get(id)).toHaveLength(0)
  })

  it('db.del(\'undefined-key\') deletes none', async () => {
    expect(await db.del('undefined-key')).toBeUndefined()
  })

  it('db.del() throws', async () => {
    expect(async () => { await db.del() }).rejects.toThrow()
  })
})
