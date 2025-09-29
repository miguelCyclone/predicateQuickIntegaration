const hre = require('hardhat')
const { ethers } = hre

const constants = require("../Utils/constants.js");

// ABI
const COUNTER_ABI = require("../artifacts/contracts/Counter.sol/Counter.json").abi

// Contract constants
const CONTRACT_ADDRESS = constants.CONTRACT_ADDRESS

// Init variables
const PRIV_KEY = constants.PRIV_KEY
const SEPOLIA_RPC = constants.SEPOLIA_RPC

// Decalre Signer
const PROVIDER = new ethers.JsonRpcProvider(SEPOLIA_RPC);
const SIGNER = new ethers.Wallet(PRIV_KEY, PROVIDER);

// Declare contract
const COUNTER_CONTRACT = new ethers.Contract(CONTRACT_ADDRESS, COUNTER_ABI, SIGNER);

// Declare PRedicate struct message (Obtained from the ABI)

/*

status: 200
response: {
  is_compliant: true,
  task_id: '662c0495-81f2-45a9-a6a6-95b334e7f5cb',
  expiry_block: 1759138817,
  signers: [ '0xDAc74b6f9B3609E914c924eB87Adff87A30fcDf6' ],
  signature: [
    '0x782b7fb05c46a01a15d301699968446df18fda7553dff13eb6847a2b8f892c7a7c95c3f03df9b3e5ac74e9c0876336efe4a4306e1eecd73513b0799c1a2b535c1b'
  ]

*/

/*

struct PredicateMessage {
    string taskId;
    uint256 expireByBlockNumber;
    address[] signerAddresses;
    bytes[] signatures;
}

*/
const PredicateMessage = {
    taskId: "662c0495-81f2-45a9-a6a6-95b334e7f5cb",
    expireByBlockNumber: BigInt(1759138817),
    signerAddresses: ["0xDAc74b6f9B3609E914c924eB87Adff87A30fcDf6"],
    signatures: ["0x782b7fb05c46a01a15d301699968446df18fda7553dff13eb6847a2b8f892c7a7c95c3f03df9b3e5ac74e9c0876336efe4a4306e1eecd73513b0799c1a2b535c1b"]


}

async function callSmartContract() {
    try {
        let tx = await COUNTER_CONTRACT.setNumberWithPredicate(
            BigInt("0"),
            PredicateMessage,
            )
        tx = await tx.wait()
        console.log("OK!", tx);
        console.log("tx HAsh", tx.hash)
    } catch (error) {
        console.log("NOK", error)
    }
}

async function main() {

    await callSmartContract()

}

main()