import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.defaults.headers.common['x-auth-token'] = token;
            // Decode token or fetch user if endpoints exist
            // For now just set a user object based on token presence or implement a check
            // A better way is to call the /user endpoint
            checkUser();
        } else {
            setLoading(false);
        }
    }, []);

    const checkUser = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/auth/user');
            setUser(res.data);
        } catch (err) {
            console.error(err);
            localStorage.removeItem('token');
            delete axios.defaults.headers.common['x-auth-token'];
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
        localStorage.setItem('token', res.data.token);
        axios.defaults.headers.common['x-auth-token'] = res.data.token;
        await checkUser();
    };

    const register = async (username, email, password) => {
        const res = await axios.post('http://localhost:5000/api/auth/register', { username, email, password });
        localStorage.setItem('token', res.data.token);
        axios.defaults.headers.common['x-auth-token'] = res.data.token;
        await checkUser();
    };

    const logout = () => {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['x-auth-token'];
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
