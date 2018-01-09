'use strict'

var SwaggerExpress = require('swagger-express-mw')
var app = require('express')()
module.exports = app // for testing

var config = {
  appRoot: __dirname // required config
}

var SwaggerUi = require('swagger-tools/middleware/swagger-ui')

SwaggerExpress.create(config, function (err, swaggerExpress) {
  if (err) { throw err }

  // install middleware
  app.use(SwaggerUi(swaggerExpress.runner.swagger))
  swaggerExpress.register(app)

  var port = process.env.PORT || 8888
  app.listen(port)

  if (swaggerExpress.runner.swagger.paths['/places']) {
    console.log('try this:\ncurl http://127.0.0.1:' + port + '/places')
  }
})
