# Predicate – General Questions & Observations

This document collects questions and observations from testing Predicate integration. It’s meant to help clarify design choices and highlight areas where documentation could be improved.

---

## Integration Models

* **Direct integration**:
  Uses `PredicateClient` and `PredicateMessage`.

* **Proxy integration**:
  Uses `PredicateProtected`.

### Questions

* Does direct integration mean users can only call my app through Predicate?
* What are the differences between direct and proxy integrations?
* Can you share gaps, benefits, bottlenecks, and motivation for each approach?
* A simple comparison table would be very helpful.

---

## Counter Example Contract

* In the example, `setNumberWithPredicate` checks compliance, then calls `setNumber`.
* Should `setNumber` be **private/internal** instead of public, since it should not be callable directly?

---

## Storage Pattern

From your contracts:

```solidity
bytes32 private constant _PREDICATE_CLIENT_STORAGE_SLOT =
  0x804776a84f3d03ad8442127b1451e2fbbb6a715c681d6a83c9e9fca787b99300;

function _getPredicateClientStorage() private pure returns (PredicateClientStorage storage $) {
  assembly {
    $.slot := _PREDICATE_CLIENT_STORAGE_SLOT
  }
}
```

### Questions

* This is called the **ERC-7201 storage pattern** (“namespaced storage layout”), correct?
* Is it related to **EIP-1967** or the **diamond storage pattern**?
* To confirm: this is inline Yul assembly mapping a struct to a fixed slot to avoid collisions in upgradeable contracts?

---

## Function Signatures

* How should function signatures be implemented when protecting multiple functions in the same smart contract?
* Example guidance would help.

---

## Predicate ID

* You mention Predicate ID does not store personal information.
* How is this implemented/enforced?

---

## Policy IDs

* A `policyID` is required when deploying a contract.
* What exactly are policy IDs?
* Docs mention `"x-test-random"` for testing, but it’s hard to find.
* In the UI, policies appear under the app tab but are difficult to click/select.

---

## Attestations
* How do you attest in the smart contracts?
* Could not find the exact code or examples on this point.

---

## UI Notes

* The app sometimes reloads or resets back to the initial homepage/tab.