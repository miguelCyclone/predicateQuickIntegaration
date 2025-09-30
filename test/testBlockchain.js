const hre = require('hardhat')
const { ethers } = hre
const predicate = require("@predicate/core")
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

// Predicate API compliant response

/*

status: 200
response: {
  is_compliant: true,
  task_id: 'c4757c97-2738-4e5a-94f9-cd63c7abe854',
  expiry_block: 1759193701,
  signers: [ '0xDAc74b6f9B3609E914c924eB87Adff87A30fcDf6' ],
  signature: [
    '0xf0099e8977dea5c7cd0e84ff1e60aab2bc64ccac8f6e014f91bdeb6c2480f2e32e5680b566eea1b421469134f5ba561f2d06712aa43521e71da986d3687e72351c'
  ]
}

*/

// Declare Predicate struct message (Obtained from the ABI)

/*

struct PredicateMessage {
    string taskId;
    uint256 expireByBlockNumber;
    address[] signerAddresses;
    bytes[] signatures;
}

*/
const PredicateMessage = {
    taskId: "c4757c97-2738-4e5a-94f9-cd63c7abe854",
    expireByBlockNumber: BigInt("1759193701"),
    signerAddresses: ["0xDAc74b6f9B3609E914c924eB87Adff87A30fcDf6"],
    signatures: ["0xf0099e8977dea5c7cd0e84ff1e60aab2bc64ccac8f6e014f91bdeb6c2480f2e32e5680b566eea1b421469134f5ba561f2d06712aa43521e71da986d3687e72351c"]


}

async function callSmartContract() {
    try {
        let tx = await COUNTER_CONTRACT.setNumberWithPredicate(
            BigInt("919191"),
            PredicateMessage,
            )
        // Print txHas
        console.log("tx HAsh", tx.hash)

        // Wait for tx to get minted
        tx = await tx.wait()

        // Print result
        console.log("OK!", tx);
    } catch (error) {
        console.log("NOK", error)
    }
}

async function main() {

    await callSmartContract()

}

main()