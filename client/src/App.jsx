import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateSurvey from './pages/CreateSurvey';
import TakeSurvey from './pages/TakeSurvey';
import SurveyResults from './pages/SurveyResults';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 text-gray-900">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create-survey" element={<CreateSurvey />} />
            <Route path="/survey/:id" element={<TakeSurvey />} />
            <Route path="/survey/:id/results" element={<SurveyResults />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

const Home = () => (
  <div className="container mx-auto p-8 text-center mt-10">
    <h1 className="text-5xl font-extrabold mb-6 text-blue-600">Welcome to Surveyor</h1>
    <p className="text-xl mb-8 text-gray-700">Create, Share, and Analyze Surveys with ease.</p>
    <div className="space-x-4">
        <a href="/login" className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-700 transition">Get Started</a>
        <a href="/register" className="bg-white text-blue-600 border border-blue-600 px-6 py-3 rounded-lg text-lg hover:bg-blue-50 transition">Sign Up</a>
    </div>
  </div>
);

export default App;
