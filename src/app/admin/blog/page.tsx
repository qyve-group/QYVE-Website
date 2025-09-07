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
        <h1 className="text-gray-900 text-3xl font-bold">Blog Admin</h1>
        <p className="text-gray-600 mt-2">
          Create and manage blog posts for your QYVE store.
        </p>
      </div>

      {message.text && (
        <div
          className={`mb-6 rounded-lg p-4 ${
            message.type === 'success'
              ? 'border border-green-200 bg-green-50 text-green-800'
              : 'border border-red-200 bg-red-50 text-red-800'
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
              className="text-gray-700 mb-2 block text-sm font-medium"
            >
              Title *
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              required
              className="border-gray-300 w-full rounded-lg border px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Enter blog post title"
            />
          </div>

          <div>
            <label
              htmlFor="slug"
              className="text-gray-700 mb-2 block text-sm font-medium"
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
              className="border-gray-300 w-full rounded-lg border px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="url-friendly-title"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="excerpt"
            className="text-gray-700 mb-2 block text-sm font-medium"
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
            className="border-gray-300 w-full rounded-lg border px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="Brief description of the blog post..."
          />
        </div>

        <div>
          <label
            htmlFor="content"
            className="text-gray-700 mb-2 block text-sm font-medium"
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
            className="border-gray-300 w-full rounded-lg border px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder={`Write your blog post content here...\n\nUse markdown formatting:\n# Main heading\n## Subheading\n\nRegular text with line breaks.`}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label
              htmlFor="author"
              className="text-gray-700 mb-2 block text-sm font-medium"
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
              className="border-gray-300 w-full rounded-lg border px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Author name"
            />
          </div>

          <div>
            <label
              htmlFor="featured_image"
              className="text-gray-700 mb-2 block text-sm font-medium"
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
              className="border-gray-300 w-full rounded-lg border px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
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
            className="border-gray-300 size-4 rounded text-primary focus:ring-primary"
          />
          <label
            htmlFor="published"
            className="text-gray-900 ml-2 block text-sm"
          >
            Publish immediately
          </label>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="hover:bg-primary-600 rounded-lg bg-primary px-6 py-3 font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
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
            className="border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg border px-6 py-3 font-medium transition-colors"
          >
            Clear Form
          </button>
        </div>
      </form>

      <div className="bg-gray-50 mt-12 rounded-lg p-6">
        <h3 className="text-gray-900 mb-3 text-lg font-semibold">
          Quick Tips:
        </h3>
        <ul className="text-gray-600 space-y-2 text-sm">
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
