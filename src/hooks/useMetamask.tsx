// src/hooks/useMetamask.ts

import { useState } from "react";
import { ethers } from "ethers";

export function useMetamask() {
  const [account, setAccount] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function connectWallet() {
    try {
      if (!(window as any).ethereum) {
        setError("Metamask is not installed");
        return;
      }
      const provider = new ethers.providers.Web3Provider(
        (window as any).ethereum
      );
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const addr = await signer.getAddress();
      setAccount(addr);
      console.log("Wallet connected:", addr);
    } catch (err) {
      setError("User denied wallet connection or error occurred");
      console.error(err);
    }
  }

  return { account, connectWallet, error };
}
