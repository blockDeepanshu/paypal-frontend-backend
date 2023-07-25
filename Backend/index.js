const express = require("express");
const Moralis = require("moralis").default;
const app = express();
const cors = require("cors");
require("dotenv").config();

const port = 8000;
const ABI = require("./abi.json");

app.use(cors());
app.use(express.json());

const convertArrayToObject = (arr) => {
  const data = arr.map((element, index) => ({
    key: (arr.length + 1 - index).toString(),
    type: element[0] === "+" ? "Receive" : "Send",
    amount: element[1] / 10000000000,
    message: element[2],
    address: `${element[3].slice(0, 4)}...${element[3].slice(38)}`,
    subject: element[4],
  }));
  return data;
};

app.get("/getUserAccountDetails", async (req, res) => {
  const { userAddress } = req.query;
  const contractAddress = "0x560bF635c81a5F7F9a920b5E37fd6dF2ad0Cc9Ae";

  const userName = await Moralis.EvmApi.utils.runContractFunction({
    chain: "0x13881",
    address: contractAddress,
    functionName: "getUserName",
    abi: ABI,
    params: { _user: userAddress },
  });

  const userNameJson = userName.raw;

  const userBalance = await Moralis.EvmApi.balance.getNativeBalance({
    chain: "0x13881",
    address: userAddress,
  });

  const userBalanceJson = (userBalance.raw.balance / 1e18).toFixed(2);

  const tokenPrice = await Moralis.EvmApi.token.getTokenPrice({
    address: "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0",
  });

  const tokenPriceInDollars = (
    tokenPrice.raw.usdPrice * userBalanceJson
  ).toFixed(2);

  const userHistory = await Moralis.EvmApi.utils.runContractFunction({
    chain: "0x13881",
    address: contractAddress,
    functionName: "getUserHistory",
    abi: ABI,
    params: { _user: userAddress },
  });

  const userRequests = await Moralis.EvmApi.utils.runContractFunction({
    chain: "0x13881",
    address: contractAddress,
    functionName: "getUserRequests",
    abi: ABI,
    params: { _user: userAddress },
  });

  return res.status(200).json({
    name: userNameJson,
    balance: userBalanceJson,
    dollars: tokenPriceInDollars,
    transactionHistory: convertArrayToObject(userHistory.raw),
    paymentRequests: userRequests.raw,
  });
});

Moralis.start({
  apiKey: process.env.MORALIS_KEY,
}).then(() => {
  app.listen(port, () => {
    console.log(`Server is Running 🚀`);
  });
});
