import { Card } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { Modal, Input } from "antd";
import matic from "../assets/polygon-token.png";
import { useContext, useEffect, useState } from "react";
import UserContext from "../context/UserContext";
import { useAccount, useContractWrite } from "wagmi";
import ABI from "../abi.json";

function AccountDetails() {
  const { name, balance, getUserAccountDetails } = useContext(UserContext);
  const { address, isConnected } = useAccount();

  const [show, setShow] = useState(false);
  const [names, setName] = useState("");

  const showModal = () => {
    setShow(true);
  };

  const hideModal = () => {
    setShow(false);
  };

  const { isSuccess, write } = useContractWrite({
    address: "0x560bF635c81a5F7F9a920b5E37fd6dF2ad0Cc9Ae",
    abi: ABI,
    functionName: "addNameToWallet",
  });

  useEffect(() => {
    getUserAccountDetails(address, isConnected);
  }, [isSuccess]);

  return (
    <>
      <Modal
        title="Set Account Username"
        open={show}
        onOk={() => {
          hideModal();
          write({
            args: [names],
            from: address,
          });
        }}
        onCancel={hideModal}
        okText="Confirm"
        cancelText="Cancel"
      >
        <Input
          placeholder="Username..."
          value={names}
          onChange={(val) => setName(val.target.value)}
        />
      </Modal>
      <Card title="Account Details" style={{ width: "100%" }}>
        <div className="accountDetailRow">
          <UserOutlined style={{ color: "#767676", fontSize: "25px" }} />
          <div>
            <div className="accountDetailHead"> {name} </div>
            <div className="accountDetailBody"> Address:{address} </div>
          </div>
        </div>
        <div className="accountDetailRow">
          <img src={matic} alt="maticLogo" width={25} />
          <div>
            <div className="accountDetailHead"> Native Matic Tokens</div>
            <div className="accountDetailBody">{balance} Matic</div>
          </div>
        </div>
        <div className="balanceOptions">
          <div className="extraOption" onClick={() => showModal()}>
            Set Username
          </div>
        </div>
      </Card>
    </>
  );
}

export default AccountDetails;
