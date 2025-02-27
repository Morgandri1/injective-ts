# Token Factory

## Token Factory

This `tokenfactory` module allows any account to create a new token with the name `factory/{creator address}/{subdenom}`. Because tokens are namespaced by creator address, this allows token minting to be permissionless, due to not needing to resolve name collisions.

_Note: If you want your denom to be visible on products like Helix, Hub, Explorer, etc, it's important to add token metadata information using the `MsgSetDenomMetadata` message as explained below._

#### Messages

Let's explore (and provide examples) the Messages that the TokenFactory module exports and we can use to interact with the Injective chain.

#### MsgCreateDenom

Creates a denom of `factory/{creator address}/{subdenom}` given the denom creator address and the subdenom. Subdenoms can contain \[a-zA-Z0-9./]. Keep in mind that there is a `creation fee` which you need to cover when creating a new token.

```ts
import {
  MsgCreateDenom,
} from "@injectivelabs/sdk-ts";
import { BigNumberInBase } from "@injectivelabs/utils";
import { ChainId } from "@injectivelabs/ts-types";
import { Network, getNetworkEndpoints } from "@injectivelabs/networks";

const injectiveAddress = "inj1...";
const privateKey = "0x...";
const subdenom = "inj-test";

const msg = MsgCreateDenom.fromJSON({
  subdenom,
  sender: injectiveAddress,
});

const txHash = await new MsgBroadcasterWithPk({
  privateKey,
  chainId: ChainId.Testnet,
  endpoints: getNetworkEndpoints(Network.Testnet),
}).broadcast({
  msgs: msg,
  injectiveAddress,
});

console.log(txHash);
```

#### MsgMint

Minting of a specific denom is only allowed for the current admin. Note, the current admin is defaulted to the creator of the denom.

```ts
import {
  MsgMint,
} from "@injectivelabs/sdk-ts";
import { BigNumberInBase } from "@injectivelabs/utils";
import { ChainId } from "@injectivelabs/ts-types";
import { Network, getNetworkEndpoints } from "@injectivelabs/networks";

const injectiveAddress = "inj1...";
const privateKey = "0x...";
const subdenom = "inj-test";
const amountToMint = 1_000_000_000

const msg = MsgMint.fromJSON({
  sender: injectiveAddress,
  amount: {
    denom: `factory/${injectiveAddress}/${subdenom}`,
    amount: amountToMint
  }
});

const txHash = await new MsgBroadcasterWithPk({
  privateKey,
  chainId: ChainId.Testnet,
  endpoints: getNetworkEndpoints(Network.Testnet),
}).broadcast({
  msgs: msg,
  injectiveAddress,
});

console.log(txHash);
```

#### MsgBurn

Burning of a specific denom is only allowed for the current admin. Note, the current admin is defaulted to the creator of the denom.

```ts
import {
  MsgBurn,
} from "@injectivelabs/sdk-ts";
import { BigNumberInBase } from "@injectivelabs/utils";
import { ChainId } from "@injectivelabs/ts-types";
import { Network, getNetworkEndpoints } from "@injectivelabs/networks";

const injectiveAddress = "inj1...";
const privateKey = "0x...";
const subdenom = "inj-test";
const amountToBurn = 1_000_000_000

const msg = MsgBurn.fromJSON({
  sender: injectiveAddress,
  amount: {
    denom: `factory/${injectiveAddress}/${subdenom}`,
    amount: amountToBurn
  }
});

const txHash = await new MsgBroadcasterWithPk({
  privateKey,
  chainId: ChainId.Testnet,
  endpoints: getNetworkEndpoints(Network.Testnet),
}).broadcast({
  msgs: msg,
  injectiveAddress,
});

console.log(txHash);
```

#### MsgSetDenomMetadata

Setting of metadata for a specific denom is only allowed for the admin of the denom. It allows the overwriting of the denom metadata in the bank module.

```ts
import {
  MsgSetDenomMetadata,
} from "@injectivelabs/sdk-ts";
import { BigNumberInBase } from "@injectivelabs/utils";
import { ChainId } from "@injectivelabs/ts-types";
import { Network, getNetworkEndpoints } from "@injectivelabs/networks";

const injectiveAddress = "inj1...";
const privateKey = "0x...";
const subdenom = 'inj-test'
const denom = `factory/${injectiveAddress}/${subdenom}`;
const amountToBurn = 1_000_000_000

const denomUnitsIfTokenHas0Decimals = [
  {
    denom: denom,
    exponent: 0,
    aliases: [subdenom]
  },
]
const denomUnitsIfTokenHas6Decimals = [
  {
    denom: `factory/${injectiveAddress}/u${subdenom}`, /** notice the u */
    exponent: 0,
    aliases: [`micro${subdenom}`]
  },
  {
    denom: denom,
    exponent: 6, /** if you want your token to have 6 decimals */
    aliases: [subdenom]
  },
]

const msg = MsgSetDenomMetadata.fromJSON({
  sender: injectiveAddress,
  metadata: {
    base: denom, /** the base denom */
    description: '', /** description of your token */
    display: '', /** the displayed name of your token on UIs */,
    name: '', /** the name of your token */,
    symbol: '' /** the symbol of your token */,
    uri: '' /** the logo of your token, should be hosted on IPFS and should be a small webp image */
    denomUnits: denomUnitsIfTokenHas6Decimals  /** choose if you want to have 6 or 0 decimals for the token */
  }
});

const txHash = await new MsgBroadcasterWithPk({
  privateKey,
  chainId: ChainId.Testnet,
  endpoints: getNetworkEndpoints(Network.Testnet),
}).broadcast({
  msgs: msg,
  injectiveAddress,
});

console.log(txHash);
```

#### Full Example

Here is a full example on how to create a new token, mint new tokens and set token metadata on Injective.

```ts
import {
  MsgSetDenomMetadata,
} from "@injectivelabs/sdk-ts";
import { BigNumberInBase } from "@injectivelabs/utils";
import { ChainId } from "@injectivelabs/ts-types";
import { Network, getNetworkEndpoints } from "@injectivelabs/networks";

const injectiveAddress = "inj1...";
const privateKey = "0x...";
const subdenom = 'inj-test'
const denom = `factory/${injectiveAddress}/${subdenom}`;
const amount = 1_000_000_000

const msgCreateDenom = MsgCreateDenom.fromJSON({
  subdenom,
  sender: injectiveAddress,
});
const msgMint = MsgMint.fromJSON({
  sender: injectiveAddress,
  amount: {
    denom: `factory/${injectiveAddress}/${subdenom}`,
    amount: amount
  }
});
const msgSetDenomMetadata = MsgSetDenomMetadata.fromJSON({
  sender: injectiveAddress,
  metadata: {
    base: denom, /** the base denom */
    description: '', /** description of your token */
    display: '', /** the displayed name of your token on UIs */,
    name: '', /** the name of your token */,
    symbol: '' /** the symbol of your token */,
    uri: '' /** the logo of your token, should be hosted on IPFS and should be a small webp image */
    denomUnits: [
      {
        denom: `factory/${injectiveAddress}/u${subdenom}`, /** notice the u */
        exponent: 0,
        aliases: [`micro${subdenom}`]
      },
      {
        denom: denom,
        exponent: 6, /** if you want your token to have 6 decimals */
        aliases: [subdenom]
      },
    ]
  }
});

const txHash = await new MsgBroadcasterWithPk({
  privateKey,
  chainId: ChainId.Testnet,
  endpoints: getNetworkEndpoints(Network.Testnet),
}).broadcast({
  msgs: [msgCreateDenom, msgMint, msgSetDenomMetadata],
  injectiveAddress,
});

console.log(txHash);
```
