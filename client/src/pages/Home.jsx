import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { useContext, useEffect } from "react";
const Home = () => {
    
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

     useEffect(() => {
            if (user) {
                navigate('/dashboard');
            }
        }, [user, navigate]);

    return (<>
    <div className="container mx-auto p-8 text-center mt-10">
        <h1 className="text-5xl font-extrabold mb-6 text-blue-600">Welcome to Surveyor</h1>
        <p className="text-xl mb-8 text-gray-700">Create, Share, and Analyze Surveys with ease.</p>
        <div className="space-x-4">
            <Link to="/login" className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-700 transition">Get Started</Link>
            <Link to="/register" className="bg-white text-blue-600 border border-blue-600 px-6 py-3 rounded-lg text-lg hover:bg-blue-50 transition">Sign Up</Link>
        </div>
    </div>
    </>
)}

export default Home;