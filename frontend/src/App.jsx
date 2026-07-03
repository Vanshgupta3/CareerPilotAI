import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import ResumeAnalysis from "./pages/ResumeAnalysis";
import InterviewSetup from "./pages/InterviewSetup";
import InterviewSession from "./pages/InterviewSession";
import Feedback from "./pages/Feedback";
import ATSReport from "./pages/ATSReport";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
    path="/dashboard"
    element={
        <ProtectedRoute>
            <Dashboard />
        </ProtectedRoute>
    }
/>

<Route
    path="/resume"
    element={
        <ProtectedRoute>
            <ResumeAnalysis />
        </ProtectedRoute>
    }
/>

<Route
    path="/interview"
    element={
        <ProtectedRoute>
            <InterviewSetup />
        </ProtectedRoute>
    }
/>

<Route
    path="/interview/:id"
    element={
        <ProtectedRoute>
            <InterviewSession />
        </ProtectedRoute>
    }
/>
<Route
    path="/ats-report"
    element={
        <ProtectedRoute>
            <ATSReport />
        </ProtectedRoute>
    }
/>
<Route
    path="/feedback/:interviewId"
    element={
        <ProtectedRoute>
            <Feedback />
        </ProtectedRoute>
    }
/>
    </Routes>
  );
}

export default App;