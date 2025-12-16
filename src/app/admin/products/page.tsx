/* eslint-disable
  @typescript-eslint/no-use-before-define,
  react-hooks/exhaustive-deps,
  no-console,
  no-alert,
  no-nested-ternary,
  react/button-has-type,
  tailwindcss/migration-from-tailwind-2,
  jsx-a11y/label-has-associated-control
*/

'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

interface ProductSize {
  id: number;
  size: string;
  stock: number;
}

interface ProductColor {
  id: number;
  color: string;
  image: string | null;
  products_sizes: ProductSize[];
}

interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  previous_price: number | null;
  image_cover: string | null;
  overview: string | null;
  category_id: number | null;
  is_featured: boolean;
  is_new_arrival: boolean;
  is_best_seller: boolean;
  is_on_sale: boolean;
  status: string;
  created_at: string;
  product_colors: ProductColor[];
  totalStock: number;
  variantCount: number;
}

interface ProductFormData {
  id?: number;
  name: string;
  slug: string;
  price: number;
  previous_price: number | null;
  image_cover: string;
  overview: string;
  is_featured: boolean;
  is_new_arrival: boolean;
  is_best_seller: boolean;
  is_on_sale: boolean;
  status: string;
}

const defaultFormData: ProductFormData = {
  name: '',
  slug: '',
  price: 0,
  previous_price: null,
  image_cover: '',
  overview: '',
  is_featured: false,
  is_new_arrival: false,
  is_best_seller: false,
  is_on_sale: false,
  status: 'active',
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<ProductFormData>(defaultFormData);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/products');
      const data = await response.json();
      if (!response.ok) {
        throw new Error(
          data.error || `Failed to fetch products (${response.status})`,
        );
      }
      console.log('Fetch products data:', data);
      setProducts(data.productsWithStock || []);
    } catch (err) {
      console.error('Fetch products error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      console.log('Fetch products finished: ', products);
      setLoading(false);
    }
  };

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setFormData({
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        previous_price: product.previous_price,
        image_cover: product.image_cover || '',
        overview: product.overview || '',
        is_featured: product.is_featured,
        is_new_arrival: product.is_new_arrival,
        is_best_seller: product.is_best_seller,
        is_on_sale: product.is_on_sale,
        status: product.status,
      });
      setIsEditing(true);
    } else {
      setFormData(defaultFormData);
      setIsEditing(false);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData(defaultFormData);
    setIsEditing(false);
    setFormError(null);
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    const { checked } = e.target as HTMLInputElement;

    setFormData((prev) => {
      const newData = {
        ...prev,
        [name]:
          type === 'checkbox'
            ? checked
            : type === 'number'
              ? parseFloat(value) || 0
              : value,
      };

      if (name === 'name' && !isEditing && !prev.slug) {
        newData.slug = generateSlug(value);
      }

      return newData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFormError(null);

    try {
      const method = isEditing ? 'PUT' : 'POST';
      const response = await fetch('/api/admin/products', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save product');
      }

      await fetchProducts();
      handleCloseModal();
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : 'Failed to save product',
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/admin/products?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete product');
      }

      await fetchProducts();
      setDeleteConfirm(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete product');
    }
  };

  const getStockBadge = (stock: number) => {
    console.log('stock: ', stock);
    if (stock === 0)
      return (
        <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
          Out of Stock
        </span>
      );
    if (stock <= 10)
      return (
        <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
          Low: {stock}
        </span>
      );
    return (
      <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
        {stock} in stock
      </span>
    );
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.slug.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === 'all' || product.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="border-gray-900 size-8 animate-spin rounded-full border-b-2" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <p className="text-red-800">{error}</p>
        <button
          onClick={fetchProducts}
          className="mt-2 text-red-600 underline hover:text-red-800"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-gray-900 text-2xl font-bold">Products</h1>
          <p className="text-gray-600">Manage your product catalog</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
        >
          <svg
            className="mr-2 size-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add Product
        </button>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-gray-300 w-full rounded-lg border px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border-gray-300 rounded-lg border px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="overflow-hidden rounded-lg bg-white shadow-md transition-shadow hover:shadow-lg"
          >
            <div className="bg-gray-100 relative h-48">
              {product.image_cover ? (
                <Image
                  src={product.image_cover}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : (
                <div className="text-gray-400 flex h-full items-center justify-center">
                  <svg
                    className="size-16"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              )}
              <div className="absolute right-2 top-2 flex flex-col gap-1">
                {product.is_featured && (
                  <span className="rounded bg-purple-600 px-2 py-0.5 text-xs text-white">
                    Featured
                  </span>
                )}
                {product.is_new_arrival && (
                  <span className="rounded bg-blue-600 px-2 py-0.5 text-xs text-white">
                    New
                  </span>
                )}
                {product.is_best_seller && (
                  <span className="rounded bg-orange-600 px-2 py-0.5 text-xs text-white">
                    Best Seller
                  </span>
                )}
              </div>
            </div>

            <div className="p-4">
              <div className="mb-2 flex items-start justify-between">
                <h3 className="text-gray-900 line-clamp-1 font-semibold">
                  {product.name}
                </h3>
                <span
                  className={`rounded px-2 py-0.5 text-xs ${
                    product.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : product.status === 'draft'
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-red-100 text-red-800'
                  }`}
                >
                  {product.status}
                </span>
              </div>

              <div className="mb-3 flex items-center gap-2">
                <span className="text-gray-900 text-lg font-bold">
                  RM {product.price.toFixed(2)}
                </span>
                {product.previous_price && (
                  <span className="text-gray-500 text-sm line-through">
                    RM {product.previous_price.toFixed(2)}
                  </span>
                )}
              </div>

              <div className="mb-4 flex items-center justify-between">
                {getStockBadge(product.totalStock)}
                <span className="text-gray-500 text-sm">
                  {product.variantCount} variant
                  {product.variantCount !== 1 ? 's' : ''}
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleOpenModal(product)}
                  className="bg-gray-100 text-gray-700 hover:bg-gray-200 flex-1 rounded-lg px-3 py-2 text-sm transition-colors"
                >
                  Edit
                </button>
                {deleteConfirm === product.id ? (
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="rounded-lg bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-700"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(null)}
                      className="bg-gray-300 text-gray-700 hover:bg-gray-400 rounded-lg px-3 py-2 text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setDeleteConfirm(product.id)}
                    className="rounded-lg bg-red-100 px-3 py-2 text-sm text-red-700 transition-colors hover:bg-red-200"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="py-12 text-center">
          <svg
            className="text-gray-400 mx-auto size-12"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
          <h3 className="text-gray-900 mt-2 text-sm font-medium">
            No products found
          </h3>
          <p className="text-gray-500 mt-1 text-sm">
            {searchTerm || filterStatus !== 'all'
              ? 'Try adjusting your filters'
              : 'Get started by adding a new product'}
          </p>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white">
            <div className="border-b p-6">
              <h2 className="text-xl font-semibold">
                {isEditing ? 'Edit Product' : 'Add New Product'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 p-6">
              {formError && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="text-gray-700 mb-1 block text-sm font-medium">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="border-gray-300 w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-gray-700 mb-1 block text-sm font-medium">
                    Slug *
                  </label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    required
                    className="border-gray-300 w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="text-gray-700 mb-1 block text-sm font-medium">
                    Price (RM) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    className="border-gray-300 w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-gray-700 mb-1 block text-sm font-medium">
                    Previous Price (RM)
                  </label>
                  <input
                    type="number"
                    name="previous_price"
                    value={formData.previous_price || ''}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="border-gray-300 w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-700 mb-1 block text-sm font-medium">
                  Image URL
                </label>
                <input
                  type="url"
                  name="image_cover"
                  value={formData.image_cover}
                  onChange={handleInputChange}
                  placeholder="https://..."
                  className="border-gray-300 w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-gray-700 mb-1 block text-sm font-medium">
                  Overview
                </label>
                <textarea
                  name="overview"
                  value={formData.overview}
                  onChange={handleInputChange}
                  rows={3}
                  className="border-gray-300 w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-gray-700 mb-1 block text-sm font-medium">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="border-gray-300 w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="is_featured"
                    checked={formData.is_featured}
                    onChange={handleInputChange}
                    className="border-gray-300 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-700 text-sm">Featured</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="is_new_arrival"
                    checked={formData.is_new_arrival}
                    onChange={handleInputChange}
                    className="border-gray-300 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-700 text-sm">New Arrival</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="is_best_seller"
                    checked={formData.is_best_seller}
                    onChange={handleInputChange}
                    className="border-gray-300 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-700 text-sm">Best Seller</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="is_on_sale"
                    checked={formData.is_on_sale}
                    onChange={handleInputChange}
                    className="border-gray-300 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-700 text-sm">On Sale</span>
                </label>
              </div>

              <div className="flex gap-3 border-t pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="bg-gray-100 text-gray-700 hover:bg-gray-200 flex-1 rounded-lg px-4 py-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving
                    ? 'Saving...'
                    : isEditing
                      ? 'Update Product'
                      : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
