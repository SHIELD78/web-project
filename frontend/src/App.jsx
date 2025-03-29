import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUpPage from "./Pages/SignUp/SignUp";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/" element={<HeroPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/selectorg" element={<SelectOrgPage />} />
        <Route path="/activitylog" element={<ActivityLogPage />} />
        <Route path="/activitylog/organization/:orgId" element={<ActivityLogPage />} />
        <Route path="/activitylog/board/:boardId" element={<ActivityLogPage />} />
        <Route path="/activitylog/task/:taskId" element={<ActivityLogPage />} />
        <Route path="/board/:boardId" element={<BoardPage />} />
        <Route path="/task/:taskId" element={<TaskPage />} />
      </Routes>
    </Router>
  );
}

export default App;