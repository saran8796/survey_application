import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import {
  PlusCircle,
  Trash2,
  Type,
  List,
  Hash,
  Check,
  ChevronRight,
  Save,
  AlertCircle,
  GripVertical,
  X
} from 'lucide-react';
const api = import.meta.env.VITE_SERVER_URL;

const CreateSurvey = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [questions, setQuestions] = useState([{ 
        id: Date.now(), 
        text: '', 
        type: 'short-answer', 
        options: [{ id: Date.now() + 1, text: '' }],
        required: false 
    }]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const addQuestion = () => {
        const newQuestion = {
            id: Date.now(),
            text: '',
            type: 'short-answer',
            options: [{ id: Date.now() + 1, text: '' }],
            required: false
        };
        setQuestions([...questions, newQuestion]);
    };

    const updateQuestion = (index, field, value) => {
        const newQuestions = [...questions];
        if (field === 'type' && value === 'short-answer') {
            newQuestions[index].options = [{ id: Date.now(), text: '' }];
        }
        newQuestions[index][field] = value;
        setQuestions(newQuestions);
    };

    const addOption = (qIndex) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].options.push({ 
            id: Date.now() + newQuestions[qIndex].options.length + 1, 
            text: '' 
        });
        setQuestions(newQuestions);
    };

    const updateOption = (qIndex, oIndex, value) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].options[oIndex].text = value;
        setQuestions(newQuestions);
    };

    const removeOption = (qIndex, oIndex) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].options.splice(oIndex, 1);
        setQuestions(newQuestions);
    };

    const removeQuestion = (index) => {
        if (questions.length > 1) {
            const newQuestions = questions.filter((_, i) => i !== index);
            setQuestions(newQuestions);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim()) {
            setError('Please enter a survey title');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            // Clean up questions for submission
            const cleanQuestions = questions.map(q => ({
                text: q.text,
                type: q.type,
                options: q.type === 'multiple-choice' ? q.options.filter(opt => opt.text.trim()) : [],
                required: q.required
            }));

            await axios.post(`${api}/api/surveys`, { 
                title, 
                description: description.trim() || null,
                questions: cleanQuestions 
            });
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.msg || err.response?.data?.message || 'Failed to create survey. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const questionTypes = [
        { value: 'short-answer', label: 'Short Answer', icon: <Type size={16} /> },
        { value: 'multiple-choice', label: 'Multiple Choice', icon: <List size={16} /> },
        { value: 'rating', label: 'Rating Scale', icon: <Hash size={16} /> }
    ];

    return (
        <div className="min-h-screen bg-linear-to-b from-white to-[#f9fafb] py-8">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center space-x-2 text-[#6b7280] text-sm mb-4">
                        <span>Dashboard</span>
                        <ChevronRight size={14} />
                        <span className="text-[#4361ee] font-medium">Create Survey</span>
                    </div>
                    
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-[#1f2937] mb-2">Create New Survey</h1>
                            <p className="text-[#6b7280]">Design your survey with our intuitive builder</p>
                        </div>
                        <div className="text-right">
                            <div className="text-sm text-[#6b7280]">
                                Questions: <span className="font-bold text-[#4361ee]">{questions.length}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start space-x-3">
                        <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={20} />
                        <p className="text-red-700 text-sm">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Survey Info Card */}
                    <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-[#1f2937] mb-4">Survey Information</h2>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[#1f2937] mb-2">
                                    Survey Title *
                                </label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full px-4 py-3 border border-[#e5e7eb] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4361ee] focus:border-transparent transition-all"
                                    placeholder="What's your survey about?"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#1f2937] mb-2">
                                    Description (Optional)
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full px-4 py-3 border border-[#e5e7eb] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4361ee] focus:border-transparent transition-all resize-none"
                                    placeholder="Add a brief description of your survey"
                                    rows={3}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Questions Section */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-[#1f2937]">Questions</h2>
                            <button
                                type="button"
                                onClick={addQuestion}
                                className="inline-flex items-center text-[#4361ee] hover:text-[#3a56d4] font-medium"
                            >
                                <PlusCircle className="mr-2" size={18} />
                                Add Question
                            </button>
                        </div>

                        {questions.map((q, qIndex) => (
                            <div key={q.id} className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm overflow-hidden">
                                <div className="p-6">
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="w-10 h-10 rounded-lg bg-[#edf2ff] flex items-center justify-center shrink-0 mt-1">
                                            <span className="text-[#4361ee] font-bold">{qIndex + 1}</span>
                                        </div>
                                        
                                        <div className="flex-1">
                                            {/* Question Text */}
                                            <input
                                                type="text"
                                                value={q.text}
                                                onChange={(e) => updateQuestion(qIndex, 'text', e.target.value)}
                                                className="w-full px-4 py-3 text-lg font-medium text-[#1f2937] border-0 focus:outline-none focus:ring-0 placeholder:text-[#9ca3af] mb-4"
                                                placeholder="Enter your question here"
                                                required
                                            />

                                            {/* Question Type Selector */}
                                            <div className="mb-6">
                                                <label className="block text-sm font-medium text-[#1f2937] mb-2">
                                                    Question Type
                                                </label>
                                                <div className="flex flex-wrap gap-2">
                                                    {questionTypes.map((type) => (
                                                        <button
                                                            type="button"
                                                            key={type.value}
                                                            onClick={() => updateQuestion(qIndex, 'type', type.value)}
                                                            className={`inline-flex items-center px-4 py-2 rounded-lg border transition-all ${
                                                                q.type === type.value
                                                                    ? 'bg-[#4361ee] text-white border-[#4361ee]'
                                                                    : 'bg-white text-[#6b7280] border-[#e5e7eb] hover:border-[#4361ee]'
                                                            }`}
                                                        >
                                                            <span className="mr-2">{type.icon}</span>
                                                            {type.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Options for Multiple Choice */}
                                            {q.type === 'multiple-choice' && (
                                                <div className="space-y-3">
                                                    <label className="block text-sm font-medium text-[#1f2937]">
                                                        Options
                                                    </label>
                                                    {q.options.map((opt, oIndex) => (
                                                        <div key={opt.id} className="flex items-center gap-3">
                                                            <div className="w-6 h-6 rounded-full border-2 border-[#e5e7eb] shrink-0"></div>
                                                            <input
                                                                type="text"
                                                                value={opt.text}
                                                                onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                                                                className="flex-1 px-3 py-2 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#4361ee] focus:border-transparent"
                                                                placeholder={`Option ${oIndex + 1}`}
                                                                required
                                                            />
                                                            {q.options.length > 1 && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeOption(qIndex, oIndex)}
                                                                    className="p-2 text-[#6b7280] hover:text-[#ef4444]"
                                                                >
                                                                    <X size={18} />
                                                                </button>
                                                            )}
                                                        </div>
                                                    ))}
                                                    <button
                                                        type="button"
                                                        onClick={() => addOption(qIndex)}
                                                        className="inline-flex items-center text-sm text-[#4361ee] hover:text-[#3a56d4] font-medium mt-2"
                                                    >
                                                        <PlusCircle className="mr-1" size={16} />
                                                        Add Option
                                                    </button>
                                                </div>
                                            )}

                                            {/* Required Toggle */}
                                            <div className="mt-6 pt-4 border-t border-[#e5e7eb]">
                                                <label className="flex items-center cursor-pointer">
                                                    <div className="relative">
                                                        <input
                                                            type="checkbox"
                                                            checked={q.required}
                                                            onChange={(e) => updateQuestion(qIndex, 'required', e.target.checked)}
                                                            className="sr-only"
                                                        />
                                                        <div className={`w-10 h-6 rounded-full transition-colors ${
                                                            q.required ? 'bg-[#10b981]' : 'bg-[#e5e7eb]'
                                                        }`}>
                                                            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                                                                q.required ? 'left-5' : 'left-1'
                                                            }`}></div>
                                                        </div>
                                                    </div>
                                                    <span className="ml-3 text-sm text-[#6b7280]">
                                                        Required question
                                                    </span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Question Actions */}
                                <div className="px-6 py-4 bg-[#f9fafb] border-t border-[#e5e7eb] flex justify-between items-center">
                                    <div className="flex items-center space-x-4">
                                        <span className="text-sm text-[#6b7280]">
                                            {q.type === 'short-answer' ? 'Text response' : 
                                             q.type === 'multiple-choice' ? `${q.options.length} options` :
                                             'Rating scale'}
                                        </span>
                                    </div>
                                    
                                    {questions.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeQuestion(qIndex)}
                                            className="inline-flex items-center text-[#ef4444] hover:text-red-600 font-medium"
                                        >
                                            <Trash2 className="mr-2" size={16} />
                                            Remove
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="sticky bottom-6 bg-white rounded-2xl border border-[#e5e7eb] shadow-lg p-6">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="text-sm text-[#6b7280]">
                                {questions.length} question{questions.length !== 1 ? 's' : ''} • 
                                All changes are saved when you publish
                            </div>
                            
                            <div className="flex items-center space-x-4">
                                <button
                                    type="button"
                                    onClick={() => navigate('/dashboard')}
                                    className="px-6 py-3 border border-[#e5e7eb] text-[#6b7280] rounded-xl font-medium hover:bg-[#f9fafb] transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="inline-flex items-center bg-[#10b981] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#0da271] focus:outline-none focus:ring-2 focus:ring-[#10b981] focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                            Creating...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="mr-2" size={18} />
                                            Create Survey
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateSurvey;