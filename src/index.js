import React from "react";
import * as ReactDOMClient from "react-dom/client";

// IE11 브라우저를 위한 바벨 폴리필
import "core-js/stable";
import "regenerator-runtime/runtime";

import App from "app";
import "css/reset.scss";
import "css/global.scss";

const container = document.getElementById("app");

const root = ReactDOMClient.createRoot(container);

root.render(<App />);
