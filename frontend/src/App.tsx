import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LandingPage } from "@/pages/LandingPage";
import { OnboardingPage } from "@/pages/OnboardingPage";
import { DashboardPage } from "@/pages/DashboardPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing — login / register */}
        <Route path="/" element={<LandingPage />} />

        {/* Onboarding wizard — protected, requires Kinde session */}
        <Route path="/onboarding" element={<OnboardingPage />} />

        {/* Dashboard — shown after onboarding completes */}
        <Route path="/dashboard" element={<DashboardPage />} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
