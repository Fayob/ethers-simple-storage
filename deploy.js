const ethers = require("ethers");
const fs = require("fs-extra");
// import ethers from "ethers";
require("dotenv").config();

async function main() {
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  // This is the code to read from encryptedJson file instead of reading from .env
  //   const encryptedJson = fs.readFileSync("./.encryptedKey.json", "utf8")
  //   let wallet = new ethers.Wallet.fromEncryptedJsonSync(
  //     encryptedJson,
  //     process.env.PRIVATE_KEY_PASSWORD
  //   )
  //   wallet = await wallet.connect(provider)

  const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf8");
  const binary = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.bin", "utf8");

  const contractFactory = new ethers.ContractFactory(abi, binary, wallet);
  console.log("Deploying, please wait...");
  const contract = await contractFactory.deploy();
  const transactionReceipt = contract.deploymentTransaction.wait(1);
  //   console.log(`Contract Address: ${contract.getAddress.toString}`);

  console.log("Here is the deployment transaction (transaction response): ");
  console.log(contract.deploymentTransaction);
  console.log("Here is the transaction receipt: ");
  console.log(transactionReceipt);

  //Get Number
  const favouriteNumber = await contract.retrieve();
  console.log(`Current Favourite Number: ${favouriteNumber}`);
  const transactionResponse = await contract.store("8");
  const txReceipt = await transactionResponse.wait(1);
  const updatedFavouriteNumber = await contract.retrieve();
  console.log(`Updated favourite number is: ${updatedFavouriteNumber}`);

  //   // deploying our contract like sending a transaction
  //   console.log("Let's deploy with only transaction data!");
  //   const nonce = await wallet.getTransactionCount();
  //   const tx = {
  //     nonce: nonce,
  //     gasPrice: 20000000000,
  //     gasLimit: 1000000,
  //     to: null,
  //     value: 0,
  //     data: "", // bin
  //     chainId: 1337,
  //   };
  //   // this code below will only sign the transaction, it won't send it to blockchain
  // //   const signedTrasactionResponse = await wallet.signTransaction(tx);
  // //   console.log(signedTrasactionResponse);

  //   // this code below will both sign and send the transactiont to blockchain.
  //   // It makes sure the tx is signed before sending to blockchain
  //   const sentTxResponse = await wallet.sendTransaction(tx);
  //   await sentTxResponse.wait(1);
  //   console.log(sentTxResponse);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
