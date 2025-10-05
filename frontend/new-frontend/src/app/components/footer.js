"use client";
import Link from 'next/link';
import { useState } from 'react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState('');

  const handleSubscribe = async (e) => {
    e.preventDefault();
    
    if (!email) {
      return;
    }

    try {
      setSubscribeStatus('subscribing');
      // Add your newsletter subscription logic here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      setSubscribeStatus('success');
      setEmail('');
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setSubscribeStatus('');
      }, 3000);
      
    } catch (error) {
      console.error('Subscription error:', error);
      setSubscribeStatus('error');
      
      // Reset error message after 3 seconds
      setTimeout(() => {
        setSubscribeStatus('');
      }, 3000);
    }
  };

  return (
    <footer className="bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-green-600">RecipeAI</span>
            </Link>
            <p className="mt-4 text-gray-600">
              Discover AI-powered recipe recommendations tailored just for you.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-gray-900 font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-600 hover:text-green-600 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/recommender" className="text-gray-600 hover:text-green-600 transition-colors">
                  Get Recommendations
                </Link>
              </li>
              <li>
                <Link href="/AboutUs" className="text-gray-600 hover:text-green-600 transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="col-span-1">
            <h3 className="text-gray-900 font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/PrivacyPolicy" className="text-gray-600 hover:text-green-600 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/TermsOfService" className="text-gray-600 hover:text-green-600 transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-span-1">
            <h3 className="text-gray-900 font-semibold mb-4">Stay Updated</h3>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-500"
                required
              />
              <button
                type="submit"
                className={`w-full px-4 py-2 rounded-lg text-white transition-colors ${
                  subscribeStatus === 'subscribing'
                    ? 'bg-gray-400'
                    : 'bg-green-500 hover:bg-green-600'
                }`}
                disabled={subscribeStatus === 'subscribing'}
              >
                {subscribeStatus === 'subscribing' ? 'Subscribing...' : 'Subscribe'}
              </button>
              {subscribeStatus === 'success' && (
                <p className="text-green-500 text-sm">Successfully subscribed!</p>
              )}
              {subscribeStatus === 'error' && (
                <p className="text-red-500 text-sm">Something went wrong. Please try again.</p>
              )}
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} RecipeAI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}