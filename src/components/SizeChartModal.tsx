'use client';

import React, { useState, useEffect } from 'react';
import { X, Ruler, Lightbulb, CheckCircle, AlertCircle } from 'lucide-react';
import { SIZE_CHARTS, SIZE_QUESTIONNAIRE, getSizeRecommendation, SizeRecommendation } from '@/data/sizeCharts';

interface SizeChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: string;
  productName?: string;
}

interface QuestionnaireAnswers {
  [key: string]: string;
}

const SizeChartModal: React.FC<SizeChartModalProps> = ({
  isOpen,
  onClose,
  category,
  productName
}) => {
  const [activeTab, setActiveTab] = useState<'chart' | 'questionnaire'>('chart');
  const [answers, setAnswers] = useState<QuestionnaireAnswers>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [recommendation, setRecommendation] = useState<SizeRecommendation | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const sizeChart = SIZE_CHARTS[category];
  const questionnaire = SIZE_QUESTIONNAIRE.filter(q => q.category.includes(category));

  useEffect(() => {
    if (isOpen) {
      setActiveTab('chart');
      setAnswers({});
      setCurrentQuestionIndex(0);
      setRecommendation(null);
    }
  }, [isOpen, category]);

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questionnaire.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Calculate recommendation
      setIsLoading(true);
      setTimeout(() => {
        const rec = getSizeRecommendation(category, answers);
        setRecommendation(rec);
        setIsLoading(false);
      }, 1000);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleRestartQuestionnaire = () => {
    setAnswers({});
    setCurrentQuestionIndex(0);
    setRecommendation(null);
  };

  const isCurrentQuestionAnswered = () => {
    const currentQuestion = questionnaire[currentQuestionIndex];
    if (!currentQuestion) return false;
    
    if (currentQuestion.required) {
      return answers[currentQuestion.id] && answers[currentQuestion.id].trim() !== '';
    }
    return true;
  };

  const getProgressPercentage = () => {
    return ((currentQuestionIndex + 1) / questionnaire.length) * 100;
  };

  const renderSizeChart = () => {
    if (!sizeChart) return null;

    const measurementKeys = Object.keys(sizeChart.measurements);
    const sizes = Object.keys(sizeChart.measurements[measurementKeys[0]] || {});

    return (
      <div className="space-y-6">
        {/* Size Chart Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-50">
                {measurementKeys.map((key) => (
                  <th key={key} className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sizes.map((size) => (
                <tr key={size} className="hover:bg-gray-50">
                  {measurementKeys.map((key) => (
                    <td key={key} className="border border-gray-300 px-4 py-3 text-gray-600">
                      {sizeChart.measurements[key][size]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Size Guide */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
            <Ruler className="w-5 h-5 mr-2" />
            How to Measure
          </h4>
          <ul className="space-y-2 text-blue-800">
            {sizeChart.sizeGuide.map((step, index) => (
              <li key={index} className="flex items-start">
                <span className="bg-blue-200 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">
                  {index + 1}
                </span>
                {step}
              </li>
            ))}
          </ul>
        </div>

        {/* Tips */}
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-semibold text-green-900 mb-3 flex items-center">
            <Lightbulb className="w-5 h-5 mr-2" />
            Pro Tips
          </h4>
          <ul className="space-y-2 text-green-800">
            {sizeChart.tips.map((tip, index) => (
              <li key={index} className="flex items-start">
                <CheckCircle className="w-5 h-5 mr-2 mt-0.5 text-green-600" />
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  const renderQuestionnaire = () => {
    if (questionnaire.length === 0) {
      return (
        <div className="text-center py-8">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No questionnaire available for this product category.</p>
        </div>
      );
    }

    const currentQuestion = questionnaire[currentQuestionIndex];

    if (recommendation) {
      return (
        <div className="text-center py-8">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-green-900 mb-2">
              Your Recommended Size
            </h3>
            <div className="text-3xl font-bold text-green-700 mb-4">
              {recommendation.recommendedSize}
            </div>
            <div className="text-sm text-green-600 mb-4">
              Confidence: {recommendation.confidence}%
            </div>
            <p className="text-green-800 mb-6">
              {recommendation.reasoning}
            </p>
            <button
              onClick={handleRestartQuestionnaire}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Take Quiz Again
            </button>
          </div>
        </div>
      );
    }

    if (isLoading) {
      return (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Calculating your perfect size...</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${getProgressPercentage()}%` }}
          ></div>
        </div>
        <div className="text-sm text-gray-600 text-center">
          Question {currentQuestionIndex + 1} of {questionnaire.length}
        </div>

        {/* Question */}
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            {currentQuestion.question}
          </h3>

          {/* Answer Options */}
          <div className="space-y-3">
            {currentQuestion.type === 'select' && currentQuestion.options && (
              <select
                value={answers[currentQuestion.id] || ''}
                onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                className="w-full max-w-md mx-auto px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select an option</option>
                {currentQuestion.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            )}

            {currentQuestion.type === 'radio' && currentQuestion.options && (
              <div className="space-y-3 max-w-md mx-auto">
                {currentQuestion.options.map((option) => (
                  <label
                    key={option}
                    className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <input
                      type="radio"
                      name={currentQuestion.id}
                      value={option}
                      checked={answers[currentQuestion.id] === option}
                      onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                      className="mr-3 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            )}

            {currentQuestion.type === 'input' && (
              <input
                type="text"
                value={answers[currentQuestion.id] || ''}
                onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                placeholder="Enter your answer"
                className="w-full max-w-md mx-auto px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            )}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6">
          <button
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          <button
            onClick={handleNextQuestion}
            disabled={!isCurrentQuestionAnswered()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {currentQuestionIndex === questionnaire.length - 1 ? 'Get Recommendation' : 'Next'}
          </button>
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        ></div>

        {/* Modal */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          {/* Header */}
          <div className="bg-white px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {sizeChart?.title || 'Size Chart'}
                </h2>
                {productName && (
                  <p className="text-gray-600 mt-1">{productName}</p>
                )}
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 mt-4">
              <button
                onClick={() => setActiveTab('chart')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'chart'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Size Chart
              </button>
              <button
                onClick={() => setActiveTab('questionnaire')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'questionnaire'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Size Finder
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white px-6 py-6 max-h-96 overflow-y-auto">
            {activeTab === 'chart' ? renderSizeChart() : renderQuestionnaire()}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SizeChartModal;
