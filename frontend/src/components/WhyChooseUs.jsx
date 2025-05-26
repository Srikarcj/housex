import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Users, Clock, DollarSign } from 'lucide-react';

const WhyChooseUs = () => {
  const features = [
    {
      title: "Licensed & Insured",
      description: "Your peace of mind is our priority with fully licensed and insured services",
      icon: Shield,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      path: "/features/licensed-insured",
      gradient: "from-blue-500 to-blue-600"
    },
    {
      title: "Expert Team",
      description: "Highly skilled professionals with years of industry experience",
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-100",
      path: "/features/expert-team",
      gradient: "from-green-500 to-green-600"
    },
    {
      title: "On-Time Service",
      description: "We value your time with guaranteed punctual service delivery",
      icon: Clock,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      path: "/features/on-time-service",
      gradient: "from-purple-500 to-purple-600"
    },
    {
      title: "Fair Pricing",
      description: "Transparent and competitive pricing with no hidden costs",
      icon: DollarSign,
      color: "text-amber-600",
      bgColor: "bg-amber-100",
      path: "/features/fair-pricing",
      gradient: "from-amber-500 to-amber-600"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Us</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Experience excellence with our professional services and commitment to quality
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Link
              key={index}
              to={feature.path}
              className="group relative bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
              <div className="p-6">
                <div className={`w-12 h-12 ${feature.bgColor} rounded-xl flex items-center justify-center mb-4 transform group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{feature.title}</h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <div className="flex items-center text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                  Learn more
                  <svg
                    className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent group-hover:via-blue-500 transition-colors"></div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs; 