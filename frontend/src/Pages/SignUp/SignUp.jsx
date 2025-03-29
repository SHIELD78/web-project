import React from "react";
import { SignUp } from "@clerk/clerk-react";
import "./SignUp.css"; 


const SignupPage = () => {
  return (
    <div className="signup-container">
      <div className="image-section">
        <img src="src\assets\image.png" alt="Dashboard Preview" className="image"/>
      </div>
      <div className="signup-section">
        <SignUp />
      </div>
    </div>
  );
};

export default SignupPage;
