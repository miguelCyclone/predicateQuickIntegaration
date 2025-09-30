const ck = require('ckey'); // force load of env variables

// Load env variables
const PREDICATE_API_KEY = process.env.PREDICATE_API_KEY
const SEPOLIA_RPC = process.env.SEPOLIA_RPC
const MNEMONIC = process.env.MNEMONIC
const PRIV_KEY = process.env.PRIV_KEY

// PREDICATE URL
const API_PREDICATE_URL_TASK = "https://api.predicate.io/v1/task";

// Predicate System constants
const SEPOLIA_SERVICE_MANAGER = "0xb4486F75129B0aa74F99b1B8B7b478Cd4c17e994"
const BASE_SERVICE_MANAGER = "0xb4486F75129B0aa74F99b1B8B7b478Cd4c17e994"

// Predicate Policies
const INIT_POLICY_TEST = "x-test-random" // 50% chance compliant, for testing
const TRM_POLICY_TEST= "x-test-trm"

// App deployed Ok
const CONTRACT_ADDRESS = "0x270dE4Cf541CA08fcc7cc08941efC044A5f8F4B4"

// App with wrong Service Manager, deployed in Sepolia with Base Service Manager
const CONTRACT_ADDRESS_WRONG_SM = "0x7238B8f25DCB61CCbFd453a4BDE3300211C9020E"

// some address
const OWNER_ADDRESS = "0xDFeA3AA339836650a6BCC7B64720aBA82EE5cafb"

// EVM chain IDs
const SEPOLIA_CHAIN_ID = 11155111

// Exports
module.exports = {
    PREDICATE_API_KEY,
    SEPOLIA_RPC,
    MNEMONIC,
    PRIV_KEY,
    API_PREDICATE_URL_TASK,
    SEPOLIA_SERVICE_MANAGER,
    BASE_SERVICE_MANAGER,
    INIT_POLICY_TEST,
    TRM_POLICY_TEST,
    CONTRACT_ADDRESS,
    CONTRACT_ADDRESS_WRONG_SM,
    OWNER_ADDRESS,
    SEPOLIA_CHAIN_ID

}