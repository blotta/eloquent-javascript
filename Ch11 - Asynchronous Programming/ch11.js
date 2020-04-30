// ----- Asynchronous Programming ----- //
//////////////////////////////////////////

// Callbacks //
///////////////

// setTimeout(() => console.log("Tick"), 2000);

const { bigOak } = require("./crow-tech");

// bigOak.readStorage("food caches", (caches) => {
//   let firstCache = caches[0];
//   bigOak.readStorage(firstCache, (info) => {
//     console.log(info);
//   });
// });

const { defineRequestType } = require("./crow-tech");

defineRequestType("note", (nest, content, source, done) => {
  console.log(`${nest.name} received note: ${content}`);
  done();
});

// bigOak.send("Cow Pasture", "note", "Let's caw loudly at 7PM", () =>
//   console.log("Note delivered.")
// );

// Promisses //
///////////////

// Asynchronous action that may complete at some point and
// produce a value. It's able to notify anyone who is
// interested when its value is available.

// Promise.resolve - easiest way to create a promise.
// Ensures that the value you give is wrapped in a promise.

// let fifteen = Promise.resolve(15);
// fifteen.then((value) => console.log(`Got ${value}`));

function sleep(ms, msg = null) {
  console.log("Sleeping for " + ms + "ms");
  console.log("msg = " + msg);
  if (ms >= 5000) {
    // return new Promise((_, reject) => reject(new Error(ms + "ms is too much time")));
    return Promise.reject(new Error(ms + "ms is too much time"));
  }
  return new Promise(resolve => setTimeout(resolve, ms, [ms, msg]));
}

// sleep(1000)
//   // fail to sleep again for 6s if success
//   .then(([ milliseconds, message ]) => {
//     let t = "finished sleeping for "+milliseconds+"ms";
//     if (message != null) {t += ". Got message: " + message}
//     console.log(t);

//     return sleep(6000, "Hello");
//   })
//   // Not called
//   .then(([ milliseconds, message ]) => {
//     let t = "finished sleeping for "+milliseconds+"ms";
//     if (message != null) {t += ". Got message: " + message}
//     console.log(t);
    
//     return sleep(5000, "5 secs");
//   // if no success, handle rejection in the same `then`, 2nd argument
//   }, (reason) => {
//     console.log("A promise returned an error: "+ reason);
//     return sleep(4999, "my bad");
//   })
//   // fail to sleep again
//   .then(([ milliseconds, message ]) => {
//     let t = "finished sleeping for "+milliseconds+"ms";
//     if (message != null) {t += ". Got message: " + message}
//     console.log(t);
    
//     return sleep(5000, "5 secs");
//   })
//   // Now handle rejection in its own `catch`
//   .catch((reason) => {
//     console.log("A promise returned an error: "+ reason);
//     return sleep(4999, "my bad");

//   })
//   // now finish
//   .then(([milliseconds, message]) => {
//     let t = "finished sleeping for "+milliseconds+"ms";
//     if (message != null) {t += ". Got message: " + message}
//     console.log(t);
//     console.log("finally finished");
//     continueProgram(message);
//   })

function continueProgram(a) {
  console.log("Rest of program '" + a + "'");
}
  
// Got 15

/**
 * Use the `then` method to get the result of a promise.
 *
 * Registers a function to be called when the promise
 * resolves and produces a value.
 *
 * Possible to add multiple callbacks to a single promise, and
 * they will be called even if you add them after the promise
 * has already been resolved (finished).
 *
 * The `then` method returns another promise, which resolves to the value that
 * the handler function returns or, if that returns a promise, waits for that
 * promise and then resolves to its result.
 *
 * A normal value is simply there. A promise value is a value that might
 * already be there or might appear at some point in the future.
 *
 */

// Creating promises with a constructor
// The constructor expects a function as argument, which it immediately calls.
// The constructor passes a function to the passed function that can be used
// to resolve the promise.
// This is so only the code that created the promise can resolve it.

function storage(nest, name) {
  return new Promise((resolve) => {
    nest.readStorage(name, (result) => resolve(result));
  });
}

// storage(bigOak, "enemies").then((value) => console.log("Got enemies", value));

// Failure //
/////////////

/**
 * Extremelly difficult to make sure failures are properly reported to the
 * callbacks.
 *
 * Widely used convention is that the 1st argument to the callback is used
 * to indicate that the action failed and the second contains the value
 * produced by the action when it was successful.
 *
 * Such callback functions must always check whether they received an
 * exception and make sure that any problems they cause, including
 * exceptions thrown by functions they call, are caught and given to the
 * right function.
 *
 * Promises make this easier. Can be either resolved (action finished
 * sucessfully) or rejected (it failed).
 *
 * Resolve handlers (as registered with `then`) are called only when the
 * action is successful, and rejections are automatcally propagated to the
 * new promise that is returned by `then`.
 *
 * If any element in a chain of asynchronous actions fails, the outcome
 * of the whole chain is marked as rejected, and no success handlers are
 * called beyond the point where it failed.
 *
 * Much like resolving a promise provides a value, rejecting one also
 * provides one, usually called the `reason` of the rejection. When an
 * exception in a handler function causes the rejection, exception is used
 * as reason.
 *
 * There's a Promise.reject function that creates a new, immediately
 * rejected promise
 *
 * To handle rejections, promises have a catch method that registers a
 * handler to be called when the promise is rejected. It returns a new
 * promise, which resolves to the original promise's value if it resolves
 * normally and to the result of the catch handler otherwise. If catch
 * handler throws error, new promise is also rejected.
 *
 * `then` also accepts a rejection handler as a second argument.
 *
 * A function passed to the Promise constructor receives a second argument
 * alongside the resolve function, which it can use to reject the new
 * promise.
 */

// let a = new Promise((_, reject) => reject(new Error("Fail")))
//   .then((value) => console.log("Handler 1"))
//   .catch((reason) => {
//     console.log("Caught failure " + reason);
//     return "nothing";
//   })
//   .then((value) => {
//     console.log("Handler 2", value);
//     return "to A";
//   });
// // -> Caught failure Error: Fail
// // -> Handler 2 nothing

// a.then((value) => console.log(`Got ${value}`));
// // -> Got to A


// Networks are Hard //
///////////////////////

// Making request function automatically retry the sending of the request
// a few times.
// request function returns promise
// Even if request and its response are successfully delivered, response
// may indicate failure. `send` and `defineRequestType` follow the
// convention where the first argument passed to callbacks is the failure,
// if any, and the second is the actual result.

class Timeout extends Error {}

function request(nest, target, type, content) {
  return new Promise((resolve, reject) => {
    let done = false;
    function attempt(n) {
      nest.send(target, type, content, (failed, value) => {
        done = true;
        if (failed) reject(failed);
        else resolve([value, n]);
      });
      setTimeout(() => {
        if (done) {
          // console.log("send already called callback. No need to continue");
          return;
        }
        else if (n < 3) attempt(n + 1);
        else reject(new Timeout("Timed out"));
      }, 250);
    }
    attempt(1);
  });
}

// // request(bigOak, "Big Maple", "note", "heyheyhey") // not reachable
// // request(bigOak, "Butcher Shop", "notAnAction", "heyheyhey") // Unknown request type
// request(bigOak, "Butcher Shop", "note", "heyheyhey") // ok, if no timeout
//   .then(([value, n]) => console.log("Request OK: " + value + " Attempts " + n))
//   .catch((reason) => console.log("Request failed: " +reason));

/**
 * Promises can be resolved or rejected only once. Outcome determined by
 * first one called.
 *
 * Need to use recursive function, since a regular loop doesn't allow us
 * to stop and wait for an asynchronous action.
 */

// wrapper for defineRequestType that allows handler function to return
// promise or plain value

function requestType(name, handler) {
  defineRequestType(name, (nest, content, source, callback) => {
    try {
      Promise.resolve(handler(nest, content, source))
        .then(
          response => callback(null, response),
          failure => callback(failure));
    } catch (exception) {
      callback(exception);
    }
  });
}

// Collections of Promisses //
//////////////////////////////

// Each nest has `neighbors` property with an array of other nests within
// transmission distance.

// Could write a function that tries to 'ping' each of them.

// Promises.all returns a promise that waits for all of the promises in the
// to resolve and then resolves to an array of the values that these
// promises produced. If any promise rejected, the result of Promise.all
// is itself rejected.

requestType("ping", () => "pong");

function availableNeighbors(nest) {
  let requests = nest.neighbors.map(neighbor => {
    // request returns promise
    return request(nest, neighbor, "ping")
      .then(() => true, () => false);
  });
  return Promise.all(requests).then(result => {
    return nest.neighbors.filter((_, i) => result[i]);
  });
}

/**
 * Once we have an array with elements that are true if the neighbor is
 * reachable, and false if not, we use filter to create a 3rd array
 * that is returned with only the reachable neighbors.
 */

// Network Flooding //
//////////////////////

// Broadcasting information by setting up a type of request that is
// automatically forwarded to neighbors, which in turn, forward to
// their neighbors. (I think double messaging is fine)

// function that runs code on every nest
const {everywhere} = require("./crow-tech");

// defining array of gossip strings that it has already seen
everywhere(nest => {
  nest.state.gossip = [];
});

function sendGossip(nest, message, exceptFor = null) {
  nest.state.gossip.push(message);
  for (let neighbor of nest.neighbors) {
    if (neighbor == exceptFor) continue;
    request(nest, neighbor, "gossip", message);
  }
}

// registering action/request type
requestType("gossip", (nest, message, source) => {
  if (nest.state.gossip.includes(message)) return;
  // console.log(`${nest.name} received gossip '${message}' from ${source}`);
  sendGossip(nest, message, source);
});

sendGossip(bigOak, "Kids with airgun in the park");

// Message Routing //
/////////////////////

// A given node wants to talk to a single other node

// We can use flooding again, but instead of checking whether a given message
// has already been received, we now check whether the new set of neighbors for
// a given nest matched the current set we have for it

requestType("connections", (nest, {name, neighbors},
                            source) => {
  let connections = nest.state.connections;
  if (JSON.stringify(connections.get(name)) ==
      JSON.stringify(neighbors)) return;
  connections.set(name, neighbors);
  broadcastConnections(nest, name, source);
});

function broadcastConnections(nest, name, exceptFor = null) {
  for (let neighbor of nest.neighbors) {
    if (neighbor == exceptFor) continue;
    request(nest, neighbor, "connections", {
      name,
      neighbors: nest.state.connections.get(name)
    });
  }
}

everywhere(nest => {
  nest.state.connections = new Map;
  nest.state.connections.set(nest.name, nest.neighbors);
  broadcastConnections(nest, nest.name);
});

// This findRoute function, similar to the one on Chapter 7, searches
// for a way to reach a given node in the network. But instead of
// returning the whole route, it just returns the next step. That
// next nest will itself decide where it sends the message.

function findRoute(from, to, connections) {
  let work = [{at: from, via: null}];
  // console.log(connections);
  for (let [k,v] of connections) {
    // console.log(`Key: ${k}  Value: ${v}`);
  }
  for (let i = 0; i < work.length; i++) {
    let {at, via} = work[i];
    // console.log(`findRoute From ${at} to ${to}. Conns ${connections.get(at)}`);
    for (let next of connections.get(at) || []) {
      if (next == to) return via;
      if (!work.some(w => w.at == next)) {
        work.push({at: next, via: via || next});
      }
    }
  }
  return null;
}

/**
 * Now we can send long distance messages
 * 
 * if message is addressed to a direct neighbor, delivered as usual
 * 
 * if not, packaged in an object and sent to a neighbor closer to target
 * using the 'route' request type, which will cause the neighbor to 
 * repeat the same behaviour
 */

function routeRequest(nest, target, type, content) {
  if (nest.neighbors.includes(target)) {
    return request(nest, target, type, content);
  } else {
    // console.log(nest.state.connections);
    let via = findRoute(nest.name, target,
                        nest.state.connections);
    if (!via) throw new Error(`No route to ${target}`);
    return request(nest, via, "route",
                   {target, type, content});
  }
}

requestType("route", (nest, {target, type, content}) => {
  return routeRequest(nest, target, type, content);
});

// sending 4-hop message
// Needs to wait for some reason, or it returns the Error
// sleep(100)
//   .then(() => {
//     routeRequest(bigOak, "Church Tower", "note", "Incoming jackdaws!");
//     // routeRequest(bigOak, "Tall Poplar", "note", "Incoming jackdaws!");
//   });
// routeRequest(bigOak, "Tall Poplar", "note", "Incoming jackdaws!");


// Async Functions //
/////////////////////

requestType("storage", (nest, name) => storage(nest, name));

function network(nest) {
  return Array.from(nest.state.connections.keys());
}

function findInRemoteStorage(nest, name) {
  let sources = network(nest).filter(n => n != nest.name);
  function next() {
    if (sources.length == 0) {
      return Promise.reject(new Error("Not found"));
    } else {
      let source = sources[Math.floor(Math.random() *
                                      sources.length)];
      sources = sources.filter(n => n != source);
      return routeRequest(nest, source, "storage", name)
        .then(value => value != null ? value : next(),
              next);
    }
  }
  return next();
}

// Synchronous version
function findInStorageSync(nest, name) {
  return storage(nest, name)
    .then(found => {
      if (found != null) return found;
      else return findInRemoteStorage(nest, name);
    });
}

// Async Version
async function findInStorage(nest, name) {
  let local = await storage(nest, name);
  if (local != null) return local;

  let sources = network(nest).filter(n => n != nest.name);
  while (sources.length > 0) {
    let source = sources[Math.floor(Math.random() *
                                    sources.length)];
    sources = sources.filter(n => n != source);
    try {
      let found = await routeRequest(nest, source, "storage",
                                     name);
      if (found != null) return found;
    } catch (_) {}
  }
  throw new Error("Not found");
}

/**
 * Async function is marked by word 'async' before the 'function'
 * keyword
 * 
 * When such a function or method is called, it returns a promise
 * 
 * As soon as body returns something, that promise is resolved
 * 
 * if it throws an exception, the promise is rejected
 * 
 * Inside an async function, the word 'await' can be put in front
 * of an expression to wait for a promisse to resolve and only then
 * continue th execution of the function
 * 
 */

// seems the same
findInStorageSync(bigOak, "enemies")
  .then(console.log);

findInStorage(bigOak, "emies")
  .then(console.log)
  .catch(console.log);

// Generators //
////////////////

/**
 * "function*" functions are generators
 * 
 * When you call a generator, it returns an iterator (seen in Ch06)
 */

function* powers(n) {
  for (let current = n;; current *= n) {
    yield current;
  }
}

for (let power of powers(3)) {
  if (power > 50) break;
  console.log(power);
}

// Chapter 6's iterator can be rewritten like this
class Group {
    constructor() {
        this._gArr = [];
    }

    add(value) {
        if (!this.has(value)) {
            this._gArr.push(value);
        }
    }

    delete(value) {
        this._gArr.filter((e) => e != value);
    }

    has(value) {
        return this._gArr.includes(value);
    }

    static from(iterable) {
        let g = new Group();
        for (let item of iterable) {
            g.add(item);
        }
        return g;
    }

    // [Symbol.iterator]() { return new GroupIterator(this);}
}

Group.prototype[Symbol.iterator] = function*() {
  for (let i = 0; i < this._gArr.length; i++) {
    yield this._gArr[i];
  }
};

for (let item of Group.from(["4", "10", "28"])) {
    console.log("Item:", item);
}

/**
 * yield expressions can only occur directly in the generator
 * function itself. The state a generator saves is only its local
 * environment
 */

//  function sleep(ms, msg = null) {
//   console.log("Sleeping for " + ms + "ms");
//   console.log("msg = " + msg);
//   if (ms >= 5000) {
//     // return new Promise((_, reject) => reject(new Error(ms + "ms is too much time")));
//     return Promise.reject(new Error(ms + "ms is too much time"));
//   }
//   return new Promise(resolve => setTimeout(resolve, ms, [ms, msg]));
// }

// Rewriting sleep with async
async function sleepAsync(ms, msg = null) {
  console.log("Sleeping for " + ms + "ms");
  console.log("msg = " + msg);
  if (ms >= 5000) {
    throw new Error(ms + "ms is too much time");
  }

  let promise = new Promise((resolve, reject) => {
    if (msg == "failplease") {
      setTimeout(() => reject([ms, msg]), ms);
    } else {
      setTimeout(() => resolve([ms, msg]), ms);
    }
  });
  
  let result = await promise;
  console.log(ms + " LALALA " + typeof result);
  // only gets here if promise was resolved
  return result;
}

sleep(600, "Promise")
  .then((res) => console.log(`res: ${res}`));

sleepAsync(700, "Async")
  .then((res) => console.log(`res: ${res}`))

sleepAsync(800, "failplease")
  .catch((reason) => console.log("Failed: " + reason));


// Event Loop //
////////////////

/**
 * A JS environment will run only one program at a time.
 * 
 * As events come in, they are added to a queue, and their code
 * is executed one after the other.
 * 
 * Because no two things run at the same time, slow-running code might
 * delay the handling of other events.
 */

// this example sets a timeout but then dallies until after the timeout's
// intended point of time, causing the timeout to be late.
let start = Date.now();
setTimeout(() => {
  console.log("Timeout ran at", Date.now() - start);
}, 20);
// basically a synchronous sleep
while (Date.now() < start + 50) {}
console.log("Wasted time until", Date.now() - start);
// → Wasted time until 50
// → Timeout ran at 55 (+)


// Promises always resolve or reject as a new event.
Promise.resolve("Done").then(console.log);
console.log("Me first!");