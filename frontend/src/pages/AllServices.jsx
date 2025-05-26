import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Paintbrush, Home, Sparkles, Hammer, Droplets, Wrench, Palette } from 'lucide-react';

const AllServices = () => {
  const services = [
    {
      id: 1,
      name: 'Interior Painting',
      description: 'Transform your living spaces with our professional interior painting services.',
      image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop&q=60',
      link: '/services/interior-painting',
      icon: Paintbrush
    },
    {
      id: 2,
      name: 'Exterior Painting',
      description: 'Protect and beautify your home\'s exterior with our comprehensive painting services.',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=60',
      link: '/services/exterior-painting',
      icon: Home
    },
    {
      id: 3,
      name: 'Cabinet Refinishing',
      description: 'Give your kitchen a fresh look with our cabinet refinishing service.',
      image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&auto=format&fit=crop&q=60',
      link: '/services/cabinet-refinishing',
      icon: Sparkles
    },
    {
      id: 4,
      name: 'Drywall Installation',
      description: 'Professional drywall installation and repair services for your home or office.',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop&q=60',
      link: '/services/drywall',
      icon: Hammer
    },
    {
      id: 5,
      name: 'Water Damage Repair',
      description: 'Expert water damage restoration and repair services.',
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=60',
      link: '/services/water-damage',
      icon: Droplets
    },
    {
      id: 6,
      name: 'Plumbing Services',
      description: 'Comprehensive plumbing solutions for residential and commercial properties.',
      image: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=800&auto=format&fit=crop&q=60',
      link: '/services/plumbing',
      icon: Wrench
    },
    {
      id: 7,
      name: 'Color Consultation',
      description: 'Professional color consultation to help you choose the perfect palette.',
      image: 'https://images.unsplash.com/photo-1615529162924-f8605388461e?w=800&auto=format&fit=crop&q=60',
      link: '/services/color-consultation',
      icon: Palette
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h1>
          <p className="text-xl text-gray-600">Browse through our comprehensive range of services.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <Link to={service.link} key={service.id} className="block">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full">
                <div className="relative h-48">
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-2">
                    <service.icon className="w-6 h-6 text-indigo-600 mr-3" />
                    <h3 className="text-xl font-semibold text-gray-900">{service.name}</h3>
                  </div>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <div className="text-indigo-600 font-semibold">Learn More <ArrowRight className="inline-block ml-1 w-4 h-4" /></div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllServices; 