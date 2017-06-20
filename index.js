const app = require('./expressApp.js')

const { makeNodeContext } = require('airbitz-io-node-js')
const { makeCurrencyWallet } = require('airbitz-core-js')
const { makeBitcoinPlugin } = require('airbitz-currency-bitcoin')

const output = {
  keys: '<none>',
  address: '<none>',
  balance: NaN
}

app.get('/', function (req, res) {
  res.render('index', output)
})

app.post('/spend', function (req, res) {
  res.redirect('/')
  console.log(
    `amount: ${parseInt(req.body.amount)}, address: ${req.body.address}`
  )
  // TODO: Actual spend
})

function main () {
  const context = makeNodeContext({
    apiKey: '9c05067d2a349a67b10f3d3fa7d7834d3667a534'
  })
  const plugin = makeBitcoinPlugin({ io: context.io })

  return context.loginWithPassword('bob19', 'Funtimes19').then(account => {
    output.keys = JSON.stringify(account.allKeys, null, 2)

    return makeCurrencyWallet(account.getFirstWallet('wallet:bitcoin'), {
      io: context.io,
      plugin
    }).then(wallet => {
      wallet
        .getReceiveAddress()
        .then(address => (output.address = JSON.stringify(address, 2, null)))
    })
  })

  // TODO:
  // Check balance
}

main().catch(e => console.error(e))
