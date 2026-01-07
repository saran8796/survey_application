import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
const api = import.meta.env.VITE_SERVER_URL;

const TakeSurvey = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [survey, setSurvey] = useState(null);
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        const fetchSurvey = async () => {
            try {
                const res = await axios.get(`${api}/api/surveys/${id}`);
                setSurvey(res.data);
                // Initialize answers state
                const initialAnswers = {};
                res.data.questions.forEach(q => {
                    initialAnswers[q._id] = '';
                });
                setAnswers(initialAnswers);
            } catch (err) {
                console.error(err);
            }
        };
        fetchSurvey();
    }, [id]);

    const handleAnswerChange = (questionId, value) => {
        setAnswers({ ...answers, [questionId]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Format answers for backend
        const formattedAnswers = Object.keys(answers).map(qId => ({
            questionId: qId,
            answerText: answers[qId]
        }));

        try {
            await axios.post(`${api}/api/surveys/${id}/responses`, { answers: formattedAnswers });
            setSubmitted(true);
        } catch (err) {
            console.error(err);
        }
    };

    if (!survey) return <div className="p-4">Loading survey...</div>;
    if (submitted) return (
            <div className="container mx-auto p-4 text-center">
                <h2 className="text-3xl font-bold text-green-600 mb-4">Thank You!</h2>
                <p>Your response has been recorded.</p>
                <button onClick={() => navigate('/')} className="mt-4 text-blue-500 underline">Go Home</button>
            </div>
    );

    return (
        <div className="container mx-auto p-4 max-w-3xl">
            <h1 className="text-3xl font-bold mb-6">{survey.title}</h1>
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
                {survey.questions.map((q, index) => (
                    <div key={q._id} className="mb-6">
                        <label className="block font-bold mb-2">{index + 1}. {q.text}</label>
                        
                        {q.type === 'short-answer' ? (
                            <input
                                type="text"
                                className="w-full px-3 py-2 border rounded"
                                value={answers[q._id] || ''}
                                onChange={(e) => handleAnswerChange(q._id, e.target.value)}
                                required
                            />
                        ) : (
                            <div className="flex flex-col">
                                {q.options.map(opt => (
                                    <label key={opt._id} className="inline-flex items-center mt-2">
                                        <input
                                            type="radio"
                                            name={q._id}
                                            value={opt.text}
                                            checked={answers[q._id] === opt.text}
                                            onChange={(e) => handleAnswerChange(q._id, e.target.value)}
                                            className="form-radio h-5 w-5 text-blue-600"
                                            required
                                        />
                                        <span className="ml-2">{opt.text}</span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
                <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded font-bold hover:bg-blue-700">Submit Answers</button>
            </form>
        </div>
    );
};

export default TakeSurvey;
