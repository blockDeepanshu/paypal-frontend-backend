import "./App.css";
import logo from "./assets/paypal.png";
import { Layout, Button } from "antd";
import CurrentBalance from "./components/CurrentBalance";
import RequestAndPay from "./components/RequestAndPay";
import AccountDetails from "./components/AccountDetails";
import RecentActivity from "./components/RecentActivity";

const { Header, Content } = Layout;

function App() {
  return (
    <div className="App">
      <Layout>
        <Header className="header">
          <div className="headerLeft">
            <img src={logo} alt="logo" className="logo" />
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
          </div>

          <Button type={"primary"}>Connect Wallet</Button>
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
