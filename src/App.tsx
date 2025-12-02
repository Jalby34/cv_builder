import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import QuickBuild from './pages/QuickBuild';
import DetailedBuilder from './pages/DetailedBuilder';
import LinkedInImport from './pages/LinkedInImport';
import CVCustomizer from './pages/CVCustomizer';
import JobFinder from './pages/JobFinder';

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/quick-build" element={<QuickBuild />} />
          <Route path="/detailed-builder" element={<DetailedBuilder />} />
          <Route path="/linkedin-import" element={<LinkedInImport />} />
          <Route path="/customizer" element={<CVCustomizer />} />
          <Route path="/job-finder" element={<JobFinder />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
