const express = require('express')
const mustacheExpress = require('mustache-express')
const path = require('path')
const bodyParser = require('body-parser')

// Set up Express to automatically handle form bodies and mustache templates:
const app = express()
app.engine('mustache', mustacheExpress())
app.set('view engine', 'mustache')
app.set('views', path.join(__dirname, 'views'))
app.use(bodyParser.urlencoded({ extended: true }))

app.listen(3000, function () {
  console.log('Example app listening on port http://localhost:3000')
})

module.exports = app
