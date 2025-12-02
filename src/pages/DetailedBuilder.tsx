import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Plus,
  Trash2,
  Sparkles,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { useCVStore } from '../store/cvStore';
import { aiService } from '../services/aiService';
import { CVData, Experience, Education, Skill, Project } from '../types/cv';

type BuildStep = 'personal' | 'summary' | 'experience' | 'education' | 'skills' | 'projects' | 'review';

const DetailedBuilder = () => {
  const navigate = useNavigate();
  const { setCurrentCV, addSuggestion } = useCVStore();
  const [currentStep, setCurrentStep] = useState<BuildStep>('personal');
  const [aiLoading, setAiLoading] = useState(false);

  const [cvData, setCvData] = useState<Partial<CVData>>({
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      linkedIn: '',
      portfolio: '',
      github: '',
      website: '',
    },
    summary: '',
    experiences: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
  });

  const [currentExperience, setCurrentExperience] = useState<Partial<Experience>>({
    company: '',
    position: '',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    description: '',
    achievements: [],
  });

  const [achievementInput, setAchievementInput] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);

  const steps: { id: BuildStep; title: string; description: string }[] = [
    { id: 'personal', title: 'Personal Info', description: 'Your contact details' },
    { id: 'summary', title: 'Professional Summary', description: 'Brief overview of your career' },
    { id: 'experience', title: 'Experience', description: 'Your work history' },
    { id: 'education', title: 'Education', description: 'Your academic background' },
    { id: 'skills', title: 'Skills', description: 'Your technical and soft skills' },
    { id: 'projects', title: 'Projects', description: 'Notable projects and portfolio' },
    { id: 'review', title: 'Review', description: 'Final review and export' },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStep(steps[currentStepIndex + 1].id);
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(steps[currentStepIndex - 1].id);
    } else {
      navigate('/');
    }
  };

  const handleSuggestAchievements = async () => {
    if (!currentExperience.description || !currentExperience.position || !currentExperience.company) {
      alert('Please fill in position, company, and description first');
      return;
    }

    setAiLoading(true);
    try {
      const suggestions = await aiService.suggestAchievements(
        currentExperience.description,
        currentExperience.position,
        currentExperience.company
      );
      setAiSuggestions(suggestions);
    } catch (error) {
      alert('Failed to generate suggestions. Please try again.');
    } finally {
      setAiLoading(false);
    }
  };

  const addAchievement = (achievement: string) => {
    setCurrentExperience({
      ...currentExperience,
      achievements: [...(currentExperience.achievements || []), achievement],
    });
    setAchievementInput('');
    setAiSuggestions(aiSuggestions.filter((s) => s !== achievement));
  };

  const removeAchievement = (index: number) => {
    const newAchievements = [...(currentExperience.achievements || [])];
    newAchievements.splice(index, 1);
    setCurrentExperience({ ...currentExperience, achievements: newAchievements });
  };

  const saveExperience = () => {
    if (!currentExperience.company || !currentExperience.position) {
      alert('Please fill in company and position');
      return;
    }

    const newExp: Experience = {
      id: `exp-${Date.now()}`,
      company: currentExperience.company || '',
      position: currentExperience.position || '',
      location: currentExperience.location || '',
      startDate: currentExperience.startDate || '',
      endDate: currentExperience.endDate || '',
      current: currentExperience.current || false,
      description: currentExperience.description || '',
      achievements: currentExperience.achievements || [],
    };

    setCvData({
      ...cvData,
      experiences: [...(cvData.experiences || []), newExp],
    });

    // Reset form
    setCurrentExperience({
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      achievements: [],
    });
    setAiSuggestions([]);
  };

  const handleFinish = () => {
    const completedCV: CVData = {
      id: `cv-${Date.now()}`,
      personalInfo: cvData.personalInfo!,
      summary: cvData.summary || '',
      experiences: cvData.experiences || [],
      education: cvData.education || [],
      skills: cvData.skills || [],
      projects: cvData.projects || [],
      certifications: cvData.certifications || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setCurrentCV(completedCV);
    navigate('/customizer');
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'personal':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Personal Information</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={cvData.personalInfo?.fullName || ''}
                  onChange={(e) =>
                    setCvData({
                      ...cvData,
                      personalInfo: { ...cvData.personalInfo!, fullName: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  value={cvData.personalInfo?.email || ''}
                  onChange={(e) =>
                    setCvData({
                      ...cvData,
                      personalInfo: { ...cvData.personalInfo!, email: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                <input
                  type="tel"
                  value={cvData.personalInfo?.phone || ''}
                  onChange={(e) =>
                    setCvData({
                      ...cvData,
                      personalInfo: { ...cvData.personalInfo!, phone: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  value={cvData.personalInfo?.location || ''}
                  onChange={(e) =>
                    setCvData({
                      ...cvData,
                      personalInfo: { ...cvData.personalInfo!, location: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                  placeholder="San Francisco, CA"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  LinkedIn
                </label>
                <input
                  type="url"
                  value={cvData.personalInfo?.linkedIn || ''}
                  onChange={(e) =>
                    setCvData({
                      ...cvData,
                      personalInfo: { ...cvData.personalInfo!, linkedIn: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                  placeholder="linkedin.com/in/johndoe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Portfolio/Website
                </label>
                <input
                  type="url"
                  value={cvData.personalInfo?.portfolio || ''}
                  onChange={(e) =>
                    setCvData({
                      ...cvData,
                      personalInfo: { ...cvData.personalInfo!, portfolio: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                  placeholder="johndoe.com"
                />
              </div>
            </div>
          </div>
        );

      case 'experience':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Work Experience</h2>

            {/* Existing experiences */}
            {cvData.experiences && cvData.experiences.length > 0 && (
              <div className="space-y-4 mb-6">
                <h3 className="font-semibold text-gray-700">Added Experiences</h3>
                {cvData.experiences.map((exp, index) => (
                  <div
                    key={exp.id}
                    className="bg-gray-50 p-4 rounded-lg border-2 border-gray-200"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-gray-900">{exp.position}</h4>
                        <p className="text-gray-600">{exp.company}</p>
                        <p className="text-sm text-gray-500">
                          {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          const newExps = cvData.experiences?.filter((_, i) => i !== index);
                          setCvData({ ...cvData, experiences: newExps });
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add new experience form */}
            <div className="bg-white border-2 border-primary-200 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Add Experience</h3>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Position *
                  </label>
                  <input
                    type="text"
                    value={currentExperience.position || ''}
                    onChange={(e) =>
                      setCurrentExperience({ ...currentExperience, position: e.target.value })
                    }
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                    placeholder="Software Engineer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company *
                  </label>
                  <input
                    type="text"
                    value={currentExperience.company || ''}
                    onChange={(e) =>
                      setCurrentExperience({ ...currentExperience, company: e.target.value })
                    }
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                    placeholder="Google"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={currentExperience.description || ''}
                  onChange={(e) =>
                    setCurrentExperience({ ...currentExperience, description: e.target.value })
                  }
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                  rows={3}
                  placeholder="Brief overview of your role and responsibilities..."
                />
              </div>

              {/* Achievements section with AI assistance */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Achievements & Impact
                  </label>
                  <button
                    onClick={handleSuggestAchievements}
                    disabled={aiLoading}
                    className="flex items-center text-sm text-primary-600 hover:text-primary-700 font-semibold"
                  >
                    <Sparkles className="w-4 h-4 mr-1" />
                    {aiLoading ? 'Generating...' : 'AI Suggest'}
                  </button>
                </div>

                {/* AI Suggestions */}
                {aiSuggestions.length > 0 && (
                  <div className="mb-4 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                      <Sparkles className="w-4 h-4 mr-2 text-primary-600" />
                      AI Suggestions (Click to add)
                    </h4>
                    <div className="space-y-2">
                      {aiSuggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          onClick={() => addAchievement(suggestion)}
                          className="p-3 bg-white rounded border-2 border-transparent hover:border-primary-500 cursor-pointer transition-all"
                        >
                          <p className="text-sm text-gray-700">{suggestion}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Manual achievement input */}
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={achievementInput}
                    onChange={(e) => setAchievementInput(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === 'Enter' && achievementInput && addAchievement(achievementInput)
                    }
                    className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                    placeholder="Add achievement (e.g., Increased sales by 30%)"
                  />
                  <button
                    onClick={() => achievementInput && addAchievement(achievementInput)}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>

                {/* Added achievements */}
                {currentExperience.achievements && currentExperience.achievements.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {currentExperience.achievements.map((achievement, index) => (
                      <div
                        key={index}
                        className="flex items-start justify-between p-2 bg-green-50 rounded border border-green-200"
                      >
                        <p className="text-sm text-gray-700 flex-1">{achievement}</p>
                        <button
                          onClick={() => removeAchievement(index)}
                          className="text-red-500 hover:text-red-700 ml-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-3 p-3 bg-amber-50 border-l-4 border-amber-500 rounded">
                  <p className="text-xs text-gray-700">
                    <strong>Tip:</strong> Use action verbs and include specific metrics. Example:
                    "Reduced deployment time by 40% by implementing CI/CD pipeline"
                  </p>
                </div>
              </div>

              <button
                onClick={saveExperience}
                className="w-full py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-semibold"
              >
                Save Experience
              </button>
            </div>
          </div>
        );

      case 'review':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Review Your CV</h2>

            <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-gray-900">
                    {cvData.personalInfo?.fullName || 'Your Name'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {cvData.personalInfo?.email} | {cvData.personalInfo?.phone}
                  </p>
                </div>

                {cvData.experiences && cvData.experiences.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Experience</h4>
                    <p className="text-sm text-gray-600">
                      {cvData.experiences.length} position(s) added
                    </p>
                  </div>
                )}

                <button
                  onClick={handleFinish}
                  className="w-full py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg hover:from-primary-600 hover:to-primary-700 font-semibold flex items-center justify-center"
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Finish & Customize
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-12">
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">This section is coming soon!</p>
            <p className="text-sm text-gray-500 mt-2">
              You can skip to the next section for now.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button onClick={() => navigate('/')} className="flex items-center text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Detailed CV Builder</h1>
          <p className="text-gray-600">
            Build your CV step-by-step with AI-powered suggestions
          </p>
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex flex-col items-center ${
                    index <= currentStepIndex ? 'opacity-100' : 'opacity-40'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      step.id === currentStep
                        ? 'bg-primary-600 text-white'
                        : index < currentStepIndex
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-300 text-gray-600'
                    }`}
                  >
                    {index < currentStepIndex ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <span className="text-xs mt-2 text-center hidden md:block">{step.title}</span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`h-1 w-12 mx-2 ${
                      index < currentStepIndex ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-xl p-8 mb-6">{renderStepContent()}</div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleBack}
            className="flex items-center px-6 py-3 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-all shadow-md"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>

          {currentStep !== 'review' && (
            <button
              onClick={handleNext}
              className="flex items-center px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all shadow-md"
            >
              Next
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailedBuilder;
