import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ConfigProvider } from "antd";
import { BrowserRouter } from "react-router-dom"; // Import BrowserRouter

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ConfigProvider
    theme={{
      components: {
        Table: {
          borderColor: "#b5f5ec",
          headerBg: "orange",
          cellPaddingBlock: 5,
          headerColor: "white",
          rowHoverBg: "#f6ffed",
          headerBorderRadius: 0,
        },
      },
    }}
  >
    <App /> {/* Your main App component */}
  </ConfigProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
