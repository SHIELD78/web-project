import React,{useEffect} from "react";
import { SignUp, useUser } from "@clerk/clerk-react";
import "./SignUp.css"; 
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
  const { isSignedIn } = useUser(); // Check if user is signed in
  const navigate = useNavigate();

  useEffect(() => {
    if (isSignedIn) {
      navigate("/select-org"); // Redirect if signed in
    }
  }, [isSignedIn, navigate]);
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
