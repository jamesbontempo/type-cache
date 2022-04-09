# typecache

![Version](https://img.shields.io/github/package-json/v/jamesbontempo/type-cache?color=blue) ![Coverage](https://codecov.io/gh/jamesbontempo/type-cache/branch/main/graph/badge.svg?token=199Q3V345I) ![Dependencies](https://img.shields.io/librariesio/release/npm/@jamesbontempo/typecache) ![License](https://img.shields.io/github/license/jamesbontempo/type-cache?color=red)

`typecache` is a simple TypeScript caching library with ttl support and SQL-inspired syntax.

## Install
```js
npm install @jamesbontempo/typecache
```
## Test
```js
npm test
```
## Usage
```js
const { TypeCache } = require("@jamesbontempo/typecache");
const cache = new TypeCache();
cache.insert("key", "value");
cache.update("key", ["new value 1", "new value 2"]);
cache.delete("key");
```

## Contents

 - [Constructor](#constructor)
 - [Cache properties](#cache-properties)
 - [Cache methods](#cache-methods)
 - [Cache item methods](#cache-item-methods)
 - [Cache events](#cache-events)

## Constructor
 Creates a new `TypeCache` instance. By default, there is no `ttl` (actually, it's set to `Infinity`) & all items persist until deleted, or until the cache itself is cleared or destroyed.

## Cache properties
`count`

The number of items in the cache.

`ttl`

The default ttl in milliseconds for items inserted into the cache. You can "get" or "set" this value. Values less than or equal to zero are ignored.

## Cache methods

`keys()`

Returns an array of the cache keys.

`clear()`

Removes all items from the cache.

## Cache item methods
`insert(key, value [, ttl, force])`

Inserts an item into the cache. If no `ttl` is provided the default cache-level `ttl` is used. If a `ttl` value less than or equal to zero is provided it's ignored. If an item already exists for the given key and `force` is `true` the item will effectively be overwritten (both its `value` and its `ttl`); otherwise, no changes will be made.

`select(key)`

Returns the value of the item with the given `key`.

`exists(key)`

Returns `true` if an item with the given key exists in the cache, false otherwise. This can be particularly helpful for determining if an item really exists since a call to `select` for a non-existent key will return `undefined`.

`update(key, value)`

Updates the value of the item in the cache.

`remaining(key)`

Returns the remaining `ttl` time for the item; that is, how much longer before the item is removed from the cache. If there is no `ttl` it will return `Infinity`.

`extend(key [, ttl])`

Extends the `ttl` of the item by a number of milliseconds. If no `ttl` is provided the default cache-level ttl is used (allowing you to basically "bump" the item). If a `ttl` of `Infinity` is provided, the `ttl` is effectively removed.

`shorten(key, ttl)`

Shortens the `ttl` of the item by a number of milliseconds. Values less than or equal to zero are ignored. If the current `ttl` is less than the value provided no changes are made because the item would be deleted before the shortened time anyway. If the current `ttl` is `Infinity`,  the `ttl` is set to the value provided.

`delete(key)`

Deletes the item from the cache.

## Cache events

The cache emits events when the `insert`, `update`, and `delete` methods are called. The events have the same corresponding names: `insert`, `update`, and `delete`. They emit objects with information about the related cache items:

```js
{
    key: key name,
    value: key value,
    ttl: key ttl,
    added: when the key was added,
    modified: when the key value was last modified,
    deleted: when the key was deleted
}
```

`insert`

Emits information about the item inserted.

`update`

Emits information about an update to an item, including `before` and `after` objects allowing for comparison.

`delete`

Emits information about the item deleted; potentially useful for "listening" for `ttl` expirations.

This allows you to do things like:
```js
cache.on("insert", item => { verify(item); });

cache.on("update", item => { compare(item.before, item.after); });

cache.on("delete", item => { log(item); });
```