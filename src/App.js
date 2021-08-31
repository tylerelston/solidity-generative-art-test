import * as React from "react";
import { ethers } from "ethers";
import './App.css';

export default function App() {
  const [currAccount, setCurrentAccount] = React.useState("");

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

      </div>
    </div>
  );
}
