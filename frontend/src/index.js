import React from "react";
import ReactDOM from "react-dom/client";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import { BrowserRouter } from "react-router-dom";
import "./App.css";

import App from "./App";
import { GoogleOAuthProvider } from "@react-oauth/google";

ReactDOM.createRoot(document.getElementById("root")).render(
    <BrowserRouter>
        <GoogleOAuthProvider clientId={'255592446336-if0o8j8aa5n0cojpvlngsuab7boef14t.apps.googleusercontent.com'}>
    <App />
</GoogleOAuthProvider>
    </BrowserRouter>
);