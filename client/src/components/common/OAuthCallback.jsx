import React, { useEffect, useState } from "react";
import { Client, Account } from "appwrite";
import { useNavigate } from "react-router-dom";

// --- Initialize Appwrite Client ---
const client = new Client()
  .setEndpoint("https://nyc.cloud.appwrite.io/v1") // Replace if self-hosted
  .setProject("6893bc88002d2718b00e"); // Your Project ID

const account = new Account(client);

export default function OAuthCallback() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // After Appwrite OAuth redirect, try to get the session
    account
      .get()
      .then((response) => {
        console.log("User logged in:", response);
        navigate("/dashboard"); // Redirect after successful login
      })
      .catch((error) => {
        console.error("OAuth session error:", error);
        navigate("/login"); // Redirect to login on failure
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      {loading ? <h2>Signing you in...</h2> : <h2>Redirecting...</h2>}
    </div>
  );
}
