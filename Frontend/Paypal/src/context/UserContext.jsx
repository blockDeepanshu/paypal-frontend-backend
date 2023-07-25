import { createContext, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [name, setName] = useState("...");
  const [balance, setBalance] = useState("...");
  const [dollars, setDollars] = useState("...");
  const [transactionHistory, setTransactionHistory] = useState(null);
  const [userRequest, setUserRequests] = useState({
    0: [],
    1: [],
    2: [],
    3: [],
  });

  const getUserAccountDetails = async (address, isConnected) => {
    if (isConnected) {
      const data = await fetch(
        `http://localhost:8000/getUserAccountDetails?userAddress=${address}`
      );
      const response = await data.json();

      console.log(response);

      if (response["name"][1]) setName(response["name"][0]);

      setBalance(response["balance"].toString());
      setDollars(response["dollars"].toString());
      setTransactionHistory(response["transactionHistory"]);
      setUserRequests(response["paymentRequests"]);
    } else {
      console.log("else is running");
      setBalance("...");
      setDollars("...");
      setTransactionHistory(null);
      setUserRequests({
        0: [],
        1: [],
        2: [],
        3: [],
      });
    }
  };

  return (
    <UserContext.Provider
      value={{
        name,
        balance,
        dollars,
        transactionHistory,
        userRequest,
        getUserAccountDetails,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
