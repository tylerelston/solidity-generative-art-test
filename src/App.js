import * as React from "react";
import { ethers } from "ethers";
import './App.css';
import abi from './utils/auction.json';
import Canvas from "./canvas.js";

export default function App() {
  const [currAccount, setCurrentAccount] = React.useState("");
  const contractAddress = "0xAe72Edf308cf735f6b91ea12EC788dFf9000ff9c";
  const contractABI = abi.abi;

  let mining = false;


  const [allMessages, setAllMessages] = React.useState([]);
  async function getAllMessages() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const auctionContract = new ethers.Contract(contractAddress, contractABI, signer);

    let messages = await auctionContract.getAllMessages();

    let messagesCleaned = [];
    messages.forEach(message => {
      messagesCleaned.push({
        address: message.address,
        timestamp: new Date(message.timestamp * 1000),
        message: message.message
      })
    setAllMessages(messagesCleaned);
    })
  }

  const checkIfWalletConnected = () => {
    const { ethereum } = window;
    if (!ethereum){
      console.log("You need a MetaMask account!");
      return;
    } else {
      getAllMessages();
      console.log("Ethereum object:", ethereum);
      console.log("Messages:", allMessages);
    }

    ethereum.request({method: "eth_accounts"})
      .then(accounts => {
        if (accounts.length !== 0) {
          const account = accounts[0];
          console.log("Found authorized account:", account);
          setCurrentAccount(account);
        } else {
          console.log("No authorized account found");
        }
      })
  }

  const connectWallet = () => {
    const { ethereum } = window;
    if (!ethereum) {
      alert("MetaMask is required to use this site");
    } else {
    ethereum.request({method: "eth_requestAccounts"})
      .then(accounts => {
        console.log("Connected", accounts[0]);
        setCurrentAccount(accounts[0]);
      })
      .catch(err => console.log(err));
    }
  }

  const getTotalInterested = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const auctionContract = new ethers.Contract(contractAddress, contractABI, signer);

    let count = await auctionContract.getInterested();
    console.log("Total interested:", count.toNumber());
  }

  const interested = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const auctionContract = new ethers.Contract(contractAddress, contractABI, signer);

    const interestedTxn = await auctionContract.interested();
    mining = true;
    console.log("Mining..", interestedTxn.hash);
    await interestedTxn.wait();
    console.log("Mined!", interestedTxn.hash);
    mining = false;

    let count = await auctionContract.getInterested();
    console.log("New Total interested:", count.toNumber());
  }

  const message = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const auctionContract = new ethers.Contract(contractAddress,contractABI, signer);

    const messageTxn = await auctionContract.message("Hi");
    mining = true;
    console.log("Mining..", messageTxn.hash);
    await messageTxn.wait();
    console.log("Mined!", messageTxn.hash);
    mining = false;

    console.log("All messages:", allMessages);
  }

  const claim = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const auctionContract = new ethers.Contract(contractAddress,contractABI, signer);

    const messageTxn = await auctionContract.claim();
    mining = true;
    console.log("Mining..", messageTxn.hash);
    await messageTxn.wait();
    console.log("Mined!", messageTxn.hash);
    mining = false;
  }

  React.useEffect(() => {
    checkIfWalletConnected();
  }, [])
  
  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
        <span role="img" aria-label="thinking face">🤔</span> Hey there!
        </div>

        <div className="bio">
        Welcome to an auction site. Connect your wallet below to get started
        </div>


        {currAccount ? null : (
          <button className="button" onClick={connectWallet}>
          Connect Wallet
        </button>
        )}

        {(!currAccount ? null : <button className="button" onClick={getTotalInterested}>
          Total Interested
        </button>
        )}

        {(!currAccount ? null :<button className="button" onClick={interested}>
          Interested
        </button>)}

        {(!currAccount ? null :<button className="button" onClick={message}>
          Message
        </button>)}

        {(!currAccount ? null :<button className="button" onClick={claim}>
          Claim
        </button>)}


        {!mining ? null : (
          <button className="button" onClick={connectWallet}>
          <span role="img" aria-label="hourglass">⏳</span>
        </button>
        )}

        <div>
        <Canvas />
        </div>

      </div>
    </div>
  );
}
