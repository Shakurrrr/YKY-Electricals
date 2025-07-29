import React from 'react';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">YKY</span>
              </div>
              <span className="text-xl font-bold">YKY Electricals</span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Professional electrical installation and repair services. We provide reliable, 
              safe, and efficient electrical solutions for residential and commercial properties.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone size={16} className="text-orange-500" />
                <span className="text-gray-300">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={16} className="text-orange-500" />
                <span className="text-gray-300">info@ykyelectricals.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin size={16} className="text-orange-500" />
                <span className="text-gray-300">123 Main Street, City, State 12345</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2">
              <a href="/" className="block text-gray-300 hover:text-white transition-colors duration-200">
                Home
              </a>
              <a href="/contact" className="block text-gray-300 hover:text-white transition-colors duration-200">
                Contact
              </a>
              <a href="/book-service" className="block text-gray-300 hover:text-white transition-colors duration-200">
                Book Service
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            &copy; 2025 YKY Electricals. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;