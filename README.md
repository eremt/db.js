# db.js

Simple in-memory database without dependencies in a single [JavaScript file](https://github.com/eremt/db.js/blob/main/src/db.js) < 100 LOC.

- **opinionated:** all objects have atleast `id` and `created` keys
- **minimalist:** only 3 operations: `get`, `set` and `del`

## Installation

Install with npm:
```
npm i -S https://github.com/eremt/db.js
```
or just download the file:
```
wget https://raw.github.com/eremt/db.js/main/src/db.js
```

## Documentation

- [`get(query?)`](https://github.com/eremt/db.js#getquery)
- [`set(key?, data?)`](https://github.com/eremt/db.js#setkey-data)
- [`del(key)`](https://github.com/eremt/db.js#delkey)

### `get(query?)`

#### `get(query: undefined)`

Without `query` (or any falsy value such as `null`, `''`, etc.) an array containing all items is returned.

#### Example
```
import db from 'db.js'

db.get()
// => [ { id, created, ... }, ... ]
```

#### `get(query: string)`

If `query` is a `string` it is treated as the `key` and returns an array with a single match if found.

#### Example
```
import db from 'db.js'

db.get('my-key')
// => [ { id: 'my-key', created, ... } ]
```

#### `get(query: { [key]: string | number | boolean | RegExp, ... })`

When `query` is an `object` it's used as filter and returns an array with the items that matched.

The `value` can be any of type: `string`, `number`, `boolean` and `RegExp`.

#### Example
```
import db from 'db.js'

db.get({ value: /example/ })
// => [ { id, created, value: 'My example', ... }, ... ]
```

### `set(key?, data?)`

### `del(key)`
