import React, { useState } from 'react';
import { Paintbrush, Sparkles, CheckCircle, Sun, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const CabinetRefinishing = () => {
  const [quote, setQuote] = useState(null);

  const benefits = [
    "Cost-Effective Kitchen Update",
    "Faster than Full Replacement",
    "Wide Range of Color Options",
    "Durable and Long-Lasting Finish",
    "Minimal Disruption to Your Home"
  ];

  const processSteps = [
    {
      step: '1',
      title: 'Consultation & Assessment',
      description: 'Evaluate cabinet condition and discuss desired look and finish.',
      icon: Sparkles,
    },
    {
      step: '2',
      title: 'Preparation & Cleaning',
      description: 'Remove doors/hardware, deep clean, and prepare surfaces for refinishing.',
      icon: CheckCircle,
    },
    {
      step: '3',
      title: 'Refinishing',
      description: 'Apply primer and multiple coats of high-quality, durable finish.',
      icon: Paintbrush,
    },
    {
      step: '4',
      title: 'Reassembly & Final Touch-ups',
      description: 'Reinstall doors/hardware, make any necessary touch-ups, and clean the area.',
      icon: Sun,
    },
  ];

  const galleryImages = [
    'https://images.pexels.com/photos/3990595/pexels-photo-3990595.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/209315/pexels-photo-209315.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/7641780/pexels-photo-7641780.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/1250655/pexels-photo-1250655.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  ];

  const cabinetRefinishingQuotes = [
    { amount: '₹15,000', description: 'Basic Cabinet Refinishing - Small Kitchen' },
    { amount: '₹25,000', description: 'Standard Cabinet Refinishing - Medium Kitchen' },
    { amount: '₹40,000', description: 'Premium Cabinet Refinishing - Large Kitchen' },
    { amount: '₹10,000', description: 'Bathroom Vanity Refinishing' },
    { amount: '₹30,000', description: 'Custom Color Cabinet Refinishing' },
  ];

  const generateFreshQuote = () => {
    const randomQuote = cabinetRefinishingQuotes[Math.floor(Math.random() * cabinetRefinishingQuotes.length)];
    setQuote(randomQuote);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-yellow-600 to-orange-700 text-white py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">Cabinet Refinishing Services</h1>
          <p className="text-xl text-center text-yellow-100 mb-8">Give your kitchen or bathroom cabinets a fresh, new look.</p>
          <div className="text-center">
            <button onClick={generateFreshQuote} className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-yellow-700 hover:bg-yellow-800 transition-colors">
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
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Benefits of Cabinet Refinishing</h2>
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
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Our Cabinet Refinishing Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-yellow-600 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4">
                  {step.step}
                </div>
                <step.icon className="w-8 h-8 text-yellow-600 mb-4" />
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
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Gallery: Cabinet Refinishing Projects</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {galleryImages.map((image, index) => (
              <div key={index} className="rounded-lg overflow-hidden shadow-lg">
                <img src={image} alt={`Cabinet Refinishing Project ${index + 1}`} className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-orange-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Cabinets?</h2>
          <p className="text-xl text-orange-100 mb-8">Contact us today for a consultation and revitalize your space.</p>
          <Link to="/contact" className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-orange-700 bg-white hover:bg-gray-100 transition-colors">
            Contact Us
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CabinetRefinishing; 