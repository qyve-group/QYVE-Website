import React, { useState } from 'react';

import { newsletter } from '@/data/content';
import { trackNewsletterSubscription } from '@/lib/gtag';

import ButtonPrimary from '../Button/ButtonPrimary';
import Input from '../Input/Input';

const Subscribe = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async () => {
    if (!email || !email.includes('@')) {
      alert('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    
    try {
      // Track newsletter subscription
      trackNewsletterSubscription(email, 'footer');
      
      // Here you would typically send the email to your backend/email service
      // For now, we'll just simulate success
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsSubscribed(true);
      setEmail('');
      
      // Reset success message after 3 seconds
      setTimeout(() => setIsSubscribed(false), 3000);
      
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      alert('Failed to subscribe. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="items-stretch justify-between space-y-5 rounded-2xl bg-white/10 p-5 md:flex md:space-y-0">
      <div className="basis-[52%] space-y-5">
        <h3 className="text-2xl font-medium">{newsletter.heading}</h3>
        <Input
          type="email"
          sizeClass="h-12 px-0 py-3"
          rounded="rounded-none"
          className="border-b-2 border-transparent border-b-neutral-400 bg-transparent placeholder:text-sm placeholder:text-neutral-200 focus:border-transparent"
          placeholder="Your email@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
        />
      </div>
      <div className="basis-[43%] space-y-7">
        <p className="text-neutral-400">{newsletter.description}</p>
        <ButtonPrimary 
          onClick={handleSubscribe}
          disabled={isLoading || isSubscribed}
        >
          {isSubscribed ? 'Subscribed!' : isLoading ? 'Subscribing...' : 'Subscribe'}
        </ButtonPrimary>
      </div>
    </div>
  );
};

export default Subscribe;
