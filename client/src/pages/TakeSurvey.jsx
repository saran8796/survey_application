import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  CheckCircle,
  ArrowLeft,
  Send,
  Loader2,
  ClipboardCheck,
  AlertCircle,
  ChevronRight,
  Type,
  List,
  Hash,
  Star,
  Award
} from 'lucide-react';

const api = import.meta.env.VITE_SERVER_URL;

const TakeSurvey = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [survey, setSurvey] = useState(null);
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const fetchSurvey = async () => {
            try {
                const res = await axios.get(`${api}/api/surveys/${id}`);
                setSurvey(res.data);
                
                // Initialize answers state
                const initialAnswers = {};
                res.data.questions.forEach(q => {
                    initialAnswers[q._id] = q.type === 'multiple-choice' ? '' : '';
                });
                setAnswers(initialAnswers);
            } catch (err) {
                console.error(err);
                setError('Failed to load survey. Please try again.');
            }
        };
        fetchSurvey();
    }, [id]);

    useEffect(() => {
        if (survey) {
            const answeredCount = Object.values(answers).filter(answer => 
                answer !== '' && answer !== null
            ).length;
            const newProgress = (answeredCount / survey.questions.length) * 100;
            setProgress(newProgress);
        }
    }, [answers, survey]);

    const handleAnswerChange = (questionId, value) => {
        setAnswers({ ...answers, [questionId]: value });
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            // Format answers for backend
            const formattedAnswers = Object.keys(answers).map(qId => ({
                questionId: qId,
                answerText: answers[qId]
            }));

            await axios.post(`${api}/api/surveys/${id}/responses`, { answers: formattedAnswers });
            setSubmitted(true);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.msg || err.response?.data?.message || 'Failed to submit. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!survey && !error) {
        return (
            <div className="min-h-screen bg-linear-to-b from-white to-[#f9fafb] flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-[#4361ee] mx-auto mb-4" />
                    <p className="text-[#6b7280]">Loading survey...</p>
                </div>
            </div>
        );
    }

    if (error && !survey) {
        return (
            <div className="min-h-screen bg-linear-to-b from-white to-[#f9fafb] flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
                    <AlertCircle className="w-12 h-12 text-[#ef4444] mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-[#1f2937] mb-2">Error Loading Survey</h2>
                    <p className="text-[#6b7280] mb-6">{error}</p>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="inline-flex items-center text-[#4361ee] hover:text-[#3a56d4] font-medium"
                    >
                        <ArrowLeft className="mr-2" size={18} />
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    if (submitted) {
        return (
            <div className="min-h-screen bg-linear-to-b from-white to-[#f9fafb] flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
                    <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-[#1f2937] mb-3">Thank You! 🎉</h2>
                    <p className="text-[#6b7280] mb-6">
                        Your response has been recorded. We appreciate your feedback!
                    </p>
                    <div className="space-y-4">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="w-full inline-flex items-center justify-center bg-[#4361ee] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#3a56d4] transition-colors"
                        >
                            <Award className="mr-2" size={18} />
                            View Your Dashboard
                        </button>
                        <button
                            onClick={() => window.location.reload()}
                            className="w-full inline-flex items-center justify-center border border-[#e5e7eb] text-[#6b7280] px-6 py-3 rounded-xl font-medium hover:bg-[#f9fafb] transition-colors"
                        >
                            <ClipboardCheck className="mr-2" size={18} />
                            Take Another Survey
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const getQuestionIcon = (type) => {
        switch(type) {
            case 'short-answer': return <Type size={18} />;
            case 'multiple-choice': return <List size={18} />;
            case 'rating': return <Star size={18} />;
            default: return <ClipboardCheck size={18} />;
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-b from-white to-[#f9fafb] py-8">
            <div className="container mx-auto px-4 max-w-3xl">
                {/* Back Button & Progress */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="inline-flex items-center text-[#6b7280] hover:text-[#4361ee] mb-6 group"
                    >
                        <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={18} />
                        Back to Dashboard
                    </button>

                    {/* Progress Bar */}
                    <div className="mb-4">
                        <div className="flex justify-between text-sm text-[#6b7280] mb-2">
                            <span>Survey Progress</span>
                            <span>{Math.round(progress)}% Complete</span>
                        </div>
                        <div className="w-full h-2 bg-[#e5e7eb] rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-linear-to-r from-[#4361ee] to-[#3a56d4] transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                    </div>
                </div>

                {/* Survey Card */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
                    {/* Header */}
                    <div className="p-6 border-b border-[#e5e7eb]">
                        <div className="flex items-start gap-3">
                            <div className="w-12 h-12 rounded-xl bg-[#edf2ff] flex items-center justify-center shrink-0">
                                <ClipboardCheck className="text-[#4361ee]" size={24} />
                            </div>
                            <div className="flex-1">
                                <h1 className="text-2xl font-bold text-[#1f2937] mb-2">{survey.title}</h1>
                                {survey.description && (
                                    <p className="text-[#6b7280]">{survey.description}</p>
                                )}
                                <div className="flex items-center text-sm text-[#6b7280] mt-2">
                                    <span className="flex items-center gap-1">
                                        <List size={14} />
                                        {survey.questions.length} questions
                                    </span>
                                    <span className="mx-2">•</span>
                                    <span>Anonymous survey</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mx-6 mt-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start space-x-3">
                            <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={20} />
                            <p className="text-red-700 text-sm">{error}</p>
                        </div>
                    )}

                    {/* Survey Form */}
                    <form onSubmit={handleSubmit} className="p-6">
                        <div className="space-y-8">
                            {survey.questions.map((q, index) => (
                                <div 
                                    key={q._id} 
                                    className={`p-6 rounded-xl border ${
                                        answers[q._id] && answers[q._id] !== '' 
                                            ? 'border-[#10b981] bg-green-50/50' 
                                            : 'border-[#e5e7eb] bg-white'
                                    } transition-colors`}
                                >
                                    <div className="flex items-start gap-4 mb-6">
                                        <div className="w-10 h-10 rounded-lg bg-[#edf2ff] flex items-center justify-center shrink-0">
                                            <span className="text-[#4361ee] font-bold">{index + 1}</span>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-2">
                                                <h3 className="text-lg font-semibold text-[#1f2937]">
                                                    {q.text}
                                                    {q.required && (
                                                        <span className="text-red-500 ml-1">*</span>
                                                    )}
                                                </h3>
                                                <div className="flex items-center text-[#6b7280] text-sm">
                                                    {getQuestionIcon(q.type)}
                                                    <span className="ml-2 capitalize">{q.type.replace('-', ' ')}</span>
                                                </div>
                                            </div>
                                            
                                            {/* Question Type Inputs */}
                                            {q.type === 'short-answer' ? (
                                                <div className="relative">
                                                    <textarea
                                                        value={answers[q._id] || ''}
                                                        onChange={(e) => handleAnswerChange(q._id, e.target.value)}
                                                        className="w-full px-4 py-3 border border-[#e5e7eb] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4361ee] focus:border-transparent transition-all resize-none"
                                                        placeholder="Type your answer here..."
                                                        rows={3}
                                                        required={q.required}
                                                    />
                                                    <div className="absolute bottom-3 right-3 text-xs text-[#6b7280]">
                                                        Press Enter for new line
                                                    </div>
                                                </div>
                                            ) : q.type === 'multiple-choice' ? (
                                                <div className="space-y-3">
                                                    {q.options.map((opt, optIndex) => (
                                                        <label 
                                                            key={opt._id || optIndex} 
                                                            className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${
                                                                answers[q._id] === opt.text
                                                                    ? 'border-[#4361ee] bg-[#edf2ff]'
                                                                    : 'border-[#e5e7eb] hover:border-[#4361ee] hover:bg-[#f9fafb]'
                                                            }`}
                                                        >
                                                            <input
                                                                type="radio"
                                                                name={q._id}
                                                                value={opt.text}
                                                                checked={answers[q._id] === opt.text}
                                                                onChange={(e) => handleAnswerChange(q._id, e.target.value)}
                                                                className="hidden"
                                                                required={q.required && answers[q._id] === ''}
                                                            />
                                                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 shrink-0 ${
                                                                answers[q._id] === opt.text
                                                                    ? 'border-[#4361ee] bg-[#4361ee]'
                                                                    : 'border-[#6b7280]'
                                                            }`}>
                                                                {answers[q._id] === opt.text && (
                                                                    <div className="w-2 h-2 rounded-full bg-white"></div>
                                                                )}
                                                            </div>
                                                            <span className="text-[#1f2937]">{opt.text}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            ) : q.type === 'rating' ? (
                                                <div className="space-y-4">
                                                    <div className="flex justify-center space-x-2">
                                                        {[1, 2, 3, 4, 5].map((rating) => (
                                                            <button
                                                                key={rating}
                                                                type="button"
                                                                onClick={() => handleAnswerChange(q._id, rating.toString())}
                                                                className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold transition-all ${
                                                                    answers[q._id] === rating.toString()
                                                                        ? 'bg-[#10b981] text-white transform scale-110'
                                                                        : 'bg-[#f9fafb] text-[#6b7280] hover:bg-[#edf2ff]'
                                                                }`}
                                                            >
                                                                {rating}
                                                            </button>
                                                        ))}
                                                    </div>
                                                    <div className="flex justify-between text-sm text-[#6b7280] px-2">
                                                        <span>Poor</span>
                                                        <span>Excellent</span>
                                                    </div>
                                                    {/* Hidden input for HTML5 validation */}
                                                    <input 
                                                        type="text" 
                                                        className="absolute opacity-0 w-1 h-1 pointer-events-none" 
                                                        value={answers[q._id] || ''} 
                                                        required={q.required} 
                                                        onChange={() => {}}
                                                        tabIndex={-1}
                                                        onInvalid={(e) => e.target.setCustomValidity('Please select a rating')}
                                                        onInput={(e) => e.target.setCustomValidity('')}
                                                    />
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>

                                    {answers[q._id] && answers[q._id] !== '' && (
                                        <div className="flex items-center justify-end text-sm text-[#10b981] mt-2">
                                            <CheckCircle size={14} className="mr-1" />
                                            Answered
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Submit Button */}
                        <div className="mt-8 pt-6 border-t border-[#e5e7eb]">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full inline-flex items-center justify-center bg-[#10b981] text-white px-8 py-4 rounded-xl font-semibold hover:bg-[#0da271] focus:outline-none focus:ring-2 focus:ring-[#10b981] focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <Send className="mr-2 group-hover:translate-x-1 transition-transform" size={18} />
                                        Submit Survey
                                        <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
                                    </>
                                )}
                            </button>
                            <p className="text-center text-sm text-[#6b7280] mt-4">
                                Your responses are anonymous and confidential
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default TakeSurvey;