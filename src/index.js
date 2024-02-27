import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import store from "./store/index";
import { App as AntdApp } from "antd";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  // <React.StrictMode>
  <Provider store={store}>
    <AntdApp>
      <App />
    </AntdApp>
  </Provider>
  // </React.StrictMode>
);

reportWebVitals();
