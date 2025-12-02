import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Sparkles, CheckCircle, Loader } from 'lucide-react';
import { aiService } from '../services/aiService';
import { QuestionResponse } from '../types/cv';
import { useCVStore } from '../store/cvStore';

interface Question {
  id: number;
  text: string;
  placeholder: string;
  type: 'text' | 'textarea' | 'select';
  options?: string[];
  followUp?: string;
}

const initialQuestions: Question[] = [
  {
    id: 1,
    text: "What's your target job title or role?",
    placeholder: "e.g., Senior Software Engineer, Marketing Manager",
    type: 'text',
  },
  {
    id: 2,
    text: "What's your current or most recent position?",
    placeholder: "e.g., Software Engineer at Google",
    type: 'text',
  },
  {
    id: 3,
    text: "How many years of experience do you have in this field?",
    placeholder: "e.g., 5 years",
    type: 'text',
  },
  {
    id: 4,
    text: "What are your top 3-5 technical or core skills?",
    placeholder: "e.g., React, Node.js, Python, AWS, Project Management",
    type: 'textarea',
  },
  {
    id: 5,
    text: "What's your biggest professional achievement?",
    placeholder: "Describe a specific accomplishment with measurable impact",
    type: 'textarea',
  },
];

const QuickBuild = () => {
  const navigate = useNavigate();
  const { setCurrentCV, setLoading, isLoading } = useCVStore();

  const [currentStep, setCurrentStep] = useState(0);
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [responses, setResponses] = useState<QuestionResponse[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [followUpQuestion, setFollowUpQuestion] = useState('');
  const [aiTyping, setAiTyping] = useState(false);

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  const handleNext = async () => {
    if (!currentAnswer.trim()) return;

    const newResponse: QuestionResponse = {
      question: currentQuestion.text,
      answer: currentAnswer,
    };

    // Check if AI should ask a follow-up question
    if (currentStep < 5 && shouldTriggerFollowUp(currentAnswer)) {
      setAiTyping(true);
      try {
        const followUp = await aiService.generateFollowUpQuestion(
          currentQuestion.text,
          currentAnswer,
          responses
        );

        if (followUp) {
          setFollowUpQuestion(followUp);
          setShowFollowUp(true);
          setAiTyping(false);
          return;
        }
      } catch (error) {
        console.error('Error generating follow-up:', error);
      }
      setAiTyping(false);
    }

    const updatedResponses = [...responses, newResponse];
    setResponses(updatedResponses);
    setCurrentAnswer('');
    setShowFollowUp(false);

    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Generate CV
      await generateCV(updatedResponses);
    }
  };

  const handleFollowUpResponse = () => {
    if (!currentAnswer.trim()) return;

    const updatedResponses = [
      ...responses,
      {
        question: currentQuestion.text,
        answer: responses[responses.length - 1]?.answer || '',
        followUp: currentAnswer,
      },
    ];

    setResponses(updatedResponses);
    setCurrentAnswer('');
    setShowFollowUp(false);

    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      generateCV(updatedResponses);
    }
  };

  const shouldTriggerFollowUp = (answer: string): boolean => {
    // Trigger follow-up for achievements or important questions
    if (currentStep === 4 || currentStep === 1) {
      return answer.length < 100; // If answer is too brief, ask for more details
    }
    return false;
  };

  const generateCV = async (finalResponses: QuestionResponse[]) => {
    setLoading(true);
    try {
      const targetRole = finalResponses[0]?.answer;
      const generatedCV = await aiService.generateCVFromAnswers(
        finalResponses,
        targetRole
      );

      setCurrentCV(generatedCV);
      navigate('/customizer');
    } catch (error) {
      console.error('Error generating CV:', error);
      alert('Failed to generate CV. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (showFollowUp) {
      setShowFollowUp(false);
      setCurrentAnswer('');
    } else if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      const lastResponse = responses[responses.length - 1];
      if (lastResponse) {
        setCurrentAnswer(lastResponse.answer);
        setResponses(responses.slice(0, -1));
      }
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </button>
          <div className="flex items-center space-x-3 mb-4">
            <Sparkles className="w-8 h-8 text-primary-600" />
            <h1 className="text-3xl font-bold text-gray-900">Quick AI Build</h1>
          </div>
          <p className="text-gray-600">
            Answer a few questions and let AI create your professional CV
          </p>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-lg p-4 shadow-md mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Question {currentStep + 1} of {questions.length}
            </span>
            <span className="text-sm font-medium text-primary-600">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-xl shadow-xl p-8 mb-6 animate-slide-up">
          {!showFollowUp ? (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {currentQuestion.text}
              </h2>

              {currentQuestion.type === 'textarea' ? (
                <textarea
                  value={currentAnswer}
                  onChange={(e) => setCurrentAnswer(e.target.value)}
                  placeholder={currentQuestion.placeholder}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none resize-none"
                  rows={6}
                  autoFocus
                />
              ) : (
                <input
                  type="text"
                  value={currentAnswer}
                  onChange={(e) => setCurrentAnswer(e.target.value)}
                  placeholder={currentQuestion.placeholder}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                  autoFocus
                  onKeyPress={(e) => e.key === 'Enter' && handleNext()}
                />
              )}

              {/* AI Tips */}
              <div className="mt-4 p-4 bg-blue-50 border-l-4 border-primary-500 rounded">
                <p className="text-sm text-gray-700">
                  <strong>Tip:</strong> Be specific and include numbers or metrics when possible.
                  For example: "Increased sales by 30%" or "Managed team of 5 developers"
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-start space-x-3 mb-6">
                <Sparkles className="w-6 h-6 text-primary-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    AI Follow-up Question
                  </h3>
                  <p className="text-gray-700">{followUpQuestion}</p>
                </div>
              </div>

              <textarea
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                placeholder="Your answer..."
                className="w-full px-4 py-3 border-2 border-primary-300 rounded-lg focus:border-primary-500 focus:outline-none resize-none"
                rows={4}
                autoFocus
              />

              <button
                onClick={handleFollowUpResponse}
                disabled={!currentAnswer.trim()}
                className="mt-4 w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white py-3 rounded-lg font-semibold hover:from-primary-600 hover:to-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Continue
              </button>
            </>
          )}
        </div>

        {/* Navigation */}
        {!showFollowUp && (
          <div className="flex items-center justify-between">
            <button
              onClick={handleBack}
              className="flex items-center px-6 py-3 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-all shadow-md"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </button>

            <button
              onClick={handleNext}
              disabled={!currentAnswer.trim() || isLoading}
              className="flex items-center px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg hover:from-primary-600 hover:to-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
            >
              {isLoading ? (
                <>
                  <Loader className="w-5 h-5 mr-2 animate-spin" />
                  Generating CV...
                </>
              ) : currentStep === questions.length - 1 ? (
                <>
                  Generate CV
                  <CheckCircle className="w-5 h-5 ml-2" />
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </button>
          </div>
        )}

        {/* AI Typing Indicator */}
        {aiTyping && (
          <div className="fixed bottom-8 right-8 bg-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-3">
            <Loader className="w-5 h-5 text-primary-600 animate-spin" />
            <span className="text-sm text-gray-700">AI is thinking...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuickBuild;
