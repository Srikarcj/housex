import React, { useState } from 'react';
import { Home, Shield, Sun, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const ExteriorPainting = () => {
  const [quote, setQuote] = useState(null);

  const benefits = [
    "Enhance Curb Appeal",
    "Protect Against Weather Damage",
    "Increase Property Value",
    "Prevent Wood Rot and Insect Infestation",
    "Improve Energy Efficiency (with reflective paints)"
  ];

  const processSteps = [
    {
      step: '1',
      title: 'Inspection & Preparation',
      description: 'Assess the exterior, clean surfaces, and make necessary repairs.',
      icon: CheckCircle,
    },
    {
      step: '2',
      title: 'Priming',
      description: 'Apply a high-quality primer for better adhesion and durability.',
      icon: Sparkles,
    },
    {
      step: '3',
      title: 'Painting',
      description: 'Apply premium exterior paint for a durable and beautiful finish.',
      icon: Home,
    },
    {
      step: '4',
      title: 'Final Inspection & Clean-up',
      description: 'Ensure thorough coverage, clean the site, and conduct a final walkthrough.',
      icon: Sun,
    },
  ];

  const galleryImages = [
    'https://images.pexels.com/photos/1390527/pexels-photo-1390527.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/1390532/pexels-photo-1390532.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/1390535/pexels-photo-1390535.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/1390538/pexels-photo-1390538.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  ];

  const exteriorPaintingQuotes = [
    { amount: '₹20,000', description: 'Basic Exterior Painting Package - Small Home' },
    { amount: '₹35,000', description: 'Standard Exterior Painting Package - Medium Home' },
    { amount: '₹60,000', description: 'Premium Exterior Painting Package - Large Home' },
    { amount: '₹15,000', description: 'Boundary Wall Painting - Per Meter' },
    { amount: '₹40,000', description: 'Weatherproof Coating - Per Square Foot' },
  ];

  const generateFreshQuote = () => {
    const randomQuote = exteriorPaintingQuotes[Math.floor(Math.random() * exteriorPaintingQuotes.length)];
    setQuote(randomQuote);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-green-600 to-teal-700 text-white py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">Exterior Painting Services</h1>
          <p className="text-xl text-center text-green-100 mb-8">Protect and beautify your home\'s exterior with professional painting.</p>
          <div className="text-center">
            <button onClick={generateFreshQuote} className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-700 hover:bg-green-800 transition-colors">
              Get a Free Quote
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
             {quote && (
              <div className="mt-8 text-xl font-semibold text-white">
                Your Fresh Quote: {quote.amount} - {quote.description}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Benefits of Exterior Painting</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg flex items-center space-x-4">
                <CheckCircle className="w-6 h-6 text-green-500" />
                <p className="text-gray-700 text-lg">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Process Section */}
      <div className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Our Exterior Painting Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4">
                  {step.step}
                </div>
                <step.icon className="w-8 h-8 text-green-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{step.title}</h3>
                <p className="text-gray-700">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gallery Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Gallery: Exterior Painting Projects</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {galleryImages.map((image, index) => (
              <div key={index} className="rounded-lg overflow-hidden shadow-lg">
                <img src={image} alt={`Exterior Painting Project ${index + 1}`} className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-teal-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Enhance Your Home's Exterior?</h2>
          <p className="text-xl text-teal-100 mb-8">Contact us today for a consultation and protect your investment.</p>
          <Link to="/contact" className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-teal-700 bg-white hover:bg-gray-100 transition-colors">
            Contact Us
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ExteriorPainting; 