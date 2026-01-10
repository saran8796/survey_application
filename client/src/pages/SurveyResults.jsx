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

    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                let surveyData;
                let responseData;

                if (user) {
                    // Authenticated fetch
                     const surveyRes = await axios.get(`${api}/api/surveys/${id}`);
                     const responseRes = await axios.get(`${api}/api/surveys/${id}/responses`);
                     surveyData = surveyRes.data;
                     responseData = responseRes.data;
                } else {
                    // Public fetch attempt (guests)
                    const surveyRes = await axios.get(`${api}/api/surveys/${id}`);
                    surveyData = surveyRes.data;

                    if (surveyData.isPublicResults) {
                         // Use the public responses endpoint we created
                         const responseRes = await axios.get(`${api}/api/surveys/${id}/responses/public`);
                         responseData = responseRes.data;
                    } else {
                        // Not public, and not logged in
                        navigate('/login');
                        return;
                    }
                }
                
                setSurvey(surveyData);
                setResponses(responseData);
            } catch (err) {
                 console.error(err);
                 if (!user) {
                     navigate('/login'); // Redirect if fetch fails and not logged in
                 } else {
                    setError('Failed to load survey results. You may not have permission to view this data.');
                 }
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
        } else if (question.type === 'rating') {
            const counts = { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 };
            
            responses.forEach(r => {
                const answer = r.answers.find(a => a.questionId === question._id);
                if (answer && counts[answer.answerText] !== undefined) {
                    counts[answer.answerText]++;
                }
            });

            const labels = Object.keys(counts);
            const data = Object.values(counts);
            
            return {
                labels,
                datasets: [
                    {
                        label: 'Ratings',
                        data,
                        backgroundColor: labels.map((_, index) => 
                            `rgba(16, 185, 129, ${0.4 + (index * 0.15)})`
                        ),
                        borderColor: '#10b981',
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
                <div className="max-w-md w-full bg-white rounded-xl md:rounded-2xl shadow-lg p-4 md:p-8 text-center">
                    <AlertCircle className="w-10 h-10 md:w-12 md:h-12 text-[#ef4444] mx-auto mb-3 md:mb-4" />
                    <h2 className="text-lg md:text-xl font-bold text-[#1f2937] mb-1 md:mb-2">Unable to Load Results</h2>
                    <p className="text-[#6b7280] text-sm md:text-base mb-4 md:mb-6">{error || 'Survey not found or access denied.'}</p>
                    <Link
                        to="/dashboard"
                        className="inline-flex items-center bg-[#4361ee] text-white px-4 md:px-6 py-2 md:py-3 rounded-xl font-semibold hover:bg-[#3a56d4] transition-colors text-sm md:text-base"
                    >
                        <ChevronLeft className="mr-1 md:mr-2" size={14} />
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

    const handleExportCSV = () => {
        if (!survey || !responses.length) return;

        // Create CSV Headers
        const headers = ['Response Date', ...survey.questions.map(q => `"${q.text}"`)];
        
        // Create CSV Rows
        const rows = responses.map(response => {
            const date = new Date(response.createdAt).toLocaleString();
            const answers = survey.questions.map(q => {
                const answer = response.answers.find(a => a.questionId === q._id);
                // Escape quotes in answer text
                return answer ? `"${answer.answerText.replace(/"/g, '""')}"` : '""';
            });
            return [date, ...answers].join(',');
        });

        // Combine Headers and Rows
        const csvContent = [headers.join(','), ...rows].join('\n');
        
        // Create Blob and Download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `${survey.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_results.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const togglePublicAccess = async () => {
        try {
            const res = await axios.put(`${api}/api/surveys/${id}/toggle-public`);
            setSurvey({ ...survey, isPublicResults: res.data.isPublicResults });
        } catch (err) {
            console.error('Failed to toggle public access:', err);
            // Optionally set an error state here
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-b from-white to-[#f9fafb] py-4 md:py-8">
            <div className="container mx-auto px-3 sm:px-4 max-w-6xl">
                {/* Header */}
                <div className="mb-6 md:mb-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4 mb-4 md:mb-6">
                        <div>
                            <div className="flex items-center space-x-1 md:space-x-2 text-xs md:text-sm text-[#6b7280] mb-2 md:mb-3">
                                <Link to="/dashboard" className="hover:text-[#4361ee] flex items-center">
                                    <ChevronLeft size={12} className="mr-1" />
                                    Dashboard
                                </Link>
                                <span>/</span>
                                <span className="text-[#4361ee] font-medium">Results</span>
                            </div>
                            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#1f2937] mb-1 md:mb-2 truncate">{survey.title}</h1>
                            <p className="text-xs md:text-sm text-[#6b7280] truncate">
                                {survey.description || "Analyze responses and gain insights from your survey data"}
                            </p>
                        </div>
                        
                        <div className="flex items-center space-x-2 md:space-x-3 mt-3 md:mt-0">
                            <button
                                onClick={copyResultsLink}
                                className="inline-flex items-center px-3 md:px-4 py-1.5 md:py-2 border border-[#e5e7eb] text-[#6b7280] rounded-lg md:rounded-xl hover:bg-[#f9fafb] transition-colors text-xs md:text-sm"
                            >
                                {copied ? (
                                    <>
                                        <Check size={14} className="mr-1 md:mr-2" />
                                        Copied!
                                    </>
                                ) : (
                                    <>
                                        <Share2 size={14} className="mr-1 md:mr-2" />
                                        Share Results
                                    </>
                                )}
                            </button>
                            <Link
                                to={`/survey/${id}`}
                                className="inline-flex items-center px-3 md:px-4 py-1.5 md:py-2 bg-[#4361ee] text-white rounded-lg md:rounded-xl hover:bg-[#3a56d4] transition-colors text-xs md:text-sm"
                            >
                                <BarChart3 size={14} className="mr-1 md:mr-2" />
                                View Survey
                            </Link>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mb-6 md:mb-8">
                        <div className="bg-white p-3 md:p-4 lg:p-6 rounded-xl md:rounded-2xl border border-[#e5e7eb] shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs md:text-sm text-[#6b7280] font-medium mb-1">Total Responses</p>
                                    <p className="text-xl md:text-2xl lg:text-3xl font-bold text-[#1f2937]">{responses.length}</p>
                                </div>
                                <div className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-lg md:rounded-xl bg-[#edf2ff] flex items-center justify-center">
                                    <Users className="text-[#4361ee]" size={16} />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-3 md:p-4 lg:p-6 rounded-xl md:rounded-2xl border border-[#e5e7eb] shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs md:text-sm text-[#6b7280] font-medium mb-1">Questions</p>
                                    <p className="text-xl md:text-2xl lg:text-3xl font-bold text-[#1f2937]">{survey.questions.length}</p>
                                </div>
                                <div className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-lg md:rounded-xl bg-[#edf2ff] flex items-center justify-center">
                                    <MessageSquare className="text-[#4361ee]" size={16} />
                                </div>
                            </div>
                        </div>


                    </div>

                    {/* Tabs - Overview Tag Only */}
                    <div className="flex border-b border-[#e5e7eb] mb-4 md:mb-6 overflow-x-auto">
                        <div className="px-4 py-2 md:px-6 md:py-3 font-medium text-xs md:text-sm border-b-2 border-[#4361ee] text-[#4361ee] whitespace-nowrap">
                            <BarChart3 size={14} className="inline mr-1 md:mr-2" />
                            Overview
                        </div>
                    </div>
                </div>

                {/* Results Content */}
                <div className="space-y-4 md:space-y-6 lg:space-y-8">
                    {survey.questions.map((q, index) => (
                        <div key={q._id} className="bg-white rounded-xl md:rounded-2xl border border-[#e5e7eb] shadow-sm overflow-hidden">
                            <div className="p-4 md:p-6 border-b border-[#e5e7eb]">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2">
                                            <div className="w-6 h-6 md:w-8 md:h-8 rounded-lg bg-[#edf2ff] flex items-center justify-center shrink-0">
                                                <span className="text-[#4361ee] font-bold text-sm">{index + 1}</span>
                                            </div>
                                            <h3 className="text-sm md:text-base lg:text-lg font-semibold text-[#1f2937] truncate">{q.text}</h3>
                                            <span className="px-1.5 md:px-2 py-0.5 md:py-1 bg-[#f9fafb] text-[#6b7280] text-xs rounded-full shrink-0">
                                                {q.type === 'multiple-choice' ? 'Multiple Choice' : q.type === 'rating' ? 'Rating' : 'Short Answer'}
                                            </span>
                                        </div>
                                        <p className="text-xs md:text-sm text-[#6b7280]">
                                            {responses.length} response{responses.length !== 1 ? 's' : ''}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 md:p-6">
                                {q.type === 'multiple-choice' || q.type === 'rating' ? (
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
                                        {/* Bar Chart */}
                                        <div className="h-48 md:h-56 lg:h-72">
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
                                                                color: '#6b7280',
                                                                font: {
                                                                    size: window.innerWidth < 768 ? 10 : 12
                                                                }
                                                            }
                                                        },
                                                        x: {
                                                            grid: {
                                                                display: false
                                                            },
                                                            ticks: {
                                                                color: '#6b7280',
                                                                font: {
                                                                    size: window.innerWidth < 768 ? 10 : 12
                                                                },
                                                                maxRotation: 45,
                                                                minRotation: 45
                                                            }
                                                        }
                                                    }
                                                }}
                                            />
                                        </div>

                                        {/* Doughnut Chart */}
                                        <div className="h-48 md:h-56 lg:h-72">
                                            <Doughnut 
                                                data={getChartData(q, 'doughnut')}
                                                options={{
                                                    maintainAspectRatio: false,
                                                    responsive: true,
                                                    plugins: {
                                                        legend: {
                                                            position: window.innerWidth < 768 ? 'bottom' : 'right',
                                                            labels: {
                                                                color: '#6b7280',
                                                                padding: 10,
                                                                usePointStyle: true,
                                                                font: {
                                                                    size: window.innerWidth < 768 ? 10 : 12
                                                                }
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
                                            <div className="overflow-x-auto pl-5 md:pl-0 -mx-4 md:mx-0">
                                                <table className="w-full min-w-[500px] md:min-w-full">
                                                    <thead>
                                                        <tr className="border-b border-[#e5e7eb]">
                                                            <th className="text-left py-2 md:py-3 text-xs md:text-sm font-medium text-[#6b7280]">Option</th>
                                                            <th className="text-left py-2 md:py-3 text-xs md:text-sm font-medium text-[#6b7280]">Responses</th>
                                                            <th className="text-left py-2 md:py-3 text-xs md:text-sm font-medium text-[#6b7280]">Percentage</th>
                                                            <th className="text-left py-2 md:py-3 text-xs md:text-sm font-medium text-[#6b7280]">Chart</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-[#e5e7eb]">
                                                        {getChartData(q, 'bar')?.labels.map((label, idx) => {
                                                            const count = getChartData(q, 'bar')?.datasets[0].data[idx] || 0;
                                                            const percentage = responses.length > 0 ? Math.round((count / responses.length) * 100) : 0;
                                                            
                                                            return (
                                                                <tr key={idx} className="hover:bg-[#f9fafb]">
                                                                    <td className="py-2 md:py-3 text-xs md:text-sm text-[#1f2937] truncate max-w-[150px]">{label}</td>
                                                                    <td className="py-2 md:py-3 font-medium text-xs md:text-sm text-[#1f2937]">{count}</td>
                                                                    <td className="py-2 md:py-3">
                                                                        <div className="flex items-center gap-2 md:gap-3">
                                                                            <span className="font-medium text-xs md:text-sm text-[#1f2937]">{percentage}%</span>
                                                                            <div className="flex-1 h-1.5 md:h-2 bg-[#e5e7eb] rounded-full overflow-hidden">
                                                                                <div 
                                                                                    className="h-full bg-[#4361ee] rounded-full"
                                                                                    style={{ width: `${percentage}%` }}
                                                                                ></div>
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                    <td className="py-2 md:py-3">
                                                                        <div className="w-3 h-3 md:w-4 md:h-4 rounded-full" style={{ backgroundColor: getChartData(q, 'doughnut')?.datasets[0].backgroundColor[idx] }}></div>
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
                                    <div className="space-y-3 md:space-y-4">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 md:mb-4">
                                            <h4 className="font-medium text-sm md:text-base text-[#1f2937]">Text Responses</h4>
                                            <span className="text-xs md:text-sm text-[#6b7280]">
                                                Showing {getShortAnswers(q._id).length} response{getShortAnswers(q._id).length !== 1 ? 's' : ''}
                                            </span>
                                        </div>
                                        
                                        <div className="space-y-3 md:space-y-4 max-h-64 md:max-h-96 overflow-y-auto pr-1 md:pr-2">
                                            {getShortAnswers(q._id).length > 0 ? (
                                                getShortAnswers(q._id).map((answer, idx) => (
                                                    <div key={idx} className="p-3 md:p-4 bg-[#f9fafb] rounded-lg md:rounded-xl border border-[#e5e7eb]">
                                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 md:gap-2 mb-1 md:mb-2">
                                                            <span className="text-xs md:text-sm font-medium text-[#4361ee]">
                                                                Response #{idx + 1}
                                                            </span>
                                                            <span className="text-xs text-[#6b7280]">
                                                                <Calendar size={10} className="inline mr-1" />
                                                                {formatDate(answer.date)}
                                                            </span>
                                                        </div>
                                                        <p className="text-xs md:text-sm text-[#1f2937] wrap-break-words">{answer.text}</p>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="text-center py-6 md:py-8 text-[#6b7280]">
                                                    <MessageSquare size={24} className="mx-auto mb-2 md:mb-3 opacity-50" />
                                                    <p className="text-sm">No text responses yet for this question.</p>
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
                <div className="mt-6 md:mt-8 p-4 md:p-6 bg-linear-to-r from-[#edf2ff] to-[#e0e7ff] rounded-xl md:rounded-2xl">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4">
                        <div>
                            <h3 className="font-semibold text-sm md:text-base text-[#1f2937] mb-1">Export Results</h3>
                            <p className="text-xs md:text-sm text-[#6b7280]">Download your survey data for further analysis</p>
                        </div>
                        <div className="flex flex-wrap gap-2 md:gap-3 mt-2 md:mt-0">
                            <button 
                                onClick={handleExportCSV}
                                className="inline-flex items-center px-3 md:px-4 py-1.5 md:py-2 bg-white border border-[#e5e7eb] text-[#1f2937] rounded-lg md:rounded-xl hover:bg-[#f9fafb] transition-colors text-xs md:text-sm"
                            >
                                <Download size={14} className="mr-1 md:mr-2" />
                                CSV Export
                            </button>
                            
                            {/* Only show sharing options for owner */}
                            {user && survey.user && (typeof survey.user === 'object' ? survey.user._id : survey.user) === user._id && (
                                <button 
                                    onClick={togglePublicAccess}
                                    className={`inline-flex items-center px-3 md:px-4 py-1.5 md:py-2 border rounded-lg md:rounded-xl transition-colors text-xs md:text-sm ${survey.isPublicResults 
                                        ? 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100' 
                                        : 'bg-white border-[#e5e7eb] text-[#1f2937] hover:bg-[#f9fafb]'}`}
                                >
                                    <Share2 size={14} className="mr-1 md:mr-2" />
                                    <span className="hidden xs:inline">
                                        {survey.isPublicResults ? 'Disable Public Access' : 'Enable Public Access'}
                                    </span>
                                    <span className="xs:hidden">
                                        {survey.isPublicResults ? 'Disable Public' : 'Enable Public'}
                                    </span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SurveyResults;