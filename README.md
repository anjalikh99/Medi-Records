# Project Setup Steps

1. Clone the project using Github Url

2. `npm install` to install all the packages mentioned in package.json file

3. In the hardhat.config.js file configure your wallet address as per network requirements
--- For using Ganache paste your wallet address in the from value
--- For using Sepolia Network paste you wallet's private key in the .env file

4. In the root directory execute `npx hardhat run scripts/deploy.js` to deploy the smart contract MediRecords.sol and copy the deployed contract address from console

5. Paste the copied contract address into contractAddress variable in initializeMetamask() function (filepath: public/contractMethods.js)

6. execute the shell command `node app.js` or
--- install nodemon globally `npm i nodemon -g` and execute `nodemon app.js` for restarting the server automatically on changes

7. Your project is ready to be used. Go to localhost:3000 to interact with the project

