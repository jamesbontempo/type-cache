const { TypeCache, T } = require("../dist/type-cache");

const cache = new TypeCache();
cache.on("delete", o => console.log(o));
cache.insert("test", [1,2,3,4,5], 1000);
for (let i = 0; i < 10; i++) {
    cache.insert(i, i+1);
}
console.log(cache.count);
cache.update(5, "new value");
cache.extend(7, 200)
setTimeout(function(cache) { console.log(cache); }, 2000, cache);
let t = T;
console.log(t);