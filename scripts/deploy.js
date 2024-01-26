// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  // ethers method to get the address of the deployer deploying the contract
  const [deployer] = await ethers.getSigners();

  //  ethers method getContractFactory to deploy a new instance of MediRecords smart contract. It return a smart contract factory
  const mediRecord = await ethers.getContractFactory("MediRecords");

  //  ethers method deploy to Deploy the smart contract to the selected network
  const contract = await mediRecord.deploy();

  //  print to console the address of contract deployed
  console.log(contract.target);
}
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
