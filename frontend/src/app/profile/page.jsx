// app/profile/page.js
"use client"; // This line is crucial for using client-side hooks like useState and useEffect

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, Edit3, Save, X } from 'lucide-react';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  // Date formatting utility
  const formatRegistrationDate = (dateString) => {
    if (!dateString) return 'Unknown';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Unknown';
    }
  };

  useEffect(() => {
    // 1. Check if we're running in the browser
    if (typeof window !== 'undefined') {
      try {
        // Retrieve the user JSON string from localStorage
        const userJSON = localStorage.getItem('user');
        
        // Retrieve the token to confirm login status
        const token = localStorage.getItem('token');
        
        if (!token || !userJSON) {
          // If no token or user data, redirect to login
          router.push('/login');
          return;
        }

        // 2. Parse the JSON string back into a JavaScript object
        const userData = JSON.parse(userJSON);
        
        // 3. Update the state with the actual user data
        setUser(userData);
        
        // 4. Initialize form data with current user data
        setFormData({
          name: userData.name || '',
          email: userData.email || ''
        });
        
      } catch (error) {
        console.error("Error retrieving user data:", error);
        // Handle cases where localStorage might be corrupted or inaccessible
        router.push('/login'); 
      } finally {
        setIsLoading(false);
      }
    }
  }, [router]);

  // Form handling functions
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditClick = () => {
    setIsEditing(true);
    // Reset form data to current user data
    setFormData({
      name: user.name || '',
      email: user.email || ''
    });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // Reset form data to original user data
    setFormData({
      name: user.name || '',
      email: user.email || ''
    });
  };

  const handleSaveProfile = async () => {
    // Basic validation
    if (!formData.name.trim() || !formData.email.trim()) {
      alert('Please fill in all fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('Please enter a valid email address');
      return;
    }

    setIsSaving(true);

    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Session expired. Please login again.');
        router.push('/login');
        return;
      }

      // Prepare update data
      const updateData = {
        name: formData.name.trim(),
        email: formData.email.trim()
      };

      // Call backend API to update user profile
      const baseUrl = process.env.NODE_ENV === 'production' 
        ? process.env.NEXT_PUBLIC_API_URL 
        : 'http://localhost:5000';
      const response = await fetch(`${baseUrl}/user/update/${user._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }

      const updatedUserData = await response.json();
      
      // Update user data
      const updatedUser = {
        ...user,
        name: updatedUserData.name,
        email: updatedUserData.email
      };

      // Update localStorage with new data
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Update state
      setUser(updatedUser);
      setIsEditing(false);
      
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert(`Failed to update profile: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="pt-20 max-w-4xl mx-auto p-6 text-center text-xl">
        Loading profile data...
      </div>
    );
  }

  // Fallback state if user data is missing (should be prevented by the redirect above)
  if (!user) {
    return (
      <div className="pt-20 max-w-4xl mx-auto p-6 text-center text-xl text-red-600">
        Error: Could not load user information.
      </div>
    );
  }

  // --- Display the actual user data ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-green-600 to-green-700 text-white py-16">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            {/* Profile Avatar */}
            <div className="mb-6">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full mx-auto flex items-center justify-center text-4xl font-bold text-white border-4 border-white/30"
              >
                {user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
              </motion.div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Welcome back, {user.name.split(' ')[0]}! 👋
      </h1>
            <p className="text-xl text-green-100 max-w-2xl mx-auto">
              Manage your account settings and personalize your recipe experience
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Profile Information Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              {/* Card Header */}
              <div className="bg-gradient-to-r from-green-500 to-green-600 px-8 py-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Profile Information</h2>
                  </div>
                  {!isEditing && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleEditClick}
                      className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                      <span>Edit</span>
                    </motion.button>
                  )}
                </div>
              </div>

              {/* Card Content */}
              <div className="p-8">
                {!isEditing ? (
                  // Display Mode
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-gray-600">
                          <User className="w-5 h-5" />
                          <span className="font-medium">Full Name</span>
                        </div>
                        <p className="text-xl font-semibold text-gray-900 pl-7">
                          {user.name || 'Not provided'}
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-gray-600">
                          <Mail className="w-5 h-5" />
                          <span className="font-medium">Email Address</span>
                        </div>
                        <p className="text-xl font-semibold text-gray-900 pl-7">
                          {user.email || 'Not provided'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="border-t pt-6">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Calendar className="w-5 h-5" />
                        <span className="font-medium">Member Since</span>
                      </div>
                      <p className="text-lg text-gray-700 pl-7 mt-1">
                        {formatRegistrationDate(user.createdAt)}
                      </p>
                    </div>
                  </div>
                ) : (
                  // Edit Mode
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                          placeholder="Enter your full name"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                          placeholder="Enter your email address"
                        />
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleSaveProfile}
                        disabled={isSaving}
                        className="flex items-center justify-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                      >
                        {isSaving ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span>Saving...</span>
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            <span>Save Changes</span>
                          </>
                        )}
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleCancelEdit}
                        disabled={isSaving}
                        className="flex items-center justify-center space-x-2 bg-gray-500 text-white px-6 py-3 rounded-xl hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                      >
                        <X className="w-4 h-4" />
                        <span>Cancel</span>
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
      </div>
    </div>
  );
}