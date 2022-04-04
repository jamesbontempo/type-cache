const { TypeCache } = require("../dist/typecache");
const expect = require("chai").expect;

var cache;
var items = [];
var keys = [];
var count = 0;
var inserts = [];
var updates = [];
var deletes = [];

describe("TypeCache tests", () => {

    it("Creates a new TypeCache instance", () => {
        cache = new TypeCache();
        expect(cache.count).to.equal(0);
        expect(cache.ttl).to.equal(Infinity);
    });

    it("Listens for items being inserted into the cache", () => {
        let properties = ["added", "deleted", "key", "modified", "ttl", "value"];
        cache.on("insert", item => {
            expect(Object.getOwnPropertyNames(item).sort()).to.deep.equal(properties);
            expect(item.modifed).to.equal(undefined);
            expect(item.deleted).to.equal(undefined);
            inserts.push(item);
        });
    });

    it("Listens for items being updated in the cache", () => {
        let properties = ["after", "before"];
        cache.on("update", item => {
            expect(Object.getOwnPropertyNames(item).sort()).to.deep.equal(properties);
            expect(item.after.modified).to.not.equal(undefined);
            updates.push(item);
        });
    });

    it("Listens for items being deleted from the cache", () => {
        let properties = ["added", "deleted", "key", "modified", "ttl", "value"];
        cache.on("delete", item => {
            expect(Object.getOwnPropertyNames(item).sort()).to.deep.equal(properties);
            if (item.key !== "0" && item.key !== "9") {
                expect(item.deleted - item.added).to.be.at.least(item.ttl - 10);
            } else if (item.key === "9") {
                expect(item.deleted - item.added).to.be.at.least(10 * 1000);
            }
            deletes.push(item);
        });
    });

    it("Updates the default ttl value", () => {
        cache.ttl = 500;
        expect(cache.ttl).to.equal(500);
    });

    it("Tries to set the ttl to a non-number value", () => {
        cache.ttl= "not a number";
        expect(cache.ttl).to.equal(500);
    });

    it("Inserts 10 items into the cache", () => {
        for (let i = 0; i < 10; i++) {
            let key = i;
            let value = i + 1;
            let ttl = (i === 7) ? 2000 : undefined
            cache.insert(key, value, ttl)
            items.push({ key: key.toString(), value: value, ttl: ttl || cache.ttl });
            keys.push(i.toString());
            count++;
        }
        expect(cache.count).to.equal(10);
        expect(cache.keys()).to.deep.equal(keys)
    });

    it("Selects those 10 items & inspects their values", () => {
        for (let i = 0; i < 10; i++) {
            expect(cache.select(i)).to.equal(i + 1);
        }
    });

    it("Tries to find & select an item that doesn't exist in the cache", () => {
        expect(cache.exists("non-existent")).to.equal(false);
        expect(cache.select("non-existent")).to.equal(undefined);
    });

    it("Updates the value of an item in the cache", () => {
        let value = ["new value"];
        cache.update("5", value);
        items.find(item => item.key === "5").value = value;
        expect(cache.select(5)).to.deep.equal(value);
    });

    it("Tries to update the value of an item that doesn't exist in the cache", () => {
        cache.update("non-existent item", "foo");
        expect(cache.select("non-existent item")).to.equal();
    })

    it("Extends items in the cache", () => {
        cache.extend("7")
        items.find(item => item.key === "7").ttl += 500;
        cache.extend("8", 5000);
        items.find(item => item.key === "8").ttl += 5000;
        cache.extend("9", Infinity);
        items.find(item => item.key === "9").ttl += Infinity;
    });

    it("Tries to extend a non-existent item", () => {
        cache.extend("non-existent item");
        expect(cache.remaining("non-existent item")).to.equal();
    });

    it("Shortens items in the cache", () => {
        cache.shorten("7", 50);
        items.find(item => item.key === "7").ttl -= 50;
        cache.shorten("9", 15000);
        items.find(item => item.key === "9").ttl = 15000;
    });

    it("Tries to shorten an item in the cache that has a shorter ttl", () => {
        cache.shorten("8", 6000);
        expect(cache.remaining("8")).to.be.below(5500);
    });

    it("Tries to shorten an item in the cache using a non-number value", () => {
        cache.shorten("7", "not a number");
        expect(cache.remaining("7")).to.be.above(2400);
    });

    it ("Checks the remaining time before deletion for items in the cache", () => {
        expect(cache.remaining("9")).to.be.below(15000);
        expect(cache.remaining("8")).to.be.below(5500);
        expect(cache.remaining("7")).to.be.below(2450);
    });

    it("Checks the remaining time for an item that doesn't exist", () => {
        expect(cache.remaining("non-existent item")).to.equal();
    })

    it ("Inserts an item w/an undefined value into the cache", () => {
        cache.insert("undefined", undefined);
        items.push({ key: "undefined", value: undefined, ttl: cache.ttl });
        keys.push("undefined");
        count++;
        expect(cache.select("undefined")).to.equal(undefined);
        expect(cache.exists("undefined")).to.equal(true);
    });

    it("Deletes an item from the cache", () => {
        cache.delete("0");
        keys.shift()
        expect(cache.exists(0)).to.equal(false);
        expect(cache.count).to.equal(keys.length);
        expect(cache.keys()).to.deep.equal(keys);
    });

    it("Waits a second then checks what items remain in the cache", function(done) {
        setTimeout((cache) => { expect(cache.keys().sort()).to.deep.equal(["7", "8", "9"]); done(); }, 1000, cache);
    });

    it("Waits ten seconds then deletes the remaining cache items", function(done) {
        this.timeout(10500);
        setTimeout(() => {
            expect(cache.count).to.equal(1);
            cache.clear();
            expect(cache.count).to.equal(0);
            expect(cache.keys()).to.deep.equal([]);
            done();
        }, 10000);
    });

    it("Checks to see if we 'heard' every event", function(done) {
        expect(inserts.length).to.equal(count);
        expect(updates.length).to.equal(1);
        expect(deletes.length).to.equal(count);
        for (deleted of deletes) {
            let item = items.find(item => item.key === deleted.key);
            expect({ value: item.value, ttl: item.ttl }).to.deep.equal({ value: deleted.value, ttl: deleted.ttl });
        }
        done();
    });
});