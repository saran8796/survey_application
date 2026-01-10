import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { 
  UserPlus, 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff,
  AlertCircle,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        fullName: '',
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const { username, fullName, email, password } = formData;

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (error) setError('');
        if (success) setSuccess('');
    };

    const onSubmit = async e => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');

        // Password Validation
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
        if (!passwordRegex.test(password)) {
             setError('Password must be at least 8 characters and include letters, numbers, and symbols.');
             setIsLoading(false);
             return;
        }

        try {
            await register(username, email, password, fullName);
            setSuccess('Account created successfully! Redirecting...');
            setTimeout(() => {
                navigate('/dashboard');
            }, 1500);
        } catch (err) {
            console.error('Registration failed', err);
            setError(err.response?.data?.msg || 'Registration failed. Please try again.');
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
                        <UserPlus className="text-white" size={20} />
                    </div>
                    <span className="text-lg md:text-xl font-bold text-[#1f2937]">Surveyor</span>
                </Link>

                {/* Header */}
                <div className="text-center mb-6 md:mb-8">
                    <h1 className="text-xl md:text-2xl font-bold text-[#1f2937] mb-1 md:mb-2">Create your account</h1>
                    <p className="text-xs md:text-sm text-[#6b7280]">
                        Start creating surveys in minutes
                    </p>
                </div>

                {/* Success Message */}
                {success && (
                    <div className="mb-4 md:mb-6 p-3 md:p-4 rounded-lg md:rounded-xl bg-green-50 border border-green-200 flex items-start space-x-2 md:space-x-3">
                        <CheckCircle className="text-green-500 shrink-0 mt-0.5" size={16} />
                        <p className="text-green-700 text-xs md:text-sm">{success}</p>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="mb-4 md:mb-6 p-3 md:p-4 rounded-lg md:rounded-xl bg-red-50 border border-red-200 flex items-start space-x-2 md:space-x-3">
                        <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={16} />
                        <p className="text-red-700 text-xs md:text-sm">{error}</p>
                    </div>
                )}

                {/* Register Form */}
                <form onSubmit={onSubmit} className="space-y-4 md:space-y-6">
                    
                    {/* Full Name Input */}
                    <div>
                        <label className="block text-xs md:text-sm font-medium text-[#1f2937] mb-1 md:mb-2">
                            Full Name
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User className="h-4 w-4 md:h-5 md:w-5 text-[#6b7280]" />
                            </div>
                            <input
                                type="text"
                                name="fullName"
                                value={fullName}
                                onChange={onChange}
                                className="w-full pl-9 md:pl-10 pr-4 py-2 md:py-3 border border-[#e5e7eb] rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4361ee] focus:border-transparent transition-all bg-white text-sm md:text-base"
                                placeholder="Enter your full name"
                                required
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    {/* Username Input */}
                    <div>
                        <label className="block text-xs md:text-sm font-medium text-[#1f2937] mb-1 md:mb-2">
                            Username
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User className="h-4 w-4 md:h-5 md:w-5 text-[#6b7280]" />
                            </div>
                            <input
                                type="text"
                                name="username"
                                value={username}
                                onChange={onChange}
                                className="w-full pl-9 md:pl-10 pr-4 py-2 md:py-3 border border-[#e5e7eb] rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4361ee] focus:border-transparent transition-all bg-white text-sm md:text-base"
                                placeholder="Choose a username"
                                required
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    {/* Email Input */}
                    <div>
                        <label className="block text-xs md:text-sm font-medium text-[#1f2937] mb-1 md:mb-2">
                            Email Address
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-4 w-4 md:h-5 md:w-5 text-[#6b7280]" />
                            </div>
                            <input
                                type="email"
                                name="email"
                                value={email}
                                onChange={onChange}
                                className="w-full pl-9 md:pl-10 pr-4 py-2 md:py-3 border border-[#e5e7eb] rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4361ee] focus:border-transparent transition-all bg-white text-sm md:text-base"
                                placeholder="you@example.com"
                                required
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    {/* Password Input */}
                    <div>
                        <label className="block text-xs md:text-sm font-medium text-[#1f2937] mb-1 md:mb-2">
                            Password
                        </label>
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
                                placeholder="Create a strong password"
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
                        <p className="mt-1 md:mt-2 text-xs text-[#6b7280]">
                            Use at least 8 characters with a mix of letters, numbers & symbols
                        </p>
                    </div>

                    {/* Terms Agreement */}
                    <div className="flex items-start">
                        <input
                            id="terms"
                            name="terms"
                            type="checkbox"
                            className="h-3 w-3 md:h-4 md:w-4 text-[#4361ee] focus:ring-[#4361ee] border-[#e5e7eb] rounded mt-1"
                            required
                        />
                        <label htmlFor="terms" className="ml-2 block text-xs md:text-sm text-[#6b7280]">
                            I agree to the{' '}
                            <Link to="/terms" className="text-[#4361ee] hover:text-[#3a56d4]">
                                Terms of Service
                            </Link>{' '}
                            and{' '}
                            <Link to="/privacy" className="text-[#4361ee] hover:text-[#3a56d4]">
                                Privacy Policy
                            </Link>
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
                                <span>Creating account...</span>
                            </>
                        ) : (
                            <>
                                <span>Create Account</span>
                                <ArrowRight size={14} />
                            </>
                        )}
                    </button>
                </form>

                {/* Sign In Link */}
                <div className="mt-6 md:mt-8 text-center">
                    <p className="text-xs md:text-sm text-[#6b7280]">
                        Already have an account?{' '}
                        <Link 
                            to="/login" 
                            className="text-[#4361ee] font-semibold hover:text-[#3a56d4] hover:underline"
                        >
                            Sign in here
                        </Link>
                    </p>
                </div>
                
            </div>
        </div>
    );
};

export default Register;