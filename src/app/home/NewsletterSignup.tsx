'use client';

import { useState } from 'react';

const NewsletterSignup = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Newsletter signup:', email);
    setEmail('');
  };

  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl rounded-3xl bg-[#1a2942] px-8 py-12 text-center md:px-12">
          <h2 className="mb-4 text-3xl font-bold italic text-white md:text-4xl">
            JOIN THE COMMUNITY
          </h2>
          <p className="mb-8 text-gray-300">
            Keep up with all things QYVE, from upcoming launches to events.
            <br />
            Be part of the next big thing.
          </p>

          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter Your Email"
              className="flex-1 rounded-full bg-gray-400/50 px-6 py-3 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white"
              required
            />
            <button
              type="submit"
              className="rounded-full bg-white px-8 py-3 font-semibold text-gray-900 transition-colors hover:bg-gray-100"
            >
              SIGN UP
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSignup;
