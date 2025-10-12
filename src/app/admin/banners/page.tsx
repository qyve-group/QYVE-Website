'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  ToggleLeft, 
  ToggleRight,
  Image as ImageIcon,
  Palette,
  Type,
  Settings
} from 'lucide-react';
import { BannerConfig, BANNER_VARIANTS } from '@/data/bannerConfig';

const BannersPage = () => {
  const [banners, setBanners] = useState<BannerConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBanner, setSelectedBanner] = useState<BannerConfig | null>(null);
  const [showBannerModal, setShowBannerModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState<BannerConfig | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      // Mock data - replace with actual API call
      const mockBanners: BannerConfig[] = [
        {
          id: 'default-marketing-banner',
          title: '🎉 Get 10% Off Your First Order!',
          subtitle: 'Join the QYVE Family',
          description: 'Subscribe to our newsletter and be the first to know about new releases, exclusive offers, and special promotions.',
          buttonText: 'Subscribe Now',
          placeholder: 'Enter your email address',
          successMessage: '🎉 Welcome to the QYVE family! Check your email for your discount code.',
          errorMessage: 'Something went wrong. Please try again.',
          backgroundColor: '#ff6b35',
          textColor: '#ffffff',
          buttonColor: '#000000',
          buttonTextColor: '#ffffff',
          position: 'bottom',
          isActive: true,
          showOnPages: ['home', 'shop', 'products'],
          hideOnPages: ['checkout', 'success', 'login', 'signup'],
          gdprRequired: true,
          gdprText: 'I agree to receive marketing emails and understand I can unsubscribe at any time.',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-15T00:00:00Z'
        },
        {
          id: 'welcome-banner',
          title: '🏆 Welcome to QYVE!',
          subtitle: 'Your Premium Sports Gear Destination',
          description: 'Get exclusive access to new releases, member-only discounts, and early access to limited editions.',
          buttonText: 'Join Now',
          placeholder: 'Enter your email address',
          successMessage: 'Welcome to QYVE!',
          errorMessage: 'Something went wrong. Please try again.',
          backgroundColor: '#1a1a1a',
          textColor: '#ffffff',
          buttonColor: '#ff6b35',
          buttonTextColor: '#ffffff',
          position: 'top',
          isActive: false,
          showOnPages: ['home'],
          hideOnPages: ['checkout', 'success', 'login', 'signup'],
          gdprRequired: true,
          gdprText: 'I agree to receive marketing emails.',
          createdAt: '2024-01-02T00:00:00Z',
          updatedAt: '2024-01-14T00:00:00Z'
        }
      ];
      
      setBanners(mockBanners);
    } catch (error) {
      console.error('Error fetching banners:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleBannerStatus = async (bannerId: string) => {
    try {
      // Toggle banner status - replace with actual API call
      setBanners(banners.map(banner => 
        banner.id === bannerId 
          ? { ...banner, isActive: !banner.isActive, updatedAt: new Date().toISOString() }
          : banner
      ));
    } catch (error) {
      console.error('Error updating banner status:', error);
    }
  };

  const deleteBanner = async (bannerId: string) => {
    if (window.confirm('Are you sure you want to delete this banner?')) {
      try {
        // Delete banner - replace with actual API call
        setBanners(banners.filter(banner => banner.id !== bannerId));
      } catch (error) {
        console.error('Error deleting banner:', error);
      }
    }
  };

  const viewBanner = (banner: BannerConfig) => {
    setSelectedBanner(banner);
    setShowBannerModal(true);
  };

  const editBanner = (banner: BannerConfig) => {
    setEditingBanner(banner);
    setShowEditModal(true);
  };

  const saveBanner = async (bannerData: BannerConfig) => {
    try {
      // Save banner - replace with actual API call
      if (editingBanner) {
        setBanners(banners.map(banner => 
          banner.id === editingBanner.id 
            ? { ...bannerData, updatedAt: new Date().toISOString() }
            : banner
        ));
      } else {
        const newBanner = {
          ...bannerData,
          id: `banner-${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        setBanners([...banners, newBanner]);
      }
      setShowEditModal(false);
      setEditingBanner(null);
    } catch (error) {
      console.error('Error saving banner:', error);
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
          <h1 className="text-2xl font-bold text-gray-900">Marketing Banners</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage marketing banners and promotional content
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={() => editBanner({} as BannerConfig)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Banner
          </button>
        </div>
      </div>

      {/* Banners Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {banners.map((banner) => (
          <div key={banner.id} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div 
                      className="h-16 w-16 rounded-lg flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: banner.backgroundColor }}
                    >
                      <Type className="h-8 w-8" />
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {banner.title}
                      </dt>
                      <dd className="text-lg font-semibold text-gray-900 truncate">
                        {banner.subtitle}
                      </dd>
                    </dl>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => viewBanner(banner)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    <Eye className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => editBanner(banner)}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => deleteBanner(banner.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center">
                    <Palette className="h-4 w-4 text-gray-400 mr-1" />
                    <span className="text-gray-500 capitalize">
                      {banner.position}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Settings className="h-4 w-4 text-gray-400 mr-1" />
                    <span className="text-gray-500">
                      {banner.showOnPages.length} pages
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    banner.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {banner.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <button
                    onClick={() => toggleBannerStatus(banner.id)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {banner.isActive ? (
                      <ToggleRight className="h-5 w-5 text-green-600" />
                    ) : (
                      <ToggleLeft className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Banner Preview Modal */}
      {showBannerModal && selectedBanner && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowBannerModal(false)}></div>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Banner Preview - {selectedBanner.title}
                  </h3>
                  <button
                    onClick={() => setShowBannerModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>
                
                {/* Banner Preview */}
                <div 
                  className="p-6 rounded-lg"
                  style={{
                    backgroundColor: selectedBanner.backgroundColor,
                    color: selectedBanner.textColor
                  }}
                >
                  <div className="text-center">
                    <h2 className="text-2xl font-bold mb-2">{selectedBanner.title}</h2>
                    <p className="text-lg mb-4">{selectedBanner.subtitle}</p>
                    <p className="text-sm mb-6 opacity-90">{selectedBanner.description}</p>
                    
                    <div className="flex items-center justify-center space-x-4">
                      <input
                        type="email"
                        placeholder={selectedBanner.placeholder}
                        className="px-4 py-2 rounded-lg text-gray-900 placeholder-gray-500"
                        disabled
                      />
                      <button
                        className="px-6 py-2 rounded-lg font-medium"
                        style={{
                          backgroundColor: selectedBanner.buttonColor,
                          color: selectedBanner.buttonTextColor
                        }}
                        disabled
                      >
                        {selectedBanner.buttonText}
                      </button>
                    </div>
                    
                    {selectedBanner.gdprRequired && (
                      <div className="mt-4 flex items-center justify-center">
                        <input type="checkbox" disabled className="mr-2" />
                        <span className="text-xs opacity-75">{selectedBanner.gdprText}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Banner Details */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Configuration</h4>
                    <div className="space-y-1 text-sm">
                      <p><strong>Position:</strong> {selectedBanner.position}</p>
                      <p><strong>Active:</strong> {selectedBanner.isActive ? 'Yes' : 'No'}</p>
                      <p><strong>GDPR Required:</strong> {selectedBanner.gdprRequired ? 'Yes' : 'No'}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Display Rules</h4>
                    <div className="space-y-1 text-sm">
                      <p><strong>Show on:</strong> {selectedBanner.showOnPages.join(', ')}</p>
                      <p><strong>Hide on:</strong> {selectedBanner.hideOnPages.join(', ')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Banner Edit Modal */}
      {showEditModal && (
        <BannerEditModal
          banner={editingBanner}
          onSave={saveBanner}
          onClose={() => {
            setShowEditModal(false);
            setEditingBanner(null);
          }}
        />
      )}
    </div>
  );
};

// Banner Edit Modal Component
const BannerEditModal: React.FC<{
  banner: BannerConfig | null;
  onSave: (banner: BannerConfig) => void;
  onClose: () => void;
}> = ({ banner, onSave, onClose }) => {
  const [formData, setFormData] = useState<BannerConfig>(banner || {
    id: '',
    title: '',
    subtitle: '',
    description: '',
    buttonText: 'Subscribe Now',
    placeholder: 'Enter your email address',
    successMessage: 'Thank you for subscribing!',
    errorMessage: 'Something went wrong. Please try again.',
    backgroundColor: '#ff6b35',
    textColor: '#ffffff',
    buttonColor: '#000000',
    buttonTextColor: '#ffffff',
    position: 'bottom',
    isActive: true,
    showOnPages: ['home', 'shop', 'products'],
    hideOnPages: ['checkout', 'success', 'login', 'signup'],
    gdprRequired: true,
    gdprText: 'I agree to receive marketing emails.',
    createdAt: '',
    updatedAt: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (field: keyof BannerConfig, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>
        
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {banner ? 'Edit Banner' : 'Create Banner'}
                </h3>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Content */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Content</h4>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleChange('title', e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Subtitle</label>
                    <input
                      type="text"
                      value={formData.subtitle}
                      onChange={(e) => handleChange('subtitle', e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleChange('description', e.target.value)}
                      rows={3}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Button Text</label>
                    <input
                      type="text"
                      value={formData.buttonText}
                      onChange={(e) => handleChange('buttonText', e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Banner Image</label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="banner-image-upload"
                            className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                          >
                            <span>Upload banner image</span>
                            <input
                              id="banner-image-upload"
                              name="banner-image-upload"
                              type="file"
                              className="sr-only"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  console.log('Selected banner image:', file);
                                  // Handle banner image upload logic here
                                }
                              }}
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Styling */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Styling</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Background Color</label>
                      <input
                        type="color"
                        value={formData.backgroundColor}
                        onChange={(e) => handleChange('backgroundColor', e.target.value)}
                        className="mt-1 block w-full h-10 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Text Color</label>
                      <input
                        type="color"
                        value={formData.textColor}
                        onChange={(e) => handleChange('textColor', e.target.value)}
                        className="mt-1 block w-full h-10 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Button Color</label>
                      <input
                        type="color"
                        value={formData.buttonColor}
                        onChange={(e) => handleChange('buttonColor', e.target.value)}
                        className="mt-1 block w-full h-10 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Button Text Color</label>
                      <input
                        type="color"
                        value={formData.buttonTextColor}
                        onChange={(e) => handleChange('buttonTextColor', e.target.value)}
                        className="mt-1 block w-full h-10 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Position</label>
                    <select
                      value={formData.position}
                      onChange={(e) => handleChange('position', e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="top">Top</option>
                      <option value="bottom">Bottom</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Settings */}
              <div className="mt-6 space-y-4">
                <h4 className="font-medium text-gray-900">Settings</h4>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => handleChange('isActive', e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900">Active</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.gdprRequired}
                    onChange={(e) => handleChange('gdprRequired', e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900">GDPR Required</label>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Save Banner
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

export default BannersPage;
