import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { 
  LogIn, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff,
  AlertCircle,
  ArrowRight
} from 'lucide-react';

const Login = () => {
    const [formData, setFormData] = useState({
        emailOrUsername: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const { emailOrUsername, password } = formData;

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (error) setError('');
    };

    const onSubmit = async e => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            await login(emailOrUsername, password);
            navigate('/dashboard');
        } catch (err) {
            console.error('Login failed', err);
            setError(err.response?.data?.msg || 'Invalid email or password. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-[#f9fafb] to-[#edf2ff] flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
                {/* Logo */}
                <Link to="/" className="flex items-center justify-center space-x-2 mb-8">
                    <div className="w-10 h-10 rounded-lg bg-[#4361ee] flex items-center justify-center">
                        <LogIn className="text-white" size={24} />
                    </div>
                    <span className="text-xl font-bold text-[#1f2937]">Surveyor</span>
                </Link>

                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-[#1f2937] mb-2">Welcome back</h1>
                    <p className="text-[#6b7280]">
                        Sign in to your account to continue
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start space-x-3">
                        <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={20} />
                        <p className="text-red-700 text-sm">{error}</p>
                    </div>
                )}

                {/* Login Form */}
                <form onSubmit={onSubmit} className="space-y-6">
                {/* Email or Username Input */}
                    <div>
                        <label className="block text-sm font-medium text-[#1f2937] mb-2">
                            Email or Username
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-[#6b7280]" />
                            </div>
                            <input
                                type="text"
                                name="emailOrUsername"
                                value={emailOrUsername}
                                onChange={onChange}
                                className="w-full pl-10 pr-4 py-3 border border-[#e5e7eb] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4361ee] focus:border-transparent transition-all bg-white"
                                placeholder="Email address or username"
                                required
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    {/* Password Input */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-medium text-[#1f2937]">
                                Password
                            </label>
                            <Link 
                                to="/forgot-password" 
                                className="text-sm text-[#4361ee] hover:text-[#3a56d4] font-medium"
                            >
                                Forgot password?
                            </Link>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-[#6b7280]" />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={password}
                                onChange={onChange}
                                className="w-full pl-10 pr-12 py-3 border border-[#e5e7eb] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4361ee] focus:border-transparent transition-all bg-white"
                                placeholder="Enter your password"
                                required
                                disabled={isLoading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            >
                                {showPassword ? (
                                    <EyeOff className="h-5 w-5 text-[#6b7280] hover:text-[#4361ee]" />
                                ) : (
                                    <Eye className="h-5 w-5 text-[#6b7280] hover:text-[#4361ee]" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Remember Me */}
                    <div className="flex items-center">
                        <input
                            id="remember-me"
                            name="remember-me"
                            type="checkbox"
                            className="h-4 w-4 text-[#4361ee] focus:ring-[#4361ee] border-[#e5e7eb] rounded"
                        />
                        <label htmlFor="remember-me" className="ml-2 block text-sm text-[#6b7280]">
                            Remember me
                        </label>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#4361ee] text-white py-3 px-4 rounded-xl font-semibold hover:bg-[#3a56d4] focus:outline-none focus:ring-2 focus:ring-[#4361ee] focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                        {isLoading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Signing in...</span>
                            </>
                        ) : (
                            <>
                                <span>Sign In</span>
                                <ArrowRight size={18} />
                            </>
                        )}
                    </button>
                </form>

                {/* Sign Up Link */}
                <div className="mt-8 text-center">
                    <p className="text-[#6b7280]">
                        Don't have an account?{' '}
                        <Link 
                            to="/register" 
                            className="text-[#4361ee] font-semibold hover:text-[#3a56d4] hover:underline"
                        >
                            Sign up now
                        </Link>
                    </p>
                </div>

                {/* Terms */}
                <div className="mt-6 text-center text-xs text-[#6b7280]">
                    <p>
                        By signing in, you agree to our{' '}
                        <Link to="/terms" className="text-[#4361ee] hover:text-[#3a56d4]">
                            Terms
                        </Link>{' '}
                        and{' '}
                        <Link to="/privacy" className="text-[#4361ee] hover:text-[#3a56d4]">
                            Privacy Policy
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;