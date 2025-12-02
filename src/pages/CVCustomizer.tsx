import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Download,
  Sparkles,
  Check,
  X,
  TrendingUp,
  FileText,
} from 'lucide-react';
import { useCVStore } from '../store/cvStore';
import { aiService } from '../services/aiService';

const CVCustomizer = () => {
  const navigate = useNavigate();
  const {
    currentCV,
    suggestions,
    atsScore,
    addSuggestion,
    acceptSuggestion,
    rejectSuggestion,
    setATSScore,
  } = useCVStore();

  const [loading, setLoading] = useState(false);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  useEffect(() => {
    if (currentCV) {
      analyzeATS();
      generateInitialSuggestions();
    } else {
      // No CV loaded, redirect to home
      navigate('/');
    }
  }, []);

  const analyzeATS = async () => {
    if (!currentCV) return;

    setLoading(true);
    try {
      const score = await aiService.analyzeATSCompatibility(currentCV);
      setATSScore(score);
    } catch (error) {
      console.error('ATS analysis failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateInitialSuggestions = async () => {
    if (!currentCV) return;

    setLoading(true);
    try {
      // Get skill suggestions
      const targetRole = currentCV.experiences[0]?.position || 'professional';
      const currentSkills = currentCV.skills.map((s) => s.name);
      const skillSuggestions = await aiService.suggestSkills(
        currentSkills,
        targetRole,
        currentCV.experiences
      );

      skillSuggestions.forEach((suggestion) => addSuggestion(suggestion));

      // Get portfolio suggestions
      const portfolioSuggestions = await aiService.suggestPortfolioItems(
        currentCV.experiences,
        currentCV.projects
      );

      portfolioSuggestions.forEach((item, index) => {
        addSuggestion({
          id: `portfolio-${Date.now()}-${index}`,
          type: 'keyword',
          section: 'projects',
          suggestion: item,
          reasoning: 'Portfolio item you might have forgotten to include',
          priority: 'medium',
          accepted: false,
        });
      });
    } catch (error) {
      console.error('Failed to generate suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptSuggestion = (suggestionId: string) => {
    acceptSuggestion(suggestionId);
  };

  const handleRejectSuggestion = (suggestionId: string) => {
    rejectSuggestion(suggestionId);
  };

  const handleImproveSection = async (section: string) => {
    if (!currentCV) return;

    setSelectedSection(section);
    setLoading(true);

    try {
      let content = '';
      if (section === 'summary') {
        content = currentCV.summary;
      } else if (section === 'experience') {
        content = JSON.stringify(currentCV.experiences);
      }

      const improvements = await aiService.improveSection(section, content, {
        targetRole: currentCV.experiences[0]?.position,
      });

      improvements.forEach((improvement) => addSuggestion(improvement));
    } catch (error) {
      console.error('Failed to improve section:', error);
    } finally {
      setLoading(false);
      setSelectedSection(null);
    }
  };

  const handleDownloadPDF = () => {
    alert('PDF download feature coming soon! This will generate an ATS-optimized PDF.');
  };

  if (!currentCV) {
    return null;
  }

  const pendingSuggestions = suggestions.filter((s) => s.accepted === undefined);
  const acceptedSuggestions = suggestions.filter((s) => s.accepted === true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">CV Customizer</h1>
              <p className="text-gray-600">Review and improve your CV with AI suggestions</p>
            </div>
            <button
              onClick={handleDownloadPDF}
              className="flex items-center px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg hover:from-primary-600 hover:to-primary-700 font-semibold shadow-lg"
            >
              <Download className="w-5 h-5 mr-2" />
              Download PDF
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main CV Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* ATS Score Card */}
            {atsScore && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">ATS Compatibility Score</h2>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                    <span className="text-3xl font-bold text-primary-600">
                      {atsScore.percentage}%
                    </span>
                  </div>
                </div>

                {/* Issues */}
                {atsScore.issues && atsScore.issues.length > 0 && (
                  <div className="space-y-2 mb-4">
                    {atsScore.issues.slice(0, 3).map((issue, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg border-l-4 ${
                          issue.type === 'critical'
                            ? 'bg-red-50 border-red-500'
                            : issue.type === 'warning'
                            ? 'bg-yellow-50 border-yellow-500'
                            : 'bg-blue-50 border-blue-500'
                        }`}
                      >
                        <p className="text-sm text-gray-700">{issue.message}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Strengths */}
                {atsScore.strengths && atsScore.strengths.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Strengths:</h3>
                    <ul className="space-y-1">
                      {atsScore.strengths.slice(0, 3).map((strength, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start">
                          <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* CV Sections */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {currentCV.personalInfo.fullName}
              </h2>

              {/* Personal Info */}
              <div className="mb-6">
                <p className="text-gray-600">
                  {currentCV.personalInfo.email} | {currentCV.personalInfo.phone}
                </p>
                <p className="text-gray-600">{currentCV.personalInfo.location}</p>
              </div>

              {/* Summary */}
              {currentCV.summary && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold text-gray-900">Professional Summary</h3>
                    <button
                      onClick={() => handleImproveSection('summary')}
                      disabled={loading}
                      className="text-sm text-primary-600 hover:text-primary-700 font-semibold flex items-center"
                    >
                      <Sparkles className="w-4 h-4 mr-1" />
                      Improve
                    </button>
                  </div>
                  <p className="text-gray-700">{currentCV.summary}</p>
                </div>
              )}

              {/* Experience */}
              {currentCV.experiences && currentCV.experiences.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">Experience</h3>
                    <button
                      onClick={() => handleImproveSection('experience')}
                      disabled={loading}
                      className="text-sm text-primary-600 hover:text-primary-700 font-semibold flex items-center"
                    >
                      <Sparkles className="w-4 h-4 mr-1" />
                      Improve
                    </button>
                  </div>

                  <div className="space-y-4">
                    {currentCV.experiences.map((exp) => (
                      <div key={exp.id} className="border-l-4 border-primary-500 pl-4">
                        <h4 className="font-bold text-gray-900">{exp.position}</h4>
                        <p className="text-gray-600">{exp.company}</p>
                        <p className="text-sm text-gray-500 mb-2">
                          {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                        </p>
                        {exp.description && (
                          <p className="text-gray-700 mb-2">{exp.description}</p>
                        )}
                        {exp.achievements && exp.achievements.length > 0 && (
                          <ul className="list-disc list-inside space-y-1">
                            {exp.achievements.map((achievement, index) => (
                              <li key={index} className="text-sm text-gray-700">
                                {achievement}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills */}
              {currentCV.skills && currentCV.skills.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {currentCV.skills.map((skill) => (
                      <span
                        key={skill.id}
                        className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium"
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Suggestions Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">AI Suggestions</h2>
                <span className="px-2 py-1 bg-primary-100 text-primary-800 rounded-full text-xs font-semibold">
                  {pendingSuggestions.length} pending
                </span>
              </div>

              {loading && (
                <div className="text-center py-8">
                  <Sparkles className="w-8 h-8 text-primary-600 animate-pulse mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Generating suggestions...</p>
                </div>
              )}

              {!loading && pendingSuggestions.length === 0 && (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">No pending suggestions</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Your CV looks great! Click "Improve" on any section for more suggestions.
                  </p>
                </div>
              )}

              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {pendingSuggestions.map((suggestion) => (
                  <div
                    key={suggestion.id}
                    className={`p-4 rounded-lg border-2 ${
                      suggestion.priority === 'high'
                        ? 'border-red-200 bg-red-50'
                        : suggestion.priority === 'medium'
                        ? 'border-yellow-200 bg-yellow-50'
                        : 'border-blue-200 bg-blue-50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-xs font-semibold text-gray-600 uppercase">
                        {suggestion.type} • {suggestion.section}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded ${
                          suggestion.priority === 'high'
                            ? 'bg-red-200 text-red-800'
                            : suggestion.priority === 'medium'
                            ? 'bg-yellow-200 text-yellow-800'
                            : 'bg-blue-200 text-blue-800'
                        }`}
                      >
                        {suggestion.priority}
                      </span>
                    </div>

                    <p className="text-sm font-medium text-gray-900 mb-2">
                      {suggestion.suggestion}
                    </p>
                    <p className="text-xs text-gray-600 mb-3">{suggestion.reasoning}</p>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleAcceptSuggestion(suggestion.id)}
                        className="flex-1 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm font-semibold flex items-center justify-center"
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Accept
                      </button>
                      <button
                        onClick={() => handleRejectSuggestion(suggestion.id)}
                        className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm font-semibold flex items-center justify-center"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Accepted suggestions summary */}
              {acceptedSuggestions.length > 0 && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm font-semibold text-green-800">
                    ✓ {acceptedSuggestions.length} suggestion(s) accepted
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVCustomizer;
