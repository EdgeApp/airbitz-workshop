const express = require('express')
const bodyParser = require('body-parser')

// Set up Express app:
const app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.listen(3000, function () {
  console.log('Example app listening on port http://localhost:3000')
})

module.exports = app
