import { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import {
  BarChart3,
  Users,
  ChevronLeft,
  Download,
  Share2,
  Calendar,
  MessageSquare,
  CheckCircle,
  PieChart,
  AlertCircle,
  Loader2,
  TrendingUp,
  Filter,
  Copy,
  Check
} from 'lucide-react';

const api = import.meta.env.VITE_SERVER_URL;

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const SurveyResults = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, loading: authLoading } = useContext(AuthContext);
    const [survey, setSurvey] = useState(null);
    const [responses, setResponses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('overview');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!user) {
                navigate('/login');
                return;
            }

            try {
                const surveyRes = await axios.get(`${api}/api/surveys/${id}`);
                const responseRes = await axios.get(`${api}/api/surveys/${id}/responses`);
                
                setSurvey(surveyRes.data);
                setResponses(responseRes.data);
            } catch (err) {
                console.error(err);
                setError('Failed to load survey results. You may not have permission to view this data.');
            } finally {
                setLoading(false);
            }
        };
        
        if (!authLoading) {
            fetchData();
        }
    }, [id, user, authLoading, navigate]);

    const copyResultsLink = () => {
        const resultsLink = `${window.location.href}`;
        navigator.clipboard.writeText(resultsLink)
            .then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            })
            .catch(err => {
                console.error('Failed to copy:', err);
            });
    };

    const getChartData = (question, chartType = 'bar') => {
        if (question.type === 'multiple-choice') {
            const counts = {};
            question.options.forEach(opt => counts[opt.text] = 0);
            
            responses.forEach(r => {
                const answer = r.answers.find(a => a.questionId === question._id);
                if (answer && counts[answer.answerText] !== undefined) {
                    counts[answer.answerText]++;
                }
            });

            const labels = Object.keys(counts);
            const data = Object.values(counts);
            
            // Your category colors
            const categoryColors = ['#8b5cf6', '#ec4899', '#0ea5e9', '#f59e0b', '#10b981', '#ef4444'];
            
            return {
                labels,
                datasets: [
                    {
                        label: 'Responses',
                        data,
                        backgroundColor: labels.map((_, index) => 
                            chartType === 'doughnut' 
                                ? categoryColors[index % categoryColors.length]
                                : `rgba(67, 97, 238, ${0.6 + (index * 0.1)})`
                        ),
                        borderColor: labels.map((_, index) => 
                            chartType === 'doughnut'
                                ? categoryColors[index % categoryColors.length]
                                : `rgba(67, 97, 238, 1)`
                        ),
                        borderWidth: 1,
                        borderRadius: 8,
                    }
                ]
            };
        }
        return null;
    };

    const getShortAnswers = (questionId) => {
        return responses.map(r => {
            const answer = r.answers.find(a => a.questionId === questionId);
            return answer ? { text: answer.answerText, date: r.createdAt } : null;
        }).filter(Boolean);
    };


    if (loading || authLoading) {
        return (
            <div className="min-h-screen bg-linear-to-b from-white to-[#f9fafb] flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-[#4361ee] mx-auto mb-4" />
                    <p className="text-[#6b7280]">Loading results...</p>
                </div>
            </div>
        );
    }

    if (error || !survey) {
        return (
            <div className="min-h-screen bg-linear-to-b from-white to-[#f9fafb] flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
                    <AlertCircle className="w-12 h-12 text-[#ef4444] mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-[#1f2937] mb-2">Unable to Load Results</h2>
                    <p className="text-[#6b7280] mb-6">{error || 'Survey not found or access denied.'}</p>
                    <Link
                        to="/dashboard"
                        className="inline-flex items-center bg-[#4361ee] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#3a56d4] transition-colors"
                    >
                        <ChevronLeft className="mr-2" size={18} />
                        Back to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="min-h-screen bg-linear-to-b from-white to-[#f9fafb] py-8">
            <div className="container mx-auto px-4 max-w-6xl">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <div>
                            <div className="flex items-center space-x-2 text-sm text-[#6b7280] mb-3">
                                <Link to="/dashboard" className="hover:text-[#4361ee] flex items-center">
                                    <ChevronLeft size={14} className="mr-1" />
                                    Dashboard
                                </Link>
                                <span>/</span>
                                <span className="text-[#4361ee] font-medium">Results</span>
                            </div>
                            <h1 className="text-3xl font-bold text-[#1f2937] mb-2">{survey.title}</h1>
                            <p className="text-[#6b7280]">
                                Analyze responses and gain insights from your survey data
                            </p>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={copyResultsLink}
                                className="inline-flex items-center px-4 py-2 border border-[#e5e7eb] text-[#6b7280] rounded-xl hover:bg-[#f9fafb] transition-colors"
                            >
                                {copied ? (
                                    <>
                                        <Check size={16} className="mr-2" />
                                        Copied!
                                    </>
                                ) : (
                                    <>
                                        <Share2 size={16} className="mr-2" />
                                        Share Results
                                    </>
                                )}
                            </button>
                            <Link
                                to={`/survey/${id}`}
                                className="inline-flex items-center px-4 py-2 bg-[#4361ee] text-white rounded-xl hover:bg-[#3a56d4] transition-colors"
                            >
                                <BarChart3 size={16} className="mr-2" />
                                View Survey
                            </Link>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                        <div className="bg-white p-6 rounded-2xl border border-[#e5e7eb] shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-[#6b7280] text-sm font-medium mb-1">Total Responses</p>
                                    <p className="text-3xl font-bold text-[#1f2937]">{responses.length}</p>
                                </div>
                                <div className="w-12 h-12 rounded-xl bg-[#edf2ff] flex items-center justify-center">
                                    <Users className="text-[#4361ee]" size={24} />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-[#e5e7eb] shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-[#6b7280] text-sm font-medium mb-1">Questions</p>
                                    <p className="text-3xl font-bold text-[#1f2937]">{survey.questions.length}</p>
                                </div>
                                <div className="w-12 h-12 rounded-xl bg-[#edf2ff] flex items-center justify-center">
                                    <MessageSquare className="text-[#4361ee]" size={24} />
                                </div>
                            </div>
                        </div>


                    </div>

                    {/* Tabs */}
                    <div className="flex border-b border-[#e5e7eb] mb-6">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                                activeTab === 'overview'
                                    ? 'border-[#4361ee] text-[#4361ee]'
                                    : 'border-transparent text-[#6b7280] hover:text-[#1f2937]'
                            }`}
                        >
                            <BarChart3 size={16} className="inline mr-2" />
                            Overview
                        </button>
                        <button
                            onClick={() => setActiveTab('responses')}
                            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                                activeTab === 'responses'
                                    ? 'border-[#4361ee] text-[#4361ee]'
                                    : 'border-transparent text-[#6b7280] hover:text-[#1f2937]'
                            }`}
                        >
                            <Users size={16} className="inline mr-2" />
                            Individual Responses
                        </button>
                    </div>
                </div>

                {/* Results Content */}
                <div className="space-y-8">
                    {survey.questions.map((q, index) => (
                        <div key={q._id} className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-[#e5e7eb]">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-8 h-8 rounded-lg bg-[#edf2ff] flex items-center justify-center">
                                                <span className="text-[#4361ee] font-bold">{index + 1}</span>
                                            </div>
                                            <h3 className="text-lg font-semibold text-[#1f2937]">{q.text}</h3>
                                            <span className="px-2 py-1 bg-[#f9fafb] text-[#6b7280] text-xs rounded-full">
                                                {q.type === 'multiple-choice' ? 'Multiple Choice' : 'Short Answer'}
                                            </span>
                                        </div>
                                        <p className="text-[#6b7280] text-sm">
                                            {responses.length} response{responses.length !== 1 ? 's' : ''}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6">
                                {q.type === 'multiple-choice' ? (
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                        {/* Bar Chart */}
                                        <div className="h-72">
                                            <Bar 
                                                data={getChartData(q, 'bar')}
                                                options={{
                                                    maintainAspectRatio: false,
                                                    responsive: true,
                                                    plugins: {
                                                        legend: {
                                                            display: false
                                                        },
                                                        tooltip: {
                                                            backgroundColor: '#1f2937',
                                                            titleColor: '#ffffff',
                                                            bodyColor: '#ffffff'
                                                        }
                                                    },
                                                    scales: {
                                                        y: {
                                                            beginAtZero: true,
                                                            grid: {
                                                                color: '#e5e7eb'
                                                            },
                                                            ticks: {
                                                                color: '#6b7280'
                                                            }
                                                        },
                                                        x: {
                                                            grid: {
                                                                display: false
                                                            },
                                                            ticks: {
                                                                color: '#6b7280'
                                                            }
                                                        }
                                                    }
                                                }}
                                            />
                                        </div>

                                        {/* Doughnut Chart */}
                                        <div className="h-72">
                                            <Doughnut 
                                                data={getChartData(q, 'doughnut')}
                                                options={{
                                                    maintainAspectRatio: false,
                                                    responsive: true,
                                                    plugins: {
                                                        legend: {
                                                            position: 'right',
                                                            labels: {
                                                                color: '#6b7280',
                                                                padding: 20,
                                                                usePointStyle: true
                                                            }
                                                        },
                                                        tooltip: {
                                                            backgroundColor: '#1f2937',
                                                            titleColor: '#ffffff',
                                                            bodyColor: '#ffffff'
                                                        }
                                                    }
                                                }}
                                            />
                                        </div>

                                        {/* Stats Table */}
                                        <div className="lg:col-span-2">
                                            <div className="overflow-x-auto">
                                                <table className="w-full">
                                                    <thead>
                                                        <tr className="border-b border-[#e5e7eb]">
                                                            <th className="text-left py-3 text-sm font-medium text-[#6b7280]">Option</th>
                                                            <th className="text-left py-3 text-sm font-medium text-[#6b7280]">Responses</th>
                                                            <th className="text-left py-3 text-sm font-medium text-[#6b7280]">Percentage</th>
                                                            <th className="text-left py-3 text-sm font-medium text-[#6b7280]">Chart</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-[#e5e7eb]">
                                                        {getChartData(q, 'bar')?.labels.map((label, idx) => {
                                                            const count = getChartData(q, 'bar')?.datasets[0].data[idx] || 0;
                                                            const percentage = responses.length > 0 ? Math.round((count / responses.length) * 100) : 0;
                                                            
                                                            return (
                                                                <tr key={idx} className="hover:bg-[#f9fafb]">
                                                                    <td className="py-3 text-[#1f2937]">{label}</td>
                                                                    <td className="py-3 font-medium text-[#1f2937]">{count}</td>
                                                                    <td className="py-3">
                                                                        <div className="flex items-center gap-3">
                                                                            <span className="font-medium text-[#1f2937]">{percentage}%</span>
                                                                            <div className="flex-1 h-2 bg-[#e5e7eb] rounded-full overflow-hidden">
                                                                                <div 
                                                                                    className="h-full bg-[#4361ee] rounded-full"
                                                                                    style={{ width: `${percentage}%` }}
                                                                                ></div>
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                    <td className="py-3">
                                                                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: getChartData(q, 'doughnut')?.datasets[0].backgroundColor[idx] }}></div>
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="font-medium text-[#1f2937]">Text Responses</h4>
                                            <span className="text-sm text-[#6b7280]">
                                                Showing {getShortAnswers(q._id).length} response{getShortAnswers(q._id).length !== 1 ? 's' : ''}
                                            </span>
                                        </div>
                                        
                                        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                                            {getShortAnswers(q._id).length > 0 ? (
                                                getShortAnswers(q._id).map((answer, idx) => (
                                                    <div key={idx} className="p-4 bg-[#f9fafb] rounded-xl border border-[#e5e7eb]">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <span className="text-sm font-medium text-[#4361ee]">
                                                                Response #{idx + 1}
                                                            </span>
                                                            <span className="text-xs text-[#6b7280]">
                                                                <Calendar size={12} className="inline mr-1" />
                                                                {formatDate(answer.date)}
                                                            </span>
                                                        </div>
                                                        <p className="text-[#1f2937]">{answer.text}</p>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="text-center py-8 text-[#6b7280]">
                                                    <MessageSquare size={32} className="mx-auto mb-3 opacity-50" />
                                                    <p>No text responses yet for this question.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Export Options */}
                <div className="mt-8 p-6 bg-linear-to-r from-[#edf2ff] to-[#e0e7ff] rounded-2xl">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h3 className="font-semibold text-[#1f2937] mb-1">Export Results</h3>
                            <p className="text-sm text-[#6b7280]">Download your survey data for further analysis</p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <button className="inline-flex items-center px-4 py-2 bg-white border border-[#e5e7eb] text-[#1f2937] rounded-xl hover:bg-[#f9fafb] transition-colors">
                                <Download size={16} className="mr-2" />
                                CSV Export
                            </button>
                            <button className="inline-flex items-center px-4 py-2 bg-white border border-[#e5e7eb] text-[#1f2937] rounded-xl hover:bg-[#f9fafb] transition-colors">
                                <Download size={16} className="mr-2" />
                                PDF Report
                            </button>
                            <button className="inline-flex items-center px-4 py-2 bg-[#4361ee] text-white rounded-xl hover:bg-[#3a56d4] transition-colors">
                                <Share2 size={16} className="mr-2" />
                                Share Summary
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SurveyResults;