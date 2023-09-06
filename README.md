# db.js

Simple in-memory database without dependencies in a [single JavaScript file](https://github.com/eremt/db.js/blob/main/src/db.js).

- **opinionated:** all objects have atleast `id`, `created` and `updated` keys
- **minimalist:** only 3 operations: `get`, `set` and `del`
- **tiny:** less than 100 LOC including comments and whitespace

## Installation

Install with npm:
```
npm i -S https://github.com/eremt/db.js
```
or just download the file:
```
wget https://raw.github.com/eremt/db.js/main/db.js
```

## Documentation

- [`dbjs(options?)`](https://github.com/eremt/db.js#dbjsoptions)
- [`get(query?)`](https://github.com/eremt/db.js#getquery)
- [`set(data?, key?)`](https://github.com/eremt/db.js#setdata-key)
- [`del(key)`](https://github.com/eremt/db.js#delkey)

### `dbjs(options?)`

```
const dbjs = require('db.js')
const db = new dbjs()
```

### `get(query?)`

#### `get(query: undefined)`

Without `query` (or any falsy value such as `null`, `''`, etc.) an array containing all items is returned.

#### Example
```
db.get()
// => [ { id, created, updated, ... }, ... ]
```

#### `get(query: string)`

If `query` is a `string` it is treated as the `key` and returns an array with a single match if found.

#### Example
```
db.get('my-key')
// => [ { id: 'my-key', created, updated, ... } ]
```

#### `get(query: { [key]: string | number | boolean | RegExp, ... })`

When `query` is an `object` it's used as filter and returns an array with the items that matched.

The `value` can be any of type: `string`, `number`, `boolean` and `RegExp`.

#### Example
```
db.get({ value: /example/ })
// => [ { id, created, updated, value: 'My example', ... }, ... ]
```

### `set(data?, key?)`

#### `set(data: undefined, key: undefined)`

Without arguments a default object is created with `id`, `created` and `updated` keys. Returns the created object.

#### Example
```
db.set()
// => { id, created, updated }
```

#### `set(data: any, key: undefined)`

With `data` but no `key` a new object is created with the default keys and the `data` object. Returns the created object.

#### Example
```
db.set({ value: 'My example' })
// => { id, created, updated, value: 'My example' }
```

#### `set(data: any, key: string)`

When `data` and `key` are passed it does one of two things:

If the `key` is found it updates that object with the `data` and a new `updated` value.

If no `key` is found it creates a new object with the `data` and all default values except `id` which gets its value from `key`.

Returns the updated or created object.

#### Example
```
db.set({ value: 'My example' }, 'my-key')
// => { id: 'my-ke', created, updated, value: 'My example' }
```

### `del(key)`
