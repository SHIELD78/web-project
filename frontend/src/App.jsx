import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUpPage from "./Pages/SignUp";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignUpPage />} />
      </Routes>
    </Router>
  );
}

export default App;