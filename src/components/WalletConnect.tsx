import React, { useState } from "react";
import { BrowserProvider } from "ethers";

interface WalletConnectProps {
  onConnect: (address: string) => void;
}

const WalletConnect: React.FC<WalletConnectProps> = ({ onConnect }) => {
  const [error, setError] = useState<string | null>(null);

  async function connectWallet() {
    try {
      if (!window.ethereum) {
        setError("MetaMask not found, install it first.");
        return;
      }
      const provider = new BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const address = await (await signer).getAddress();
      console.log("Wallet address:", address);
      onConnect(address);
    } catch (e) {
      setError("User rejected the connection or error occurred.");
      console.error(e);
    }
  }

  return (
    <div className="container">
      <div className="hero">
        <div className="hero-left">
          <h1 className="hero-title">Let's create and manage subnets.</h1>
          <p className="hero-sub">
            Create and monitor your own blockchain subnets with ease.
          </p>
          <p className="hero-sub">Connect your wallet to get started.</p>

          <div className="hero-cta">
            <button className="btn btn-primary" onClick={connectWallet}>
              Connect Wallet
            </button>
          </div>

          {error && <p className="error">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default WalletConnect;
