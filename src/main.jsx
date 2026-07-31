import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { registerPwaInstall } from "./utils/pwaInstall";
import { registerPwaUpdates } from "./utils/pwaUpdate";
import "./styles/base.css";

registerPwaInstall();
registerPwaUpdates();

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
