import './index.css';
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import AuthProvider from "./context/AuthProvider";
import { GoogleOAuthProvider } from "@react-oauth/google";

// Replace this with your actual Client ID from Google Cloud
const clientId = "1091318533580-sotv1p5i5bqktotea8o6cmto4534sk9k.apps.googleusercontent.com";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
