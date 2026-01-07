import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
const api = import.meta.env.VITE_SERVER_URL;

const CreateSurvey = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [questions, setQuestions] = useState([{ text: '', type: 'short-answer', options: [] }]);
    
    const addQuestion = () => {
        setQuestions([...questions, { text: '', type: 'short-answer', options: [] }]);
    };

    const updateQuestion = (index, field, value) => {
        const newQuestions = [...questions];
        newQuestions[index][field] = value;
        setQuestions(newQuestions);
    };

    const addOption = (qIndex) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].options.push({ text: '' });
        setQuestions(newQuestions);
    };

    const updateOption = (qIndex, oIndex, value) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].options[oIndex].text = value;
        setQuestions(newQuestions);
    };

    const removeQuestion = (index) => {
        const newQuestions = questions.filter((_, i) => i !== index);
        setQuestions(newQuestions);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${api}/api/surveys`, { title, questions });
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="container mx-auto p-4 max-w-4xl">
            <h1 className="text-3xl font-bold mb-6">Create New Survey</h1>
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
                <div className="mb-6">
                    <label className="block text-gray-700 font-bold mb-2">Survey Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-3 py-2 border rounded"
                        placeholder="Enter survey title"
                        required
                    />
                </div>

                {questions.map((q, qIndex) => (
                    <div key={qIndex} className="mb-6 p-4 border rounded bg-gray-50">
                        <div className="flex justify-between items-center mb-2">
                             <h3 className="font-bold">Question {qIndex + 1}</h3>
                             <button type="button" onClick={() => removeQuestion(qIndex)} className="text-red-500">Remove</button>
                        </div>
                       
                        <input
                            type="text"
                            value={q.text}
                            onChange={(e) => updateQuestion(qIndex, 'text', e.target.value)}
                            className="w-full px-3 py-2 border rounded mb-2"
                            placeholder="Question Text"
                            required
                        />
                        <select
                            value={q.type}
                            onChange={(e) => updateQuestion(qIndex, 'type', e.target.value)}
                            className="w-full px-3 py-2 border rounded mb-2"
                        >
                            <option value="short-answer">Short Answer</option>
                            <option value="multiple-choice">Multiple Choice</option>
                        </select>

                        {q.type === 'multiple-choice' && (
                            <div className="ml-4">
                                <p className="font-semibold mb-1">Options:</p>
                                {q.options.map((opt, oIndex) => (
                                    <div key={oIndex} className="flex mb-2">
                                        <input
                                            type="text"
                                            value={opt.text}
                                            onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                                            className="w-full px-2 py-1 border rounded mr-2"
                                            placeholder={`Option ${oIndex + 1}`}
                                            required
                                        />
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => addOption(qIndex)}
                                    className="text-sm bg-gray-200 px-2 py-1 rounded"
                                >
                                    + Add Option
                                </button>
                            </div>
                        )}
                    </div>
                ))}

                <button
                    type="button"
                    onClick={addQuestion}
                    className="bg-blue-500 text-white px-4 py-2 rounded mr-4"
                >
                    Add Question
                </button>
                <button
                    type="submit"
                    className="bg-green-600 text-white px-6 py-2 rounded font-bold"
                >
                     Create Survey
                </button>
            </form>
        </div>
    );
};

export default CreateSurvey;
