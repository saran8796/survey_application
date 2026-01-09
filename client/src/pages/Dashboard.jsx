import { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { 
  PlusCircle, 
  BarChart3, 
  Users, 
  Calendar, 
  Trash2, 
  Eye, 
  Share2, 
  Loader2,
  ChevronRight,
  ClipboardCheck,
  TrendingUp,
  AlertCircle,
  Link as LinkIcon,
  Copy,
  Check,
  PlayCircle
} from 'lucide-react';

const api = import.meta.env.VITE_SERVER_URL;

const Dashboard = () => {
    const { user, loading } = useContext(AuthContext);
    const [surveys, setSurveys] = useState([]);
    const [stats, setStats] = useState({
        totalSurveys: 0,
        totalResponses: 0,
        activeSurveys: 0
    });
    const [isDeleting, setIsDeleting] = useState(null);
    const [copiedSurveyId, setCopiedSurveyId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !user) {
            navigate('/login');
        } else if (user) {
            fetchSurveys();
        }
    }, [user, loading, navigate]);

    const fetchSurveys = async () => {
        try {
            const res = await axios.get(`${api}/api/surveys/`);
            setSurveys(res.data);
            
            // Calculate stats
            const totalResponses = res.data.reduce((acc, survey) => 
                acc + (survey.responses?.length || 0), 0);
            const activeSurveys = res.data.filter(s => s.status === 'active').length;
            
            setStats({
                totalSurveys: res.data.length,
                totalResponses,
                activeSurveys
            });
        } catch (err) {
            console.error(err);
        }
    };

    const deleteSurvey = async (id) => {
        if (!window.confirm('Are you sure you want to delete this survey? This action cannot be undone.')) {
            return;
        }

        setIsDeleting(id);
        try {
            await axios.delete(`${api}/api/surveys/${id}`);
            setSurveys(surveys.filter(s => s._id !== id));
        } catch (err) {
            console.error(err);
            alert('Failed to delete survey. Please try again.');
        } finally {
            setIsDeleting(null);
        }
    };

    const copySurveyLink = (surveyId) => {
        const surveyLink = `${window.location.origin}/survey/${surveyId}`;
        navigator.clipboard.writeText(surveyLink)
            .then(() => {
                setCopiedSurveyId(surveyId);
                setTimeout(() => setCopiedSurveyId(null), 2000);
            })
            .catch(err => {
                console.error('Failed to copy:', err);
                alert('Failed to copy link. Please try again.');
            });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-linear-to-b from-white to-[#f9fafb] flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-[#4361ee] mx-auto mb-4" />
                    <p className="text-[#6b7280]">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-b from-white to-[#f9fafb]">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-[#1f2937] mb-2">Dashboard</h1>
                            <p className="text-[#6b7280]">
                                Welcome back, <span className="font-semibold text-[#4361ee]">{user?.username}</span>
                            </p>
                        </div>
                        <Link 
                            to="/create-survey" 
                            className="inline-flex items-center justify-center bg-[#4361ee] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#3a56d4] transition-all duration-300 shadow-md hover:shadow-lg group"
                        >
                            <PlusCircle className="mr-2" size={20} />
                            Create New Survey
                            <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
                        </Link>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-2xl border border-[#e5e7eb] shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-[#6b7280] text-sm font-medium mb-1">Total Surveys</p>
                                    <p className="text-3xl font-bold text-[#1f2937]">{stats.totalSurveys}</p>
                                </div>
                                <div className="w-12 h-12 rounded-xl bg-[#edf2ff] flex items-center justify-center">
                                    <ClipboardCheck className="text-[#4361ee]" size={24} />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-[#e5e7eb] shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-[#6b7280] text-sm font-medium mb-1">Total Responses</p>
                                    <p className="text-3xl font-bold text-[#1f2937]">{stats.totalResponses}</p>
                                </div>
                                <div className="w-12 h-12 rounded-xl bg-[#edf2ff] flex items-center justify-center">
                                    <Users className="text-[#4361ee]" size={24} />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-[#e5e7eb] shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-[#6b7280] text-sm font-medium mb-1">Active Surveys</p>
                                    <p className="text-3xl font-bold text-[#1f2937]">{stats.activeSurveys}</p>
                                </div>
                                <div className="w-12 h-12 rounded-xl bg-[#edf2ff] flex items-center justify-center">
                                    <TrendingUp className="text-[#4361ee]" size={24} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Surveys Section */}
                <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-[#e5e7eb]">
                        <h2 className="text-xl font-bold text-[#1f2937]">My Surveys</h2>
                        <p className="text-[#6b7280] text-sm mt-1">Create, manage, and analyze your surveys</p>
                    </div>

                    {surveys.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="w-16 h-16 rounded-full bg-[#edf2ff] flex items-center justify-center mx-auto mb-4">
                                <AlertCircle className="text-[#4361ee]" size={24} />
                            </div>
                            <h3 className="text-lg font-semibold text-[#1f2937] mb-2">No surveys yet</h3>
                            <p className="text-[#6b7280] mb-6 max-w-md mx-auto">
                                Create your first survey to start collecting responses and insights
                            </p>
                            <Link 
                                to="/create-survey" 
                                className="inline-flex items-center bg-[#4361ee] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#3a56d4] transition-colors"
                            >
                                <PlusCircle className="mr-2" size={20} />
                                Create Your First Survey
                            </Link>
                        </div>
                    ) : (
                        <div className="divide-y divide-[#e5e7eb]">
                            {surveys.map(survey => (
                                <div key={survey._id} className="p-6 hover:bg-[#f9fafb] transition-colors">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-start gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-[#edf2ff] flex items-center justify-center shrink-0">
                                                    <ClipboardCheck className="text-[#4361ee]" size={20} />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-[#1f2937] text-lg mb-1">
                                                        {survey.title}
                                                    </h3>
                                                    <div className="flex flex-wrap items-center gap-4 text-sm text-[#6b7280]">
                                                        <span className="flex items-center gap-1">
                                                            <Calendar size={14} />
                                                            {formatDate(survey.createdAt)}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Users size={14} />
                                                            {survey.responses?.length || 0} responses
                                                        </span>
                                                        {survey.status && (
                                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                                survey.status === 'active' 
                                                                    ? 'bg-green-100 text-green-800' 
                                                                    : 'bg-gray-100 text-gray-800'
                                                            }`}>
                                                                {survey.status}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-2">
                                            {/* Take Survey Button */}
                                            <Link 
                                                to={`/survey/${survey._id}`}
                                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#10b981] text-white hover:bg-[#0da271] transition-colors font-medium"
                                            >
                                                <PlayCircle size={16} />
                                                Take Survey
                                            </Link>

                                            {/* View Results Button */}
                                            <Link 
                                                to={`/survey/${survey._id}/results`}
                                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-[#4361ee] hover:bg-[#edf2ff] transition-colors font-medium"
                                            >
                                                <BarChart3 size={16} />
                                                Analytics
                                            </Link>

                                            {/* Share Button */}
                                            <button
                                                onClick={() => copySurveyLink(survey._id)}
                                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-[#f59e0b] hover:bg-amber-50 transition-colors font-medium"
                                                title="Copy survey link to share"
                                            >
                                                {copiedSurveyId === survey._id ? (
                                                    <>
                                                        <Check size={16} />
                                                        Copied!
                                                    </>
                                                ) : (
                                                    <>
                                                        <Share2 size={16} />
                                                        Share
                                                    </>
                                                )}
                                            </button>

                                            {/* Delete Button */}
                                            <button
                                                onClick={() => deleteSurvey(survey._id)}
                                                disabled={isDeleting === survey._id}
                                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-[#ef4444] hover:bg-red-50 transition-colors font-medium disabled:opacity-50"
                                            >
                                                {isDeleting === survey._id ? (
                                                    <>
                                                        <Loader2 className="animate-spin" size={16} />
                                                        Deleting...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Trash2 size={16} />
                                                        Delete
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                
            </div>
        </div>
    );
};

export default Dashboard;