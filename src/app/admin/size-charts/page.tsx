'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Save,
  X,
  FileText,
  Ruler,
  Users,
  HelpCircle
} from 'lucide-react';
import { SIZE_CHARTS } from '@/data/sizeCharts';

export const dynamic = 'force-dynamic';

interface SizeChart {
  title: string;
  description: string;
  measurementKeys: string[];
  sizes: Array<Record<string, string>>;
  sizeGuide: string[];
  tips: string[];
  questionnaire?: {
    totalQuestions: number;
    questions: Array<{
      id: string;
      question: string;
      type: 'select' | 'radio' | 'text';
      options?: string[];
      required: boolean;
    }>;
  };
}

const SizeChartsPage = () => {
  const [charts, setCharts] = useState<Record<string, SizeChart>>(SIZE_CHARTS || {});
  const [selectedCategory, setSelectedCategory] = useState<string>('futsal');
  const [editingChart, setEditingChart] = useState<SizeChart | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const categories = Object.keys(charts || {});

  const handleEditChart = (category: string) => {
    setSelectedCategory(category);
    setEditingChart({ ...charts[category] });
    setShowEditModal(true);
  };

  const handleSaveChart = () => {
    if (editingChart) {
      setCharts(prev => ({
        ...prev,
        [selectedCategory]: editingChart
      }));
      setShowEditModal(false);
      setEditingChart(null);
    }
  };

  const handleAddSize = () => {
    if (editingChart) {
      const newSize: Record<string, string> = {};
      editingChart.measurementKeys.forEach(key => {
        newSize[key] = '';
      });
      setEditingChart({
        ...editingChart,
        sizes: [...editingChart.sizes, newSize]
      });
    }
  };

  const handleRemoveSize = (index: number) => {
    if (editingChart) {
      setEditingChart({
        ...editingChart,
        sizes: editingChart.sizes.filter((_, i) => i !== index)
      });
    }
  };

  const handleSizeChange = (index: number, key: string, value: string) => {
    if (editingChart) {
      const newSizes = [...editingChart.sizes];
      newSizes[index][key] = value;
      setEditingChart({
        ...editingChart,
        sizes: newSizes
      });
    }
  };

  const handleAddQuestion = () => {
    if (editingChart) {
      const newQuestion = {
        id: `question_${Date.now()}`,
        question: '',
        type: 'select' as const,
        options: [],
        required: false
      };
      setEditingChart({
        ...editingChart,
        questionnaire: {
          totalQuestions: (editingChart.questionnaire?.questions.length || 0) + 1,
          questions: [...(editingChart.questionnaire?.questions || []), newQuestion]
        }
      });
    }
  };

  const handleRemoveQuestion = (index: number) => {
    if (editingChart && editingChart.questionnaire) {
      const newQuestions = editingChart.questionnaire.questions.filter((_, i) => i !== index);
      setEditingChart({
        ...editingChart,
        questionnaire: {
          totalQuestions: newQuestions.length,
          questions: newQuestions
        }
      });
    }
  };

  const handleQuestionChange = (index: number, field: string, value: any) => {
    if (editingChart && editingChart.questionnaire) {
      const newQuestions = [...editingChart.questionnaire.questions];
      newQuestions[index] = { ...newQuestions[index], [field]: value };
      setEditingChart({
        ...editingChart,
        questionnaire: {
          ...editingChart.questionnaire,
          questions: newQuestions
        }
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Size Charts</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage size charts for different product categories
          </p>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                selectedCategory === category
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {category}
            </button>
          ))}
        </nav>
      </div>

      {/* Current Chart Display */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                {charts[selectedCategory]?.title}
              </h3>
              <p className="text-sm text-gray-500">
                {charts[selectedCategory]?.description}
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowPreviewModal(true)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </button>
              <button
                onClick={() => handleEditChart(selectedCategory)}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </button>
            </div>
          </div>

          {/* Size Chart Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {charts[selectedCategory]?.measurementKeys.map((key) => (
                    <th
                      key={key}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {charts[selectedCategory]?.sizes.map((size, index) => (
                  <tr key={index}>
                    {charts[selectedCategory]?.measurementKeys.map((key) => (
                      <td key={key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {size[key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Size Guide and Tips */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Size Guide</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                {charts[selectedCategory]?.sizeGuide.map((guide, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>{guide}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Tips</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                {charts[selectedCategory]?.tips.map((tip, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Questionnaire */}
          {charts[selectedCategory]?.questionnaire && (
            <div className="mt-6">
              <h4 className="font-medium text-gray-900 mb-2">Size Recommendation Questionnaire</h4>
              <div className="text-sm text-gray-600">
                <p>Total Questions: {charts[selectedCategory]?.questionnaire?.totalQuestions}</p>
                <div className="mt-2 space-y-2">
                  {charts[selectedCategory]?.questionnaire?.questions.map((question, index) => (
                    <div key={index} className="p-2 bg-gray-50 rounded">
                      <p className="font-medium">{question.question}</p>
                      <p className="text-xs text-gray-500">
                        Type: {question.type} • Required: {question.required ? 'Yes' : 'No'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && editingChart && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowEditModal(false)}></div>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Edit Size Chart - {selectedCategory}
                  </h3>
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                
                <div className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Title</label>
                      <input
                        type="text"
                        value={editingChart.title}
                        onChange={(e) => setEditingChart({ ...editingChart, title: e.target.value })}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Description</label>
                      <input
                        type="text"
                        value={editingChart.description}
                        onChange={(e) => setEditingChart({ ...editingChart, description: e.target.value })}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  {/* Size Chart Table */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">Size Chart Data</h4>
                      <button
                        onClick={handleAddSize}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Size
                      </button>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            {editingChart.measurementKeys.map((key) => (
                              <th
                                key={key}
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                {key}
                              </th>
                            ))}
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {editingChart.sizes.map((size, index) => (
                            <tr key={index}>
                              {editingChart.measurementKeys.map((key) => (
                                <td key={key} className="px-6 py-4 whitespace-nowrap">
                                  <input
                                    type="text"
                                    value={size[key] || ''}
                                    onChange={(e) => handleSizeChange(index, key, e.target.value)}
                                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                  />
                                </td>
                              ))}
                              <td className="px-6 py-4 whitespace-nowrap">
                                <button
                                  onClick={() => handleRemoveSize(index)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Size Guide */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Size Guide</h4>
                    <textarea
                      value={editingChart.sizeGuide.join('\n')}
                      onChange={(e) => setEditingChart({ ...editingChart, sizeGuide: e.target.value.split('\n') })}
                      rows={4}
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Enter size guide instructions, one per line"
                    />
                  </div>

                  {/* Tips */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Tips</h4>
                    <textarea
                      value={editingChart.tips.join('\n')}
                      onChange={(e) => setEditingChart({ ...editingChart, tips: e.target.value.split('\n') })}
                      rows={4}
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Enter sizing tips, one per line"
                    />
                  </div>

                  {/* Questionnaire */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">Size Recommendation Questionnaire</h4>
                      <button
                        onClick={handleAddQuestion}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Question
                      </button>
                    </div>
                    <div className="space-y-4">
                      {editingChart.questionnaire?.questions.map((question, index) => (
                        <div key={index} className="p-4 border border-gray-200 rounded-lg">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Question</label>
                              <input
                                type="text"
                                value={question.question}
                                onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Type</label>
                              <select
                                value={question.type}
                                onChange={(e) => handleQuestionChange(index, 'type', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                              >
                                <option value="select">Select</option>
                                <option value="radio">Radio</option>
                                <option value="text">Text</option>
                              </select>
                            </div>
                          </div>
                          <div className="mt-4 flex items-center justify-between">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                checked={question.required}
                                onChange={(e) => handleQuestionChange(index, 'required', e.target.checked)}
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                              />
                              <label className="ml-2 block text-sm text-gray-900">Required</label>
                            </div>
                            <button
                              onClick={() => handleRemoveQuestion(index)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={handleSaveChart}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </button>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowPreviewModal(false)}></div>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Size Chart Preview - {selectedCategory}
                  </h3>
                  <button
                    onClick={() => setShowPreviewModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                
                {/* This would show the actual size chart modal preview */}
                <div className="text-center py-8">
                  <Ruler className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Size chart preview would be displayed here</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SizeChartsPage;
