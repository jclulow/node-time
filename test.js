var assert = require('assert');

var time = require('./');
var initialTz = time.currentTimezone;

var d = new time.Date(Date.UTC(2011, 0, 1));

assert.equal(d.getUTCFullYear(), 2011);
assert.equal(d.getUTCMonth(), 0);
assert.equal(d.getUTCDate(), 1);
console.log(d+'');


d.setTimezone("UTC");
console.log(d+'');
console.log("UTC Hours: " + d.getHours());
assert.equal(d.getUTCDay(), d.getDay());
assert.equal(d.getUTCDate(), d.getDate());
assert.equal(d.getUTCFullYear(), d.getFullYear());
assert.equal(d.getUTCHours(), d.getHours());
assert.equal(d.getUTCMilliseconds(), d.getMilliseconds());
assert.equal(d.getUTCMinutes(), d.getMinutes());
assert.equal(d.getUTCMonth(), d.getMonth());
assert.equal(d.getUTCSeconds(), d.getSeconds());
assert.equal(d.getTimezoneOffset(), 0);


d.setTimezone("America/Los_Angeles");
console.log(d+'');
console.log("LA Hours: " + d.getHours());
assert.equal(d.getHours(), 16);
assert.equal(d.getTimezoneOffset(), 480);


d.setTimezone("America/New_York");
console.log(d+'');
console.log("NY Hours: " + d.getHours());
assert.equal(d.getHours(), 19);


d.setTimezone("US/Arizona");
console.log(d+'');
console.log("AZ Hours: " + d.getHours());
assert.equal(d.getHours(), 17);
assert.equal(d.getUTCHours(), 0);
d.setUTCHours(23);
assert.equal(d.getHours(), 16);
d.setHours(15);
assert.equal(d.getHours(), 15);

// The 'Date' extension functions are meant to "clean up" after themselves
// by setting the TZ variable back to it's original value after doing it's thing.
assert.equal(process.env.TZ, initialTz);


// We can call the 'extend()' function to transform a regular Date instance
// into a node-time extended Date instance...
var regularDate = new Date();
assert.equal('setTimezone' in regularDate, false);
var rtn = time.extend(regularDate);
assert.equal('setTimezone' in regularDate, true);
assert.ok(rtn === regularDate); // Should return the same instance


// 'node-time' goes out of it's way to ensure that we don't modify the global
// Date instance. 'Date' is shared globally between modules by default (when
// NODE_MODULE_CONTEXTS is NOT set), so we need to make sure that we don't modify
// it, and instead export our own Date constructor...
assert.ok(time.Date !== Date);


// If you pass `true` as a second argument to Date#setTimezone(), then instead
// of changing the local get* functions on the Date instance to match the
// timezone's representation of the internal UTC time, the local values are
// instead retained, and the Date's internal UTC time is adjusted to match so:
var relative = new time.Date()
  , ms = relative.getMilliseconds()
  , se = relative.getSeconds()
  , mi = relative.getMinutes()
  , ho = relative.getHours()
  , da = relative.getDate()
  , mo = relative.getMonth()
  , ye = relative.getFullYear()
  , t  = relative.getTime()

relative.setTimezone('UTC', true)

assert.equal(ms, relative.getMilliseconds())
assert.equal(se, relative.getSeconds())
assert.equal(mi, relative.getMinutes())
assert.equal(ho, relative.getHours())
assert.equal(da, relative.getDate())
assert.equal(mo, relative.getMonth())
assert.equal(ye, relative.getFullYear())
assert.notEqual(t, relative.getTime())
