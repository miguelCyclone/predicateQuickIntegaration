const fs = require("fs");
const axios = require("axios");
const constants = require("../Utils/constants.js");

// Environment variables
const PREDICATE_API_KEY = constants.PREDICATE_API_KEY;
const API_URL = constants.API_PREDICATE_URL

// Contract and user variables
const CONTRACT_ADDRESS = constants.CONTRACT_ADDRESS
const OWNER_ADDRESS = constants.OWNER_ADDRESS

// Wrong intitialed contract
const CONTRACT_ADDRESS_WRONG_SM = constants.CONTRACT_ADDRESS_WRONG_SM

// Main function
async function main() {

  // Payload
  const payload = {
    from: OWNER_ADDRESS,
    to: CONTRACT_ADDRESS,
    data: "0x",
    msg_value: "0",
    chain_id: constants.SEPOLIA_CHAIN_ID // Sepolia chainID
  };
  
  try {
    // Post request
    const res = await axios.post(API_URL, payload, {
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
