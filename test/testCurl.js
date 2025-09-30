const fs = require("fs");
const axios = require("axios");
const predicate = require("@predicate/core")
const constants = require("../Utils/constants.js");

// Predicate constants
const PREDICATE_API_KEY = constants.PREDICATE_API_KEY;
const API_PREDICATE_URL_TASK = constants.API_PREDICATE_URL_TASK // In APi direct call the "/task" is required

// Contract and user constants
const CONTRACT_ADDRESS = constants.CONTRACT_ADDRESS
const OWNER_ADDRESS = constants.OWNER_ADDRESS

// Wrong intitialed contract
const CONTRACT_ADDRESS_WRONG_SM = constants.CONTRACT_ADDRESS_WRONG_SM

 // Prepare function arguments - Constant Value to share number with API and Blockchain tests
 const newNumber = BigInt("919191") //BigInt(Math.floor(Math.random() * 1000000) + 1)
 const functionArgs = [newNumber];

 // IMPORTANT: encode the private function that is invoked by the Predicate function
 const data = predicate.packFunctionArgs("setNumber(uint256)", functionArgs);

// Main function
async function main() {

  // Payload
  const payload = {
    from: OWNER_ADDRESS,
    to: CONTRACT_ADDRESS,
    data: data,
    msg_value: "0",
    chain_id: constants.SEPOLIA_CHAIN_ID // Sepolia chainID
  };
  
  try {
    // Post request
    const res = await axios.post(API_PREDICATE_URL_TASK, payload, {
      headers: {
        "x-api-key": PREDICATE_API_KEY,
        "Content-Type": "application/json"
      }
    });

    // log responses
    console.log("status:", res.status);
    console.log("response:", res.data);
  } catch (err) {

    // catch errors
    console.error("Error:", err.message);
    process.exit(1);
  }
}

// Run main function
main();
