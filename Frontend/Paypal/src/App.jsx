import "./App.css";
import logo from "./assets/paypal.png";
import { Layout, Button } from "antd";

import { useWeb3Modal } from "@web3modal/react";
import { useAccount } from "wagmi";

import CurrentBalance from "./components/CurrentBalance";
import RequestAndPay from "./components/RequestAndPay";
import AccountDetails from "./components/AccountDetails";
import RecentActivity from "./components/RecentActivity";
import { useContext, useEffect } from "react";
import UserContext from "./context/UserContext";

const { Header, Content } = Layout;

function App() {
  const { open } = useWeb3Modal();
  const { address, isConnected } = useAccount();

  const { getUserAccountDetails } = useContext(UserContext);

  useEffect(() => {
    console.log("is", isConnected);
    getUserAccountDetails(address, isConnected);
  }, [isConnected]);

  return (
    <div className="App">
      <Layout>
        <Header className="header">
          <div className="headerLeft">
            <img src={logo} alt="logo" className="logo" />
            {isConnected && (
              <>
                <div
                  className="menuOption"
                  style={{ borderBottom: "1.5px solid white" }}
                >
                  Summary
                </div>
                <div className="menuOption">Activity</div>
                <div className="menuOption">{`Send & Request`}</div>
                <div className="menuOption">Wallet</div>
                <div className="menuOption">Help</div>
              </>
            )}
          </div>

          <Button type={"primary"} onClick={() => open()}>
            {!isConnected ? "Connect Wallet" : "Disconnect Wallet"}
          </Button>
        </Header>
        <Content className="content">
          <div className="firstColumn">
            <CurrentBalance />
            <RequestAndPay />
            <AccountDetails />
          </div>
          <div className="secondColumn">
            <RecentActivity />
          </div>
        </Content>
      </Layout>
    </div>
  );
}

export default App;
