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
            <div className="container mx-auto px-3 sm:px-4 py-4 md:py-8">
                {/* Header */}
                <div className="mb-6 md:mb-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4 mb-4 md:mb-6">
                        <div>
                            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#1f2937] mb-1 md:mb-2">Dashboard</h1>
                            <p className="text-xs sm:text-sm text-[#6b7280]">
                                Welcome back, <span className="font-semibold text-[#4361ee]">{user?.fullName || user?.username}</span>
                            </p>
                        </div>
                        <Link 
                            to="/create-survey" 
                            className="inline-flex items-center justify-center bg-[#4361ee] text-white px-4 md:px-6 py-2 md:py-3 rounded-xl font-semibold hover:bg-[#3a56d4] transition-all duration-300 shadow-md hover:shadow-lg group text-sm md:text-base mt-2 md:mt-0"
                        >
                            <PlusCircle className="mr-1 md:mr-2" size={16} />
                            Create Survey
                            <ChevronRight className="ml-1 md:ml-2 group-hover:translate-x-1 transition-transform" size={14} />
                        </Link>
                    </div>
                </div>

                {/* My Surveys Section */}
                <div className="bg-white rounded-xl md:rounded-2xl border border-[#e5e7eb] shadow-sm overflow-hidden mb-6 md:mb-8">
                    <div className="px-4 md:px-6 py-3 md:py-4 border-b border-[#e5e7eb]">
                        <h2 className="text-lg md:text-xl font-bold text-[#1f2937]">My Surveys</h2>
                        <p className="text-[#6b7280] text-xs md:text-sm mt-1">Manage and analyze your surveys</p>
                    </div>

                    {surveys.filter(s => s.user._id === user?._id || s.user === user?._id).length === 0 ? (
                        <div className="p-6 md:p-12 text-center">
                            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-[#edf2ff] flex items-center justify-center mx-auto mb-3 md:mb-4">
                                <AlertCircle className="text-[#4361ee]" size={20} />
                            </div>
                            <h3 className="text-base md:text-lg font-semibold text-[#1f2937] mb-1 md:mb-2">No surveys yet</h3>
                            <p className="text-[#6b7280] text-xs md:text-base mb-4 md:mb-6 max-w-md mx-auto">
                                Create your first survey to start collecting responses and insights
                            </p>
                            <Link 
                                to="/create-survey" 
                                className="inline-flex items-center bg-[#4361ee] text-white px-4 md:px-6 py-2 md:py-3 rounded-xl font-semibold hover:bg-[#3a56d4] transition-colors text-sm md:text-base"
                            >
                                <PlusCircle className="mr-1 md:mr-2" size={16} />
                                Create Your First Survey
                            </Link>
                        </div>
                    ) : (
                        <div className="divide-y divide-[#e5e7eb]">
                            {surveys.filter(s => s.user._id === user?._id || s.user === user?._id).map(survey => (
                                <div key={survey._id} className="p-4 md:p-6 hover:bg-[#f9fafb] transition-colors">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start gap-2 md:gap-3">
                                                <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-[#edf2ff] flex items-center justify-center shrink-0">
                                                    <ClipboardCheck className="text-[#4361ee]" size={16} />
                                                </div>
                                                <div className="min-w-0">
                                                    <h3 className="font-semibold text-[#1f2937] text-sm md:text-lg mb-1 truncate">
                                                        {survey.title}
                                                    </h3>
                                                    <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm text-[#6b7280]">
                                                        <span className="flex items-center gap-1">
                                                            <Calendar size={12} />
                                                            {formatDate(survey.createdAt)}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Users size={12} />
                                                            {survey.responseCount || 0} responses
                                                        </span>
                                                        {survey.status && (
                                                            <span className={`px-1.5 py-0.5 md:px-2 md:py-1 rounded-full text-xs font-medium ${survey.status === 'active' 
                                                                ? 'bg-green-100 text-green-800' 
                                                                : 'bg-gray-100 text-gray-800'}`}>
                                                                {survey.status}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-1 md:gap-2 mt-3 md:mt-0">
                                            <Link 
                                                to={`/survey/${survey._id}/results`}
                                                className="inline-flex items-center gap-1 md:gap-2 px-2 md:px-4 py-1.5 md:py-2 rounded-lg text-[#4361ee] hover:bg-[#edf2ff] transition-colors font-medium text-xs md:text-sm"
                                            >
                                                <BarChart3 size={14} />
                                                <span className="hidden xs:inline">Analytics</span>
                                                <span className="xs:hidden">View</span>
                                            </Link>

                                            <button
                                                onClick={() => copySurveyLink(survey._id)}
                                                className="inline-flex items-center gap-1 md:gap-2 px-2 md:px-4 py-1.5 md:py-2 rounded-lg text-[#f59e0b] hover:bg-amber-50 transition-colors font-medium text-xs md:text-sm"
                                                title="Copy survey link to share"
                                            >
                                                {copiedSurveyId === survey._id ? (
                                                    <>
                                                        <Check size={14} />
                                                        <span className="hidden xs:inline">Copied!</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Share2 size={14} />
                                                        <span className="hidden xs:inline">Share</span>
                                                        <span className="xs:hidden">Copy</span>
                                                    </>
                                                )}
                                            </button>

                                            <button
                                                onClick={() => deleteSurvey(survey._id)}
                                                disabled={isDeleting === survey._id}
                                                className="inline-flex items-center gap-1 md:gap-2 px-2 md:px-4 py-1.5 md:py-2 rounded-lg text-[#ef4444] hover:bg-red-50 transition-colors font-medium disabled:opacity-50 text-xs md:text-sm"
                                            >
                                                {isDeleting === survey._id ? (
                                                    <>
                                                        <Loader2 className="animate-spin" size={14} />
                                                        <span className="hidden xs:inline">Deleting...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Trash2 size={14} />
                                                        <span className="hidden xs:inline">Delete</span>
                                                        <span className="xs:hidden">Del</span>
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

                {/* Community Surveys Section */}
                <div className="bg-white rounded-xl md:rounded-2xl border border-[#e5e7eb] shadow-sm overflow-hidden">
                    <div className="px-4 md:px-6 py-3 md:py-4 border-b border-[#e5e7eb]">
                        <h2 className="text-lg md:text-xl font-bold text-[#1f2937]">Community Surveys</h2>
                        <p className="text-[#6b7280] text-xs md:text-sm mt-1">Explore surveys from other users</p>
                    </div>

                    {surveys.filter(s => s.user._id !== user?._id && s.user !== user?._id).length === 0 ? (
                        <div className="p-6 md:p-8 text-center text-[#6b7280] text-sm">
                            No community surveys available yet.
                        </div>
                    ) : (
                        <div className="divide-y divide-[#e5e7eb]">
                            {surveys.filter(s => s.user._id !== user?._id && s.user !== user?._id).map(survey => (
                                <div key={survey._id} className="p-4 md:p-6 hover:bg-[#f9fafb] transition-colors">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start gap-2 md:gap-3">
                                                <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-purple-50 flex items-center justify-center shrink-0">
                                                    <Users className="text-purple-600" size={16} />
                                                </div>
                                                <div className="min-w-0">
                                                    <h3 className="font-semibold text-[#1f2937] text-sm md:text-lg mb-1 truncate">
                                                        {survey.title}
                                                    </h3>
                                                    <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm text-[#6b7280]">
                                                        <span className="flex items-center gap-1 truncate">
                                                            <Users size={12} />
                                                            By {survey.user?.fullName || survey.user?.username || 'Unknown'}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Calendar size={12} />
                                                            {formatDate(survey.createdAt)}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <ClipboardCheck size={12} />
                                                            {survey.responseCount || 0} responses
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center mt-3 md:mt-0">
                                            <Link 
                                                to={`/survey/${survey._id}`}
                                                className="inline-flex items-center gap-1 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-lg bg-[#10b981] text-white hover:bg-[#0da271] transition-colors font-medium text-xs md:text-sm w-full md:w-auto justify-center"
                                            >
                                                <PlayCircle size={14} />
                                                Take Survey
                                            </Link>
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