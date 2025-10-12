'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Eye, 
  Save,
  X,
  Mail,
  Send,
  FileText,
  Palette,
  Code,
  Preview
} from 'lucide-react';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  type: 'order_confirmation' | 'payment_confirmation' | 'shipping_notification' | 'order_cancellation' | 'refund_confirmation';
  htmlContent: string;
  textContent: string;
  variables: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const EmailTemplatesPage = () => {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'html' | 'text' | 'preview'>('html');

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      // Mock data - replace with actual API call
      const mockTemplates: EmailTemplate[] = [
        {
          id: 'order-confirmation',
          name: 'Order Confirmation',
          subject: 'Order Confirmation - QYVE',
          type: 'order_confirmation',
          htmlContent: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #ff6b35; color: white; padding: 20px; text-align: center;">
              <h1>🎉 Order Confirmed!</h1>
            </div>
            <div style="padding: 20px;">
              <p>Hi {{customerName}},</p>
              <p>Thank you for your order! Your order #{{orderNumber}} has been confirmed.</p>
              <h3>Order Details:</h3>
              <ul>
                {{#each items}}
                <li>{{name}} - {{quantity}}x RM{{price}}</li>
                {{/each}}
              </ul>
              <p><strong>Total: RM{{total}}</strong></p>
            </div>
          </div>`,
          textContent: `Order Confirmation - QYVE

Hi {{customerName}},

Thank you for your order! Your order #{{orderNumber}} has been confirmed.

Order Details:
{{#each items}}
- {{name}} - {{quantity}}x RM{{price}}
{{/each}}

Total: RM{{total}}`,
          variables: ['customerName', 'orderNumber', 'items', 'total'],
          isActive: true,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-15T00:00:00Z'
        },
        {
          id: 'shipping-notification',
          name: 'Shipping Notification',
          subject: 'Your QYVE Order is on the way!',
          type: 'shipping_notification',
          htmlContent: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #1a1a1a; color: white; padding: 20px; text-align: center;">
              <h1>🚚 Your Order is Shipped!</h1>
            </div>
            <div style="padding: 20px;">
              <p>Hi {{customerName}},</p>
              <p>Great news! Your order #{{orderNumber}} has been shipped and is on its way to you.</p>
              <h3>Tracking Information:</h3>
              <p>Tracking Number: {{trackingNumber}}</p>
              <p>Carrier: {{carrier}}</p>
              <p>Estimated Delivery: {{estimatedDelivery}}</p>
            </div>
          </div>`,
          textContent: `Your QYVE Order is on the way!

Hi {{customerName}},

Great news! Your order #{{orderNumber}} has been shipped and is on its way to you.

Tracking Information:
Tracking Number: {{trackingNumber}}
Carrier: {{carrier}}
Estimated Delivery: {{estimatedDelivery}}`,
          variables: ['customerName', 'orderNumber', 'trackingNumber', 'carrier', 'estimatedDelivery'],
          isActive: true,
          createdAt: '2024-01-02T00:00:00Z',
          updatedAt: '2024-01-14T00:00:00Z'
        }
      ];
      
      setTemplates(mockTemplates);
    } catch (error) {
      console.error('Error fetching templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditTemplate = (template: EmailTemplate) => {
    setEditingTemplate({ ...template });
    setShowEditModal(true);
  };

  const handleSaveTemplate = () => {
    if (editingTemplate) {
      setTemplates(templates.map(template => 
        template.id === editingTemplate.id 
          ? { ...editingTemplate, updatedAt: new Date().toISOString() }
          : template
      ));
      setShowEditModal(false);
      setEditingTemplate(null);
    }
  };

  const handlePreviewTemplate = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setShowPreviewModal(true);
  };

  const toggleTemplateStatus = (templateId: string) => {
    setTemplates(templates.map(template => 
      template.id === templateId 
        ? { ...template, isActive: !template.isActive, updatedAt: new Date().toISOString() }
        : template
    ));
  };

  const getTemplateTypeColor = (type: string) => {
    switch (type) {
      case 'order_confirmation':
        return 'bg-green-100 text-green-800';
      case 'payment_confirmation':
        return 'bg-blue-100 text-blue-800';
      case 'shipping_notification':
        return 'bg-purple-100 text-purple-800';
      case 'order_cancellation':
        return 'bg-red-100 text-red-800';
      case 'refund_confirmation':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTemplateTypeLabel = (type: string) => {
    switch (type) {
      case 'order_confirmation':
        return 'Order Confirmation';
      case 'payment_confirmation':
        return 'Payment Confirmation';
      case 'shipping_notification':
        return 'Shipping Notification';
      case 'order_cancellation':
        return 'Order Cancellation';
      case 'refund_confirmation':
        return 'Refund Confirmation';
      default:
        return type;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Email Templates</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage email templates for transactional emails
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={() => setShowEditModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Template
          </button>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {templates.map((template) => (
          <div key={template.id} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 rounded-lg bg-indigo-100 flex items-center justify-center">
                      <Mail className="h-6 w-6 text-indigo-600" />
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {template.name}
                      </dt>
                      <dd className="text-lg font-semibold text-gray-900 truncate">
                        {template.subject}
                      </dd>
                    </dl>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePreviewTemplate(template)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    <Eye className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleEditTemplate(template)}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTemplateTypeColor(template.type)}`}>
                    {getTemplateTypeLabel(template.type)}
                  </span>
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 text-gray-400 mr-1" />
                    <span className="text-gray-500">
                      {template.variables.length} variables
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    template.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {template.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <button
                    onClick={() => toggleTemplateStatus(template.id)}
                    className={`text-xs px-2 py-1 rounded ${
                      template.isActive 
                        ? 'bg-red-100 text-red-800 hover:bg-red-200' 
                        : 'bg-green-100 text-green-800 hover:bg-green-200'
                    }`}
                  >
                    {template.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <EmailTemplateEditModal
          template={editingTemplate}
          onSave={handleSaveTemplate}
          onClose={() => {
            setShowEditModal(false);
            setEditingTemplate(null);
          }}
        />
      )}

      {/* Preview Modal */}
      {showPreviewModal && selectedTemplate && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowPreviewModal(false)}></div>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Email Template Preview - {selectedTemplate.name}
                  </h3>
                  <button
                    onClick={() => setShowPreviewModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                
                <div className="border rounded-lg p-4 bg-gray-50">
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Subject: {selectedTemplate.subject}</h4>
                  </div>
                  <div 
                    className="bg-white border rounded p-4 max-h-96 overflow-y-auto"
                    dangerouslySetInnerHTML={{ __html: selectedTemplate.htmlContent }}
                  />
                </div>

                <div className="mt-4">
                  <h4 className="font-medium text-gray-900 mb-2">Available Variables</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedTemplate.variables.map((variable) => (
                      <span
                        key={variable}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {`{{${variable}}}`}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Email Template Edit Modal Component
interface EmailTemplateEditModalProps {
  template: EmailTemplate | null;
  onSave: () => void;
  onClose: () => void;
}

const EmailTemplateEditModal: React.FC<EmailTemplateEditModalProps> = ({ template, onSave, onClose }) => {
  const [formData, setFormData] = useState<EmailTemplate>(template || {
    id: '',
    name: '',
    subject: '',
    type: 'order_confirmation',
    htmlContent: '',
    textContent: '',
    variables: [],
    isActive: true,
    createdAt: '',
    updatedAt: ''
  });
  const [activeTab, setActiveTab] = useState<'html' | 'text' | 'preview'>('html');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave();
  };

  const handleChange = (field: keyof EmailTemplate, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addVariable = () => {
    const variable = prompt('Enter variable name (without curly braces):');
    if (variable && !formData.variables.includes(variable)) {
      setFormData(prev => ({
        ...prev,
        variables: [...prev.variables, variable]
      }));
    }
  };

  const removeVariable = (variable: string) => {
    setFormData(prev => ({
      ...prev,
      variables: prev.variables.filter(v => v !== variable)
    }));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>
        
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {template ? 'Edit Email Template' : 'Create Email Template'}
                </h3>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Template Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email Subject</label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => handleChange('subject', e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Template Type</label>
                    <select
                      value={formData.type}
                      onChange={(e) => handleChange('type', e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="order_confirmation">Order Confirmation</option>
                      <option value="payment_confirmation">Payment Confirmation</option>
                      <option value="shipping_notification">Shipping Notification</option>
                      <option value="order_cancellation">Order Cancellation</option>
                      <option value="refund_confirmation">Refund Confirmation</option>
                    </select>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => handleChange('isActive', e.target.checked)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">Active</label>
                  </div>
                </div>

                {/* Variables */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">Variables</label>
                    <button
                      type="button"
                      onClick={addVariable}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Variable
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.variables.map((variable) => (
                      <span
                        key={variable}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {`{{${variable}}}`}
                        <button
                          type="button"
                          onClick={() => removeVariable(variable)}
                          className="ml-1 text-blue-600 hover:text-blue-800"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Content Tabs */}
                <div>
                  <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8">
                      <button
                        type="button"
                        onClick={() => setActiveTab('html')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${
                          activeTab === 'html'
                            ? 'border-indigo-500 text-indigo-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <Code className="h-4 w-4 inline mr-2" />
                        HTML Content
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('text')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${
                          activeTab === 'text'
                            ? 'border-indigo-500 text-indigo-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <FileText className="h-4 w-4 inline mr-2" />
                        Text Content
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('preview')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${
                          activeTab === 'preview'
                            ? 'border-indigo-500 text-indigo-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <Preview className="h-4 w-4 inline mr-2" />
                        Preview
                      </button>
                    </nav>
                  </div>

                  <div className="mt-4">
                    {activeTab === 'html' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">HTML Content</label>
                        <textarea
                          value={formData.htmlContent}
                          onChange={(e) => handleChange('htmlContent', e.target.value)}
                          rows={12}
                          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm"
                          placeholder="Enter HTML content for the email template"
                        />
                      </div>
                    )}

                    {activeTab === 'text' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Text Content</label>
                        <textarea
                          value={formData.textContent}
                          onChange={(e) => handleChange('textContent', e.target.value)}
                          rows={12}
                          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm"
                          placeholder="Enter plain text content for the email template"
                        />
                      </div>
                    )}

                    {activeTab === 'preview' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Preview</label>
                        <div className="border rounded-lg p-4 bg-gray-50">
                          <div className="mb-4">
                            <h4 className="font-medium text-gray-900">Subject: {formData.subject}</h4>
                          </div>
                          <div 
                            className="bg-white border rounded p-4 max-h-96 overflow-y-auto"
                            dangerouslySetInnerHTML={{ __html: formData.htmlContent || '<p>No HTML content</p>' }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Template
              </button>
              <button
                type="button"
                onClick={onClose}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EmailTemplatesPage;
