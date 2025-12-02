import { useNavigate } from 'react-router-dom';
import {
  Zap,
  FileText,
  Linkedin,
  Edit3,
  Briefcase,
  CheckCircle,
  TrendingUp,
  Shield,
  Sparkles
} from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  recommended?: boolean;
  badge?: string;
}

const FeatureCard = ({ icon, title, description, onClick, recommended, badge }: FeatureCardProps) => (
  <div
    onClick={onClick}
    className={`relative bg-white rounded-xl shadow-lg p-8 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
      recommended ? 'ring-4 ring-primary-500' : ''
    }`}
  >
    {badge && (
      <div className="absolute -top-3 -right-3 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
        {badge}
      </div>
    )}
    <div className="flex flex-col items-center text-center space-y-4">
      <div className={`p-4 rounded-full ${recommended ? 'bg-primary-100' : 'bg-gray-100'}`}>
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
      <button className={`mt-4 px-6 py-3 rounded-lg font-semibold transition-all ${
        recommended
          ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}>
        Get Started
      </button>
    </div>
  </div>
);

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Sparkles className="w-8 h-8 text-primary-600" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                AI CV Builder
              </h1>
            </div>
            <nav className="hidden md:flex space-x-6">
              <a href="#features" className="text-gray-600 hover:text-primary-600 transition">Features</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-primary-600 transition">How It Works</a>
              <button
                onClick={() => navigate('/customizer')}
                className="text-primary-600 hover:text-primary-700 font-semibold"
              >
                Edit Existing CV
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Create Your Dream CV with{' '}
            <span className="bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
              AI Precision
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Build ATS-friendly, professional CVs with intelligent AI suggestions and human control.
            Never miss highlighting your achievements and portfolio again.
          </p>

          {/* Value Props */}
          <div className="flex flex-wrap justify-center gap-6 mb-12">
            <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-md">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium text-gray-700">ATS Optimized</span>
            </div>
            <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-md">
              <Shield className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium text-gray-700">No Fabrication</span>
            </div>
            <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-md">
              <TrendingUp className="w-5 h-5 text-purple-500" />
              <span className="text-sm font-medium text-gray-700">Smart Suggestions</span>
            </div>
          </div>
        </div>

        {/* Main Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16" id="features">
          <FeatureCard
            icon={<Zap className="w-10 h-10 text-primary-600" />}
            title="Quick AI Build"
            description="Answer 5-10 intelligent questions and let AI create a professional CV in minutes. Perfect for those in a hurry."
            onClick={() => navigate('/quick-build')}
            recommended={true}
            badge="FASTEST"
          />
          <FeatureCard
            icon={<FileText className="w-10 h-10 text-indigo-600" />}
            title="Detailed Builder"
            description="Step-by-step guided creation with comprehensive AI assistance. Get prompts for achievements and portfolio items."
            onClick={() => navigate('/detailed-builder')}
          />
          <FeatureCard
            icon={<Linkedin className="w-10 h-10 text-blue-600" />}
            title="LinkedIn Import"
            description="Import your LinkedIn profile and let AI enhance it into a polished, ATS-friendly CV with skill recommendations."
            onClick={() => navigate('/linkedin-import')}
          />
        </div>

        {/* Additional Features */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div
            onClick={() => navigate('/customizer')}
            className="bg-white rounded-xl shadow-lg p-8 cursor-pointer hover:shadow-xl transition-all"
          >
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Edit3 className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">CV Customizer</h3>
                <p className="text-gray-600">
                  Edit and refine your existing CV with AI-powered suggestions for improvements and ATS optimization.
                </p>
              </div>
            </div>
          </div>

          <div
            onClick={() => navigate('/job-finder')}
            className="bg-white rounded-xl shadow-lg p-8 cursor-pointer hover:shadow-xl transition-all"
          >
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Briefcase className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Job Finder</h3>
                <p className="text-gray-600">
                  Find relevant jobs matching your CV, see what skills you need, and optimize your resume for specific roles.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-white py-16" id="how-it-works">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: '1',
                title: 'Choose Your Path',
                description: 'Select quick build, detailed builder, or LinkedIn import based on your needs.'
              },
              {
                step: '2',
                title: 'AI Asks Smart Questions',
                description: 'Our AI asks targeted questions about achievements, portfolio, and skills you might forget.'
              },
              {
                step: '3',
                title: 'Review & Validate',
                description: 'Human-in-the-loop: You approve or reject every AI suggestion. No fabricated information.'
              },
              {
                step: '4',
                title: 'Export & Apply',
                description: 'Download your ATS-optimized CV and apply with confidence. Track job matches.'
              }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            © 2024 AI CV Builder. Built with accuracy, ethics, and your career in mind.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
