/**
 * Project: A mail delivery robot picking up and dropping off parcels
 */

// Meadowfield consists of 11 places with 14 roads between them.
const roads = [
  "Alice's House-Bob's House",
  "Alice's House-Cabin",
  "Alice's House-Post Office",
  "Bob's House-Town Hall",
  "Daria's House-Ernie's House",
  "Daria's House-Town Hall",
  "Ernie's House-Grete's House",
  "Grete's House-Farm",
  "Grete's House-Shop",
  "Marketplace-Farm",
  "Marketplace-Post Office",
  "Marketplace-Shop",
  "Marketplace-Town Hall",
  "Shop-Town Hall"
];

function buildGraph(edges) {
  let graph = Object.create(null);
  function addEdge(from, to) {
    if (graph[from] == null) {
      graph[from] = [to];
    } else {
      graph[from].push(to);
    }
  }
  for (let [from, to] of edges.map(r => r.split("-"))) {
    addEdge(from, to);
    addEdge(to, from);
  }
  return graph;
}

const roadGraph = buildGraph(roads);
console.log(roadGraph);

/**
 * === TASK ===
 * ============
 *
 * There are parcels in various places, each addressed to some other place
 *
 * The robot picks up parcels when it comes to them and delivers them when it
 * arrives at their destinations.
 *
 * The automation must decide at each point, where to go next.
 *
 * It has finished it's tasks when all parcels have been delivered.
 *
 *
 * === SIMULATION ===
 * ==================
 *
 * Model that tells where robot is and where the parcels are.
 *
 * When robot decides to move, update the model.
 *
 */

class VillageState {
  constructor(place, parcels) {
    this.place = place;
    this.parcels = parcels;
  }

  move(destination) {
    if (!roadGraph[this.place].includes(destination)) {
      // Mustn't move to a non-attached destination
      return this;
    } else {
      // destination = robot's next destination
      // place = current place; address = parcel's destination
      let parcels = this.parcels
        .map(p => {
          // update parcel list
          if (p.place != this.place) return p; // if parcel's place not same as robot's place, maintain parce's location
          return { place: destination, address: p.address }; // else, robot is carrying, or just picked up, so update place
        })
        .filter(p => p.place != p.address); // "delivery"
      return new VillageState(destination, parcels); // return new state, leaving "this" intact
    }
  }
}

let first = new VillageState("Post Office", [
  { place: "Post Office", address: "Alice's House" } // undelivered parcel
]);
let next = first.move("Alice's House");
console.log(next.place); // -> Alice's House
console.log(next.parcels); // -> []
console.log(first.place); // -> Post Office

// Object.freeze silently ignores when its properties are written to

// When objects in my system are fixed, stable things, I can consider
// operations on them in isolation. When objects change over time,
// that adds to the complexity.

// The most important limit on what kind of systems we can build is how much
// we can understand.

// Simulation //
////////////////

/**
 * A delivery robot looks at the world and decides in which directino it wants
 * to move. So it could be a func that takes a VillageState and returns the
 * name of a nearby place.
 *
 * To make and execute plas, robots must be able to remember things, so we'll
 * pass them their memory and allow to return a new memory.
 *
 * So a robot returns an object with the direction it wants to move in and
 * a memory value that will be given back to it next time it is called.
 */

/**
 *
 * @param {VillageState} state
 * @param {function} robot
 * @param {object} memory
 */
function runRobot(state, robot, memory) {
  // console.log("1st state:", state);

  for (let turn = 0; ; turn++) {
    if (state.parcels.length == 0) {
      console.log(`Done in ${turn} turns`);
      break;
    }
    let action = robot(state, memory);
    state = state.move(action.direction);
    memory = action.memory;
    console.log(`Moved to ${action.direction}.`);
    state.parcels.map(p => {
      console.log("  ", p.place, " -- ", p.address);
    });
  }
}

// Dumbest strategy: random direction until all parcels delivered

function randomPick(array) {
  let choice = Math.floor(Math.random() * array.length);
  return array[choice];
}

function randomRobot(state) {
  return { direction: randomPick(roadGraph[state.place]) };
}

// static method to generate random parcels and starting at the
// Post Office
VillageState.random = function(parcelCount = 5) {
  let parcels = [];
  for (let i = 0; i < parcelCount; i++) {
    let address = randomPick(Object.keys(roadGraph));
    let place;
    do {
      place = randomPick(Object.keys(roadGraph));
    } while (place == address); // So delivery not the same as dest
    parcels.push({ place, address });
  }
  return new VillageState("Post Office", parcels);
};

// Starting virtual world
// runRobot(VillageState.random(), randomRobot);

// Mail Truck Route //
//////////////////////

// Garantee all parcels delivered running route twice

const mailRoute = [
  "Alice's House",
  "Cabin",
  "Alice's House",
  "Bob's House",
  "Town Hall",
  "Daria's House",
  "Ernie's House",
  "Grete's House",
  "Shop",
  "Grete's House",
  "Farm",
  "Marketplace",
  "Post Office"
];

// Robot now needs memory. Robot keeps rest of route in memory
// and drops the first element every turn
function routeRobot(state, memory) {
  if (memory.length == 0) {
    memory = mailRoute;
  }
  return { direction: memory[0], memory: memory.slice(1) };
}

// Running
// runRobot(VillageState.random(), routeRobot, mailRoute);

// Pathfinding Robot //
///////////////////////

// Approach is to grow routes from the starting point,
// exploring every reachable place that hasn't been
// visited yet, until a route reaches the goal

/**
 * work: array of places that should be explored next, along with route that got us there.
 *
 * Search then looks at all roads going from that place
 *
 * If one of the roads is the goal, returns the finished route.
 *
 * If not found:
 * -- if place not looked at before: new item added to the list
 * -- if place looked at before: no need to explore. (either found longer route or one as long as the existing one)
 */
function findRoute(graph, from, to) {
  let work = [{ at: from, route: [] }]; // start point and route
  for (let i = 0; i < work.length; i++) {
    let { at, route } = work[i]; // for each work item
    for (let place of graph[at]) {
      // for each place that `at` is connected to
      if (place == to) return route.concat(place); // if destination found, return list of routes
      if (!work.some(w => w.at == place)) {
        work.push({ at: place, route: route.concat(place) });
      }
    }
  }
}

/**
 * Code doesn't handle situation where there are nomore work items on the work
 * list because we know that our graph is connected, meaning that every location
 * can be reached from all other locations. We'll always be able to find a route
 * between two points and the search can't fail.
 */

/**
 * Robot uses its memory value as a list of directions to move in.
 * Whenever list is empty, it figure out what to do next by taking
 * the 1st undelivered parcel in the set and, if it hasn't been
 * picked up yet, plots a route toward it. If parcel has been picked
 * up, creates route toward the delivery address instead.
 */
function goalOrientedRobot({ place, parcels }, route) {
  if (route.length == 0) {
    let parcel = parcels[0];
    if (parcel.place != place) {
      route = findRoute(roadGraph, place, parcel.place);
    } else {
      route = findRoute(roadGraph, place, parcel.address);
    }
  }
  return { direction: route[0], memory: route.slice(1) };
}

// runRobot(VillageState.random(), goalOrientedRobot, []);

// ===== EXERCISES ===== //
///////////////////////////

// Measuring Robot //
/////////////////////
/**
 *
 *
 * @param {VillageState} state
 * @param {function} robot
 * @param {object} memory
 */
function runRobotSilent(state, robot, memory) {
  // console.log("1st state:", state);

  for (let turn = 0; ; turn++) {
    if (state.parcels.length == 0) {
      return turn;
      // console.log(`Done in ${turn} turns`);
      // break;
    }
    let action = robot(state, memory);
    state = state.move(action.direction);
    memory = action.memory;
    // console.log(`Moved to ${action.direction}.`);
    // state.parcels.map(p => {
    //   console.log("  ", p.place, " -- ", p.address);
    // });
  }
}

function compareRobots(...robots) {
  let robotRank = {};
  robots.map(r => (robotRank[r.name] = []));

  // console.log(robotRank);

  for (let i = 0; i < 100; i++) {
    let tasks = VillageState.random();
    for (let r of robots) {
      robotRank[r.name].push(runRobotSilent(tasks, r.robot, r.memory));
    }
  }
  for (rName of Object.keys(robotRank)) {
    robotRank[rName] = robotRank[rName].reduce((a, b) => a + b) / 100;
  }
  console.log(robotRank);
}

compareRobots(
  { name: "Mail Route Robot", robot: routeRobot, memory: mailRoute },
  { name: "Goal Oriented Robot", robot: goalOrientedRobot, memory: [] }
);

// Robot Efficiency //
//////////////////////

function shortestRouteRobot({ place, parcels }, route) {
  if (route.length == 0) {
    let routes = [];
    for (let i = 0; i < parcels.length; i++) {
      if (parcels[i].place != place) {
        routes.push(findRoute(roadGraph, place, parcels[i].place));
      } else {
        routes.push(findRoute(roadGraph, place, parcels[i].address));
      }
    }
    // find shortest route
    let shortest = { len: Infinity, idx: -1 };
    shortest = routes.reduce((val, curr, index) => {
      if (curr.length < val.len) {
        val.len = curr.length;
        val.idx = index;
      }
      return val;
    }, shortest);
    // console.log(routes);

    // console.log(shortest);
    route = routes[shortest.idx];
  }
  return { direction: route[0], memory: route.slice(1) };
}

// runRobot(VillageState.random(), goalOrientedRobot2, []);

function shortestRoutePickupFirstRobot({ place, parcels }, route) {
  if (route.length == 0) {
    let routes = [];
    let routes_idx = [];
    for (let i = 0; i < parcels.length; i++) {
      if (parcels[i].place != place) {
        routes.push(findRoute(roadGraph, place, parcels[i].place));
        // routes_idx.unshift(i);
      } else {
        routes.push(findRoute(roadGraph, place, parcels[i].address));
        // routes_idx.push(i);
      }
    }

    // Reduce to shortest length indexes
    let short_len = routes.reduce(
      (val, r, index) => {
        if (r.length < val.len) {
          val.len = r.length;
          val.idxs = [index];
        } else if (r.length === val.len) {
          val.idxs.push(index);
        }
        return val;
      },
      { len: Infinity, idxs: [] }
    );

    route = routes[short_len.idxs[0]]; // get first, so we aleays have a value for route

    // Prioritize pickup
    for (let i of short_len.idxs) {
      if (parcels[i].place != place) {
        route = routes[i];
        break;
      }
    }
  }
  return { direction: route[0], memory: route.slice(1) };
}

// runRobot(VillageState.random(), shortestRoutePickupFirstRobot, []);

// Answer
function lazyRobot({ place, parcels }, route) {
  if (route.length == 0) {
    // Describe a route for every parcel
    let routes = parcels.map(parcel => {
      if (parcel.place != place) {
        return {
          route: findRoute(roadGraph, place, parcel.place),
          pickUp: true
        };
      } else {
        return {
          route: findRoute(roadGraph, place, parcel.address),
          pickUp: false
        };
      }
    });

    // This determines the precedence a route gets when choosing.
    // Route length counts negatively, routes that pick up a package
    // get a small bonus.
    function score({ route, pickUp }) {
      return (pickUp ? 0.5 : 0) - route.length;
    }
    route = routes.reduce((a, b) => (score(a) > score(b) ? a : b)).route;
  }

  return { direction: route[0], memory: route.slice(1) };
}

runRobot(VillageState.random(), lazyRobot, []);

compareRobots(
  { name: "Mail Route Robot", robot: routeRobot, memory: mailRoute },
  { name: "Goal Oriented Robot", robot: goalOrientedRobot, memory: [] },
  { name: "Shortest Route Robot", robot: shortestRouteRobot, memory: [] },
  {
    name: "Pickup First Robot",
    robot: shortestRoutePickupFirstRobot,
    memory: []
  },
  { name: "Lazy Robot", robot: lazyRobot, memory: [] }
);

// Persistent Group //
//////////////////////

// Answer
class PGroup {
  constructor(members) {
    this._gArr = members;
  }

  add(value) {
    if (this.has(value)) return this;
    return new PGroup(this._gArr.concat([value]));
  }

  delete(value) {
    if (!this.has(value)) return this;
    return new PGroup(this._gArr.filter(e => e != value));
  }

  has(value) {
    return this._gArr.includes(value);
  }
}

PGroup.empty = new PGroup([]);

let a = PGroup.empty.add("a");
let ab = a.add("b");
let b = ab.delete("a");

console.log(a, b, ab);

console.log(b.has("b"));
// → true
console.log(a.has("b"));
// → false
console.log(b.has("a"));
// → false
