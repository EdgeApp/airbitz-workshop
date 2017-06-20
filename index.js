const bodyParser = require('body-parser')
const express = require('express')
const qr = require('qr-image')

// Set up Express app:
const app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.listen(3000, function () {
  console.log('Example app listening on port http://localhost:3000')
})

// These are the values we will render:
const output = {
  keys: 'none',
  address: 'none',
  addressSvg: '',
  balance: NaN
}

// Render the status page:
app.get('/', function (req, res) {
  res.send(
    `<!doctype html>
<html>
<head>
  <title>Airbitz Workshop</title>
</head>
<body>
  <h1>Current app status</h1>

  <h2>Keys</h2>
  <pre>${output.keys}</pre>

  <h2>Address</h2>
  <p>${output.address}</p>
  <p style="max-width: 2in">${output.addressSvg}</p>

  <h2>Balance</h2>
  <p>${output.balance}</p>

  <h2>Spend</h2>
  <form action='./spend' method="POST">
    <label for='address'>Address</label><input name='address' type='text'>
    <label for='amount'>Amount</label><input name='amount' type='text'>
    <input type="submit", value="Spend">
  </form>
</body>
</html>
`
  )
})

// Respond to post requests:
app.post('/spend', function (req, res) {
  res.redirect('/')
  console.log(
    `amount: ${parseInt(req.body.amount)}, address: ${req.body.address}`
  )
  // TODO: Actual spend
})

function main () {
  // TODO:
  // Log in
  // Get keys
  // Create wallet
  // Check balance
}

const out = main()

// Log any asynchronous errors:
Promise.resolve(out).catch(e => console.error(e))
