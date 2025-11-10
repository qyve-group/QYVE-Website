'use client';

import { AlertCircle, CheckCircle, Lightbulb, Ruler, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import type { SizeRecommendation } from '@/data/sizeCharts';
import {
  getSizeRecommendation,
  SIZE_CHARTS,
  SIZE_QUESTIONNAIRE,
} from '@/data/sizeCharts';

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
  productName,
}) => {
  const [activeTab, setActiveTab] = useState<'chart' | 'questionnaire'>(
    'chart',
  );
  const [answers, setAnswers] = useState<QuestionnaireAnswers>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [recommendation, setRecommendation] =
    useState<SizeRecommendation | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const sizeChart = SIZE_CHARTS[category];
  const questionnaire = SIZE_QUESTIONNAIRE.filter((q) =>
    q.category.includes(category),
  );

  useEffect(() => {
    if (isOpen) {
      setActiveTab('chart');
      setAnswers({});
      setCurrentQuestionIndex(0);
      setRecommendation(null);
    }
  }, [isOpen, category]);

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questionnaire.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
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
      setCurrentQuestionIndex((prev) => prev - 1);
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
      return (
        answers[currentQuestion.id] && answers[currentQuestion.id].trim() !== ''
      );
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
          <table className="border-gray-300 w-full border-collapse border">
            <thead>
              <tr className="bg-gray-50">
                {measurementKeys.map((key) => (
                  <th
                    key={key}
                    className="border-gray-300 text-gray-700 border px-4 py-3 text-left font-semibold"
                  >
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sizes.map((size) => (
                <tr key={size} className="hover:bg-gray-50">
                  {measurementKeys.map((key) => (
                    <td
                      key={key}
                      className="border-gray-300 text-gray-600 border px-4 py-3"
                    >
                      {sizeChart.measurements[key][size]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Size Guide */}
        <div className="rounded-lg bg-blue-50 p-4">
          <h4 className="mb-3 flex items-center font-semibold text-blue-900">
            <Ruler className="mr-2 size-5" />
            How to Measure
          </h4>
          <ul className="space-y-2 text-blue-800">
            {sizeChart.sizeGuide.map((step, index) => (
              //eslint-disable-next-line react/no-array-index-key
              <li key={index} className="flex items-start">
                <span className="mr-3 mt-0.5 flex size-6 items-center justify-center rounded-full bg-blue-200 text-sm font-semibold text-blue-800">
                  {index + 1}
                </span>
                {step}
              </li>
            ))}
          </ul>
        </div>

        {/* Tips */}
        <div className="rounded-lg bg-green-50 p-4">
          <h4 className="mb-3 flex items-center font-semibold text-green-900">
            <Lightbulb className="mr-2 size-5" />
            Pro Tips
          </h4>
          <ul className="space-y-2 text-green-800">
            {sizeChart.tips.map((tip, index) => (
        //eslint-disable-next-line react/no-array-index-key  
              <li key={index} className="flex items-start">
                <CheckCircle className="mr-2 mt-0.5 size-5 text-green-600" />
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
        <div className="py-8 text-center">
          <AlertCircle className="text-gray-400 mx-auto mb-4 size-12" />
          <p className="text-gray-600">
            No questionnaire available for this product category.
          </p>
        </div>
      );
    }

    const currentQuestion = questionnaire[currentQuestionIndex];

    if (recommendation) {
      return (
        <div className="py-8 text-center">
          <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-6">
            <CheckCircle className="mx-auto mb-4 size-12 text-green-600" />
            <h3 className="mb-2 text-xl font-semibold text-green-900">
              Your Recommended Size
            </h3>
            <div className="mb-4 text-3xl font-bold text-green-700">
              {recommendation.recommendedSize}
            </div>
            <div className="mb-4 text-sm text-green-600">
              Confidence: {recommendation.confidence}%
            </div>
            <p className="mb-6 text-green-800">{recommendation.reasoning}</p>
            <button
              type='button'
              onClick={handleRestartQuestionnaire}
              className="rounded-lg bg-green-600 px-6 py-2 text-white transition-colors hover:bg-green-700"
            >
              Take Quiz Again
            </button>
          </div>
        </div>
      );
    }

    if (isLoading) {
      return (
        <div className="py-8 text-center">
          <div className="mx-auto mb-4 size-12 animate-spin rounded-full border-b-2 border-blue-600" />
          <p className="text-gray-600">Calculating your perfect size...</p>
        </div>
      );
    }

    const currentQuestion = questionnaire[currentQuestionIndex];
    
    if (!currentQuestion) {
      return (
        <div className="py-8 text-center">
          <p className="text-gray-600">No questions available.</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Progress Bar */}
        <div className="bg-gray-200 h-2 w-full rounded-full">
          <div
            className="h-2 rounded-full bg-blue-600 transition-all duration-300"
            style={{ width: `${getProgressPercentage()}%` }}
          />
        </div>
        <div className="text-gray-600 text-center text-sm">
          Question {currentQuestionIndex + 1} of {questionnaire.length}
        </div>

        {/* Question */}
        <div className="text-center">
          <h3 className="text-gray-900 mb-6 text-xl font-semibold">
            {currentQuestion.question}
          </h3>

          {/* Answer Options */}
          <div className="space-y-3">
            {currentQuestion.type === 'select' && currentQuestion.options && (
              <select
                value={answers[currentQuestion.id] || ''}
                onChange={(e) =>
                  handleAnswerChange(currentQuestion.id, e.target.value)
                }
                className="border-gray-300 mx-auto w-full max-w-md rounded-lg border px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
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
              <div className="mx-auto max-w-md space-y-3">
                {currentQuestion.options.map((option) => (
                  <label
                    key={option}
                    className="border-gray-200 hover:bg-gray-50 flex cursor-pointer items-center rounded-lg border p-4 transition-colors"
                  >
                    <input
                      type="radio"
                      name={currentQuestion.id}
                      value={option}
                      checked={answers[currentQuestion.id] === option}
                      onChange={(e) =>
                        handleAnswerChange(currentQuestion.id, e.target.value)
                      }
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
                onChange={(e) =>
                  handleAnswerChange(currentQuestion.id, e.target.value)
                }
                placeholder="Enter your answer"
                className="border-gray-300 mx-auto w-full max-w-md rounded-lg border px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
              />
            )}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6">
          <button
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
            className="border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg border px-6 py-2 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={handleNextQuestion}
            disabled={!isCurrentQuestionAnswered()}
            className="rounded-lg bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {currentQuestionIndex === questionnaire.length - 1
              ? 'Get Recommendation'
              : 'Next'}
          </button>
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
        {/* Backdrop */}
        <div
          className="bg-gray-500 fixed inset-0 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="inline-block overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl sm:align-middle">
          {/* Header */}
          <div className="border-gray-200 border-b bg-white px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-gray-900 text-2xl font-bold">
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
                <X className="size-6" />
              </button>
            </div>

            {/* Tabs */}
            <div className="mt-4 flex space-x-1">
              <button
                onClick={() => setActiveTab('chart')}
                className={`rounded-lg px-4 py-2 font-medium transition-colors ${
                  activeTab === 'chart'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Size Chart
              </button>
              <button
                onClick={() => setActiveTab('questionnaire')}
                className={`rounded-lg px-4 py-2 font-medium transition-colors ${
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
          <div className="max-h-96 overflow-y-auto bg-white p-6">
            {activeTab === 'chart' ? renderSizeChart() : renderQuestionnaire()}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 border-gray-200 border-t px-6 py-4">
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="bg-gray-600 hover:bg-gray-700 rounded-lg px-6 py-2 text-white transition-colors"
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
