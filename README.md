# Predicate Integration – Counter.sol Example (Hardhat)


📌 See [Observations & Questions](./OBSERVATIONS.md) for detailed notes, open issues, and requests for clarification from the Predicate team.

---

## Overview

* Integration done in **Hardhat**, using **Direct integration** from Predicate.
* Smart contract used: `Counter.sol`.
* Constants stored in **Utils/constants.js** (fill them from `.env`).
* Policy: `"x-test-random"`
* Tests:

  * **API tests** → offchain compliance calls.
  * **Blockchain tests** → protected contract calls.
  * **System test** → full end-to-end flow.

---

## Network & Deployment

**Sepolia**

* ✅ Correct Service Manager: `0x270dE4Cf541CA08fcc7cc08941efC044A5f8F4B4`
* ⚠️ Wrong Service Manager (Base): `0x7238B8f25DCB61CCbFd453a4BDE3300211C9020E`

Both contracts are deployed on Sepolia.

---

## System Test Walkthrough

End-to-end system test with `@predicate/core` SDK:

```js
// 1. Get newNumber and packed args
const { newNumber, data } = await getnewNumberAndData()

// 2. Obtain PredicateMessage (attestation)
const predicateMessage = await getPredicateMessage(data)

// 3. Call protected function on Counter.sol
await callSmartContract(newNumber, predicateMessage)

// 4. Verify updated state onchain
await getCurrentNumber(newNumber)
```

This proves how Predicate binds **attestations to exact function signatures and parameters**, enabling secure enforcement when multiple functions exist in the same contract.

👉 A successful transaction from this flow can be seen on Sepolia Etherscan:
[0x384a782a7859be28f8bed9f311cb2129002d233deaa949954a2464e806fa806b](https://sepolia.etherscan.io/tx/0x384a782a7859be28f8bed9f311cb2129002d233deaa949954a2464e806fa806b)

---

## API Tests

Example responses from Predicate API:

**Not Compliant**

```json
{
  "is_compliant": false,
  "task_id": "164b8c12-9eb4-466b-a0bb-71967e027739",
  "expiry_block": 1759135978,
  "signers": [],
  "signature": []
}
```

**Compliant**

```json
{
  "is_compliant": true,
  "task_id": "e3e963d8-bed8-4cc7-8e43-cfeade295f25",
  "expiry_block": 1759136025,
  "signers": ["0xDAc74b6f9B3609E914c924eB87Adff87A30fcDf6"],
  "signature": ["0xddf95a4f982702f18970a9c884c32342fb0ea695c17189a420390f18d616e1870a11e5ffc0016818c54ae05bce3d05baa1a3635a19455b12115f0af178752b251c"]
}
```

---

## Running Tests

```bash
node testCurl.js        # API tests
node testBlockchain.js  # Onchain tests
node systemTest.js      # System tests
```

---

## UI Notes

* Dashboard title should be clearer (centered, editable in one click).
* Sometimes the app reloads or resets back to initial view.
