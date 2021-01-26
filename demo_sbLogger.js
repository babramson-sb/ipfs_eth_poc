require('dotenv').config()
const Web3 = require('web3');
const ethers = require('ethers')
const mnemonic = process.env.MNEMONIC
const rpcURL = process.env.RPCURL
const walletAddress = process.env.WALLETADDRESS
const loggerAddress = process.env.LOGGERADDRESS
const mnemonicWallet = ethers.Wallet.fromMnemonic(mnemonic)
const web3 = new Web3(rpcURL);

const sbLogger = new web3.eth.Contract([{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"string","name":"hash","type":"string"},{"indexed":false,"internalType":"string","name":"uri","type":"string"}],"name":"Logged","type":"event"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"entries","outputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"string","name":"hash","type":"string"},{"internalType":"string","name":"uri","type":"string"},{"internalType":"uint256","name":"timestamp","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"entriesCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"getEntry","outputs":[{"components":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"string","name":"hash","type":"string"},{"internalType":"string","name":"uri","type":"string"},{"internalType":"uint256","name":"timestamp","type":"uint256"}],"internalType":"struct Logger.Entry","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"hash","type":"string"},{"internalType":"string","name":"uri","type":"string"}],"name":"log","outputs":[],"stateMutability":"nonpayable","type":"function"}], loggerAddress);

const tx = {
    from: walletAddress,
    to: loggerAddress,
    gas: 500000,
    value: 0,
    data: sbLogger.methods.log("QmPZ9gcCEpqKTo6aq61g2nXGUhM4iCL3ewB6LDXZCtioEB", "/ipfs/QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG/readme").encodeABI()
}

const logData = async _ => {
    const signTx = await web3.eth.accounts.signTransaction(tx, mnemonicWallet.privateKey);
    console.log(signTx)
    const sentTx = await web3.eth.sendSignedTransaction(signTx.rawTransaction);
    console.log(sentTx)
}

const readData = async _ => {
    const entCnt = await sbLogger.methods.entriesCount().call({from: walletAddress});
    for (let cnt = 0; cnt < entCnt; cnt++) {
        const log = await sbLogger.methods.getEntry(cnt).call({from: walletAddress});
        console.log('Entry Index #', cnt, log)
    }
}

logData().then(() => readData())