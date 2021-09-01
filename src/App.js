import * as React from "react";
import { ethers } from "ethers";
import './App.css';
import abi from './utils/auction.json';

export default function App() {
  const [currAccount, setCurrentAccount] = React.useState("");
  const contractAddress = "0x4657a314ccfbeB47f42D6581e78B2a9D37Acc9C4";
  const contractABI = abi.abi;
  let mining = false;

  const checkIfWalletConnected = () => {
    const { ethereum } = window;
    if (!ethereum){
      console.log("You need a MetaMask account!");
      return;
    } else {
      console.log("Ethereum object:", ethereum);
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
    }

    ethereum.request({method: "eth_requestAccounts"})
      .then(accounts => {
        console.log("Connected", accounts[0]);
        setCurrentAccount(accounts[0]);
      })
      .catch(err => console.log(err));
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

  React.useEffect(() => {
    console.log("Test");
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
          Click me
        </button>
        )}

        <button className="button" onClick={getTotalInterested}>
          Total Interested
        </button>

        <button className="button" onClick={interested}>
          Interested
        </button>

        {!mining ? null : (
          <button className="button" onClick={connectWallet}>
          <span role="img" aria-label="hourglass">⏳</span>
        </button>
        )}

      </div>
    </div>
  );
}
