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
          <p className="text-gray-300 mb-8">
            Keep up with all things QYVE, from upcoming launches to events.
            <br />
            Be part of the next big thing.
          </p>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-3 sm:flex-row sm:gap-2"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter Your Email"
              className="bg-gray-400/50 placeholder:text-gray-300 flex-1 rounded-full px-6 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white"
              required
            />
            <button
              type="submit"
              className="text-gray-900 hover:bg-gray-100 rounded-full bg-white px-8 py-3 font-semibold transition-colors"
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
