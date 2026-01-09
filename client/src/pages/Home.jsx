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
            icon: <BarChart3 className="text-[#4361ee]" size={24} />,
            title: "Advanced Analytics",
            description: "Get real-time insights with beautiful charts and data visualization"
        },
        {
            icon: <Users className="text-[#8b5cf6]" size={24} />,
            title: "Team Collaboration",
            description: "Share surveys with your team and collaborate in real-time"
        },
        {
            icon: <Zap className="text-[#f59e0b]" size={24} />,
            title: "Lightning Fast",
            description: "Create and deploy surveys in minutes, not hours"
        },
        {
            icon: <Shield className="text-[#10b981]" size={24} />,
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
            <div className="container mx-auto px-4 pt-30 pb-16">
                <div className="max-w-4xl mx-auto text-center">
                    
                    
                    <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-linear-to-r from-[#1f2937] to-[#4361ee] bg-clip-text text-transparent">
                        Create Surveys That
                        <span className="block text-[#4361ee]">Get Real Answers</span>
                    </h1>
                    
                    <p className="text-xl text-[#6b7280] mb-10 max-w-2xl mx-auto leading-relaxed">
                        Powerful survey platform with advanced analytics, beautiful design, and everything you need to understand your audience.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                        <Link 
                            to="/register" 
                            className="group bg-[#4361ee] text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-[#3a56d4] transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                        >
                            Let's Get Started
                            <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                        </Link>
                        <Link 
                            to="/login" 
                            className="bg-white text-[#1f2937] border border-[#e5e7eb] px-8 py-4 rounded-xl text-lg font-semibold hover:bg-[#f9fafb] hover:border-[#4361ee] transition-all duration-300 shadow-sm"
                        >
                            Sign In to Account
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;