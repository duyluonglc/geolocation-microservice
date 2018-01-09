'use strict'
/*
 'use strict' is not required but helpful for turning syntactical errors into true errors in the program flow
 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
*/

/*
 Modules make it possible to import JavaScript files into your application.  Modules are imported
 using 'require' statements that give you a reference to the module.

  It is a good idea to list the modules that your application depends on in the package.json in the project root
 */
const MongoClient = require('mongodb').MongoClient
const database = require('../../config/database')

/*
 Once you 'require' a module you can reference the things that it exports.  These are defined in module.exports.

 For a controller in a127 (which this is) you should export the functions referenced in your Swagger document by name.

 Either:
  - The HTTP Verb of the corresponding operation (get, put, post, delete, etc)
  - Or the operationId associated with the operation in your Swagger document

  In the starter/skeleton project the 'get' operation on the '/hello' path has an operationId named 'hello'.  Here,
  we specify that in the exports of this module that 'hello' maps to the function named 'hello'
 */
module.exports = {
  search,
  add
}

/*
  Functions in a127 controllers used for operations should take two parameters:

  Param 1: a handle to the request object
  Param 2: a handle to the response object
 */
function search (req, res) {
  // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
  const fromTimestamp = req.swagger.params.from_timestamp.value
  const toTimestamp = req.swagger.params.to_timestamp.value
  const lat = req.swagger.params.lat.value
  const lng = req.swagger.params.lng.value
  const maxDistance = req.swagger.params.max_distance.value

  const dbURL = database.url
  const dbName = database.dbName
  MongoClient.connect(dbURL, function (err, client) {
    if (err) {
      return res.json(err)
    }

    console.log('Connected successfully to server')

    const db = client.db(dbName)

    const query = {
      location: {
        $near: {
          type: 'Point',
          coordinates: [lng, lat]
        },
        $spherical: true
      }
    }
    if (maxDistance) {
      query.location.$maxDistance = maxDistance
    }
    if (fromTimestamp && toTimestamp) {
      query.timestamp = { $gte: fromTimestamp, $lte: toTimestamp }
    } else if (fromTimestamp) {
      query.timestamp = { $gte: fromTimestamp }
    } else if (toTimestamp) {
      query.timestamp = { $lte: toTimestamp }
    }

    console.log('query', query)
    db.collection('geometries').find(query).toArray(function (err, geometries) {
      if (err) {
        return res.json(err)
      }
      console.log(geometries)
      // this sends back a JSON response which is a single string
      client.close()
      return res.json(geometries)
    })
  })
}

function add (req, res) {
  // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
  const name = req.swagger.params.name.value
  const lat = req.swagger.params.lat.value
  const lng = req.swagger.params.lng.value

  const dbURL = database.url
  const dbName = database.dbName
  MongoClient.connect(dbURL, function (err, client) {
    if (err) {
      return res.json(err)
    }

    console.log('Connected successfully to server')

    const db = client.db(dbName)
    const geometry = {
      name,
      location: {
        type: 'Point',
        coordinates: [lng, lat]
      },
      timestamp: (new Date()).getTime()
    }
    db.collection('geometries').insertMany([geometry], function (err, result) {
      if (err) {
        return res.json(err)
      }
      console.log(result.ops[0])
      // this sends back a JSON response which is a single string
      client.close()
      return res.json(result.ops[0])
    })
  })
}
