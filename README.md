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

`update(key, value)` Updates the value of the item in the cache.

`remaining(key)` Returns the remaining `ttl` time for the item; that is, how much longer before the item is removed from the cache.

`extend(key [, ttl])` Extends the `ttl` of the item by a number of milliseconds. If no `ttl` is provided the default cache-level ttl is used (allowing you to basically "bump" the item). If a `ttl` of `Infinity` is provided, the `ttl` is effectively removed.

`shorten(key, ttl)` Shortens the `ttl` of the item by a number of milliseconds. If the current `ttl` is less than the value provided no changes are made because the item would be deleted before the shortened time anyway. If the current `ttl` is `Infinity` sets the `ttl` to the value provided.

`delete(key)` Deletes the item from the cache.

## Cache events

The cache emits events when the `insert`, `update`, and `delete` methods are called. The events have the same corresponding names: `insert`, `update`, and `delete`. They emit objects with information about the related cache items:

```js
{
    key: key name,
    value: key value,
    ttl: ttl,
    added: when the key was added,
    modified: when the key was modified,
    deleted: when the key was deleted
}
```

`insert` Emits information about the item inserted.

`update` Emits information about the updates to an item. Includes `before` and `after` objects allowing for comparison.

`delete` Emits information about the item deleted. Useful to "listen" for `ttl` expirations.

This allows you to do something like this:
```js
cache.on("delete", item => { doSomethingWith(item); });
```