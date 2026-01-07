import { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
const api = import.meta.env.VITE_SERVER_URL;

const Dashboard = () => {
    const { user, loading } = useContext(AuthContext);
    const [surveys, setSurveys] = useState([]);
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
        if (window.confirm('Are you sure you want to delete this survey?')) {
            try {
                await axios.delete(`${api}/api/surveys/${id}`);
                setSurveys(surveys.filter(s => s._id !== id));
            } catch (err) {
                console.error(err);
            }
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">My Surveys</h1>
                <Link to="/create-survey" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                    Create New Survey
                </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {surveys.length === 0 ? (
                     <p>No surveys found. Create one to get started!</p>
                ) : (
                    surveys.map(survey => (
                        <div key={survey._id} className="bg-white p-6 rounded shadow hover:shadow-lg transition">
                            <h3 className="text-xl font-bold mb-2">{survey.title}</h3>
                            <p className="text-gray-600 mb-4">Created: {new Date(survey.createdAt).toLocaleDateString()}</p>
                            <div className="flex justify-between mt-4">
                                <Link to={`/survey/${survey._id}/results`} className="text-blue-500 hover:underline">View Results</Link>
                                <Link to={`/survey/${survey._id}`} className="text-indigo-500 hover:underline">Take/Share</Link>
                                <button onClick={() => deleteSurvey(survey._id)} className="text-red-500 hover:underline">Delete</button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Dashboard;
