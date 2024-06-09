import { useEffect, useState, useContext } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Verify.css";
import { StoreContext } from "../../context/StoreContext";

const Verify = () => {
  const [searchParams] = useSearchParams();
  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");
  const [orderDetails, setOrderDetails] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const { url } = useContext(StoreContext);

  useEffect(() => {
    const verifyOrder = async () => {
      try {
        const response = await axios.post(`${url}/api/order/verify`, {
          orderId,
          status: success,
        });

        if (response.data.success) {
          setOrderDetails(response.data.order);
          setMessage("Order confirmed successfully!");
        } else {
          setOrderDetails(response.data.order);
          setMessage("Order confirmation failed.");
        }
      } catch (error) {
        console.error("Error verifying order:", error);
        setMessage("An error occurred while verifying the order.");
      }
    };

    if (orderId && success !== null) {
      verifyOrder();
    }
  }, [orderId, success, url]);

  return (
    <div className="verify-container">
      <h1>Order Verification</h1>
      {message && (
        <div className={`message ${success !== "true" ? "error" : ""}`}>
          {message}
        </div>
      )}
      {orderDetails && (
        <div className="receipt">
          <h2>Order Receipt</h2>
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Amount</th>
                <th>Items</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{orderDetails._id}</td>
                <td className="amount">${orderDetails.amount.toFixed(2)}</td>
                <td>
                  <ul>
                    {orderDetails.items.map((item) => (
                      <li key={item._id}>
                        {item.name} x {item.quantity}
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
      <div className="buttons">
        <button className="back-button" onClick={() => navigate("/myorders")}>
          See Your Order
        </button>
        <button className="back-button" onClick={() => navigate("/")}>
          Go To HomePage
        </button>
      </div>
    </div>
  );
};

export default Verify;
