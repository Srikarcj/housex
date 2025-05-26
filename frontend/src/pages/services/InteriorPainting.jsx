import React, { useState } from 'react';
import { Paintbrush, Sun, CheckCircle, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const InteriorPainting = () => {
  const [quote, setQuote] = useState(null);

  const benefits = [
    "Enhance Aesthetics & Ambiance",
    "Increase Home Value",
    "Protect Walls from Wear and Tear",
    "Improve Indoor Air Quality (with low-VOC paints)",
    "Reflect Personal Style"
  ];

  const processSteps = [
    {
      step: '1',
      title: 'Consultation & Planning',
      description: 'Understand your vision, assess the space, and choose colors/finishes.',
      icon: Sparkles,
    },
    {
      step: '2',
      title: 'Preparation',
      description: 'Cover furniture, protect floors, clean and repair surfaces.',
      icon: CheckCircle,
    },
    {
      step: '3',
      title: 'Painting',
      description: 'Apply primer and high-quality paint coats for a smooth finish.',
      icon: Paintbrush,
    },
    {
      step: '4',
      title: 'Clean-up & Review',
      description: 'Thorough cleaning, furniture arrangement, and final walkthrough.',
      icon: Sun,
    },
  ];

  const galleryImages = [
    'https://images.pexels.com/photos/1250655/pexels-photo-1250655.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/6431038/pexels-photo-6431038.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/14518731/pexels-photo-14518731.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/6431037/pexels-photo-6431037.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  ];

  const interiorPaintingQuotes = [
    { amount: '₹18,000', description: 'Basic Interior Painting Package - Single Room' },
    { amount: '₹28,000', description: 'Standard Interior Painting Package - Living & Dining' },
    { amount: '₹45,000', description: 'Premium Interior Painting Package - Full Apartment' },
    { amount: '₹22,000', description: 'Accent Wall Painting - Per Wall' },
    { amount: '₹10,000', description: 'Ceiling Painting - Per Room' },
  ];

  const generateFreshQuote = () => {
    const randomQuote = interiorPaintingQuotes[Math.floor(Math.random() * interiorPaintingQuotes.length)];
    setQuote(randomQuote);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">Interior Painting Services</h1>
          <p className="text-xl text-center text-blue-100 mb-8">Transform your indoor spaces with professional painting.</p>
          <div className="text-center">
            <button onClick={generateFreshQuote} className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-700 hover:bg-blue-800 transition-colors">
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
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Benefits of Interior Painting</h2>
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
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Our Interior Painting Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4">
                  {step.step}
                </div>
                <step.icon className="w-8 h-8 text-blue-600 mb-4" />
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
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Gallery: Interior Painting Projects</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {galleryImages.map((image, index) => (
              <div key={index} className="rounded-lg overflow-hidden shadow-lg">
                <img src={image} alt={`Interior Painting Project ${index + 1}`} className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-indigo-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Refresh Your Interiors?</h2>
          <p className="text-xl text-indigo-200 mb-8">Contact us today for a consultation and transform your living space.</p>
          <Link to="/contact" className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-gray-100 transition-colors">
            Contact Us
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default InteriorPainting; 