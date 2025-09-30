const hre = require('hardhat')
const axios = require("axios");
const { ethers } = hre
const predicate = require("@predicate/core")
const constants = require("../Utils/constants.js");

// ABI
const COUNTER_ABI = require("../artifacts/contracts/Counter.sol/Counter.json").abi

// Predicate constants
const PREDICATE_API_KEY = constants.PREDICATE_API_KEY;
const API_PREDICATE_URL_TASK = constants.API_PREDICATE_URL_TASK

// Contract and user constants
const CONTRACT_ADDRESS = constants.CONTRACT_ADDRESS
const OWNER_ADDRESS = constants.OWNER_ADDRESS

// Init variables
const PRIV_KEY = constants.PRIV_KEY
const SEPOLIA_RPC = constants.SEPOLIA_RPC

// Decalre Signer
const PROVIDER = new ethers.JsonRpcProvider(SEPOLIA_RPC);
const SIGNER = new ethers.Wallet(PRIV_KEY, PROVIDER);

// Declare contract
const COUNTER_CONTRACT = new ethers.Contract(CONTRACT_ADDRESS, COUNTER_ABI, SIGNER);

// Create new Predicate Client
// Client API URL is without "/task"
const predicateClient = new predicate.PredicateClient({
    apiUrl: 'https://api.predicate.io/',
    apiKey: PREDICATE_API_KEY
});

// Function to get the current number in the smart contract, and to packed the data arguments
async function getnewNumberAndData() {

    // Prepare function arguments
    const currentNumber = await COUNTER_CONTRACT.number()

    // Increment by one to keep tests different without collisions
    const newNumber = currentNumber + 1n

    // Create argument array
    const functionArgs = [newNumber]

    // IMPORTANT: encode the private function that is invoked by the Predicate function
    const data = predicate.packFunctionArgs("setNumber(uint256)", functionArgs);

    return { newNumber: newNumber, data: data }
}

// Function to obtain the Predicate message
async function getPredicateMessage(_data) {
    const request = {
        from: OWNER_ADDRESS,
        to: CONTRACT_ADDRESS,
        data: _data,
        msg_value: '0',
        chain_id: constants.SEPOLIA_CHAIN_ID
    };

    console.log("Evaluate policy", request);

    // Send request to Predicate API
    const evaluationResult = await predicateClient.evaluatePolicy(request);


    console.log("Policy result:", evaluationResult);

    // If not compliant, exit
    if (!evaluationResult.is_compliant) {
        console.error("Transaction is not compliant");
        console.error(evaluationResult);
        process.exit(1);
    }

    // Convert predicate response into predicate message
    const predicateMessage = predicate.signaturesToBytes(evaluationResult);

    // Log Predicate Message
    console.log("Predicate message:", {
        taskId: predicateMessage.taskId,
        expireByBlockNumber: predicateMessage.expireByBlockNumber,
        signerAddresses: predicateMessage.signerAddresses,
        signatures: predicateMessage.signatures
    });

    return predicateMessage
}

// Function to call the smart contract Predicate protected function
async function callSmartContract(_newNumber, _predicateMessage) {
    try {
        let tx = await COUNTER_CONTRACT.setNumberWithPredicate(
            _newNumber,
            [
                _predicateMessage.taskId,
                _predicateMessage.expireByBlockNumber,
                _predicateMessage.signerAddresses,
                _predicateMessage.signatures
            ],
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

// Get current Numnber, validate transaction
async function getCurrentNumber(_sentNumber){

    // Prepare function arguments
    const currentNumber = await COUNTER_CONTRACT.number()

    // Evaluate result
    if(currentNumber === _sentNumber){
        console.log("Current Number equals sentNumber: ", currentNumber, _sentNumber)
    }else{
        console.error("Sent Number " + _sentNumber + " does not equal contract number: " + currentNumber);
        process.exit(1);
    }

}

// Main wrapper function
async function main() {

    // 1. Get New Number and solidity_packed_function_signature
    const { newNumber, data } = await getnewNumberAndData()

    // 2. Obtain the Predicate message (predicate siganture)
    const predicateMessage = await getPredicateMessage(data)

    // 3. Call the App Smart contract function with the Predicate prtected function
    await callSmartContract(newNumber, predicateMessage)

    // 4. Verify updated state onchain
    await getCurrentNumber(newNumber) 

}

// Execute main
main()