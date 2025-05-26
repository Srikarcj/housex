import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, 
  ArrowRight, Heart, Clock, Shield, Award, Users, Building2,
  Paintbrush, Wrench, Hammer, Ruler, FileText, HelpCircle
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-800 text-white w-full relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500 rounded-full filter blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-500 rounded-full filter blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
      </div>

      {/* Main footer content */}
      <div className="relative w-full px-4 py-12">
        {/* Top section with newsletter */}
        <div className="max-w-7xl mx-auto mb-12">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2">Stay Updated</h3>
                <p className="text-gray-400">Subscribe to our newsletter for the latest updates, exclusive offers, and home improvement tips.</p>
              </div>
              <div className="flex-1 w-full md:w-auto">
                <form className="flex gap-4">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-3 rounded-lg bg-gray-700/50 border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-white placeholder-gray-400 transition-all"
                  />
                  <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors flex items-center gap-2">
                    Subscribe
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="max-w-7xl mx-auto mb-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">10K+</p>
                  <p className="text-gray-400 text-sm">Happy Clients</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">500+</p>
                  <p className="text-gray-400 text-sm">Projects Completed</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-purple-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">50+</p>
                  <p className="text-gray-400 text-sm">Cities Covered</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-600/20 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-yellow-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">100%</p>
                  <p className="text-gray-400 text-sm">Satisfaction Rate</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main grid */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-xl font-bold">H</span>
              </div>
              <span className="text-2xl font-bold">HouseX</span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Your trusted partner in home improvement. We connect you with professional painters and builders for quality projects.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-700/50 hover:bg-blue-600 flex items-center justify-center transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-700/50 hover:bg-blue-600 flex items-center justify-center transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-700/50 hover:bg-blue-600 flex items-center justify-center transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-700/50 hover:bg-blue-600 flex items-center justify-center transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-6 relative inline-block">
              Our Services
              <span className="absolute -bottom-2 left-0 w-12 h-0.5 bg-blue-600"></span>
            </h4>
            <ul className="space-y-4">
              <li>
                <Link to="/services/painting" className="text-gray-400 hover:text-white flex items-center gap-2 transition-colors group">
                  <Paintbrush className="w-4 h-4 text-blue-500" />
                  Interior Painting
                </Link>
              </li>
              <li>
                <Link to="/services/exterior" className="text-gray-400 hover:text-white flex items-center gap-2 transition-colors group">
                  <Paintbrush className="w-4 h-4 text-blue-500" />
                  Exterior Painting
                </Link>
              </li>
              <li>
                <Link to="/services/renovation" className="text-gray-400 hover:text-white flex items-center gap-2 transition-colors group">
                  <Hammer className="w-4 h-4 text-blue-500" />
                  Home Renovation
                </Link>
              </li>
              <li>
                <Link to="/services/repairs" className="text-gray-400 hover:text-white flex items-center gap-2 transition-colors group">
                  <Wrench className="w-4 h-4 text-blue-500" />
                  Repairs & Maintenance
                </Link>
              </li>
              <li>
                <Link to="/services/design" className="text-gray-400 hover:text-white flex items-center gap-2 transition-colors group">
                  <Ruler className="w-4 h-4 text-blue-500" />
                  Interior Design
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6 relative inline-block">
              Quick Links
              <span className="absolute -bottom-2 left-0 w-12 h-0.5 bg-blue-600"></span>
            </h4>
            <ul className="space-y-4">
              <li>
                <Link to="/search" className="text-gray-400 hover:text-white flex items-center gap-2 transition-colors group">
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Find Professionals
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-400 hover:text-white flex items-center gap-2 transition-colors group">
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Our Services
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white flex items-center gap-2 transition-colors group">
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-400 hover:text-white flex items-center gap-2 transition-colors group">
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Blog & Tips
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-gray-400 hover:text-white flex items-center gap-2 transition-colors group">
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 className="text-lg font-semibold mb-6 relative inline-block">
              Contact & Support
              <span className="absolute -bottom-2 left-0 w-12 h-0.5 bg-blue-600"></span>
            </h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
                <Mail className="w-5 h-5 text-blue-500" />
                support@housex.com
              </li>
              <li className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
                <Phone className="w-5 h-5 text-blue-500" />
                (555) 123-4567
              </li>
              <li className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
                <MapPin className="w-5 h-5 text-blue-500" />
                123 Build Street, City, Country
              </li>
              <li className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
                <Clock className="w-5 h-5 text-blue-500" />
                Mon-Fri: 9AM-6PM
              </li>
              <li className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
                <HelpCircle className="w-5 h-5 text-blue-500" />
                <Link to="/faq">FAQ & Support</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-700/50">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} HouseX. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-sm">
              <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link to="/sitemap" className="text-gray-400 hover:text-white transition-colors">
                Sitemap
              </Link>
              <div className="flex items-center gap-1 text-gray-400">
                Made with <Heart className="w-4 h-4 text-red-500" /> by HouseX Team
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 