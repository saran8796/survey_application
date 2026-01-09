import { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const setLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="bg-gray-800 p-4 text-white">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-xl font-bold">Survey App</Link>
                <div>
                    {user ? (
                        <>
                            <span className="mr-4">Welcome, {user.username}</span>
                            <Link to="/dashboard" className="mr-4 hover:text-gray-300">Dashboard</Link>
                            <button onClick={setLogout} className="bg-red-500 px-3 py-1 rounded hover:bg-red-600">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="mr-4 hover:text-gray-300">Login</Link>
                            <Link to="/register" className="bg-blue-500 px-3 py-1 rounded hover:bg-blue-600">Register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
