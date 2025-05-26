import React from 'react';
import { Shield, CheckCircle, FileCheck, Award, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const LicensedInsured = () => {
  const navigate = useNavigate();

  const certifications = [
    {
      title: "RERA Registration",
      description: "Fully registered under Real Estate Regulatory Authority for all our services",
      icon: FileCheck,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      image: "https://images.pexels.com/photos/1707828/pexels-photo-1707828.jpeg"
    },
    {
      title: "Insurance Coverage",
      description: "Comprehensive insurance coverage as per Indian regulations",
      icon: Shield,
      color: "text-green-600",
      bgColor: "bg-green-100",
      image: "https://images.pexels.com/photos/1181696/pexels-photo-1181696.jpeg"
    },
    {
      title: "Safety Certifications",
      description: "ISO and Indian safety certifications",
      icon: Award,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      image: "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg"
    }
  ];

  const benefits = [
    "RERA compliant services",
    "Worker's compensation insurance",
    "Property damage protection",
    "Professional indemnity insurance",
    "Regular safety audits",
    "Licensed professionals only"
  ];

  const handleGetStarted = () => {
    toast.success('Successfully selected Licensed & Insured service. Redirecting to sign up...');
    setTimeout(() => {
      navigate('/sign-up');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative bg-blue-600 text-white py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 opacity-90"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Licensed & Insured</h1>
              <p className="text-xl text-blue-100 mb-8">
                Your peace of mind is our priority. We maintain the highest standards of licensing and insurance coverage.
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <Shield className="w-6 h-6 text-blue-300" />
                  <span className="ml-2 text-lg">100% Protected</span>
                </div>
              </div>
            </div>
            <div className="flex-1">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2">100%</div>
                    <div className="text-blue-100">Licensed Team</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2">₹2Cr+</div>
                    <div className="text-blue-100">Insurance Coverage</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2">24/7</div>
                    <div className="text-blue-100">Support</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2">0</div>
                    <div className="text-blue-100">Incidents</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Certifications Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {certifications.map((cert, index) => (
            <div key={index} className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100">
              <div className="h-48 overflow-hidden">
                <img
                  src={cert.image}
                  alt={cert.title}
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <div className={`w-12 h-12 ${cert.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                  <cert.icon className={`w-6 h-6 ${cert.color}`} />
                </div>
                <h3 className="text-xl font-semibold mb-2">{cert.title}</h3>
                <p className="text-gray-600">{cert.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Your Protection is Our Priority</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-3 bg-white p-4 rounded-lg shadow-sm">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-gray-700">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Work with Licensed & Insured Professionals
            </h2>
            <p className="text-xl text-indigo-100 mb-8">
              Experience peace of mind with our fully licensed and insured team
            </p>
            <button
              onClick={handleGetStarted}
              className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
            >
              Get Started Today
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LicensedInsured; 