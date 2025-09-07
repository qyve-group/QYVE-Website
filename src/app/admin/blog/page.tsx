'use client';

import { useState } from 'react';
import { supabase } from '@/libs/supabaseClient';

interface BlogFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  featured_image: string;
  published: boolean;
}

const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

const AdminBlogPage = () => {
  const [formData, setFormData] = useState<BlogFormData>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    author: 'QYVE Team',
    featured_image: '',
    published: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleTitleChange = (title: string) => {
    const slug = generateSlug(title);
    setFormData((prev) => ({ ...prev, title, slug }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      const { error } = await supabase.from('blog_posts').insert([formData]);
      if (error) throw error;

      setMessage({ type: 'success', text: 'Blog post created successfully!' });
      setFormData({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        author: 'QYVE Team',
        featured_image: '',
        published: false,
      });
    } catch (error) {
      setMessage({ type: 'error', text: `Error: ${(error as Error).message}` });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container max-w-4xl pb-20 pt-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Blog Admin</h1>
        <p className="mt-2 text-gray-600">
          Create and manage blog posts for your QYVE store.
        </p>
      </div>

      {message.text && (
        <div
          className={`mb-6 rounded-lg p-4 ${
            message.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Title *
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Enter blog post title"
            />
          </div>

          <div>
            <label
              htmlFor="slug"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Slug *
            </label>
            <input
              type="text"
              id="slug"
              value={formData.slug}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, slug: e.target.value }))
              }
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="url-friendly-title"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="excerpt"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Excerpt *
          </label>
          <textarea
            id="excerpt"
            value={formData.excerpt}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, excerpt: e.target.value }))
            }
            required
            rows={3}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="Brief description of the blog post..."
          />
        </div>

        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Content *
          </label>
          <textarea
            id="content"
            value={formData.content}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, content: e.target.value }))
            }
            required
            rows={15}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder={`Write your blog post content here...\n\nUse markdown formatting:\n# Main heading\n## Subheading\n\nRegular text with line breaks.`}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label
              htmlFor="author"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Author
            </label>
            <input
              type="text"
              id="author"
              value={formData.author}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, author: e.target.value }))
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Author name"
            />
          </div>

          <div>
            <label
              htmlFor="featured_image"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Featured Image URL
            </label>
            <input
              type="url"
              id="featured_image"
              value={formData.featured_image}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  featured_image: e.target.value,
                }))
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="published"
            checked={formData.published}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, published: e.target.checked }))
            }
            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
          />
          <label
            htmlFor="published"
            className="ml-2 block text-sm text-gray-900"
          >
            Publish immediately
          </label>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-primary px-6 py-3 text-white font-medium transition-colors hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Creating...' : 'Create Blog Post'}
          </button>

          <button
            type="button"
            onClick={() =>
              setFormData({
                title: '',
                slug: '',
                excerpt: '',
                content: '',
                author: 'QYVE Team',
                featured_image: '',
                published: false,
              })
            }
            className="rounded-lg border border-gray-300 px-6 py-3 text-gray-700 font-medium transition-colors hover:bg-gray-50"
          >
            Clear Form
          </button>
        </div>
      </form>

      <div className="mt-12 rounded-lg bg-gray-50 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Quick Tips:
        </h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>
            • Use <strong>markdown formatting</strong> in content: # for
            headings, ## for subheadings
          </li>
          <li>
            • The <strong>slug</strong> will be auto-generated from the title,
            but you can customize it
          </li>
          <li>
            • Add your <strong>Supabase image URLs</strong> for featured images
          </li>
          <li>
            • Save as <strong>draft</strong> (unpublished) to review before
            going live
          </li>
          <li>
            • Blog posts appear on <strong>/blog</strong> when published
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AdminBlogPage;
