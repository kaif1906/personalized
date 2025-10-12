"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react'; // 🟢 Import useEffect

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  // 🟢 State to hold the current year
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear()); 

  // 🟢 Use useEffect to set the year only on the client (though in this case
  // the initial state is already correct and stable, this is the safest pattern
  // if you were dealing with other changing values like Math.random or window).
  // For new Date().getFullYear(), setting the state immediately is acceptable 
  // since the year won't change during the single render cycle. 
  // We keep the state for clarity and extensibility.

  const handleSubscribe = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setSubscribeStatus('error');
      setTimeout(() => setSubscribeStatus(''), 3000);
      return;
    }

    try {
      setSubscribeStatus('subscribing');
      
      // Determine the base URL based on environment
      const baseUrl = process.env.NODE_ENV === 'production' 
        ? 'https://mern-workshop.onrender.com' 
        : 'http://localhost:5000';
      
      // Call the backend API
      const response = await fetch(`${baseUrl}/newsletter/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setSubscribeStatus('success');
        setStatusMessage(data.message);
        setEmail('');
        
        // Reset success message after 5 seconds
        setTimeout(() => {
          setSubscribeStatus('');
          setStatusMessage('');
        }, 5000);
      } else {
        setSubscribeStatus('error');
        setStatusMessage(data.message);
        
        // Reset error message after 5 seconds
        setTimeout(() => {
          setSubscribeStatus('');
          setStatusMessage('');
        }, 5000);
      }
      
    } catch (error) {
      console.error('Subscription error:', error);
      setSubscribeStatus('error');
      setStatusMessage('Network error. Please check your connection and try again.');
      
      // Reset error message after 5 seconds
      setTimeout(() => {
        setSubscribeStatus('');
        setStatusMessage('');
      }, 5000);
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
                suppressHydrationWarning
              />
              <button
                type="submit"
                className={`w-full px-4 py-2 rounded-lg text-white transition-colors ${
                  subscribeStatus === 'subscribing'
                    ? 'bg-gray-400'
                    : 'bg-green-500 hover:bg-green-600'
                }`}
                disabled={subscribeStatus === 'subscribing'}
                suppressHydrationWarning
              >
                {subscribeStatus === 'subscribing' ? 'Subscribing...' : 'Subscribe'}
              </button>
              {subscribeStatus === 'success' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-green-700 text-sm font-medium">
                    🎉 {statusMessage || 'Welcome to RecipeAI! You\'re now subscribed to our newsletter.'}
                  </p>
                </div>
              )}
              {subscribeStatus === 'error' && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-700 text-sm font-medium">
                    😔 {statusMessage || 'Oops! Something went wrong. Please check your email address and try again.'}
                  </p>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-center text-gray-500 text-sm">
            {/* 🟢 Use the stable state variable instead of calling new Date() */}
            © {currentYear} RecipeAI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}