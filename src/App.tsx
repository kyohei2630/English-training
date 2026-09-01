import { HashRouter, Routes, Route } from 'react-router-dom';
import AppShell from './components/layout/AppShell';
import HomePage from './pages/HomePage';
import TrainingPage from './pages/TrainingPage';
import ReadingPage from './pages/ReadingPage';
import ReadingDetailPage from './pages/ReadingDetailPage';
import WritingPage from './pages/WritingPage';
import ReviewPage from './pages/ReviewPage';
import ProgressPage from './pages/ProgressPage';
import SettingsPage from './pages/SettingsPage';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/training" element={<TrainingPage />} />
          <Route path="/reading" element={<ReadingPage />} />
          <Route path="/reading/:materialId" element={<ReadingDetailPage />} />
          <Route path="/writing" element={<WritingPage />} />
          <Route path="/review" element={<ReviewPage />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
