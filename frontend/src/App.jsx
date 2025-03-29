import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUpPage from "./Pages/SignUp/SignUp";
import  HeroPage from "./Pages/Hero/Hero";
import DashboardPage from "./Pages/Dashboard/Dashboard";

import SettingsPage from "./Pages/Setting/Setting";
import SignInPage from "./Pages/SignIn/SignIn";
import SelectOrgPage from "./Pages/SelectOrg/SelectOrg";
import ActivityLogPage from "./Pages/ActivityLog/ActivityLog";
import BoardPage from "./Pages/Board/Board";
import TaskPage from "./Pages/Task/Task";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/" element={<HeroPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />

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