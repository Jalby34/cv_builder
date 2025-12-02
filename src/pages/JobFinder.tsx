import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Briefcase, MapPin, TrendingUp } from 'lucide-react';

const JobFinder = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-8"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </button>

        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Briefcase className="w-8 h-8 text-primary-600" />
            <h1 className="text-3xl font-bold text-gray-900">Job Finder</h1>
          </div>
          <p className="text-gray-600">
            Find relevant jobs and see how your CV matches the requirements
          </p>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Title or Keywords
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g., Software Engineer, Marketing Manager"
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="City or Remote"
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
          <button className="mt-4 w-full md:w-auto px-8 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg hover:from-primary-600 hover:to-primary-700 font-semibold">
            Search Jobs
          </button>
        </div>

        {/* Coming Soon Message */}
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <div className="max-w-2xl mx-auto">
            <TrendingUp className="w-16 h-16 text-primary-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Job Matching Coming Soon!</h2>
            <p className="text-gray-600 mb-6">
              We're building an intelligent job matching system that will:
            </p>
            <ul className="text-left space-y-3 mb-8">
              {[
                'Find jobs that match your CV and skills',
                'Show you skill gaps for your dream roles',
                'Provide match scores for each job posting',
                'Suggest CV improvements for specific applications',
                'Track your applications and optimize your success rate',
              ].map((feature, index) => (
                <li key={index} className="flex items-start">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
            <p className="text-sm text-gray-500">
              For now, focus on building your perfect CV, and we'll help you find the perfect job soon!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobFinder;
