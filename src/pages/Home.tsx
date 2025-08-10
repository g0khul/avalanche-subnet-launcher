import React, { useState } from "react";
import WalletConnect from "../components/WalletConnect";
import SubnetForm from "../components/SubnetForm/SubnetForm";

const Home: React.FC = () => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  return (
    <div>
      {!walletAddress ? (
        <WalletConnect onConnect={setWalletAddress} />
      ) : (
        <SubnetForm walletAddress={walletAddress} />
      )}
    </div>
  );
};

export default Home;
