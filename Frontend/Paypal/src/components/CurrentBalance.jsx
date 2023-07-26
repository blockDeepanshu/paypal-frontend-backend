import { Card } from "antd";
import { useContext } from "react";
import UserContext from "../context/UserContext";

function CurrentBalance() {
  const { dollars } = useContext(UserContext);
  return (
    <Card title="Current Balance" style={{ width: "100%" }}>
      <div className="currentBalance">
        <div style={{ lineHeight: "70px" }}>$ {dollars}</div>
        <div style={{ fontSize: "20px" }}>Available</div>
      </div>
    </Card>
  );
}

export default CurrentBalance;
