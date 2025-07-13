import { Button } from "@/components/ui/button";
import {
  ArrowUp,
  Facebook,
  Github,
  Heart,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Shield,
  Twitter
} from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

const Footer: React.FC = () => {
  const navigate = useNavigate();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Practo Exam</h3>
                <p className="text-gray-400 text-sm">Secure Online Platform</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Empowering educators and students with secure, AI-powered online examination solutions. 
              Trusted by institutions worldwide for reliable and efficient assessment delivery.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://github.com/nayan-kr-bera"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-700 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-all duration-200 group"
              >
                <Github className="w-5 h-5 text-gray-300 group-hover:text-white" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-700 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-all duration-200 group"
              >
                <Twitter className="w-5 h-5 text-gray-300 group-hover:text-white" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-700 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-all duration-200 group"
              >
                <Linkedin className="w-5 h-5 text-gray-300 group-hover:text-white" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-700 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-all duration-200 group"
              >
                <Facebook className="w-5 h-5 text-gray-300 group-hover:text-white" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => navigate("/")}
                  className="text-gray-300 hover:text-white transition-colors duration-200 text-left"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/signup")}
                  className="text-gray-300 hover:text-white transition-colors duration-200 text-left"
                >
                  Sign Up
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/signin")}
                  className="text-gray-300 hover:text-white transition-colors duration-200 text-left"
                >
                  Sign In
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/feedback")}
                  className="text-gray-300 hover:text-white transition-colors duration-200 text-left"
                >
                  Feedback
                </button>
              </li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">Features</h4>
            <ul className="space-y-3">
              <li className="text-gray-300 hover:text-white transition-colors duration-200 cursor-pointer">
                Secure Exam Environment
              </li>
              <li className="text-gray-300 hover:text-white transition-colors duration-200 cursor-pointer">
                Live Video Proctoring
              </li>
              <li className="text-gray-300 hover:text-white transition-colors duration-200 cursor-pointer">
                Instant Results
              </li>
              <li className="text-gray-300 hover:text-white transition-colors duration-200 cursor-pointer">
                Multi-Device Support
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">Contact Us</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-blue-400" />
                <span className="text-gray-300">support@practoexam.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-blue-400" />
                <span className="text-gray-300">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-blue-400" />
                <span className="text-gray-300">123 Tech Street, Digital City</span>
              </div>
            </div>
            
            {/* Newsletter Signup */}
            <div className="mt-6">
              <h5 className="text-sm font-medium text-white mb-3">Stay Updated</h5>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                />
                <Button
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <span>© {currentYear} Practo Exam Platform. Made with</span>
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              <span>by Nayan Kr Bera & Avik Mandal</span>
            </div>
            
            <div className="flex items-center gap-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Cookie Policy
              </a>
            </div>

            {/* Scroll to Top Button */}
            <button
              onClick={scrollToTop}
              className="w-10 h-10 bg-gray-700 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-all duration-200 group"
            >
              <ArrowUp className="w-5 h-5 text-gray-300 group-hover:text-white" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 