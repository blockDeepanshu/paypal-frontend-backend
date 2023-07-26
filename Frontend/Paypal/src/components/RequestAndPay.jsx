import { useContext, useEffect, useState } from "react";
import { DollarOutlined, SwapOutlined } from "@ant-design/icons";
import { Modal, Input, InputNumber } from "antd";
import { useContractWrite, useAccount } from "wagmi";
import ABI from "../abi.json";
import UserContext from "../context/UserContext";
import { parseEther } from "viem";

function RequestAndPay() {
  const { userRequest, getUserAccountDetails } = useContext(UserContext);
  const { address, isConnected } = useAccount();

  const [payModal, setPayModal] = useState(false);
  const [requestModal, setRequestModal] = useState(false);
  const [requestAmount, setRequestAmount] = useState(5);
  const [requestAddress, setRequestAddress] = useState("");
  const [requestMessage, setRequestMessage] = useState("");

  const { isSuccess, write } = useContractWrite({
    address: "0x560bF635c81a5F7F9a920b5E37fd6dF2ad0Cc9Ae",
    abi: ABI,
    functionName: "completePaymentRequest",
  });

  const { isSuccess: successRequest, write: writeRequest } = useContractWrite({
    address: "0x560bF635c81a5F7F9a920b5E37fd6dF2ad0Cc9Ae",
    abi: ABI,
    functionName: "createPaymentRequest",
  });

  const showPayModal = () => {
    setPayModal(true);
  };
  const hidePayModal = () => {
    setPayModal(false);
  };

  const showRequestModal = () => {
    setRequestModal(true);
  };
  const hideRequestModal = () => {
    setRequestModal(false);
  };

  useEffect(() => {
    getUserAccountDetails(address, isConnected);
  }, [isSuccess, successRequest]);

  return (
    <>
      <Modal
        title="Confirm Payment"
        open={payModal}
        onOk={() => {
          hidePayModal();
          write({
            args: [0],
            from: address,
            value: parseEther(String(userRequest["1"][0] / 10000000000)),
          });
        }}
        onCancel={hidePayModal}
        okText="Proceed To Pay"
        cancelText="Cancel"
      >
        {userRequest && userRequest["0"].length > 0 && (
          <>
            <h2>Sending payment to {userRequest["3"][0]}</h2>
            <h3>Value: {userRequest["1"][0] / 10000000000} Matic</h3>
            <p>{userRequest["2"][0]}</p>
          </>
        )}
      </Modal>
      <Modal
        title="Request A Payment"
        open={requestModal}
        onOk={() => {
          hideRequestModal();
          writeRequest({
            args: [
              requestAddress,
              requestMessage,
              String(requestAmount * 10000000000),
            ],
            from: address,
          });
        }}
        onCancel={hideRequestModal}
        okText="Proceed To Request"
        cancelText="Cancel"
      >
        <p>Amount (Matic)</p>
        <InputNumber
          value={requestAmount}
          onChange={(val) => setRequestAmount(val)}
        />
        <p>From (address)</p>
        <Input
          placeholder="0x..."
          value={requestAddress}
          onChange={(val) => setRequestAddress(val.target.value)}
        />
        <p>Message</p>
        <Input
          placeholder="Water Bill..."
          value={requestMessage}
          onChange={(val) => setRequestMessage(val.target.value)}
        />
      </Modal>
      <div className="requestAndPay">
        <div
          className="quickOption"
          onClick={() => {
            showPayModal();
          }}
        >
          <DollarOutlined style={{ fontSize: "26px" }} />
          Pay
          {userRequest && userRequest["0"].length > 0 && (
            <div className="numReqs">{userRequest["0"].length}</div>
          )}
        </div>
        <div
          className="quickOption"
          onClick={() => {
            showRequestModal();
          }}
        >
          <SwapOutlined style={{ fontSize: "26px" }} />
          Request
        </div>
      </div>
    </>
  );
}

export default RequestAndPay;
