import React from "react";
import { SignIn } from "@clerk/clerk-react";
import "./SignIn.css"; 


const SignInPage = () => {
  return (
    <div className="signup-container">
      <div className="image-section">
        <img src="src\assets\image.png" alt="Dashboard Preview" className="image"/>
      </div>
      <div className="signup-section">
        <SignIn />
      </div>
    </div>
  );
};

export default SignInPage;
