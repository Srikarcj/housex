import React from 'react';
import { Award, Clock, CheckCircle, TrendingUp, Star } from 'lucide-react';

const ProjectsCompleted = () => {
  const projects = [
    {
      title: "Modern Home Renovation",
      type: "Renovation",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      description: "Complete home transformation with modern design elements",
      duration: "3 months",
      rating: 5,
      completed: "March 2024"
    },
    {
      title: "Interior Painting Project",
      type: "Painting",
      image: "https://images.unsplash.com/photo-1615529162924-f8605388461e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      description: "Professional interior painting with premium materials",
      duration: "2 weeks",
      rating: 5,
      completed: "February 2024"
    },
    // Add more projects as needed
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative bg-green-600 text-white py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-800 opacity-90"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">500+ Projects Completed</h1>
              <p className="text-xl text-green-100 mb-8">
                Delivering excellence in every project, from small renovations to complete home transformations.
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                  ))}
                </div>
                <span className="text-lg font-semibold">Perfect Project Delivery</span>
              </div>
            </div>
            <div className="flex-1">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2">500+</div>
                    <div className="text-green-100">Projects</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2">100%</div>
                    <div className="text-green-100">On-time Delivery</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2">15+</div>
                    <div className="text-green-100">Project Types</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2">50+</div>
                    <div className="text-green-100">Expert Team</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Project Types Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Timely Delivery</h3>
            <p className="text-gray-600">
              We complete every project on schedule without compromising quality.
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <CheckCircle className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Quality Assured</h3>
            <p className="text-gray-600">
              Every project undergoes rigorous quality checks before delivery.
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Continuous Improvement</h3>
            <p className="text-gray-600">
              We constantly evolve our processes to deliver better results.
            </p>
          </div>
        </div>
      </div>

      {/* Featured Projects Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-green-600">{project.type}</span>
                    <div className="flex items-center">
                      {[...Array(project.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                  <p className="text-gray-600 mb-4">{project.description}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Duration: {project.duration}</span>
                    <span>Completed: {project.completed}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-green-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Start Your Project Today</h2>
          <p className="text-xl text-green-100 mb-8">
            Let's create something amazing together
          </p>
          <button className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors">
            Get a Free Quote
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectsCompleted; 