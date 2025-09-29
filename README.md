# Predicate Integration – Counter.sol Example (Hardhat)


📌 See [Observations & Questions](./OBSERVATIONS.md) for detailed notes, open issues, and requests for clarification from the Predicate team.

---

## Overview

* Integration done in **Hardhat**, using **Direct integration** from Predicate.
* Smart contract used: `Counter.sol`.
* Constants stored in **Utils/constants.js** (fill them from `.env`).
* Policy: `"x-test-random"`
* Two types of tests implemented:

  * **API tests** → calls to Predicate offchain app.
  * **Blockchain tests** → calls to the deployed `Counter` contract.
* Tests are inside the **Tests** folder.

---

## Network & Deployment

**Network:** Sepolia

* ✅ Correct deployment with **Service Manager**:
  `0x270dE4Cf541CA08fcc7cc08941efC044A5f8F4B4`

* ⚠️ Intentionally wrong deployment with **Service Manager from Base**:
  `0x7238B8f25DCB61CCbFd453a4BDE3300211C9020E`

Both contracts are deployed on Sepolia.

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

### Observations

* **Who are the `signers`?** What does this field represent?
* Bad contract address → failed as expected (400).
* Bad `from` address → failed as expected (400).
* Incorrect `data` hex → failed with 400. What is validated in the `data` field?
* `msg_value` did not affect compliance outcome. Is this expected for policy `"x-test-random"`?
* Could error responses include **why** validation failed (e.g., wrong address)?

---

## Blockchain Tests

Using Hardhat + ethers.js to call:

```solidity
function setNumberWithPredicate(uint256 newNumber, PredicateMessage calldata _message)
```

Struct (from ABI):

```solidity
struct PredicateMessage {
  string taskId;
  uint256 expireByBlockNumber;
  address[] signerAddresses;
  bytes[] signatures;
}
```

Example JS struct:

```js
const PredicateMessage = {
  taskId: "662c0495-81f2-45a9-a6a6-95b334e7f5cb",
  expireByBlockNumber: BigInt(1759138817),
  signerAddresses: ["0xDAc74b6f9B3609E914c924eB87Adff87A30fcDf6"],
  signatures: ["0x782b7fb05c46a0...c1b"]
};
```

### Observations

* Calling blockchain function failed with:

  ```
  execution reverted: "Predicate.validateSignatures: Invalid signature"
  TaskID: e3e963d8-bed8-4cc7-8e43-cfeade295f25
  ```
* Tried aligning values (curl and blockchain using same `newNumber`), but still failed.
* Question: Should curl API and blockchain-protected function always use the **same values**?
* Attestations: **how do you attest in smart contracts?** Couldn’t find clear docs.
* Obtaining correct struct format was tricky: only found inside ABI.
  → Having a clear example in docs would help.

---

## Example Test Results

* Deployment with Sepolia + Base service manager (wrong) at
  `0x7238B8f25DCB61CCbFd453a4BDE3300211C9020E`
  → Curl test returned **compliant**, which was unexpected. An expected Failure code XXXX was expected.

  ```json
  {
    "is_compliant": true,
    "task_id": "b194ab8f-d2ac-4662-aaf9-c49159f3474d",
    "expiry_block": 1759135848,
    "signers": ["0xDAc74b6f9B3609E914c924eB87Adff87A30fcDf6"],
    "signature": ["0x75022aa08735...197f251b"]
  }
  ```
* Why did this return compliant despite wrong service manager?

---

## Running the Tests

**API curl tests:**

```bash
node testCurl.js
```

**Blockchain tests:**

```bash
node testBlockchain.js
```

---

## UI Notes

* Dashboard title should be clearer (centered, editable in one click).
* Sometimes the app reloads or resets back to initial view.

---

## Open Questions

1. **Signers**: who are they exactly?
2. **Data validation**: what is checked in the `data` field?
3. **msg_value**: why doesn’t it affect compliance?
4. **Compliance**: why does a contract with wrong service manager still return compliant in curl test?
5. **Blockchain invalid signature**: why does validation fail even when API returned compliant?
6. **Attestation**: how do you attest in smart contracts?
7. **Docs**: clearer example for struct format would help.

