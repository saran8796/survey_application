import { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const SurveyResults = () => {
    const { id } = useParams();
    const { user, loading: authLoading } = useContext(AuthContext);
    const [survey, setSurvey] = useState(null);
    const [responses, setResponses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const surveyRes = await axios.get(`http://localhost:5000/api/surveys/${id}`);
                // Access control check (optional, backend handles it too but nice for UI)
                // if (user && surveyRes.data.user !== user.id) ... 
                
                const responseRes = await axios.get(`http://localhost:5000/api/surveys/${id}/responses`);
                
                setSurvey(surveyRes.data);
                setResponses(responseRes.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        if (user) fetchData();
    }, [id, user]);

    if (loading || authLoading) return <div className="p-8">Loading results...</div>;
    if (!survey) return <div className="p-8">Survey not found or access denied.</div>;

    // Helper to process data for charts
    const getChartData = (question) => {
        const counts = {};
        if (question.type === 'multiple-choice') {
            question.options.forEach(opt => counts[opt.text] = 0);
            
            responses.forEach(r => {
                const answer = r.answers.find(a => a.questionId === question._id);
                if (answer && counts[answer.answerText] !== undefined) {
                    counts[answer.answerText]++;
                }
            });

            return {
                labels: Object.keys(counts),
                datasets: [
                    {
                        label: 'Votes',
                        data: Object.values(counts),
                        backgroundColor: 'rgba(54, 162, 235, 0.6)',
                    }
                ]
            };
        }
        return null;
    };

    const getShortAnswers = (questionId) => {
        return responses.map(r => {
            const answer = r.answers.find(a => a.questionId === questionId);
            return answer ? answer.answerText : null;
        }).filter(Boolean);
    };

    return (
        <div className="container mx-auto p-4 max-w-5xl">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">{survey.title} Results</h1>
                <Link to="/dashboard" className="text-blue-500 hover:underline">Back to Dashboard</Link>
            </div>
            
            <div className="mb-4">
                <p className="text-xl">Total Responses: <span className="font-bold">{responses.length}</span></p>
            </div>

            <div className="grid gap-8">
                {survey.questions.map((q, index) => (
                    <div key={q._id} className="bg-white p-6 rounded shadow-md">
                        <h3 className="text-xl font-bold mb-4">{index + 1}. {q.text}</h3>
                        
                        {q.type === 'multiple-choice' ? (
                            <div className="h-64">
                                <Bar 
                                    data={getChartData(q)} 
                                    options={{ maintainAspectRatio: false, responsive: true }} 
                                />
                            </div>
                        ) : (
                            <div className="max-h-64 overflow-y-auto bg-gray-50 p-4 rounded">
                                <ul className="list-disc pl-5">
                                    {getShortAnswers(q._id).map((ans, i) => (
                                        <li key={i} className="mb-1">{ans}</li>
                                    ))}
                                </ul>
                                {getShortAnswers(q._id).length === 0 && <p className="text-gray-500">No answers yet.</p>}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SurveyResults;
