const app = require('./expressApp.js')

const { makeNodeContext } = require('airbitz-io-node-js')
const { makeCurrencyWallet } = require('airbitz-core-js')
const { makeBitcoinPlugin } = require('airbitz-currency-bitcoin')
const qr = require('qr-image')

const output = {
  keys: '<none>',
  address: '<none>',
  addressSvg: '',
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

  if (app.wallet) {
    const spendInfo = {
      spendTargets: [
        {
          publicAddress: req.body.address,
          amountSatoshi: req.body.amount
        }
      ]
    }
    app.wallet
      .makeSpend(spendInfo)
      .then(tx => console.log(`Sent transaction with id ${tx.txid}`))
  }
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
      plugin,
      callbacks: {
        onBalanceChanged (balance) {
          output.balance = balance
        }
      }
    }).then(wallet =>
      wallet.startEngine().then(() => {
        app.wallet = wallet
        wallet.getReceiveAddress().then(address => {
          output.address = JSON.stringify(address, 2, null)
          output.addressSvg = qr.imageSync(address.publicAddress, {
            type: 'svg'
          })
        })

        output.balance = wallet.getBalance('BTC')
      })
    )
  })
}

main().catch(e => console.error(e))
