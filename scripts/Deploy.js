// Deploy script
// Counter Smart Contract with Direct inheritance

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
const hre = require("hardhat");
const constants = require("../Utils/constants.js");

// Predicate constants Sepolia
const SEPOLIA_SERVICE_MANAGER = constants.SEPOLIA_SERVICE_MANAGER

// Predicate constants Base
const BASE_SERVICE_MANAGER = constants.BASE_SERVICE_MANAGER

// Predicate policies
const INIT_POLICY_TEST = constants.INIT_POLICY_TEST

async function deployCounter() {

  let Contract = await hre.ethers.deployContract(
    "Counter",
    [
      SEPOLIA_SERVICE_MANAGER,
      INIT_POLICY_TEST
    ])

  return Contract;

}

async function main() {

  const counter = await deployCounter()
  console.log("Contract address: ", counter.target)

}


main().catch((error) => {
  console.error(error);
  process.exit(1);
});


/*
module.exports = buildModule("CounterModule", (m) => {

  const lock = m.contract("Counter", [SEPOLIDA_SERVICE_MANAGER, INIT_POLICY_TEST], {
    value: 0,
  });

});
*/