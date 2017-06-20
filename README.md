# Airbitz Workshop

The purpose of this workshop is to create a simple node.js application that use the Airbitz library to send and receive money.

This git repository contains the starting template for the application. The app itself will run entirely in node.js, but there is an express.js server instance for sending information to the browser. This browser doesn't do anything; it's basically just a glorified `console.log` that can happen to display QR codes as well as text.

Here are the steps to get started:

```shell
git clone git@github.com:Airbitz/airbitz-workshop.git
cd airbitz-workshop
npm install
```

Once that's done, you can use `npm start` to launch the app. You can visit [http://localhost:3000](http://localhost:3000) to see the status page, and you can use ctrl+C to stop the app.

## Logging in to Airbitz

First, we need to add the Airbitz library as a dependency:

```shell
npm install airbitz-core-js
npm install airbitz-io-node-js
```

Now that that's done, go into `index.js`, and add the following code:

```javascript
// At the top of the file:
const { makeNodeContext } = require('airbitz-io-node-js')

// In the `main` function:
const context = makeNodeContext({
  apiKey: '9c05067d2a349a67b10f3d3fa7d7834d3667a534'
})
```

This will create an Airbitz context object. The context object has a `loginWithPassword` method, which you can use to download your keys from the Airbitz encrypted backup service:

```javascript

return context.loginWithPassword('username', 'password').then(function (account) {
  // Use your account here
})
```

You can find documetation for all these functions and objects at [the Airbitz developer site](https://developer.airbitz.co/javascript/#loginwithpassword).

## Displaying Private Keys

Bitcoin private keys control access to the currency. While anybody can *view* the transactions on the bitcoin network, only somebody with the correct private key can *move* money.

Private keys are sensitive information, so normally we do everything we can to keep them secret. In this exercise, however, we can going to peek behind the curtain and take a look at some keys. Once the workshop is over, you may want to archive the wallets in your Airbitz account and create some fresh ones.

The code to do this is actually pretty short:

```
output.keys = JSON.stringify(account.allKeys, null, 2)
```

The `account.allKeys` parameter contains an array of all the wallet keys in the account, along with their type and metadata. While Airbitz has many keys for different purposes, for this exercise, we are interested in the `wallet:bitcoin` type keys.

## Starting the wallet

The core Airbitz library only provides login functionality. To do transactions, we need to bring in a plugin:

```shell
npm install https://github.com/Airbitz/airbitz-currency-bitcoin.git
```

Import the Javascript:

```javascript
// At the top of the file:
const { makeBitcoinPlugin } = require('airbitz-currency-bitcoin')

// In the `main` function:
const plugin = makeBitcoinPlugin({ io: context.io })
```

With that set up, we have what we need to create a wallet:

```javascript
const key = account.getFirstWallet('wallet:bitcoin')
return makeCurrencyWallet(key, {
  io: context.io,
  plugin,
  callbacks: { /* todo */ }
}).then(function (wallet) {
  return wallet.startEngine().then(function () {
    // Stash the wallet for later:
    app.wallet = wallet

    // Use your wallet here
  })
})
```

## Showing an address

Bitcoin wallets can contain multiple addresses. To grab an address out of the wallet, we use the `getReceiveAddress` function:

```javascript
wallet.getReceiveAddress().then(function (address) {
  output.address = JSON.stringify(address, 2, null)
  output.addressSvg = qr.imageSync(address.publicAddress, { type: 'svg' })
})
```

## Showing the balance

As funds arrive in the wallet, the balance will change. Therefore, we need to set up a callback function that can keep the balance up to date as funds arrive:

```
// Before the wallet is created:
function onBalanceChanged (balance) {
  output.balance = balance
}
```

Pass this callback in the `callbacks` parameter to `makeCurrenyWallet`, and it will automatically be called when funds arrive. We also need to check the balance once when the app first loads:

```javascript
output.balance = wallet.getBalance()
```

## Receiving money

At this point, your application has everything it needs to receive money. It is showing a QR code, and is tracking a balance. Please call over one of the Airbitz staff, and we will send you some test funds for the next step.

## Spending money

Within the application template, there is a `/spend` endpoint that is triggered whenver the user hits the `submit` button on the send form. This is where we are going to put our spend code.

Here is how that looks:

```javascript
const spendInfo = {
  spendTargets: [
    {
      publicAddress: req.body.address,
      amountSatoshi: req.body.amount
    }
  ]
}

app.wallet.makeSpend(spendInfo)
```

The `spendInfo` structure contains an array of addresses to send money to, called `spendTargets`. In this case, we are putting in the single address the user provided in the form. The `makeSpend` function accepts this information and accomplishes the spend.
