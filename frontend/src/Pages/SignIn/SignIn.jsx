import React ,{useEffect} from "react";
import { SignIn, useClerk} from "@clerk/clerk-react";
import "./SignIn.css"; 
import { useNavigate } from "react-router-dom";

const SignInPage = () => {
  const { user } = useClerk(); // Get user object
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/selectorg"); // Redirect if signed in
    }
  }, [user, navigate]);
  return (
    <div className="signup-container">
      <div className="image-section">
        <img src="src\assets\image.png" alt="Dashboard Preview" className="image"/>
      </div>
      <div className="signup-section">
        <SignIn  />
      </div>
    </div>
  );
};

export default SignInPage;
