import React from 'react';
import { Users, Star, MessageSquare, ThumbsUp, Award } from 'lucide-react';

const HappyClients = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Homeowner",
      image: "https://randomuser.me/api/portraits/women/1.jpg",
      rating: 5,
      comment: "HouseX transformed our home with exceptional painting services. The attention to detail and professionalism was outstanding!",
      date: "March 15, 2024"
    },
    {
      name: "Michael Chen",
      role: "Property Manager",
      image: "https://randomuser.me/api/portraits/men/2.jpg",
      rating: 5,
      comment: "Working with HouseX has been a game-changer for our property management business. Their reliable service and quality work speak for themselves.",
      date: "March 10, 2024"
    },
    // Add more testimonials as needed
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative bg-blue-600 text-white py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 opacity-90"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">10,000+ Happy Clients</h1>
              <p className="text-xl text-blue-100 mb-8">
                Join our growing family of satisfied customers who trust HouseX for their home improvement needs.
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                  ))}
                </div>
                <span className="text-lg font-semibold">4.9/5 Average Rating</span>
              </div>
            </div>
            <div className="flex-1">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2">10K+</div>
                    <div className="text-blue-100">Happy Clients</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2">98%</div>
                    <div className="text-blue-100">Satisfaction Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2">4.9</div>
                    <div className="text-blue-100">Average Rating</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2">5K+</div>
                    <div className="text-blue-100">Reviews</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Dedicated Support</h3>
            <p className="text-gray-600">
              Our team is available 24/7 to assist you with any questions or concerns.
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <ThumbsUp className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Quality Guarantee</h3>
            <p className="text-gray-600">
              We stand behind our work with a 100% satisfaction guarantee.
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Award className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Expert Team</h3>
            <p className="text-gray-600">
              Our professionals are highly trained and experienced in their fields.
            </p>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Clients Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">{testimonial.comment}</p>
                <p className="text-gray-400 text-sm">{testimonial.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Happy Clients</h2>
          <p className="text-xl text-blue-100 mb-8">
            Experience the HouseX difference for yourself
          </p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
            Get Started Today
          </button>
        </div>
      </div>
    </div>
  );
};

export default HappyClients; 