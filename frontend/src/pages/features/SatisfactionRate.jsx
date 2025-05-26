import React from 'react';
import { Star, ThumbsUp, Award, Heart } from 'lucide-react';

const SatisfactionRate = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Homeowner",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      rating: 5,
      comment: "The team exceeded my expectations. Professional, timely, and the quality of work was outstanding!",
      project: "Complete Home Renovation"
    },
    {
      name: "Michael Chen",
      role: "Property Manager",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      rating: 5,
      comment: "Consistent quality across multiple properties. Their attention to detail is remarkable.",
      project: "Multiple Property Maintenance"
    },
    // Add more testimonials as needed
  ];

  const satisfactionMetrics = [
    {
      title: "Customer Satisfaction",
      value: "100%",
      icon: Heart,
      color: "text-red-600",
      bgColor: "bg-red-100"
    },
    {
      title: "Repeat Customers",
      value: "85%",
      icon: ThumbsUp,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "On-time Delivery",
      value: "98%",
      icon: Award,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Quality Rating",
      value: "4.9/5",
      icon: Star,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative bg-red-600 text-white py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-800 opacity-90"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">100% Satisfaction Rate</h1>
              <p className="text-xl text-red-100 mb-8">
                Our commitment to excellence has earned us the trust of thousands of satisfied customers.
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                  ))}
                </div>
                <span className="text-lg font-semibold">Perfect Customer Experience</span>
              </div>
            </div>
            <div className="flex-1">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="grid grid-cols-2 gap-4">
                  {satisfactionMetrics.map((metric, index) => (
                    <div key={index} className="text-center">
                      <div className="text-4xl font-bold mb-2">{metric.value}</div>
                      <div className="text-red-100">{metric.title}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Satisfaction Metrics Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {satisfactionMetrics.map((metric, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className={`w-12 h-12 ${metric.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                <metric.icon className={`w-6 h-6 ${metric.color}`} />
              </div>
              <h3 className="text-xl font-semibold mb-2">{metric.title}</h3>
              <p className="text-3xl font-bold text-gray-900">{metric.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold">{testimonial.name}</h3>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">{testimonial.comment}</p>
                <p className="text-sm text-gray-500">Project: {testimonial.project}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-red-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Experience Excellence</h2>
          <p className="text-xl text-red-100 mb-8">
            Join thousands of satisfied customers who trust us with their homes
          </p>
          <button className="bg-white text-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-red-50 transition-colors">
            Get Started Today
          </button>
        </div>
      </div>
    </div>
  );
};

export default SatisfactionRate; 