import React, { useState, useEffect } from "react";
import { SignUp } from "@clerk/clerk-react";
import "./SignUp.css"; // Import the CSS file

const quotes = [
  {
    text: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt",
  },
  {
    text: "Success is not final, failure is not fatal: It is the courage to continue that counts.",
    author: "Winston Churchill",
  },
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
  },
  {
    text: "Believe you can and you're halfway there.",
    author: "Theodore Roosevelt",
  },
];

const SignUpPage = () => {
  const [quote, setQuote] = useState(quotes[0]);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setQuote(quotes[randomIndex]);
  }, []);

  return (
    <div className="login-container">
      {/* Left Section: SignUp */}
      <div className="login-form">
        <div className="form-wrapper">
          <h1 className="form-title">Join Us</h1>
          <SignUp
            appearance={{
              variables: {
                colorPrimary: "#4CAF50",
                colorBackground: "#FFFFFF",
                colorText: "#333333",
                colorInputBackground: "#F9F9F9",
                colorInputText: "#333333",
                borderRadius: "8px",
                fontFamily: "Arial, sans-serif",
              },
              elements: {
                card: {
                  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                  border: "1px solid #E5E7EB",
                  padding: "10px",
                  backgroundColor: "#FFFFFF",
                  width: "400px",
                  maxWidth: "400px",
                },
                headerTitle: {
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "#333333",
                  textAlign: "center",
                },
                headerSubtitle: {
                  fontSize: "16px",
                  color: "#666666",
                  textAlign: "center",
                },
                formFieldInput: {
                  borderRadius: "8px",
                  border: "1px solid #D1D5DB",
                  padding: "12px",
                },
                formButtonPrimary: {
                  backgroundColor: "black",
                  color: "white",
                  borderRadius: "8px",
                  padding: "12px",
                  fontSize: "16px",
                  fontWeight: "bold",
                },
                formButtonPrimary__hover: {
                  backgroundColor: "#45A049",
                },
              },
            }}
          />
        </div>
      </div>

      {/* Right Section: Quote */}
      <div className="quote-section">
        <blockquote className="quote">"{quote.text}"</blockquote>
        <footer className="author">— {quote.author}</footer>
      </div>
    </div>
  );
};

export default SignUpPage;