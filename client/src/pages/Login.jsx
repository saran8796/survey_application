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
            <div className="w-full max-w-md bg-white rounded-xl md:rounded-2xl shadow-xl p-4 md:p-6 lg:p-8">
                {/* Logo */}
                <Link to="/" className="flex items-center justify-center space-x-2 mb-6 md:mb-8">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-[#4361ee] flex items-center justify-center">
                        <LogIn className="text-white" size={20} />
                    </div>
                    <span className="text-lg md:text-xl font-bold text-[#1f2937]">Surveyor</span>
                </Link>

                {/* Header */}
                <div className="text-center mb-6 md:mb-8">
                    <h1 className="text-xl md:text-2xl font-bold text-[#1f2937] mb-1 md:mb-2">Welcome back</h1>
                    <p className="text-xs md:text-sm text-[#6b7280]">
                        Sign in to your account to continue
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-4 md:mb-6 p-3 md:p-4 rounded-lg md:rounded-xl bg-red-50 border border-red-200 flex items-start space-x-2 md:space-x-3">
                        <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={16} />
                        <p className="text-red-700 text-xs md:text-sm">{error}</p>
                    </div>
                )}

                {/* Login Form */}
                <form onSubmit={onSubmit} className="space-y-4 md:space-y-6">
                    {/* Email or Username Input */}
                    <div>
                        <label className="block text-xs md:text-sm font-medium text-[#1f2937] mb-1 md:mb-2">
                            Email or Username
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-4 w-4 md:h-5 md:w-5 text-[#6b7280]" />
                            </div>
                            <input
                                type="text"
                                name="emailOrUsername"
                                value={emailOrUsername}
                                onChange={onChange}
                                className="w-full pl-9 md:pl-10 pr-4 py-2 md:py-3 border border-[#e5e7eb] rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4361ee] focus:border-transparent transition-all bg-white text-sm md:text-base"
                                placeholder="Email address or username"
                                required
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    {/* Password Input */}
                    <div>
                        <div className="flex justify-between items-center mb-1 md:mb-2">
                            <label className="block text-xs md:text-sm font-medium text-[#1f2937]">
                                Password
                            </label>
                            <Link 
                                to="/forgot-password" 
                                className="text-xs md:text-sm text-[#4361ee] hover:text-[#3a56d4] font-medium"
                            >
                                Forgot password?
                            </Link>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-4 w-4 md:h-5 md:w-5 text-[#6b7280]" />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={password}
                                onChange={onChange}
                                className="w-full pl-9 md:pl-10 pr-10 md:pr-12 py-2 md:py-3 border border-[#e5e7eb] rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4361ee] focus:border-transparent transition-all bg-white text-sm md:text-base"
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
                                    <EyeOff className="h-4 w-4 md:h-5 md:w-5 text-[#6b7280] hover:text-[#4361ee]" />
                                ) : (
                                    <Eye className="h-4 w-4 md:h-5 md:w-5 text-[#6b7280] hover:text-[#4361ee]" />
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
                            className="h-3 w-3 md:h-4 md:w-4 text-[#4361ee] focus:ring-[#4361ee] border-[#e5e7eb] rounded"
                        />
                        <label htmlFor="remember-me" className="ml-2 block text-xs md:text-sm text-[#6b7280]">
                            Remember me
                        </label>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#4361ee] text-white py-2 md:py-3 px-4 rounded-lg md:rounded-xl font-semibold hover:bg-[#3a56d4] focus:outline-none focus:ring-2 focus:ring-[#4361ee] focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm md:text-base"
                    >
                        {isLoading ? (
                            <>
                                <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Signing in...</span>
                            </>
                        ) : (
                            <>
                                <span>Sign In</span>
                                <ArrowRight size={14} />
                            </>
                        )}
                    </button>
                </form>

                {/* Sign Up Link */}
                <div className="mt-6 md:mt-8 text-center">
                    <p className="text-xs md:text-sm text-[#6b7280]">
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
                <div className="mt-4 md:mt-6 text-center text-xs text-[#6b7280]">
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