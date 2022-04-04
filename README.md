# type-cache

![Version](https://img.shields.io/github/package-json/v/jamesbontempo/type-cache?color=blue) [![Coverage](https://codecov.io/gh/jamesbontempo/type-cache/branch/main/graph/badge.svg?token=199Q3V345I)](https://codecov.io/gh/jamesbontempo/type-cache) ![License](https://img.shields.io/github/license/jamesbontempo/type-cache?color=red)

`type-cache` is a simple TypeScript caching library with ttl support and SQL-inspired syntax.

## Install
```js
npm install type-cache
```
## Test
```js
npm test
```
## Usage
```js
const { TypeCache } = require("type-cache");
const cache = new TypeCache();
cache.insert("key", "value");
cache.update("key", ["new value 1", "new value 2"]);
cache.delete("key");
```
## Constructor
 Creates a new `TypeCache` instance. By default, there is no `ttl` & all items persist until deleted, or until the cache itself is cleared or destroyed.

## Cache properties
`count` The number of items in the cache.

`ttl` The default ttl in milliseconds for items inserted into the cache. You can "get" or "set" this value.

## Cache methods

`keys()` Returns an array of the cache keys.

`clear()` Removes all items from the cache.

## Cache item methods
`insert(key, value [, ttl])` Inserts an item into the cache. If no `ttl` is provided the default cache-level ttl is used.

`update(key, value)` Updates the value of the key in the cache.

`remaining(key)` Returns the remaining `ttl` time; that is, how much longer before the item is removed from the cache.

`extend(key [, ttl])` Extends the `ttl` of the item. If no `ttl` is provided the default cache-level ttl is used. If a `ttl` of `Infinity` is provided, the `ttl` is effectively removed.

`shorten(key, ttl)` Shortens the `ttl` of the item.

`delete(key)`

## Cache events

`insert`

`update`

`delete`