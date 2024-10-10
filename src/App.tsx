import { useState } from "react";
import { formatUnits } from "viem";
import { useBalance, useReadContract } from "wagmi";
import { NFTABI, secretABI, tokenABI } from "./abi";
import "./App.css";
import {
  MY_ACCOUNT_ADDRESS,
  NFT_CONTRACT_ADDRESS,
  SECRET_CONTRACT_ADDRESS,
  TOKEN_CONTRACT_ADDRESS,
  TOKEN_SYMBOL,
} from "./env";

const urlMyAccount = `https://sepolia.etherscan.io/address/${MY_ACCOUNT_ADDRESS}`;
const urlSecret = `https://sepolia.etherscan.io/address/${SECRET_CONTRACT_ADDRESS}`;
const urlToken = `https://sepolia.etherscan.io/address/${TOKEN_CONTRACT_ADDRESS}`;
const urlNFT = `https://sepolia.etherscan.io/address/${NFT_CONTRACT_ADDRESS}`;

function App() {
  const [NFTimage, setNFTImage] = useState<string>("");

  const useBal = useBalance({
    address: MY_ACCOUNT_ADDRESS,
  });

  const useReadSecret = useReadContract({
    address: SECRET_CONTRACT_ADDRESS,
    abi: secretABI,
    functionName: "secret",
  });

  const useReadTokenBalance = useReadContract({
    address: TOKEN_CONTRACT_ADDRESS,
    abi: tokenABI,
    functionName: "balanceOf",
    args: [MY_ACCOUNT_ADDRESS],
  });

  const userReadNFT = useReadContract({
    address: NFT_CONTRACT_ADDRESS,
    abi: NFTABI,
    functionName: "tokenURI",
    args: [0n],
    query: {
      select: (uri) => {
        fetch(uri)
          .then((res) => res.json())
          .then((data) => {
            setNFTImage(data.image);
          });
      },
    },
  });

  const displayBalance = useBal.isLoading
    ? "...loading"
    : `${parseFloat(useBal.data?.formatted || "0").toFixed(2)} (SepoliaETH)`;
  const displaySecret = useReadSecret.isLoading
    ? "...loading"
    : useReadSecret.data || "";
  const displayToken = useReadTokenBalance.isLoading
    ? "...loading"
    : `${parseFloat(formatUnits(useReadTokenBalance.data || 0n, 18)).toFixed(
        2
      )} ${TOKEN_SYMBOL}`;

  return (
    <>
      <h1>My Blockchain Assets</h1>

      <div>
        <h2>My account balance</h2>
        <div>{displayBalance}</div>
        <a href={urlMyAccount} target="_blank">
          Link
        </a>
        <hr />
      </div>

      <div>
        <h2>My secret</h2>
        <div>{displaySecret}</div>
        <a href={urlSecret} target="_blank">
          Link
        </a>
        <hr />
      </div>

      <div>
        <h2>My Token</h2>
        <div>{displayToken}</div>
        <a href={urlToken} target="_blank">
          Link
        </a>
        <hr />
      </div>

      <div>
        <h2>My NFT</h2>
        <div>
          {userReadNFT.isLoading || !NFTimage ? (
            "...loading"
          ) : (
            <img src={NFTimage} style={{ maxHeight: "30vh" }} />
          )}
        </div>
        <a href={urlNFT} target="_blank">
          Link
        </a>
      </div>
    </>
  );
}

export default App;
