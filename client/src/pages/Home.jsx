import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { useContext, useEffect } from "react";
import { 
  BarChart3, 
  Users, 
  Zap, 
  Shield, 
  CheckCircle,
  ArrowRight,
  ClipboardCheck,
  TrendingUp
} from "lucide-react";

const Home = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate('/dashboard');
        }
    }, [user, navigate]);

    const features = [
        {
            icon: <BarChart3 className="text-[#4361ee]" size={20} />,
            title: "Advanced Analytics",
            description: "Get real-time insights with beautiful charts and data visualization"
        },
        {
            icon: <Users className="text-[#8b5cf6]" size={20} />,
            title: "Team Collaboration",
            description: "Share surveys with your team and collaborate in real-time"
        },
        {
            icon: <Zap className="text-[#f59e0b]" size={20} />,
            title: "Lightning Fast",
            description: "Create and deploy surveys in minutes, not hours"
        },
        {
            icon: <Shield className="text-[#10b981]" size={20} />,
            title: "Secure & Private",
            description: "Enterprise-grade security for your sensitive data"
        }
    ];

    const steps = [
        { number: "01", title: "Create Survey", description: "Design your survey with our intuitive builder" },
        { number: "02", title: "Share", description: "Distribute via link, email, or embed on your site" },
        { number: "03", title: "Collect Responses", description: "Gather data in real-time from participants" },
        { number: "04", title: "Analyze Results", description: "Get actionable insights with advanced analytics" }
    ];

    return (
        <div className="min-h-screen bg-linear-to-b from-white to-[#f9fafb]">
            {/* Hero Section */}
            <div className="container mx-auto px-4 pt-8 md:pt-30 pb-8 md:pb-16">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 bg-linear-to-r from-[#1f2937] to-[#4361ee] bg-clip-text text-transparent">
                        Create Surveys That
                        <span className="block text-[#4361ee]">Get Real Answers</span>
                    </h1>
                    
                    <p className="text-base sm:text-lg md:text-xl text-[#6b7280] mb-6 md:mb-10 max-w-2xl mx-auto leading-relaxed px-2">
                        Powerful survey platform with advanced analytics, beautiful design, and everything you need to understand your audience.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center mb-12 md:mb-16 px-2">
                        <Link 
                            to="/register" 
                            className="group bg-[#4361ee] text-white px-4 sm:px-6 md:px-8 py-3 md:py-4 rounded-xl text-base md:text-lg font-semibold hover:bg-[#3a56d4] transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl flex items-center justify-center gap-1 md:gap-2"
                        >
                            Let's Get Started
                            <ArrowRight className="group-hover:translate-x-1 transition-transform" size={16} />
                        </Link>
                        <Link 
                            to="/login" 
                            className="bg-white text-[#1f2937] border border-[#e5e7eb] px-4 sm:px-6 md:px-8 py-3 md:py-4 rounded-xl text-base md:text-lg font-semibold hover:bg-[#f9fafb] hover:border-[#4361ee] transition-all duration-300 shadow-sm"
                        >
                            Sign In to Account
                        </Link>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12 md:mb-16 px-2">
                        {features.map((feature, index) => (
                            <div key={index} className="bg-white p-4 md:p-6 rounded-xl border border-[#e5e7eb] shadow-sm hover:shadow-md transition-shadow duration-300">
                                <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-blue-50 flex items-center justify-center mb-3 md:mb-4 mx-auto">
                                    {feature.icon}
                                </div>
                                <h3 className="text-sm md:text-base font-semibold text-[#1f2937] mb-2">{feature.title}</h3>
                                <p className="text-xs md:text-sm text-[#6b7280] leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>

                    {/* Steps */}
                    <div className="bg-white rounded-xl md:rounded-2xl border border-[#e5e7eb] shadow-sm p-4 md:p-8">
                        <h2 className="text-xl md:text-2xl font-bold text-[#1f2937] mb-6 md:mb-8 text-center">How It Works</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                            {steps.map((step, index) => (
                                <div key={index} className="text-center">
                                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-[#edf2ff] flex items-center justify-center mx-auto mb-3 md:mb-4">
                                        <span className="text-2xl md:text-3xl font-bold text-[#4361ee]">{step.number}</span>
                                    </div>
                                    <h3 className="text-base md:text-lg font-semibold text-[#1f2937] mb-2">{step.title}</h3>
                                    <p className="text-xs md:text-sm text-[#6b7280]">{step.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;