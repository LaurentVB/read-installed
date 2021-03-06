var readInstalled = require("../read-installed.js")
var json = require("./fixtures/package.json")
var known = [].concat(Object.keys(json.dependencies)
  , Object.keys(json.optionalDependencies)
  , Object.keys(json.devDependencies)).sort()
var test = require("tap").test
var path = require("path")

test("make sure that it works", function (t) {
  readInstalled(path.join(__dirname, "../"), {
    dev: true,
    log: console.error
  }, function (er, map) {
    t.notOk(er, "er should be bull")
    t.ok(map, "map should be data")
    if (er) return console.error(er.stack || er.message)
    cleanup(map)
    var deps = Object.keys(map.dependencies).sort()
    t.equal(known.length, deps.length, "array lengths are equal")
    t.deepEqual(known, deps, "arrays should be equal")
    t.notOk(map.dependencies.tap.extraneous, 'extraneous not set on devDep')
    t.end()
  })
})

var seen = []
function cleanup (map) {
  if (seen.indexOf(map) !== -1) return
  seen.push(map)
  for (var i in map) switch (i) {
    case "_id":
    case "path":
    case "extraneous": case "invalid":
    case "dependencies": case "name":
      continue
    default: delete map[i]
  }
  var dep = map.dependencies
//    delete map.dependencies
  if (dep) {
//      map.dependencies = dep
    for (var i in dep) if (typeof dep[i] === "object") {
      cleanup(dep[i])
    }
  }
  return map
}
