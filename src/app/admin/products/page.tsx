'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Image as ImageIcon,
  Package,
  Tag,
  DollarSign
} from 'lucide-react';

interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  previous_price?: number;
  image_cover: string;
  overview: string;
  colors: string[];
  sizes: ProductSize[];
  category: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ProductSize {
  id: number;
  size: string;
  stock: number;
  product_color_id: number;
}

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, categoryFilter]);

  const fetchProducts = async () => {
    try {
      // Try to fetch from Supabase first
      const response = await fetch('/api/products');
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.products && data.products.length > 0) {
          console.log('Fetched products from API:', data.products);
          setProducts(data.products);
          setLoading(false);
          return;
        }
      }
      
      // Fallback to demo products if API fails
      console.log('Using demo products - API not available or no products found');
      const demoProducts: Product[] = [
        {
          id: 1,
          name: 'QYVE Infinitus',
          slug: 'qyve-infinitus',
          price: 150,
          previous_price: 180,
          image_cover: '/images/products/infinitus.jpg',
          overview: 'Premium futsal shoes designed for performance and comfort.',
          colors: ['black', 'white'],
          sizes: [
            { id: 1, size: '8', stock: 10, product_color_id: 1 },
            { id: 2, size: '9', stock: 15, product_color_id: 1 },
            { id: 3, size: '10', stock: 8, product_color_id: 1 }
          ],
          category: 'futsal',
          isActive: true,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-15T00:00:00Z'
        },
        {
          id: 2,
          name: 'QYVE Leyenda Jersey',
          slug: 'qyve-leyenda-jersey',
          price: 75,
          previous_price: 90,
          image_cover: '/images/products/leyenda-jersey.jpg',
          overview: 'Retro-inspired jersey with premium materials.',
          colors: ['black', 'pink'],
          sizes: [
            { id: 4, size: 'S', stock: 5, product_color_id: 2 },
            { id: 5, size: 'M', stock: 12, product_color_id: 2 },
            { id: 6, size: 'L', stock: 8, product_color_id: 2 }
          ],
          category: 'jersey',
          isActive: true,
          createdAt: '2024-01-02T00:00:00Z',
          updatedAt: '2024-01-14T00:00:00Z'
        },
        {
          id: 3,
          name: 'QYVE Recovery Slides',
          slug: 'qyve-recovery-slides',
          price: 100,
          image_cover: '/images/products/recovery-slides.jpg',
          overview: 'Comfortable recovery slides for post-training relaxation.',
          colors: ['white', 'black'],
          sizes: [
            { id: 7, size: '8', stock: 20, product_color_id: 3 },
            { id: 8, size: '9', stock: 18, product_color_id: 3 },
            { id: 9, size: '10', stock: 15, product_color_id: 3 }
          ],
          category: 'slides',
          isActive: true,
          createdAt: '2024-01-03T00:00:00Z',
          updatedAt: '2024-01-13T00:00:00Z'
        }
      ];
      
      setProducts(demoProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(product => product.category === categoryFilter);
    }

    setFilteredProducts(filtered);
  };

  const deleteProduct = async (productId: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        // Delete product - replace with actual API call
        setProducts(products.filter(product => product.id !== productId));
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const toggleProductStatus = async (productId: number) => {
    try {
      // Toggle product status - replace with actual API call
      setProducts(products.map(product => 
        product.id === productId 
          ? { ...product, isActive: !product.isActive, updatedAt: new Date().toISOString() }
          : product
      ));
    } catch (error) {
      console.error('Error updating product status:', error);
    }
  };

  const viewProduct = (product: Product) => {
    setSelectedProduct(product);
    setShowProductModal(true);
  };

  const getTotalStock = (sizes: ProductSize[]) => {
    return sizes.reduce((total, size) => total + size.stock, 0);
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
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your product catalog
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <a
            href="/admin/products/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </a>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 w-full"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Categories</option>
              <option value="futsal">Futsal Shoes</option>
              <option value="jersey">Jersey</option>
              <option value="slides">Slides</option>
              <option value="socks">Socks</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-16 w-16 rounded-lg bg-gray-200 flex items-center justify-center">
                    <ImageIcon className="h-8 w-8 text-gray-400" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {product.name}
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        RM {product.price}
                      </div>
                      {product.previous_price && (
                        <div className="ml-2 flex items-baseline text-sm font-semibold text-red-600">
                          <span className="line-through">RM {product.previous_price}</span>
                        </div>
                      )}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <Package className="h-4 w-4 text-gray-400 mr-1" />
                    <span className="text-gray-500">
                      {getTotalStock(product.sizes)} in stock
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Tag className="h-4 w-4 text-gray-400 mr-1" />
                    <span className="text-gray-500 capitalize">
                      {product.category}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => viewProduct(product)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <a
                    href={`/admin/products/${product.id}/edit`}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    <Edit className="h-4 w-4" />
                  </a>
                  <button
                    onClick={() => deleteProduct(product.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  product.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {product.isActive ? 'Active' : 'Inactive'}
                </span>
                <button
                  onClick={() => toggleProductStatus(product.id)}
                  className={`text-xs px-2 py-1 rounded ${
                    product.isActive 
                      ? 'bg-red-100 text-red-800 hover:bg-red-200' 
                      : 'bg-green-100 text-green-800 hover:bg-green-200'
                  }`}
                >
                  {product.isActive ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Product Details Modal */}
      {showProductModal && selectedProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowProductModal(false)}></div>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {selectedProduct.name}
                  </h3>
                  <button
                    onClick={() => setShowProductModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Product Image */}
                  <div>
                    <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                      <ImageIcon className="h-16 w-16 text-gray-400" />
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900">Product Information</h4>
                      <div className="mt-2 space-y-2 text-sm">
                        <p><strong>Price:</strong> RM {selectedProduct.price}</p>
                        {selectedProduct.previous_price && (
                          <p><strong>Previous Price:</strong> RM {selectedProduct.previous_price}</p>
                        )}
                        <p><strong>Category:</strong> {selectedProduct.category}</p>
                        <p><strong>Status:</strong> 
                          <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            selectedProduct.isActive 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {selectedProduct.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900">Colors</h4>
                      <div className="mt-2 flex space-x-2">
                        {selectedProduct.colors.map((color) => (
                          <span
                            key={color}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                          >
                            {color}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900">Sizes & Stock</h4>
                      <div className="mt-2 grid grid-cols-3 gap-2">
                        {selectedProduct.sizes.map((size) => (
                          <div key={size.id} className="text-sm border rounded p-2">
                            <p className="font-medium">{size.size}</p>
                            <p className="text-gray-500">Stock: {size.stock}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                  <p className="text-sm text-gray-600">{selectedProduct.overview}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
