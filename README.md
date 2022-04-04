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
## Basic Usage
```js
const { TypeCache } = require("type-cache");
const cache = new TypeCache();
cache.insert("key", "value");
cache.update("key", "new value");
cache.delete("key");
```
## Constructor
 Creates a new `TypeCache` instance. By default, there is no `ttl` & all items persist until deleted, or until the cache itself is cleared or destroyed.

## Cache properties and methods
`count` The number of items in the cache.

`ttl([milliseconds])` Gets or sets the default ttl for items inserted into the cache.

`keys()` Returns an array of the cache keys.

## Cache item methods
`insert(key, value [,ttl])` Inserts an item into the cache. If no `ttl` is provided the default cache-level ttl is used.